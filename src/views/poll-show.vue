<template>
	<div>
		<h2 id="poll-show" class="page-title">
			{{ pageTitleLoc }}
		</h2>

		<div v-if="loading" class="my-3">
			<b-spinner small />&nbsp;{{ $t('Loading') }}
		</div>
		
		<div v-if="showStartVotingPhase" class="alert alert-admin mb-3">
			<i class="fas fa-shield-alt float-right"></i>
			<p v-html="$t('startVotingPhaseInfo')" />
			<b-button variant="primary" class="float-right" @click="clickStartVote()">
				<i class="fas fa-user-shield" />
				{{ $t("startVotingPhase") }}
			</b-button>
		</div>
		<div class="clearfix mb-3" />

		<poll-panel v-if="poll.id" :poll="poll" :read-only="true" class="shadow mb-3" />

		<div v-if="showError"	class="alert alert-danger mb-3">
			<div v-html="$t('cannotFindPoll', {pollId: pollId})" />
			<b-button variant="primary" class="float-right" @click="gotoPolls()">
				{{ $t("Back") }}
			</b-button>
		</div>

		<div v-if="poll.status === 'ELABORATION' && poll.proposals && poll.proposals.length > 0" class="alert alert-info mb-3">
			<i class="fas fa-info-circle float-right" />
			<p v-html="$t('pollInElaborationInfo')" />
		</div>

		<div v-if="showAddProposal" class="alert alert-secondary mb-3">
			<p v-html="$t('addProposalInfo')" />
			<b-button id="addProposalButton" variant="primary" class="float-right" @click="clickAddProposal()">
				{{ $t("addProposal") }}
				<i class="fas fa-angle-double-right" />
			</b-button>
		</div>
		<div class="clearfix mb-3" />

		<div v-if="poll.status === 'VOTING' && !poll.usersBallot" class="alert alert-secondary mb-3">
			<p v-html="$t('votingPhaseInfo')" />
			<b-button variant="primary" class="float-right" @click="clickCastVote()">
				<i class="fas fa-person-booth" />
				{{ $t("goToCastVote") }}
				<i class="fas fa-angle-double-right" />
			</b-button>
		</div>
		<div class="clearfix mb-3" />

		<div v-if="poll.status === 'VOTING' && poll.usersBallot" class="alert alert-secondary mb-3">
			<p v-html="$t('alreadyVotedInfo')" />
			<b-button variant="primary" class="float-right" @click="clickCastVote()">
				<i class="fas fa-person-booth" />
				{{ $t("editOwnVote") }}
				<i class="fas fa-angle-double-right" />
			</b-button>
		</div>
	</div>
</template>

<script>
import pollPanel from "../components/poll-panel"

export default {
	i18n: {
		messages: {
			en: {},
			de: {
				pollInElaborationInfo:
					"<p>Dieser Abstimmung ist in der <em>Diskussionphase</em>.</p>" +
					"<p>Diskutiert die Wahlvorschläge miteinander. In diese Phase kann jeder seinen eigenen Vorschlag noch weiter anpassen und verbessern." +
					"Wahlvorschläge können noch so lange angepasst und verbessert werden, bis euer Admin dann die <em>Wahlphase</em> für diese Abstimmung startet.</p>",
				addProposalInfo: "Du kannst deinen eigenen Wahlvorschlag zu dieser Abstimmung hinzufügen.",
				addProposal: "Vorschlag hinzufügen",
				startVotingPhaseInfo:
					"Hallo Admin! Möchstest du die Wahlphase für diese Abstimmung starten? Dann sind die Wahlvorschläge fixiert und dein Team kann abstimmen.",
				startVotingPhase: "Wahl starten",
				votingPhaseInfo: "Die Wahlphase dieser Abstimmung läuft gerade und du kannst jetzt hier deine Stimme abgeben.",
				goToCastVote: "Stimme abgeben",
				editOwnVote: "Stimmzettel ändern",
				alreadyVotedInfo:
					"<p>Du hast in dieser Abstimmung bereits eine Stimme abgegeben.</p><p>So lange die Wahlphase dieser Abstimmung noch läuft, "+
					"kannst du in <span class='liquido'></span> die Prio Reihenfolge auf deinem Stimmzettel auch noch ändern wenn du möchstest.</p>",
				cannotFindPoll: "<h4>Fehler</h4><hr/><p>Diese Abstimmung konnte nicht gefunden werden.</p>",
			},
		},
	},
	components: { pollPanel },
	props: {
		pollId: { type: String, required: true }, // url parameter is passed as String
	},
	data() {
		return {
			loading: true,
			poll: {},
			showError: false
		}
	},
	computed: {
		pageTitleLoc() {
			if (!this.poll.id) return this.$t("Poll")
			if (!this.poll.proposals || this.poll.proposals.length === 0) return this.$t("newPoll")
			if (this.poll.status === "ELABORATION") return this.$t("pollInElaboration")
			if (this.poll.status === "VOTING") return this.$t("pollInVoting")
			if (this.poll.status === "FINISHED") return this.$t("finishedPoll")
			return this.$t("poll")
		},
		userIsAdmin() {
			return this.$api.isAdmin()
		},
		/** User can add his own proposal if the poll is in status ELABORATION and he did not add a proposal to this poll yet. */
		showAddProposal() {
			if (this.poll.status !== "ELABORATION") return false
			if (!this.poll.proposals || this.poll.proposals.length === 0) {
				return true
			}
			let currentUser = this.$api.getCurrentUser()
			if (currentUser && currentUser.isAdmin) return true
			return this.poll.proposals.filter((prop) => prop.createdBy.id === currentUser.id).length === 0
		},
		/** The voting phase can be started when there are at least two proposals */
		showStartVotingPhase() {
			return this.userIsAdmin && this.poll.status === "ELABORATION" && this.poll.proposals && this.poll.proposals.length > 1
		},
	},
	created() {
		this.loading = true
		this.$api.getPollById(this.pollId, true)
			.then(receivedPoll => {
				this.poll = receivedPoll
				this.loading = false
				this.showError = false
			})
			.catch(err => {
				console.warn("Cannot find poll.id=" + this.pollId, err)
				this.loading = false
				this.showError = true
			})
	},
	mounted() {},
	methods: {
		goToPolls() {
			this.$router.push({name: "polls"})
		},
		clickAddProposal() {
			this.$router.push("/polls/" + this.poll.id + "/add")
		},
		clickCastVote() {
			this.$router.push("/polls/" + this.poll.id + "/castVote")
		},
		clickStartVote() {
			this.$api.startVotingPhase(this.poll.id).then(() => {
				//TODO: Show success to user (need some kind of nice animation)
				$("html, body").animate({ scrollTop: 0 }, 500)
			})
		},
	},
}
</script>

<style lang="scss"></style>
