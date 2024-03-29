<template>
	<div>
		<h1 id="polls" class="page-title">{{ pageTitleLoc }}</h1>

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

			<p v-if="searchResultIsEmpty" class="text-center" @click="clearSearch" v-html="$t('noPollsMatchSearch')" />

			<div class="search-wrapper">
				<input id="searchInput" v-model="searchQuery" type="text" :placeholder="$t('Search')">
				<i class="fas fa-search search-icon"></i>
			</div>
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
			pollStatusFilter: undefined,
			forceRefreshComputed: 0   
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
			// Implementation note:
			// We could hold a local copy of all polls in this component. 
			// But that would need to be updated whenver polls are loaded from the backend.
			// So we reference the list of polls from the cache.
			// Sadly the javascript Arry.filter method creates a copy of the array.
			// So VUE's reactive updates do not work when the data changes in the cache.
			// Therefore we have to force a recompute of this "computed" value with a nice hack:
			this.forceRefreshComputed;		
			let polls = this.$api.getCachedPolls()
			return polls
		},
		filteredPolls() {
			this.forceRefreshComputed;
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
		EventBus.$on(EventBus.POLL_LOADED, () => this.pollsChanged())
		EventBus.$on(EventBus.POLLS_LOADED, () => this.pollsChanged())  // event param "polls" is not used here

		// update polls in cache when navigating to this page
		this.loading = true
		this.$api.getPolls()
			.then(() => {
				this.loading = false
			})
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

		/**
		 * Called when the data of one or all polls was updated or reloaded from the backend
		 * Force a refresh of computed values to update the view.
		 */
		pollsChanged() {
			//console.log("pollsChanged")
			this.forceRefreshComputed++
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

		clearSearch() {
			this.searchQuery = undefined
		}
	},
}
</script>

<style scoped lang="scss">

.search-wrapper {
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
	margin: 1rem 0.5rem 0.5rem 0.5rem;
	color: $secondary;
}
#searchInput {
	color: $secondary;
	border: 0;
	flex-grow: 1;
	max-width: 200px;
	border-bottom: 1px solid $secondary;
	background-color: $poll-list-background;
	&:focus {
    outline: 0;
	}
}

.poll-list {
	margin: 0 -3px;
	padding: 10px;
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