<template>
	<div>
		<h2 id="poll-show" class="page-title">{{ pageTitleLoc }}</h2>

		<poll-panel v-if="poll.id" :poll="poll" :key="poll.id" :read-only="true" class="shadow mb-3"></poll-panel>

		<div v-if="showError"	class="alert alert-danger mb-3">
			<div v-html="$t('cannotFindPoll', {pollId: pollId})"></div>
			<b-button variant="primary" class="float-right" @click="$router.push({name: 'polls'})">
				{{ $t("Back") }}
			</b-button>
		</div>

		<div
			v-if="poll.status === 'ELABORATION' && poll.proposals && poll.proposals.length > 0"
			class="alert alert-secondary mb-3"
		>
			<p v-html="$t('pollInElaborationInfo')"></p>
		</div>

		<div v-if="showAddProposal" class="alert alert-secondary mb-3">
			<p v-html="$t('addProposalInfo')"></p>
			<b-button variant="primary" class="float-right" @click="clickAddProposal()">
				{{ $t("addProposal") }}
				<i class="fas fa-angle-double-right"></i>
			</b-button>
		</div>
		<div class="clearfix mb-3"></div>

		<div v-if="showStartVotingPhase" class="alert alert-secondary mb-3">
			<p v-html="$t('startVotingPhaseInfo')"></p>
			<b-button variant="primary" class="float-right" @click="clickStartVote()">
				<i class="fas fa-user-shield"></i>
				{{ $t("startVotingPhase") }}
			</b-button>
		</div>
		<div class="clearfix mb-3"></div>

		<div v-if="poll.status === 'VOTING' && !poll.usersBallot" class="alert alert-secondary mb-3">
			<p v-html="$t('votingPhaseInfo')"></p>
			<b-button variant="primary" class="float-right" @click="clickCastVote()">
				<i class="fas fa-person-booth"></i>
				{{ $t("castVote") }}
				<i class="fas fa-angle-double-right"></i>
			</b-button>
		</div>
		<div class="clearfix mb-3"></div>

		<div v-if="poll.status === 'VOTING' && poll.usersBallot" class="alert alert-secondary mb-3">
			<p v-html="$t('alreadyVotedInfo')"></p>
			<b-button variant="primary" class="float-right" @click="clickCastVote()">
				<i class="fas fa-person-booth"></i>
				{{ $t("editOwnVote") }}
				<i class="fas fa-angle-double-right"></i>
			</b-button>
		</div>
	</div>
</template>

<script>
import liquidoHeader from "../components/liquido-header"
import liquidoInput from "../components/liquido-input"
import pollPanel from "../components/poll-panel"
import pollsFooter from "../components/polls-footer"

export default {
	i18n: {
		messages: {
			en: {},
			de: {
				pollInElaborationInfo:
					"<p>Dieser Abstimmung ist in der <em>Diskussionphase</em>.</p><p>Wende dich an die Ersteller der einzelnen Wahlvorschläge und gib ihnen direkt Feedback. Wahlvorschläge können noch so lange angepasst und verbessert werden, bis euer Admin dann die <em>Wahlphase</em> für diese Abstimmung startet.</p>",
				addProposalInfo: "Du kannst deinen eigenen Wahlvorschlag zu dieser Abstimmung hinzufügen.",
				addProposal: "Vorschlag hinzufügen",
				startVotingPhaseInfo:
					"Hallo Admin! Möchstest du die Wahlphase für diese Abstimmung starten? Dann sind die Wahlvorschläge fixiert und dein Team kann abstimmen.",
				startVotingPhase: "Wahl starten",
				votingPhaseInfo: "Die Wahlphase dieser Abstimmung läuft gerade und du kannst jetzt hier deine Stimme abgeben.",
				castVote: "Abstimmen",
				editOwnVote: "Stimmzettel ändern",
				alreadyVotedInfo:
					"<p>Du hast in dieser Abstimmung bereits eine Stimme abgegeben.</p><p>So lange die Wahlphase dieser Abstimmung noch läuft, kannst du in <span class='liquido'></span> die Prio Reihenfolge auf deinem Stimmzettel auch noch ändern wenn du möchstest.</p>",
				cannotFindPoll: "<h4>Fehler</h4><hr/><p>Diese Abstimmung konnte nicht gefunden werden.</p>",
			},
		},
	},
	components: { pollPanel, liquidoHeader, liquidoInput, pollsFooter },
	props: {
		pollId: { type: String, required: true }, // url parameter is passed as String
	},
	data() {
		return {
			poll: {},
			showError: false
		}
	},
	created() {
		this.$api.getPollById(this.pollId, true)
			.then(poll => this.poll = poll)
			.catch(err => {
				console.warn("Cannot find poll.id=" + this.pollId, err)
				this.showError = true
			})
	},
	mounted() {},
	computed: {
		pageTitleLoc() {
			if (!this.poll.id) return this.$t('Poll')
			if (!this.poll.proposals || this.poll.proposals.length === 0) return this.$t("newPoll")
			if (this.poll.status === "ELABORATION") return this.$t("pollInElaboration")
			if (this.poll.status === "VOTING") return this.$t("pollInVoting")
			if (this.poll.status === "FINISHED") return this.$t("finishedPoll")
			return this.$t("poll")
		},
		userIsAdmin() {
			return this.$root.store.isAdmin()
		},
		/** User can add his own proposal if the poll is in status ELABORATION and he did not add a proposal to this poll yet. */
		showAddProposal() {
			if (this.poll.status !== "ELABORATION") return false
			if (!this.poll.proposals || this.poll.proposals.length === 0) {
				this.poll.proposals = []
				return true
			}
			let currentUserId = this.$root.store.get("user").id
			return this.poll.proposals.filter((prop) => prop.createdBy === currentUserId).length === 0
		},
		showStartVotingPhase() {
			return (
				this.userIsAdmin && this.poll.status === "ELABORATION" && this.poll.proposals && this.poll.proposals.length > 0
			)
		},
	},
	methods: {
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
