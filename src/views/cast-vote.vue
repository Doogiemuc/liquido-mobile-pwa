<template>
	<div>
		<h2 id="cast-vote-page" class="page-title">
			<i class="fas fa-person-booth" />
			&nbsp;{{ $t("castVoteTitle") }}
		</h2>

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
					v-for="(prop, idx) in proposalsInBallot"
					ref="proposalInBallot"
					:key="prop.id"
					:law="prop"
					:read-only="true"
					:collapse="true"
					:class="getLawPanelClass(idx)"
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

		<div v-if="isUpdatableBallot" id="isUpdateableBallotInfo" class="alert alert-info">
			<i class="fas fa-info-circle float-right" />
			<p v-html="$t('updateBallotInfo')"></p>
		</div>

		<div v-if="hasBallot" class="alert alert-info">
			<p>
				{{ $t("checksumOfYourBallot") }}
			</p>
			<div class="text-center mb-2">
				<b-button id="verifyBallotButton" variant="primary" size="sm" @click="verifyBallot">
					{{ existingBallot.checksum }}
					<i v-if="ballotIsVerified" class="fas fa-check-circle"></i>
				</b-button>
			</div>
			<p v-if="ballotIsVerified" id="ballotIsVerifiedInfo">
				{{ $t('ballotIsVerified') }}
			</p>
		</div>

		<popup-modal 
			id="castVoteSuccessModal"
			ref="castVoteSuccessModal"
			type="success"
		>
			<template #default>
				<div class="text-center">
					<p>{{ isFirstVote ? $t("voteCastedSuccessfully") : $t("voteUpdatedSuccessfully") }}</p>
					<p v-if="voteCount > 1">
						{{ $t('voteCountedNTimes', {voteCount: voteCount}) }}
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
const log = require("loglevel")

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
				voteCountedNTimes: "Deine Stimme als Proxy wurde {voteCount} mal gezählt.",
				yourBallot: "Dein Stimmzettel:",
				updateBallotButton: "Eigene Stimme aktualisieren",
				castVoteButton: "Diese Stimme abgeben",
				voteCastedSuccessfully: "Deine Stimme wurde erfolgreich gezählt.",
				voteUpdatedSuccessfully: "Deine Stimme wurde erfolgreich aktualisiert.",
				voteCastError: "Es gab leider einen technischen Fehler beim Abgeben deiner Stimme. Bitte versuche es später noch einmal.",
				backToPolls: "Zurück zur den Abstimmungen",
				updateBallotInfo: "Du hast in dieser Abstimmung bereits eine Stimme abgegeben. In <span class='liquido'></span> kannst du deinen Stimmzettel " + 
					"auch jetzt noch ändern, so lange die Wahlphase dieser Abstimmung noch läuft.",
				checksumOfYourBallot: "Mit dieser Checksumme kannst du prüfen ob dein Stimmzettel korrekt gezählt wurde:",
				verifyBallotButton: "Prüfen",
				ballotIsVerified: "Deine Stimme wurde erfolgreich gezählt."
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
			voteCount: 0,
			castVoteLoading: false,
			isFirstVote: true,		// used for showing the correct confirmation message
			ballotIsVerified: false,
		}
	},
	computed: {
		canCastVote() {
			return this.poll && this.poll.status === "VOTING"
		},
		hasBallot() {
			return this.existingBallot
		},
		isUpdatableBallot() {
			return this.poll && this.poll.status === "VOTING" && this.existingBallot
		},
	},
	created() {
		this.loading = true
		
		//force refresh of the poll. Load it from the backend
		let loadPoll = () => this.$api.getPollById(this.pollId, true).then(poll => {
			this.poll = poll
			if (!this.poll) throw new Error("Cannot find poll(id=" + this.pollId + ")") //TODO: show user error message to user. offer back button
			return poll
		}).catch(err => console.warn("Cannot get poll.id="+this.pollId, err))
		
		let getVoterToken = () => this.$api.getVoterToken(config.voterTokenSecret)
			.catch(err => console.warn("Cannot get voterToken of user", err))

		let getExistingBallot = (voterToken) => this.$api.getBallot(this.pollId, voterToken).then(ballot => {
			this.existingBallot = ballot  // may be undefined!
			if (this.existingBallot) this.isFirstVote = false
			return ballot
		}).catch(err => console.warn("Cannot get ballot of user", err))

		/*
		let setVoteOrder = () => {
			let proposalsById = {}
			this.poll.proposals.forEach(prop => proposalsById[prop.id] = prop)
			if (ballot) {
				this.existingBallot = ballot
				this.proposalInBallot = ballot.voteOrderIds.map(id => proposalsById[id])
			} else {
				this.proposalsInBallot = _.cloneDeep(this.poll.proposals)
			}
			this.loading = false
		}
		*/

		loadPoll()
			.then(getVoterToken)
			.then(voterToken => getExistingBallot(voterToken))
			.then(() => {
				this.proposalsInBallot = _.cloneDeep(this.poll.proposals)
				this.loading = false
			})
			.catch(err => {
				console.error("Cannot get data to cast vote!", err)
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

			//TODO: start a timer for timeout

			log.debug("CAST VOTE: poll.id="+this.poll.id, "voteOrderIds", voteOrderIds)
			this.$api.getVoterToken(config.voterTokenSecret).then((voterToken) => {
				console.debug("Received voter token. Now casting vote ...")
				this.$api.castVote(this.poll.id, voteOrderIds, voterToken).then(castVoteResponse => {
					console.info("Vote casted successfully.", castVoteResponse)
					this.existingBallot = castVoteResponse.ballot
					this.voteCount = castVoteResponse.voteCount
					this.castVoteLoading = false
					this.$refs["castVoteSuccessModal"].show()
				})
			}).catch((err) => {
				console.error("Cannot cast vote", err)
				this.castVoteLoading = false
				this.$refs["errorModal"].show()
			})
		},

		async verifyBallot() {
			if (!this.existingBallot || this.ballotIsVerified) return
			this.$api.verifyBallot(this.poll.id, this.existingBallot.checksum).then(ballot => {
				if (!ballot) {
					console.warn("Could not find a ballot for that checksum.")
				} else {
					console.debug("Ballot verified successfully.", ballot)
					this.ballotIsVerified = true
				}				
			}).catch(err => {
				console.error("Cannot verify ballot with checksum!", err)
				//TODO: show error message
				this.ballotIsVerified = false
			})
		},

		getLawPanelClass(/*idx*/) {
			/* if (idx === 0 && this.isFirstVote) return "simulate-drag" else */ 
			return ""
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


	.law-panel.simulate-drag {
		z-index: 500;  // above second proposal
		transition: all 1s;
		animation: slide-down 0.5s ease 1s 2 alternate;
	}

	@keyframes slide-down {
		50% {
			transform: translate(5px, 20px);
			box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.5) !important;
		}
		to {
			transform: translate(0px, 50px);
		}
	}
	@keyframes slide-up {
		to {
			transform: translate(5px, -20px)
		}
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

#verifyBallotButton {
	font-family: monospace;
	margin: 0 auto;
}




</style>
