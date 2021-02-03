<template>
	<div id="app">
		<liquido-header :back-link="backLink" />
		<transition :name="transitionName">
			<router-view
				id="appContent"
				class="router-view container-lg"
			/>
		</transition>
	</div>
</template>

<script>
import liquidoHeader from "@/components/liquido-header"

/** Liquido Root App */
export default {
	name: "LiquidoApp",
	components: { liquidoHeader },
	mixins: [],
	computed: {
		/**
		 * Show appropriate backlink in liquido-header
		 *
		 * show one poll -> back to list of polls
		 * add proposal  -> back to poll
		 * cast vote     -> back to poll
		 * otherwise don't show a back link
		 */
		backLink() {
			if (/^\/polls\/\d+$/.test(this.$route.path)) {
				return "/polls"
			} else if (/^\/polls\/\d+\/castVote$/.test(this.$route.path)) {
				return "BACK"
			} else if (/^\/polls\/\d+\/add$/.test(this.$route.path)) {
				return "BACK"
			}
			return undefined
		},
		/** which footer to show */
		showPollsFooter() {
			return this.$route.path === "/polls"
		},
	},
	// watch the `$route` to determine the transition to use
	// https://router.vuejs.org/guide/advanced/transitions.html#per-route-transition
	watch: {
		$route(to, from) {
			const fromDepth = from.path.split("/").length
			const toDepth = to.path.split("/").length
			this.transitionName = ""
			if (fromDepth < toDepth)  { this.transitionName = "slide-left" } else
			if (fromDepth > toDepth)  { this.transitionName = "slide-right"} else 
			if (from.path === "/team")  { this.transitionName = "slide-left" } else
			if (from.name === "createPoll" && to.name === "showPoll") { this.transitionName = "slide-left" } else
			if (fromDepth === toDepth) { this.transitionName = "fade" }
		},
	},
	// all data properties are set in main.js !
	created() {},
	mounted() {},
	methods: {
	},
}
</script>

<style lang="scss">
// Import liquido specific global styles
@import "styles/liquido.scss";

#app {
	max-width: 1140px; // bootstrap breakpoint of container-lg
	height: 100vh;
	margin: 0 auto;
	position: relative;
	overflow-x: hidden;
}

/** 
 * Main app content below the header
 * no horizintal scrolling 
 */
#appContent {
	padding-top: 50px;   // behind header. MUTS be padding!
	padding-bottom: 50px;
	padding-left: 10px;  // smaller than bootsraps default 15px. But still enough for iOS scrollbar.
	padding-right: 10px;
	overflow-x: hidden;
	height: 100%;
}

// Slide animation between pages
.router-view {
	transition: all 0.5s ease-in-out;
}
.fade-enter,
.fade-leave-to {
	opacity: 0;
}
.fade-leave-active {
	position: absolute;
	width: 100%;
}

.slide-left-enter,
.slide-right-leave-to {
	-webkit-transform: translate(100%, 0);
	transform: translate(100%, 0);
}
.slide-left-leave-active,
.slide-right-leave-active {
	position: absolute;
	width: 100%;
}
.slide-left-leave-to,
.slide-right-enter {
	-webkit-transform: translate(-100%, 0);
	transform: translate(-100%, 0);
}
</style>
