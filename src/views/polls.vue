<template>
	<div>
		<div class="container mb-3">
			<h2 class="page-title">{{ pageTitleLoc }}</h2>

			<liquido-input
				v-if="polls.length > 3"
				id="searchInput"
				v-model="searchQuery"
				:label="$t('search')"
				:status="null"
				class="mb-4"
			>
				<template v-slot:iconRight>
					<i class="fas fa-times mr-1" @click="searchQuery = undefined"></i>
				</template>
			</liquido-input>

			<poll-panel v-for="poll in filteredPolls" :poll="poll" :key="poll.id" class="shadow mb-3"></poll-panel>
		</div>

		<div class="container mb-3">
			<div v-if="polls.length === 0" class="alert alert-secondary">
				<p v-html="$t('noPollsYet')"></p>
				<p v-if="userIsAdmin" v-html="$t('noPollsYetAdmin')"></p>
			</div>
			<div
				v-if="
					filteredPolls.length === 0 &&
						searchQuery &&
						searchQuery.trim().length > 0
				"
				class="alert alert-secondary"
			>
				<p v-html="$t('noPollsMatchSearch')"></p>
			</div>
			<div
				v-if="
					filteredPolls.length === 0 &&
						!searchQuery &&
						pollStatusFilter === 'ELABORATION'
				"
				class="alert alert-secondary"
			>
				<p v-html="$t('noPollsInElaboration')"></p>
				<p v-if="pollsInVoting > 0" v-html="$t('butPollInVoting')"></p>
			</div>
			<div
				v-if="
					filteredPolls.length === 0 &&
						!searchQuery &&
						pollStatusFilter === 'VOTING'
				"
				class="alert alert-secondary"
			>
				<p v-html="$t('noPollsInVoting')"></p>
				<p v-if="pollsInElaboration > 0" v-html="$t('butProposalsInDiscussion')"></p>
			</div>
			<div
				v-if="
					filteredPolls.length === 0 &&
						!searchQuery &&
						pollStatusFilter === 'FINISHED'
				"
				class="alert alert-secondary"
			>
				<p v-html="$t('noFinishedPolls')"></p>
				<p v-if="pollsInVoting > 0" v-html="$t('butPollInVoting')"></p>
			</div>
		</div>

		<div v-if="userIsAdmin" class="container my-5 text-right">
			<b-button variant="primary" @click="createPoll()">
				<i class="fas fa-poll"></i>
				{{ $t("createPoll") }}
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
			en: {
				noPollsInElaboration: "There currently are no polls whose proposals can still be discussed.",
				noPollsInVoting: "There currently are no polls open for voting.",
				noFinishedPolls: "There are no finished polls yet.",
				butProposalsInDiscussion: "However there are proposals that you can discuss.",
				butPollInVoting: "However there is a poll in which you can vote.",
			},
			de: {
				noPollsYet: "Es wurde bisher noch keine Abstimmung erstellt.",
				noPollsYetAdmin: 'Möchstest du eine <a href="/createPoll">Abstimmung erstellen</a>?',
				noPollsMatchSearch: "Keine Treffer für diese Suche.",
				noPollsInElaboration: "Aktuell gibt es gerade keine Wahlvorschläge die noch diskutiert werden können.",
				noPollsInVoting: "Es gibt gerade keine laufenden Abstimmungen.",
				noFinishedPolls: "Es gibt bisher noch keine abgeschlossenen Abstimmungen.",
				butProposalsInDiscussion: "Es gibt jedoch Wahlvorschläge die ihr diskutieren könnt.",
				butPollInVoting: "Es gibt jedoch eine <b>laufende Wahl</b> in der du deine Stimme abgeben kannst.",
				createPoll: "Neue Abstimmung anlegen",
				allPolls: "Alle Abstimmungen",
				ELABORATION: "Neue Abstimmungen",
				VOTING: "Laufende Wahlen",
				FINISHED: "Abgeschlossene Abstimmungen",
			},
		},
	},
	components: { pollPanel, liquidoHeader, liquidoInput, pollsFooter },
	props: {
		status: { type: String, required: false, default: undefined },
	},
	data() {
		return {
			searchQuery: "",
		}
	},
	created() {
		if (this.status && this.status.match(/ELABORATION|VOTING|FINISHED/)) {
			this.$root.store.setPollStatusFilter(this.status)
		}
	},
	mounted() {},
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
			return this.$root.store.user.isAdmin
		},
		polls() {
			return this.$root.store.polls
		},
		filteredPolls() {
			return this.polls
				.filter((poll) => {
					return !this.pollStatusFilter || poll.status === this.pollStatusFilter
				})
				.filter((poll) => this.matchesSearch(poll))
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
		/** current filter for poll status, undefined|ELABORATION|VOTING|FINISHED */
		pollStatusFilter() {
			return this.$root.store.pollStatusFilter
		},
	},
	methods: {
		createPoll() {
			this.$router.push("/createPoll")
		},

		/**
		 * When user clicks on a (currently unselected) status in the footer, then filter for that status.
		 * When user clicks again on the currently selected status (blue), then clear filter.
		 */
		onClickFooter(val) {
			if (this.$root.store.getPollStatusFilter() === val) {
				this.$root.store.setPollStatusFilter(undefined)
			} else {
				this.$root.store.setPollStatusFilter(val)
			}
			this.searchQuery = ""
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
					if (prop.createdBy.profile.name.toUpperCase().includes(Q)) return true
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
