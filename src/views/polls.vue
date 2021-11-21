<template>
	<div>
		<h1 class="polls-list-title">{{ pageTitleLoc }}</h1>

		<div v-if="loading" class="my-3">
			<b-spinner small />&nbsp;{{ $t('Loading') }}
		</div>

		<!-- list of polls -->
		<div v-if="!loading" class="poll-list">
			<transition-group name="poll-list" tag="div">
				<poll-panel 
					v-for="poll in filteredPolls"
					:key="poll.id"
					:poll="poll"
					:collapse="true"
					class="shadow-sm"
				/>
			</transition-group>

			<p v-if="allPolls.length === 0 && !loading" v-html="$t('noPollYet')" />

			<p v-if="searchResultIsEmpty" class="text-center" v-html="$t('noPollsMatchSearch')" />

			<div class="search-icon-wrapper">
				<i class="fas fa-search search-icon"></i>
			</div>
			<input
				v-if="showSearch"
				id="searchInput"
				v-model="searchQuery"
				class="form-control mb-4"
				:placeholder="$t('Search')"
			/>

		</div>


		
		<div v-if="pollStatusFilter === undefined && allPolls.length > 0" class="alert text-muted">
			<p v-html="$t('allPollsInfo')" />
		</div>

		<div v-if="pollStatusFilter === 'ELABORATION'" class="alert text-muted">
			<p v-if="hasPollInElaboration" v-html="$t('pollsInElaborationInfo')" />
			<p v-else v-html="$t('noPollsInElaboration')" />
			<p v-if="!hasPollInElaboration && hasPollInVoting" v-html="$t('butPollInVoting')" />
		</div>

		<div v-if="pollStatusFilter === 'VOTING'" class="alert text-muted">
			<p v-if="hasPollInVoting" v-html="$t('pollsInVotingInfo')" />
			<p v-else v-html="$t('noPollsInVoting')" />
			<p v-if="!hasPollInVoting && hasPollInElaboration" v-html="$t('butProposalsInDiscussion')" />
		</div>

		<div v-if="pollStatusFilter === 'FINISHED'" class="alert text-muted">
			<p v-if="hasFinishedPoll" v-html="$t('finishedPollsInfo')" />
			<p v-else v-html="$t('noFinishedPolls')" />
			<p v-if="!hasFinishedPoll && hasPollInVoting" v-html="$t('butPollInVoting')" />
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
/**
 * This is by far the most important view in the whole app.
 * I think meanwhile I redesigned it dozens of times ... and yet it's not perfect :-)
 */


//import liquidoInput from "../components/liquido-input"
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
				allPollsInfo: "Klicke auf eine Abstimmung für weitere Details.",
				pollsInElaborationInfo: 
					"Diese Abstimmungen stehen gerade zur Diskussion. Weitere Wahlvorschläge können hinzugefügt werden. " +
					"Nachdem euer Admin dann die Abstimmungsphase gestartet hat, könnt ihr jeweils eure Stimme abgeben.",
				pollsInVotingInfo: "In diesen Abstimmungen kannst du jetzt deine Stimme abgeben.",
				finishedPollsInfo: "Diese Abstimmung sind abgschlossen.",
				noPollYet: "Euer Admin hat bisher noch keine Abstimmung erstellt.",
				noPollsMatchSearch: "- Keine Treffer für diese Suche -",
				noPollsInElaboration: "Aktuell gibt es gerade keine Abstimmungen mit Wahlvorschläge die noch diskutiert werden können.",
				noPollsInVoting: "Es läuft gerade keine Abstimmungen, in der du deine Stimmen abgegeben könntest.",
				noFinishedPolls: "In eurem Team gibt es bisher noch keine abgeschlossenen Abstimmungen.",
				butProposalsInDiscussion: "Es gibt jedoch Abstimmungen in Diskussion. Dort könnt ihr die Wahlvorschlägen diskutieren.",
				butPollInVoting: "Es gibt jedoch eine <b>laufende Abstimmung</b> in der du deine Stimme abgeben kannst.",
				onlyAdminCanCreateNewPolls: "Nur du als Admin dieses Teams kannst neue Abstimmungen erstellen. " +
					"Jeder im Team kann dann seinen Wahlvorschlag zur Abstimmung hinzufügen.",
				createPoll: "Neue Abstimmung anlegen",
			},
		},
	},
	components: { pollPanel },
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
			return this.filteredPolls.length === 0 // && this.searchQuery && this.searchQuery.trim().length > 0
		},
		hasPollInElaboration() {
			return this.$api.getCachedPolls("ELABORATION").length > 0
		},
		hasPollInVoting() {
			return this.$api.getCachedPolls("VOTING").length > 0
		},
		hasFinishedPoll() {
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
			let Q = this.searchQuery.trim().toUpperCase()
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

<style scoped lang="scss">

.polls-list-title {
	text-align: center;
	margin: 1rem;
}

.search-icon-wrapper {
	text-align: right;
}
.search-icon {
	color: $primary-text;
	margin-top: 1rem;
}
.poll-list {
	margin: 0 -10px 0 -10px;
	padding: 2rem 10px 10px 10px;
	background-color: $poll-list-background;
}
.poll-panel {
	transition: all 1s;
	max-height: 300px;
	&:not(:last-child) {
		margin-bottom: 1rem;
	}
	
}

/* Vue list transitions */
.poll-list-enter, .poll-list-leave-to {
	opacity: 0;
	max-height: 0;
	margin-bottom: 0;
}
/*
.poll-list-leave-active {
	border: 1px solid red;
}
*/

.iconRight {
	color: $primary;
}

</style>