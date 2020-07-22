<template>
	<div>
		<liquido-header backLink="/polls"></liquido-header>
		
		<div class="container mb-3">

			<h2 class="pageTitle">{{pageTitleLoc}}</h2>

			<poll-panel :poll="poll" :key="poll.id" class="shadow mb-3" :read-only="true"></poll-panel>

			<div v-if="poll.status === 'ELABORATION' && poll.proposals && poll.proposals.length > 0" class="alert alert-secondary mb-3">
				<p v-html="$t('pollInElaborationInfo')"></p>
			</div>

			<div v-if="showAddProposal" class="alert alert-secondary mb-3">
				<p v-html="$t('addProposalInfo')"></p>
				<b-button variant="primary" class="float-right" @click="addProposal()">{{$t('addProposal')}} <i class="fas fa-angle-double-right"></i></b-button>
			</div>
			<div class="clearfix mb-3"></div>

			<div v-if="userIsAdmin && poll.status === 'ELABORATION' && poll.proposals && poll.proposals.length > 0" class="alert alert-secondary mb-3">
				<p v-html="$t('startVotingPhaseInfo')"></p>
				<b-button variant="primary" class="float-right"><i class="fas fa-user-shield"></i> {{$t('startVotingPhase')}}</b-button>
			</div>
			<div class="clearfix mb-3"></div>


			<div v-if="poll.status === 'VOTING'" class="text-right">
				<b-button variant="primary" size="lg"><i class="fas fa-person-booth"></i> {{$t('castVote')}} <i class="fas fa-angle-double-right"></i></b-button>
			</div>

		</div>

		<div class="mb-3">&nbsp;</div>		
	</div>
</template>

<script>

import liquidoHeader from '../components/liquido-header'
import liquidoInput from '../components/liquido-input'
import pollPanel from "../components/poll-panel"
import pollsFooter from "../components/polls-footer"

export default {
	i18n: {
		messages: {
			en: {
			},
			de: {
				pollInElaborationInfo: "<p>Dieser Abstimmung ist in der <em>Diskussionphase</em>.</p><p>Wende dich an die Ersteller der einzelnen Wahlvorschläge und gib ihnen direkt Feedback. Wahlvorschläge können noch so lange angepasst und verbessert werden, bis euer Admin dann die <em>Wahlphase</em> für diese Abstimmung startet.</p>",
				addProposalInfo: "Du kannst deinen eigenen Wahlvorschlag zu dieser Abstimmung hinzufügen.",
				addProposal: "Vorschlag hinzufügen",
				startVotingPhaseInfo: 'Hallo Admin! Möchstest du die Wahlphase für diese Abstimmung starten? Dann sind die Wahlvorschläge fixiert und dein Team kann abstimmen.',
				startVotingPhase: "Wahl starten",
				castVote: "Stimme abgeben",
			}
		}
	},
	components: { pollPanel, liquidoHeader, liquidoInput, pollsFooter },
	props: {
		'pollId': { type: String, required: true }	// url parameter is passed as String
	},
	data() {
		return {
			poll: { }
		}
	},
	created() {
		this.poll = this.$root.store.getPollById(this.pollId) || {}
	},
	mounted() {},
	computed: {
		pageTitleLoc() {
			if (!this.poll.proposals || this.poll.proposals.length === 0) return this.$t('newPoll')
			if (this.poll.status === 'ELABORATION') return this.$t('pollInElaboration')
			if (this.poll.status === 'VOTING') return this.$t('pollInVoting')
			if (this.poll.status === 'FINISHED') return this.$t('finishedPoll')
			return this.$t('poll')
		},
		userIsAdmin() {
			return this.$root.store.user.isAdmin
		},
		/** User can add his own proposal if the poll is in status ELABORATION and he did not add a proposal to this poll yet. */
		showAddProposal() {
			if (this.poll.status !== "ELABORATION") return false
			if (!this.poll.proposals) return true
			var currentUserEmail = this.$root.store.user.email
			return this.poll.proposals.filter(prop => prop.createdBy.email === currentUserEmail).length === 0
		}
	},
	methods: {
		addProposal() {
			this.$router.push("/polls/"+this.poll.id+"/add")
		},
	},
}

</script>

<style lang="scss">

</style>
