<template>
	<div>
		<div id="polls" class="alert alert-primary text-center">
			<i :class="iconForFilter"></i>&nbsp;{{ pageTitleLoc }}
		</div>

		<div v-if="loading" class="my-3">
			<b-spinner small />&nbsp;{{ $t('Loading') }}
		</div>

		<liquido-input
			v-if="allPolls.length > 3"
			id="searchInput"
			v-model="searchQuery"
			:label="$t('Search')"
			:status="null"
			class="mb-4"
		>
			<template #iconRight>
				<i class="fas fa-times mr-1" @click="searchQuery = undefined" />
			</template>
		</liquido-input>


		<!-- list of polls -->
		<poll-panel 
			v-for="poll in filteredPolls"
			:key="poll.id"
			:poll="poll"
			:collapse="true"
			class="shadow mb-3"
		/>



		<div v-if="allPolls.length === 0 && !loading" class="alert alert-info">
			<p v-html="$t('noPollYet')" />
		</div>

		<div v-if="searchResultIsEmpty" class="alert alert-info">
			<p v-html="$t('noPollsMatchSearch')" />
		</div>

		<div v-if="pollStatusFilter === 'ELABORATION'">
			<div v-if="hasPollInElaboration" class="alert alert-info">
				<i class="fas fa-info-circle float-right" />
				<p v-html="$t('pollsInElaborationInfo')" />
			</div>
			<div v-else class="alert alert-info">
				<p v-html="$t('noPollsInElaboration')" />
				<p v-if="hasPollInVoting" v-html="$t('butPollInVoting')" />
			</div>
		</div>

		<div v-if="pollStatusFilter === 'VOTING'">
			<div v-if="hasPollInVoting" class="alert alert-info">
				<i class="fas fa-info-circle float-right" />
				<p v-html="$t('pollsInVotingInfo')" />
			</div>
			<div v-else class="alert alert-info">
				<i class="fas fa-info-circle float-right" />
				<p v-html="$t('noPollsInVoting')" />
				<p v-if="hasPollInElaboration" v-html="$t('butProposalsInDiscussion')" />
			</div>
		</div>

		<div v-if="pollStatusFilter === 'FINISHED' && !hasFinishedPolls" class="alert alert-info">
			<i class="fas fa-info-circle float-right" />
			<p v-html="$t('noFinishedPolls')" />
			<p v-if="hasPollInVoting" v-html="$t('butPollInVoting')" />
		</div>

		<div v-if="userIsAdmin" class="my-5 alert alert-admin">
			<i class="fas fa-shield-alt float-right"></i>
			{{ $t('onlyAdminCanCreateNewPolls') }}
			<b-button variant="primary" class="float-right" @click="gotoCreatePoll()">
				<i class="fas fa-shield-alt" /> {{ $t("createPoll") }} <i class="fas fa-angle-double-right" />
			</b-button>
		</div>
	</div>
</template>

<script>
import liquidoInput from "../components/liquido-input"
import pollPanel from "../components/poll-panel"
import EventBus from "@/services/event-bus"

const pollStatusOrder = {
	ELABORATION: 0,
	VOTING: 1,
	FINISHED: 2,
}

export default {
	i18n: {
		messages: {
			en: {
				noPollsInElaboration: "There currently are no polls whose proposals can still be discussed.",
				noPollsInVoting: "There currently are no polls open for voting.",
				noFinishedPolls: "There are no finished polls yet.",
				butProposalsInDiscussion: "However there are proposals that you can discuss.",
				butPollInVoting: "However there is a poll in which you can vote.",
			},
			de: {
				YourPolls: "Abstimmungen",
				pollsInElaborationInfo: 
					"<p>Bitte diskutiert die Wahlorschläge dieser Abstimmungen untereinander.</p>" +
					"<p>Wenn euer Teamadmin dann die Abstimmungsphase startet, könnt ihr eure Stimme abgeben.</p>",
				pollsInVotingInfo: "In diesen Abstimmungen kannst du jetzt deine Stimme abgeben.",
				noPollYet: "Euer Admin hat bisher noch keine Abstimmung erstellt.",
				noPollsMatchSearch: "Keine Treffer für diese Suche.",
				noPollsInElaboration: "Aktuell gibt es gerade keine Wahlvorschläge die noch diskutiert werden können.",
				noPollsInVoting: "Es läuft gerade keine Abstimmungen, in der du deine Stimmen abgegeben könntest.",
				noFinishedPolls: "Es gibt in eurem Team noch keine abgeschlossenen Abstimmungen.",
				butProposalsInDiscussion: "Es gibt jedoch Abstimmungen in Diskussion. Dort könnt ihr die Wahlvorschlägen diskutieren.",
				butPollInVoting: "Es gibt jedoch eine <b>laufende Wahl</b> in der du deine Stimme abgeben kannst.",
				onlyAdminCanCreateNewPolls: "Nur du als Admin dieses Teams kannst neue Abstimmungen erstellen. " +
					"Jeder im Team kann dann seinen Wahlvorschlag zur Abstimmung hinzufügen.",
				createPoll: "Neue Abstimmung anlegen",
				allPolls: "Alle eure Abstimmungen",
			},
		},
	},
	components: { pollPanel, liquidoInput },
	props: {
		status: { type: String, required: false, default: undefined },
	},
	data() {
		return {
			loading: true,
			searchQuery: "",
			/**current filter for poll status, undefined|ELABORATION|VOTING|FINISHED */
			pollStatusFilter: undefined
		}
	},
	computed: {
		pageTitleLoc() {
			switch (this.pollStatusFilter) {
				case "ELABORATION":
					return this.$t("pollsInElaboration")
				case "VOTING":
					return this.$t("pollsInVoting")
				case "FINISHED":
					return this.$t("finishedPolls")
				default:
					return this.$t("allPolls")
			}
		},
		iconForFilter() {
			switch (this.pollStatusFilter) {
				case "ELABORATION":
					return "fas fa-comments"
				case "VOTING":
					return "fas fa-person-booth"
				case "FINISHED":
					return "fas fa-check-circle"
				default:
					return "fas fa-vote-yea"
			}
		},
		userIsAdmin() {
			return this.$api.isAdmin()
		},
		allPolls() {
			return this.$api.getCachedPolls()
		},
		filteredPolls() {
			return this.$api.getCachedPolls(this.pollStatusFilter)
				.filter((poll) => this.matchesSearch(poll))
				.sort((p1,p2) => {
					//sort polls by status
					return pollStatusOrder[p1.status] - pollStatusOrder[p2.status]
				})    
		},
		searchResultIsEmpty() {
			return this.filteredPolls.length === 0 && this.searchQuery && this.searchQuery.trim().length > 0
		},
		hasPollInElaboration() {
			return this.$api.getCachedPolls("ELABORATION").length > 0
		},
		hasPollInVoting() {
			return this.$api.getCachedPolls("VOTING").length > 0
		},
		hasFinishedPolls() {
			return this.$api.getCachedPolls("FINISHED").length > 0
		}
	},
	created() {
		// status CAN be passed as parameter or Vue prop
		if (this.status && this.status.match(/ELABORATION|VOTING|FINISHED/)) {
			this.pollStatusFilter = this.status
		}
		// or status can be changed with an event (navbar-bottom does that)
		EventBus.$on(EventBus.SET_POLLS_FILTER, (newFilterValue) => this.setPollFilter(newFilterValue))

		// update polls in cache when navigating to this page
		this.loading = true
		this.$api.getPolls()
			.then(() => this.loading = false)
			.catch(err => {
				this.loading = false
				console.error("Canont load polls", err)
			})
	},
	mounted() {
		
	},
	methods: {
		/** set (or clear) the current pollStatusFilter */
		setPollFilter(newFilterValue) {
			if (newFilterValue === undefined || newFilterValue.match(/ELABORATION|VOTING|FINISHED/)) {
				this.pollStatusFilter = newFilterValue
			}
		},

		gotoCreatePoll() {
			this.$router.push("/polls/create")
		},

		/** Try to flexibly match as much as possible. Case insesitive */
		matchesSearch(poll) {
			if (!this.searchQuery || this.searchQuery.trim === "") return true
			let Q = this.searchQuery.toUpperCase()
			if (poll.title && poll.title.toUpperCase().includes(Q)) return true
			if (poll.proposals) {
				poll.proposals.forEach((prop) => {
					if (prop.title.toUpperCase().includes(Q)) return true
					if (prop.description.toUpperCase().includes(Q)) return true
					if (prop.createdBy.name.toUpperCase().includes(Q)) return true
					if (prop.createdBy.email.toUpperCase().includes(Q)) return true
				})
			}
			return false
		},
	},
}
</script>

<style lang="scss">
#searchInput {
	background-color: $input-bg;
}
.iconRight {
	color: $primary;
}
#polls.polls-page-title {
	font-size: 1rem;
	font-weight: bold;
	margin: 1rem 0;
	border: 1px solid
}
/*
.filter-buttons {
	width: 100%;
	button {
		color: $primary;
		border: 1px solid rgba(0, 0, 0, 0.125);
		background-color: rgb(220, 236, 255);
		font-size: 1.7rem;
	}
	.icon-title {
		font-size: 10px;
		line-height: 1;
	}
	.btn-secondary:not(:disabled).active {
		color: white;
		background-color: $primary;
		border: 1px solid $primary;
	}
}
*/
</style>