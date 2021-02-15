<template>
	<div class="container">
		<h2 class="page-title">
			<i class="fas fa-person-booth" />
			&nbsp;{{ $t("castVoteTitle") }}
		</h2>

		<b-card no-body class="ballot-card mb-3">
			<template #header>
				<h4 class="poll-title">
					<i class="fas fa-poll" />
					&nbsp;{{ poll ? poll.title : "" }}
				</h4>
			</template>
			<draggable
				v-model="ballot"
				class="draggable"
				:swap-threshold="0.5"
				:delay="50"
				:animation="500"
				:can-scroll-x="false"
			>
				<law-panel
					v-for="prop in ballot"
					:key="prop.id"
					:law="prop"
					:read-only="true"
					:collapsed="true"
					class="shadow-sm"
				/>
			</draggable>
			<div class="collapse-icon-wrapper">
				<a class="collapse-icon" href="#" @click="toggleBallotCollapse()">
					<i class="fa" />
				</a>
			</div>
		</b-card>

		<div class="text-right my-5">
			<b-button variant="primary" size="lg" :disabled="castVoteLoading" @click="clickCastVote()">
				<i v-if="!voteCastedSuccessfully && !voteCastedError && !castVoteLoading"  class="fas fa-vote-yea"></i>
				<i v-if="voteCastedSuccessfully" class="far fa-check-circle" />
				<i v-if="voteCastedError" class="fas fa-excamation-circle" />
				<b-spinner v-if="castVoteLoading" small/>
				{{ $t("saveBallot") }}
			</b-button>
		</div>

		<div
			v-if="voteCastedSuccessfully"
			class="alert alert-success"
			v-html="$t('voteCastedSuccessfully')"
		/>
		<div v-if="voteCastedError" class="alert alert-danger" v-html="$t('voteCastedError')" />

		<div v-if="voteCastedSuccessfully" class="text-right mb-3">
			<b-button variant="primary" @click="goToPoll()">
				{{ $t("Ok") }}
				<i class="fas fa-angle-double-right" />
			</b-button>
		</div>

		<div class="alert alert-secondary">
			<i class="fas fa-info-circle float-right" />
			<p v-html="$t('castVoteInfo')"></p>
		</div>
	</div>
</template>

<script>
import config from "config"
import lawPanel from "../components/law-panel"
//import Sortable from 'sortablejs'
import draggable from "vuedraggable"
import _ from "lodash"
const log = require("loglevel").getLogger("cast-vote");

export default {
	i18n: {
		messages: {
			en: {
				castVoteTitle: "Cast your vote",
				castVoteInfo: "Please sort the proposals into your personally preferred order. With your favorite proposal at the top.",
				castVote: "Cast vote",
				yourBallot: "Your ballot",
			},
			de: {
				castVoteTitle: "Abstimmen",
				castVoteInfo: 
					"<p>In <span class='liquido'></span> stimmst du nicht für oder gegen nur <em>einen</em> Vorschlag, sondern du sortierst " +
					"alle Vorschläge in deine persönlich bevorzugte Reihenfolge.</p>" +
					"<p>Schiebe deinen Favoriten ganz nach oben. Ordne dann alle anderen Vorschläge gemäß deiner Präferenz darunter an.</p>",
				yourBallot: "Dein Stimmzettel:",
				saveBallot: "Diese Stimme abgeben",
				voteCastedSuccessfully:
					"<p>Deine Stimme wurde erfolgreich gezählt.</p><p>In <span class='liquido'></span> kannst du deinen Stimmzettel "+
					"auch jetzt noch ändern, so lange die Wahlphase dieser Abstimmung noch läuft.</p>" +
					"<p>Du erhälst eine Benachrichtigung, sobald die Abstimmung abgeschlossen ist. Dann kannst du das Ergebnis der Wahl sehen.</p>",
				voteCastedError: "Es gab leider einen technischen Fehler beim Abgeben deiner Stimme. Bitte versuche es später noch einmal.",
			},
		},
	},
	components: { lawPanel, draggable },
	props: {
		// the cast-vote page only receives the pollId and reloads the poll from the backend
		pollId: { type: String, required: true },
	},
	data() {
		return {
			poll: undefined,
			ballot: [],
			castVoteLoading: false,
			voteCastedSuccessfully: false,
			voteCastedError: false,
		}
	},
	computed: {},
	created() {
		//force refresh of the poll. Load it from the backend
		this.$api.getPollById(this.pollId, true).then(poll => {
			this.poll = poll
			if (!this.poll) throw new Error("Cannot find poll(id=" + this.pollId + ")") //TODO: show user error message to user. offer back button
			this.ballot = _.cloneDeep(this.poll.proposals)
		})
	},
	mounted() {},
	methods: {
		/** Collapse the descriptions of all proposals in the ballot */
		toggleBallotCollapse() {

		},

		async clickCastVote() {
			this.voteCastedError = false
			this.voteCastedSuccessfully = false
			this.castVoteLoading = true

			let voteOrderIds = this.ballot.map(proposal => +proposal.id)
			let voterToken = await this.$api.getVoterToken(config.voterTokenSecret)

			//TODO: start a timeer for timeout

			log.debug("CAST VOTE: poll.id="+this.poll.id, "voterToken="+voterToken, "voteOrderIds", voteOrderIds )
			this.$api
				.castVote(this.poll.id, voteOrderIds, voterToken)
				.then(() => {
					this.castVoteLoading = false
					this.voteCastedSuccessfully = true
					//this.$root.scrollToBottom()
				})
				.catch((err) => {
					console.error("Cannot cast vote", err)
					this.castVoteLoading = false
					this.voteCastedError = true
					//this.$root.scrollToBottom()
				})
		},

		goToPoll() {
			this.$router.push("/polls/"+this.poll.id)
		},
	},
}
</script>

<style lang="scss">
.ballot-card {
	.card-header {
		padding: 0.5rem;
		background-color: $header-bg;
		.poll-title {
			margin: 0;
			font-size: 14px;
			font-weight: bold;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
		}
	}
}

.draggable {
	background-color: $input-bg;
	padding: 1rem;
	.law-panel {
		margin-bottom: 1rem;  // need some space between proposals to make it easier to drag & sort them
		cursor: grab;
	}
	.sortable-ghost {
		opacity: 0.1;
	}
	.sortable-chosen {
		border: 1px solid $primary;
		-webkit-box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.5) !important;
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.5) !important;
		transform: translate(5px, 5px);
	}
}

.collapse-icon-wrapper {
	background-color: $input-bg;
	.collapse-icon {
		position: absolute;
		bottom: 5px;
		right: 5px;
		opacity: 0.5;
	}
}

.collapse-icon .fa:before {
	content: "\f139";
}

.collapse-icon.collapsed .fa:before {
	content: "\f13a";
}

</style>
