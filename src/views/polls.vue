<template>
	<div>
		<h2 id="polls" class="page-title">
			{{ pageTitleLoc }}
		</h2>

		<liquido-input
			v-if="polls.length > 3"
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

		<poll-panel v-for="poll in filteredPolls" :key="poll.id" :poll="poll" :expanded="false" class="shadow mb-3" />

		<div v-if="polls.length === 0" class="alert alert-info">
			<p v-html="$t('noPollYet')" />
		</div>

		<div v-if="searchResultIsEmpty" class="alert alert-info">
			<p v-html="$t('noPollsMatchSearch')" />
		</div>

		<div v-if="pollStatusFilter === 'ELABORATION'">
			<div v-if="!searchResultIsEmpty" class="alert alert-info">
				<i class="fas fa-info-circle float-right" />
				<p v-html="$t('pollsInElaborationInfo')" />
			</div>

			<div v-if="filteredPolls.length === 0 && !searchQuery" class="alert alert-info">
				<p v-html="$t('noPollsInElaboration')" />
				<p v-if="pollsInVoting > 0" v-html="$t('butPollInVoting')" />
			</div>
		</div>

		<div v-if="pollStatusFilter === 'VOTING'">
			<div v-if="!searchResultIsEmpty" class="alert alert-info">
				<i class="fas fa-info-circle float-right" />
				<p v-html="$t('pollsInVotingInfo')" />
			</div>
			<div v-if="filteredPolls.length === 0 && !searchQuery" class="alert alert-info">
				<i class="fas fa-info-circle float-right" />
				<p v-html="$t('noPollsInVoting')" />
				<p v-if="pollsInElaboration > 0" v-html="$t('butProposalsInDiscussion')" />
			</div>
		</div>

		<div v-if="filteredPolls.length === 0 && !searchQuery && pollStatusFilter === 'FINISHED'" class="alert alert-info">
			<i class="fas fa-info-circle float-right" />
			<p v-html="$t('noFinishedPolls')" />
			<p v-if="pollsInVoting > 0" v-html="$t('butPollInVoting')" />
		</div>

		<div v-if="userIsAdmin" class="my-5 text-right">
			<b-button variant="primary" @click="createPoll()">
				<i class="fas fa-poll" />
				{{ $t("createPoll") }}
				<i class="fas fa-angle-double-right" />
			</b-button>
		</div>

		<pollsFooter 
			:active-status="pollStatusFilter"
			@setPollFilter="setPollFilter"
		/>
	</div>
</template>

<script>
import liquidoInput from "../components/liquido-input"
import pollPanel from "../components/poll-panel"
import pollsFooter from "../components/polls-footer"

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
				pollsInElaborationInfo: 
					"<p>Bitte diskutiert die Wahlvorschläge in diesen Abstimmungen. Die jeweiligen Ersteller können ihren Vorschlag auch noch anpassen.</p>" +
					"<p>In dieser Phase kann jedes Teammitglied auch noch seinen Vorschlag hinzufügen. Euer Teamadmin starten dann die Abstimmungsphase.</p>",
				pollsInVotingInfo: "In diesen Abstimmung kannst du jetzt deine Stimme abgeben.",
				noPollYet: "Euer Admin hat bisher noch keine Abstimmung erstellt.",
				noPollsMatchSearch: "Keine Treffer für diese Suche.",
				noPollsInElaboration: "Aktuell gibt es gerade keine Wahlvorschläge die noch diskutiert werden können.",
				noPollsInVoting: "Es läuft gerade keine Abstimmungen, in der du deine Stimmen abgegeben könntest.",
				noFinishedPolls: "Es gibt bisher noch keine abgeschlossenen Abstimmungen.",
				butProposalsInDiscussion: "Es gibt jedoch Abstimmungen in Diskussion. Dort könnt ihr die Wahlvorschlägen diskutieren.",
				butPollInVoting: "Es gibt jedoch eine <b>laufende Wahl</b> in der du deine Stimme abgeben kannst.",
				createPoll: "Neue Abstimmung anlegen",
				allPolls: "Alle eure Abstimmungen",
			},
		},
	},
	components: { pollPanel, liquidoInput, pollsFooter },
	props: {
		status: { type: String, required: false, default: undefined },
	},
	data() {
		return {
			polls: [],
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
		userIsAdmin() {
			return this.$api.isAdmin()
		},
		filteredPolls() {
			return this.polls
				.filter((poll) => {
					return !this.pollStatusFilter || poll.status === this.pollStatusFilter
				})
				.filter((poll) => this.matchesSearch(poll))
				.sort((p1,p2) => p1.id - p2.id)    //TODO: sort polls by status and then by createdAt
		},
		searchResultIsEmpty() {
			return this.filteredPolls.length === 0 && this.searchQuery && this.searchQuery.trim().length > 0
		},
		pollsInElaboration() {
			return this.polls.filter((poll) => poll.status === "ELABORATION").length
		},
		pollsInVoting() {
			return this.polls.filter((poll) => poll.status === "VOTING").length
		},
		pollsFinished() {
			return this.polls.filter((poll) => poll.status === "FINISHED").length
		},
	},
	created() {
		if (this.status && this.status.match(/ELABORATION|VOTING|FINISHED/)) {
			this.pollStatusFilter = this.status
		}
		this.$api.getPolls().then(polls => {
			this.polls = polls
			//console.log("polls", polls)
		})
	},
	mounted() {},
	methods: {

		setPollFilter(newFilterValue) {
			if (this.pollStatusFilter === newFilterValue) {
				this.pollStatusFilter = undefined
			} else {
				this.pollStatusFilter = newFilterValue
			}
		},

		createPoll() {
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
</style>
