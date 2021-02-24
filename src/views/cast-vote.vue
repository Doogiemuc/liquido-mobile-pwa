<template>
	<div class="container">
		<h2 class="page-title">
			<i class="fas fa-person-booth" />
			&nbsp;{{ $t("castVoteTitle") }}
		</h2>

		<div v-if="isUpdatableBallot" class="alert alert-info">
			<i class="fas fa-info-circle float-right" />
			<p v-html="$t('updateBallotInfo')"></p>
		</div>

		<b-card no-body class="ballot-card mb-3">
			<template #header>
				<h4 class="poll-title">
					<i class="fas fa-poll" />
					&nbsp;{{ poll ? poll.title : "" }}
				</h4>
			</template>
			<draggable
				v-model="proposalsInBallot"
				class="draggable"
				:swap-threshold="0.5"
				:delay="40"
				:animation="500"
				:can-scroll-x="false"
			>
				<law-panel
					v-for="prop in proposalsInBallot"
					ref="proposalInBallot"
					:key="prop.id"
					:law="prop"
					:read-only="true"
					:collapse="true"
					class="shadow-sm"
				/>
			</draggable>
			<div class="collapse-icon-wrapper">
				<a class="collapse-icon" href="#" @click="toggleBallotCollapse()">
					<i class="fa" />
				</a>
			</div>
		</b-card>

		<div v-if="canCastVote" class="text-right my-5">
			<b-button variant="primary" size="lg" :disabled="castVoteLoading" @click="clickCastVote()">
				<i v-if="!voteCastedSuccessfully && !voteCastedError && !castVoteLoading" class="fas fa-vote-yea"></i>
				<i v-if="voteCastedSuccessfully" class="far fa-check-circle" />
				<i v-if="voteCastedError" class="fas fa-excamation-circle" />
				<b-spinner v-if="castVoteLoading" small />
				{{ isUpdatableBallot ? $t("updateBallotButton") : $t("castVoteButton") }}
			</b-button>
		</div>

		<popup-modal 
			id="successModal"
			ref="successModal"
			type="success"
			:message="$t('voteCastedSuccessfully')"
			@clickPrimary="clickSuccessModalOk"
		></popup-modal>
		
		<div v-if="voteCastedError" class="alert alert-danger" v-html="$t('voteCastedError')" />

		<div v-if="voteCastedSuccessfully" class="alert alert-info mb-3">
			<p v-html="$t('changeBallotLaterInfo')"></p>
			<b-button variant="primary" @click="goToPoll()">
				{{ $t("GoBackToPoll") }} <i class="fas fa-angle-double-right" />
			</b-button>
		</div>

		<div class="alert alert-info">
			<i class="fas fa-info-circle float-right" />
			<p v-html="$t('castVoteInfo')"></p>
		</div>
	</div>
</template>

<script>
import config from "config"
import lawPanel from "@/components/law-panel"
import popupModal from "@/components/popup-modal"

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
					"<p>In <span class='liquido'></span> stimmst du nicht nur für <em>einen</em> Vorschlag, sondern du sortierst " +
					"alle Vorschläge in deine persönlich bevorzugte Reihenfolge.</p>" +
					"<p>Schiebe deinen Favoriten ganz nach oben. Ordne dann alle anderen Vorschläge gemäß deiner Präferenz darunter an.</p>",
				updateBallotInfo: "Du hast in dieser Abstimmung bereits eine Stimme abgegeben. In <span class='liquido'></span> kannst du deine Prio Reihenfolge " + 
					"auch jetzt noch aktualisieren, so lange die Wahlphase dieser Abstimmung noch läuft.",
				yourBallot: "Dein Stimmzettel:",
				updateBallotButton: "Eigene Stimme aktualisieren",
				castVoteButton: "Diese Stimme abgeben",
				voteCastedSuccessfully: "Deine Stimme wurde erfolgreich gezählt.",
				changeBallotLaterInfo: 
					"In <span class='liquido'></span> kannst du deinen Stimmzettel "+
					"auch jetzt noch ändern, so lange die Wahlphase dieser Abstimmung noch läuft.</p>" +
					"<p>Du erhälst eine Benachrichtigung, sobald die Abstimmung abgeschlossen ist. Dann kannst du das Ergebnis der Wahl sehen.</p>",
				voteCastedError: "Es gab leider einen technischen Fehler beim Abgeben deiner Stimme. Bitte versuche es später noch einmal.",
				GoBackToPoll: "Zurück zur Abstimmung",
			},
		},
	},
	components: { lawPanel, draggable, popupModal },
	props: {
		// the cast-vote page only receives the pollId and reloads the poll from the backend
		pollId: { type: String, required: true },
	},
	data() {
		return {
			poll: undefined,
			proposalsInBallot: [],
			existingBallot: undefined,
			castVoteLoading: false,
			voteCastedSuccessfully: false,
			voteCastedError: false,
		}
	},
	computed: {
		canCastVote() {
			return this.poll && this.poll.status == "VOTING"
		},
		isUpdatableBallot() {
			return this.poll && this.poll.status == "VOTING" && this.existingBallot
		},
	},
	created() {
		//force refresh of the poll. Load it from the backend
		this.$api.getPollById(this.pollId, true).then(poll => {
			this.poll = poll
			if (!this.poll) throw new Error("Cannot find poll(id=" + this.pollId + ")") //TODO: show user error message to user. offer back button
			this.proposalsInBallot = _.cloneDeep(this.poll.proposals)
		})
		this.$api.getVoterToken(config.voterTokenSecret).then(voterToken => {
			this.$api.getBallot(this.pollId, voterToken).then(ballot => {
				this.existingBallot = ballot  // may be undefined!
			})
		})
		
	},
	mounted() {
		
	},
	methods: {
		/** Collapse the descriptions of all proposals in the ballot */
		toggleBallotCollapse() {
			this.$refs["proposalInBallot"].forEach(pollPanel => {
				console.log("toogle collapse on", pollPanel)
				pollPanel.toggleCollapse()})
		},

		async clickCastVote() {
			this.castVoteLoading = true
			this.voteCastedError = false
			this.voteCastedSuccessfully = false

			let voteOrderIds = this.proposalsInBallot.map(proposal => +proposal.id)
			let voterToken   = await this.$api.getVoterToken(config.voterTokenSecret)

			//TODO: start a timer for timeout

			log.debug("CAST VOTE: poll.id="+this.poll.id, "voterToken="+voterToken, "voteOrderIds", voteOrderIds )
			this.$api
				.castVote(this.poll.id, voteOrderIds, voterToken)
				.then(() => {
					this.castVoteLoading = false
					this.voteCastedSuccessfully = true
					//this.$bvModal.show("successModal")  or the vue-bootstrap internal way
					this.$refs["successModal"].show()
				})
				.catch((err) => {
					console.error("Cannot cast vote", err)
					this.castVoteLoading = false
					this.voteCastedError = true
					//this.$root.scrollToBottom()
				})
		},

		clickSuccessModalOk() {
			console.log("Cast vote successModal: clicked OK")
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

#castVoteModal {
	.modal-header {
		border-bottom: none;   // "Less is more in UI-design!"
		height: 3rem;
	}
	.success-icon {
		z-index: 2020;
		position: absolute;
		text-align: center;
		top: -3.5rem;
		left: 0;
		right: 0;
		width: 6rem;
		margin: 0 auto;
		font-size: 6rem;
		background-color: green;
		border-radius: 50%;
	}
	.success-icon-shadow {
		z-index: 2010;   // behind icon
		position: absolute;
		top: 0.8rem;
		left: 0;
		right: 0;
		width: 6rem;
		height: 1rem;
		margin: 0 auto;
		//background-color: rgba(0, 0, 0, 0);
		border-radius: 50%;
		//border: 1px solid red;
		box-shadow: 0 20px 10px 2px rgba(0, 0, 0, 0.5) ;
	}
	.modal-footer {
		justify-content: center;
		border-top: none;
	}
	.okButton {
		font-weight: bold;
		width: 90%;
		background-color: green;
		border-color: green;
		border: 1px solid rgba(0, 0, 0, 0.2);
	}
}

#castVoteModal + .modal-backdrop {
	opacity: 0.8;
}


</style>
