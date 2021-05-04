<template>
	<nav id="navbar">
		<ul>
			<li	:class="getNavIconClass(0)">
				<a href="#" aria-label="Team Home" @click="goToTeam()">
					<i class="fas fa-users" />
					<div class="icon-title">{{ $t("Team") }}</div>
				</a>
			</li>
			<li	:class="getNavIconClass(1)">
				<a href="#" aria-label="Polls with proposals to discuss" @click="goToPollsInDiscussion()">
					<i class="fas fa-comments" />
					<div class="icon-title">{{ $t("discuss") }}</div>
				</a>
			</li>
			<li	:class="getNavIconClass(2)">
				<a href="#" @click="goToVote()">
					<i class="fas fa-person-booth" />
					<div class="icon-title">{{ $t("vote") }}</div>
				</a>
			</li>
			<li	:class="getNavIconClass(3)">
				<a href="#" aria-label="All polls" @click="goToFinishedPolls()">
					<i class="fas fa-check-circle" />
					<div class="icon-title">{{ $t("finished") }}</div>
				</a>
			</li>

			<li	:class="getNavIconClass(4)">
				<a href="#" @click="toggleMenue()">
					<i class="fas fa-bars" />
					<div class="icon-title">{{ $t("Menue") }}</div>
				</a>
			</li>
		</ul>
	</nav>
</template>

<script>
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
	data() { return {
		selectedItem: -1
	} },
	computed: {
		pollsInVoting() {
			return this.$api.getPollsByStatusSync("VOTING")
		}
	},
	methods: {
		getNavIconClass(idx) {
			return this.selectedItem === idx ? "selected" : ""
		},
		goToTeam() {
			if (this.selectedIteam !== 0) {
				this.selectedItem = 0
				this.$router.push({name: "teamHome"})
			}
		},
		goToPollsInDiscussion() {
			if (this.selectedIteam !== 1) {
				this.selectedItem = 1
				
				if (this.$route && this.$route.name === "polls") {
					//this.$router.replace({name: "polls", params: { status: "ELABORATION" }})	
					//TODO: update polls filter
				} else {
					//https://stackoverflow.com/questions/62223195/vue-router-uncaught-in-promise-error-redirected-from-login-to-via-a/62231211#62231211
					this.$router.push({name: "polls", params: { status: "ELABORATION" }}).catch(() => {})
				}
			}
		},
		goToVote() {
			if (this.selectedIteam !== 2) {
				this.selectedItem = 2

				//TODO: update filter on polls page and only navigate there if not yet there

				if (this.pollsInVoting.length === 1) {
					this.$router.push({name: "showPoll", params: { pollId: this.pollsInVoting[0].id}}).catch(() => {})
				} else {
					if (this.$route && this.$route.name === "polls") {
					//this.$router.replace({name: "polls", params: { status: "ELABORATION" }})	
					//TODO: update polls filter
					} else {
						this.$router.push({name: "polls", params: { status: "VOTING" }}).catch(() => {})
					}
				}
			}
		},
		goToFinishedPolls() {
			if (this.selectedItem !== 3) {
				this.selectedItem = 3
				if (this.$route && this.$route.name === "polls") {
					//this.$router.replace({name: "polls", params: { status: "ELABORATION" }})	
					//TODO: update polls filter
				} else {
					this.$router.push({name: "polls", params: { status: "FINISHED" }}).catch(() => {})
				}
			}
		},
		toggleMenue() {
			//this.menueIsOpen = !this.menueIsOpen
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
			a { text-decoration: none; }
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
		background-color: $header-bg-dark;
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
