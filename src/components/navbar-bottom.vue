<template>
	<nav id="navbar">
		<div :class="teamButtonClass" class="team-button">
			<a href="#" aria-label="Team Home" @click="goToTeam()">
				<i class="fas fa-users" />
				<div class="icon-title">{{ $t("Team") }}</div>
			</a>
		</div>
		<div :class="discussButtonClass" class="discuss-button">
			<a href="#" aria-label="Polls with proposals to discuss" @click="clickPollsInDiscussion()">
				<div v-if="pollsInElaboration.length > 0" class="counter-badge">{{ pollsInElaboration.length }}</div>
				<i class="fas fa-comments" />
				<div class="icon-title">{{ $t("discuss") }}</div>
			</a>
		</div>
		<div :class="voteButtonClass" class="vote-button">
			<a href="#" aria-label="Go to vote" @click="clickPollsInVoting()">
				<div v-if="pollsInVoting.length > 0" class="counter-badge">{{ pollsInVoting.length }}</div>
				<i class="fas fa-person-booth" />
				<div class="icon-title">{{ $t("vote") }}</div>
			</a>
		</div>
		<div :class="finishedButtonClass" class="finished-button">
			<a href="#" aria-label="Finished polls" @click="clickFinishedPolls()">
				<div v-if="pollsFinished.length > 0" class="counter-badge">{{ pollsFinished.length }}</div>
				<i class="fas fa-check-circle" />
				<div class="icon-title">{{ $t("finished") }}</div>
			</a>
		</div>
		<div :class="menueButtonClass" class="menue-button">
			<a href="#" aria-label="Toggle menue" @click="toggleMenue">
				<i class="fas fa-bars" />
				<div class="icon-title">{{ $t("Menue") }}</div>
			</a>
		</div>
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
			selectedItem: -1,         // -1 === show all polls
			menueOpen: false,
			forceRefreshComputed: 0   
		} 
	},
	computed: {
		pollsInElaboration() {
			this.forceRefreshComputed;
			let res = this.$api.getCachedPolls("ELABORATION")
			console.log("======== recompute pollsInElaboration", res)
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
			this.forceRefreshComputed;
			return { 
				selected: this.selectedItem === 0
			}
		},
		discussButtonClass() {
			return { 
				selected: this.selectedItem === 1 || this.selectedItem === -1,
				disabled: this.pollsInElaboration.length === 0
			}
		},
		voteButtonClass() {
			return { 
				selected: this.selectedItem === 2 || this.selectedItem === -1,
				disabled: this.pollsInVoting.length === 0
			}
		},
		finishedButtonClass() {
			return { 
				selected: this.selectedItem === 3 || this.selectedItem === -1,
				disabled: this.pollsFinished.length === 0
			}
		},
		menueButtonClass() {
			return { 
				selected: this.menueOpen
			}
		}
	},
	watch: {
		// when navigating from login to teamHome
		"$route.name": function(routeName) {
			console.log("navbar-bottom route.name changed to ", routeName)
			this.updatedSelectedItem()
		}		
	},
	created() {
		console.log("navbar-bottom created")
		EventBus.$on(EventBus.POLLS_LOADED, () => {  // MUST use arrow-function to keep `this` reference!
			// hack to make computed properties refresh their value
			// https://logaretm.com/blog/2019-10-11-forcing-recomputation-of-computed-properties/
			console.log("POLLS_LOADED .........")
			this.forceRefreshComputed++;  
		})
		EventBus.$on(EventBus.POLL_LOADED, () => {
			console.log("navbar-bottom POLLS_LOADED")
			this.forceRefreshComputed++;
		})
		EventBus.$on(EventBus.LOGIN, () => {
			console.log("LOGIN ====")
			this.forceRefreshComputed++;
		})
		// Check what needs to be the selectedItem, depending on this.$route.name
		this.updatedSelectedItem()
	},
	mounted() {
		//console.log("navbar-bottom mounted: forceRefreshComputed")
		//this.forceRefreshComputed++;
	},
	methods: {
		updatedSelectedItem() {
			if (this.$route.name === "teamHome") {
				this.selectedItem = 0
			}
		},

		goToTeam() {
			if (this.selectedItem !== 0) {
				this.selectedItem = 0
				this.$router.push({name: "teamHome"})
			}
		},

		/**
		 * When user is on the team page and clicks on any of the poll buttons in the navbar
		 * then select all three and show all types of polls.
		 * When all three are selected and user clicks on one of them, 
		 * then filter only that one type of polls.
		 * When one poll button is selected and user clicks on it again,
		 * then select all three and show all types of polls.
		 */
		clickPollsInDiscussion() {
			let newPollStatusFilter = undefined
			if (this.selectedItem === 0 || this.selectedItem === 1) {
				this.selectedItem = -1  // filter for all types of polls when 
				EventBus.$emit(EventBus.SET_POLLS_FILTER, undefined)
			} else {
				this.selectedItem = 1
				newPollStatusFilter = "ELABORATION"
				EventBus.$emit(EventBus.SET_POLLS_FILTER, "ELABORATION")
			}
			if (this.$route && this.$route.name !== "polls") {
				this.$router.push({name: "polls", params: { status: newPollStatusFilter }})
			}
		},

		clickPollsInVoting() {
			let newPollStatusFilter = undefined
			if (this.selectedItem === 0 || this.selectedItem === 2) {
				this.selectedItem = -1
				EventBus.$emit(EventBus.SET_POLLS_FILTER, undefined)
			} else {
				this.selectedItem = 2
				newPollStatusFilter = "VOTING"
				EventBus.$emit(EventBus.SET_POLLS_FILTER, "VOTING")
			}
			if (this.$route && this.$route.name !== "polls") {
				this.$router.push({name: "polls", params: { status: newPollStatusFilter }})
			}
		},

		clickFinishedPolls() {
			let newPollStatusFilter = undefined
			if (this.selectedItem === 0 || this.selectedItem === 3) {
				this.selectedItem = -1
				EventBus.$emit(EventBus.SET_POLLS_FILTER, undefined)
			} else {
				this.selectedItem = 3
				newPollStatusFilter = "FINISHED"
				EventBus.$emit(EventBus.SET_POLLS_FILTER, "FINISHED")
			}
			if (this.$route && this.$route.name !== "polls") {
				this.$router.push({name: "polls", params: { status: newPollStatusFilter }})
			}
		},

		toggleMenue() {
			this.menueOpen = !this.menueOpen
		}
	},
}
</script>

<style lang="scss" scoped>

$arrowColor: white; //#bbcaec;
$arrowWidth: 10px;
$arrowHeight: 30px;  // half height
$arrowGap: 5px;

#navbar {
	position: fixed;
	width: 100%;
	height: 2 * $arrowHeight + 4 * $arrowGap;
	bottom: 0;
	left: 0;
	right: 0;
	z-index: 999;
	font-size: 1.7rem;
	padding: 0;
	margin: 0;
	box-shadow: 0 0 0.25rem rgba(0,0,0,0.6);
	background-color: $header-bg;

	display: flex;
	flex-wrap: nowrap;
	justify-content: space-between;
	align-items: center;
	
  /*
	.team-button, .menue-button {
		display: flex;
		flex-direction: column;
		justify-content: center;
	}
	*/

	.team-button, .discuss-button, .vote-button, .finished-button, .menue-button {
		text-align: center;
		margin: 0;
		padding: 0;
		height: 2 * $arrowHeight;
		position: relative;
		transition: background-color 0.5s;
		a { 
			position: relative;
			text-decoration: none;
			display: inline-block;
			width: 100%;
			height: 100%;
		}
	} 

	.discuss-button, .vote-button, .finished-button {
		min-width: 60px;
		background-color: $arrowColor;
		&::after {
			-webkit-transition: background-color 0.5s ease, border-color 0.5s ease;
			-moz-transition: background-color 0.5s ease, border-color 0.5s ease;
			/* please note that transitions are not supported in IE 9 and there is no -ms prefix */
			transition: background-color 0.5s ease, border-color 0.5s ease;
		}
		&.selected::after {
			border-color: transparent transparent transparent $primary;
		}
		&::before {
			-webkit-transition: background-color 0.5s ease, border-color 0.5s ease;
			-moz-transition: background-color 0.5s ease, border-color 0.5s ease;
			/* please note that transitions are not supported in IE 9 and there is no -ms prefix */
			transition: background-color 0.5s ease, border-color 0.5s ease;
		}
		&.selected::before {
			border-color: $primary $primary $primary transparent;
		}
	}

	.team-button {
		flex-grow: 1;
		border-top-right-radius: 10px;
		border-bottom-right-radius: 10px;
	}

	.discuss-button {
		position: relative;
		border-top-left-radius: 10px;
		border-bottom-left-radius: 10px;
		margin-left: 5px;
		margin-right: $arrowWidth + $arrowGap;
		flex-grow: 2;
		&::after {
			position: absolute;
			content: "";
			top: 0px;
			right: -$arrowWidth;
			width: 0px;
			height: 0px;
			border-style: solid;
			border-width: $arrowHeight 0 $arrowHeight $arrowWidth;
			border-color: transparent transparent transparent $arrowColor;
			z-index: 150;
		}	
	}

	.vote-button {
		flex-grow: 2;
		margin-right: $arrowWidth + $arrowGap;
		&::before {
			position: absolute;
			content: "";
			top: 0px;
			left: -$arrowWidth;
			width: 0px;
			height: 0px;
			border-style: solid;
			border-width: $arrowHeight 0 $arrowHeight $arrowWidth;
			border-color: $arrowColor $arrowColor $arrowColor transparent;		
		}
		&::after {
			position: absolute;
			content: "";
			top: 0px;
			right: -$arrowWidth;
			width: 0px;
			height: 0px;
			border-style: solid;
			border-width: $arrowHeight 0 $arrowHeight $arrowWidth;
			border-color: transparent transparent transparent $arrowColor;
			z-index: 150;
		}
	}

	.finished-button {
		flex-grow: 2;
		border-top-right-radius: 10px;
		border-bottom-right-radius: 10px;
		margin-right: 5px;
		padding: 0;
		background-color: $arrowColor;
		&::before {
			position: absolute;
			content: "";
			top: 0px;
			left: -$arrowWidth;
			width: 0px;
			height: 0px;
			border-style: solid;
			border-width: $arrowHeight 0 $arrowHeight $arrowWidth;
			border-color: $arrowColor $arrowColor $arrowColor transparent;		
		}
	}

	.menue-button {
		flex-grow: 1;
		border-top-left-radius: 10px;
		border-bottom-left-radius: 10px;
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
	.disabled.selected {
		a { color: lightgray !important; }
	}
	.counter-badge {
		position: absolute;
		top: 2px;
		right: 10px;
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
