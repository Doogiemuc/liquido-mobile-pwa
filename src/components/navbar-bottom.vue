<template>
	<nav id="navbar">
		<ul>
			<li :class="teamButtonClass">
				<a href="#" aria-label="Team Home" @click="goToTeam()">
					<i class="fas fa-users" />
					<div class="icon-title">{{ $t("Team") }}</div>
				</a>
			</li>
			<li :class="discussButtonClass">
				<a href="#" aria-label="Polls with proposals to discuss" @click="goToPollsInDiscussion()">
					<div v-if="pollsInElaboration.length > 0" class="counter-badge">{{ pollsInElaboration.length }}</div>
					<i class="fas fa-comments" />
					<div class="icon-title">{{ $t("discuss") }}</div>
				</a>
			</li>
			<li :class="voteButtonClass">
				<a href="#" aria-label="Go to vote" @click="goToVote()">
					<div v-if="pollsInVoting.length > 0" class="counter-badge">{{ pollsInVoting.length }}</div>
					<i class="fas fa-person-booth" />
					<div class="icon-title">{{ $t("vote") }}</div>
				</a>
			</li>
			<li :class="finishedButtonClass">
				<a href="#" aria-label="Finished polls" @click="goToFinishedPolls()">
					<div v-if="pollsFinished.length > 0" class="counter-badge">{{ pollsFinished.length }}</div>
					<i class="fas fa-check-circle" />
					<div class="icon-title">{{ $t("finished") }}</div>
				</a>
			</li>
			<li :class="menueButtonClass">
				<a href="#" aria-label="Toggle menue" @click="toggleMenue">
					<i class="fas fa-bars" />
					<div class="icon-title">{{ $t("Menue") }}</div>
				</a>
			</li>
		</ul>
	</nav>
</template>

<script>
import EventBus from "@/services/event-bus"

export default {
	name: "LiquidoFooter",
	i18n: {
		messages: {
			en: {
				discuss: "diskutieren",
				vote: "abstimmen",
				finished: "entschieden"  // abgeschlossen?  final? fertig?  verb: entscheiden?
			}
		}
	},
	data() { 
		return {
			selectedItem: -1,         // nothing is selected => show all polls
			forceRefreshComputed: 0
		} 
	},
	computed: {
		pollsInElaboration() {
			this.forceRefreshComputed;
			let res = this.$api.getCachedPolls("ELABORATION")
			console.log("recompute pollsInElaboration", res)
			return res
		},
		pollsInVoting() {
			this.forceRefreshComputed;
			return this.$api.getCachedPolls("VOTING")
		},
		pollsFinished() {
			this.forceRefreshComputed;
			return this.$api.getCachedPolls("FINISHED")
		},
		teamButtonClass() {
			return { 
				selected: this.selectedItem === 0
			}
		},
		discussButtonClass() {
			return { 
				selected: this.selectedItem === 1,
				disabled: this.pollsInElaboration.length === 0
			}
		},
		voteButtonClass() {
			return { 
				selected: this.selectedItem === 2,
				disabled: this.pollsInVoting.length === 0
			}
		},
		finishedButtonClass() {
			return { 
				selected: this.selectedItem === 3,
				disabled: this.pollsFinished.length === 0
			}
		},
		menueButtonClass() {
			return { 
				selected: this.selectedItem === 4
			}
		}
	},
	watch: {
		"$route.name": function(routeName) {
			if (routeName === "teamHome") this.selectedItem = 0
		}
	},
	created() {
		EventBus.$on(EventBus.POLLS_LOADED, () => {  // MUST use arrow-function to keep `this` reference!
			// hack to make computed properties refresh their value
			// https://logaretm.com/blog/2019-10-11-forcing-recomputation-of-computed-properties/
			this.forceRefreshComputed++;  
		})
		EventBus.$on(EventBus.POLL_LOADED, () => {
			this.forceRefreshComputed++;  // hack to make computed properties refresh their value
		})
	},
	methods: {

		goToTeam() {
			if (this.selectedItem !== 0) {
				this.selectedItem = 0
				this.$router.push({name: "teamHome"})
			}
		},

		goToPollsInDiscussion() {
			if (this.selectedItem !== 1) {
				this.selectedItem = 1
				if (this.pollsInElaboration.length === 1) {
					this.$router.push({name: "showPoll", params: { pollId: this.pollsInElaboration[0].id }}).catch(() => {})
				} else if (this.$route && this.$route.name === "polls") {
					this.$router.replace({name: "polls", params: { status: "ELABORATION" }})	
				} else {
					//https://stackoverflow.com/questions/62223195/vue-router-uncaught-in-promise-error-redirected-from-login-to-via-a/62231211#62231211
					this.$router.push({name: "polls", params: { status: "ELABORATION" }}).catch(() => {})
				}
			}
		},

		goToVote() {
			if (this.selectedItem !== 2) {
				this.selectedItem = 2
				if (this.pollsInVoting.length === 1) {
					this.$router.push({name: "showPoll", params: { pollId: this.pollsInVoting[0].id}}).catch(() => {})
				} else if (this.$route && this.$route.name === "polls") {
					this.$router.replace({name: "polls", params: { status: "VOTING" }})	
				} else {
					this.$router.push({name: "polls", params: { status: "VOTING" }}).catch(() => {})
				}
			}
		},

		goToFinishedPolls() {
			if (this.selectedItem !== 3) {
				this.selectedItem = 3
				if (this.pollsFinished.length === 1) {
					this.$router.push({name: "showPoll", params: { pollId: this.pollsFinished[0].id }}).catch(() => {})
				} else if (this.$route && this.$route.name === "polls") {
					this.$router.replace({name: "polls", params: { status: "FINISHED" }})	
				} else {
					this.$router.push({name: "polls", params: { status: "FINISHED" }}).catch(() => {})
				}
			}
		},

		toggleMenue() {
			if (this.selectedItem !== 4) {
				this.selectedItem = 4
			} else {
				this.selectedItem = -1  // TOOD: got back to where we were?
			}
		}
	},
}
</script>

<style lang="scss" scoped>

#navbar {
	position: fixed;
	width: 100%;
	bottom: 0;
	left: 0;
	right: 0;
	z-index: 999;
	font-size: 1.7rem;
	padding: 0;
	margin: 0;
	box-shadow: 0 -2px 3px rgba(0,0,0,0.2);
	background-color: $header-bg;

	ul {
		list-style: none;
		display: flex;
		flex-wrap: nowrap;
		padding: 0;
		margin: 0;
		justify-content: space-around;
		li {
			a { 
				position: relative;
				text-decoration: none; 
			}
			flex: 1 1 0px;
			padding: 5px 0;
			text-align: center;
			//border: 1px solid red;
		}
	}
	.icon-title {
		font-size: 11px;
		line-height: 1;
		text-decoration: none;
	}
	.selected {
		a {	color: white !important; }
		background-color: $primary;
	}
	.disabled {
		a { color: grey !important; }
	}
	.counter-badge {
		position: absolute;
		top: 0;
		right: -0.9em;
		color: white;
		background-color: $primary;
		border: 1px solid $header-bg;
		border-radius: 50%;
		width: 18px;
		height: 18px;
		font-family: Geneva, sans-serif;
		font-size: 14px;
		line-height: 16px;
	}
}



.circle-1 {
	background: white;
	width: 50px;
	height: 50px;
	border: 1px solid $primary;
	border-radius: 50%;
	font-size: 1.9rem;
	position: fixed;
	bottom: 0;
	left: 50%;
	transform: translateX(-50%);
}

</style>
