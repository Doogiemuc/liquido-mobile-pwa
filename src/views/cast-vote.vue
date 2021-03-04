<template>
	<div>
		<h2 id="cast-vote-page" class="page-title">
			<i class="fas fa-person-booth" />
			&nbsp;{{ $t("castVoteTitle") }}
		</h2>

		<div v-if="isUpdatableBallot" id="isUpdateableBallotInfo" class="alert alert-info">
			<i class="fas fa-info-circle float-right" />
			<p v-html="$t('updateBallotInfo')"></p>
			<p>
				{{ $t("checksumOfYourBallot") }}<br />
				<pre>{{ existingBallot ? existingBallot.checksum : "" }}</pre>
			</p>
		</div>

		<b-card no-body class="ballot-card mb-5">
			<template #header>
				<h4 class="poll-title">
					<i class="fas fa-poll" />
					&nbsp;{{ poll ? poll.title : "" }}
				</h4>
			</template>
			<div v-if="loading" class="draggable">
				<b-spinner small />&nbsp;{{ $t('Loading') }}
			</div>
			<draggable v-else
				v-model="proposalsInBallot"
				class="draggable"
				:disabled="loading || castVoteLoading"
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

		<div v-if="canCastVote" class="text-center mb-5">
			<b-button id="castVoteButton" variant="primary" size="lg" :disabled="loading || castVoteLoading" @click="clickCastVote()">
				<i v-if="!castVoteLoading" class="fas fa-vote-yea"></i>
				<b-spinner v-if="castVoteLoading" small />
				{{ isUpdatableBallot ? $t("updateBallotButton") : $t("castVoteButton") }}
			</b-button>
		</div>

		<popup-modal 
			id="castVoteSuccessModal"
			ref="castVoteSuccessModal"
			type="success"
		>
			<template>
				<div class="text-center">
					<p>{{ isFirstVote ? $t("voteCastedSuccessfully") : $t("voteUpdatedSuccessfully") }}</p>
					<p>
						Checksum:<br />
						<pre>{{ existingBallot ? existingBallot.checksum : "" }}</pre>
					</p>
				</div>
			</template>
		</popup-modal>

		<popup-modal 
			id="errorModal"
			ref="errorModal"
			type="error"
			:message="$t('voteCastError')"
		></popup-modal>
		
		<div class="alert alert-info">
			<i class="fas fa-info-circle float-right" />
			<p v-html="$t('castVoteInfo')"></p>
		</div>

		<router-link :to="{name: 'polls'}" type="button" class="btn btn-primary">
			<i class="fas fa-angle-double-left"></i>&nbsp;{{ $t("backToPolls") }}
		</router-link>
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
				updateBallotInfo: "Du hast in dieser Abstimmung bereits eine Stimme abgegeben. In <span class='liquido'></span> kannst du deinen Stimmzettel " + 
					"auch jetzt noch ändern, so lange die Wahlphase dieser Abstimmung noch läuft.",
				checksumOfYourBallot: "Prüfsumme deines Stimmzettels:",
				yourBallot: "Dein Stimmzettel:",
				updateBallotButton: "Eigene Stimme aktualisieren",
				castVoteButton: "Diese Stimme abgeben",
				voteCastedSuccessfully: "Deine Stimme wurde erfolgreich gezählt.",
				voteUpdatedSuccessfully: "Deine Stimme wurde erfolgreich aktualisiert.",
				voteCastError: "Es gab leider einen technischen Fehler beim Abgeben deiner Stimme. Bitte versuche es später noch einmal.",
				backToPolls: "Zurück zur den Abstimmungen",
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
			loading: true,
			poll: undefined,
			proposalsInBallot: [],
			existingBallot: undefined,
			castVoteLoading: false,
			isFirstVote: true,		// used for showing the correct confirmation message
		}
	},
	computed: {
		canCastVote() {
			return this.poll && this.poll.status === "VOTING"
		},
		isUpdatableBallot() {
			return this.poll && this.poll.status === "VOTING" && this.existingBallot
		},
	},
	created() {
		this.loading = true
		//force refresh of the poll. Load it from the backend
		let loadPoll = this.$api.getPollById(this.pollId, true).then(poll => {
			this.poll = poll
			if (!this.poll) throw new Error("Cannot find poll(id=" + this.pollId + ")") //TODO: show user error message to user. offer back button
			this.proposalsInBallot = _.cloneDeep(this.poll.proposals)
		})
		let getVoterToken = this.$api.getVoterToken(config.voterTokenSecret).then(voterToken => {
			return this.$api.getBallot(this.pollId, voterToken).then(ballot => {
				this.existingBallot = ballot  // may be undefined!
				if (this.existingBallot) this.isFirstVote = false
			}).catch(err => console.warn("Cannot get ballot of user", err))
		}).catch(err => console.warn("Cannot voterToken of user", err))
		Promise.all([loadPoll, getVoterToken]).then(() => {
			this.loading = false
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

			let voteOrderIds = this.proposalsInBallot.map(proposal => +proposal.id)
			let voterToken   = await this.$api.getVoterToken(config.voterTokenSecret)  // This will normally fetch the cached voterToken

			//TODO: start a timer for timeout

			log.debug("CAST VOTE: poll.id="+this.poll.id, "voterToken="+voterToken, "voteOrderIds", voteOrderIds )
			this.$api.castVote(this.poll.id, voteOrderIds, voterToken)
				.then(() => this.$api.getBallot(this.poll.id, voterToken))
				.then(ballot => {
					console.log("Vote casted successfully ballot.checksum=", ballot.checksum)
					this.existingBallot = ballot
					this.castVoteLoading = false
					this.$refs["castVoteSuccessModal"].show()
				})
				.catch((err) => {
					console.error("Cannot cast vote", err)
					this.castVoteLoading = false
					this.$refs["errorModal"].show()
				})
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
