<template>
	<div id="app">
		<liquido-header :back-link="backLink"></liquido-header>
		<transition :name="transitionName">
			<router-view id="appContent" :key="$route.fullPath" class="router-view" />
		</transition>
		<pollsFooter v-if="showPollsFooter"></pollsFooter>
	</div>
</template>

<script>
import liquidoHeader from "@/components/liquido-header"
import pollsFooter from "@/components/polls-footer"

/** Liquido Root App */
export default {
	name: "LiquidoApp",
	components: { liquidoHeader, pollsFooter },
	mixins: [],
	// all data properties are set in main.js !
	created() {},
	mounted() {},
	// watch the `$route` to determine the transition to use
	// https://router.vuejs.org/guide/advanced/transitions.html#per-route-transition
	watch: {
		$route(to, from) {
			const fromDepth = from.path.split("/").length
			const toDepth = to.path.split("/").length

			/*
			this.transitionName = ""
			if (from.path === "/polls" && /^\/polls\/\d+$/.test(to.path)) { this.transitionName = "slide-left"  } else
			if (to.path === "/polls" && /^\/polls\/\d+$/.test(from.path)) { this.transitionName = "slide-right" }
			*/

			if (fromDepth < toDepth) this.transitionName = "slide-left"
			if (fromDepth > toDepth) this.transitionName = "slide-right"
		},
	},
	computed: {
		/**
		 * Show appropriate backlink in liquido-header
		 *
		 * show one poll -> back to list of polls
		 * add proposal  -> back to poll
		 * cast vote     -> back to poll
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
	methods: {
		//These methods are available to all sub components

		/** scroll to the very bottom of the content. Show last chat message */
		scrollToBottom() {
			this.$nextTick(() => {
				$("#app").animate({ scrollTop: $("#app").height() }, 1000)
			})
		},

		/**
		 * scroll an HTML elemant right under the header
		 * (as far up as possible, depending on content below the elem)
		 * @param {String} elem JQuery selector for dom elem
		 * @param {Number} margin margin below headerHeight in pixels (default 0)
		 */
		scrollElemToTop(elem, margin = 0) {
			let scrollTop = $("#app").scrollTop() + $(elem).offset().top - this.$root.headerHeight - margin
			this.$nextTick(() => {
				$("#app").animate({ scrollTop: scrollTop }, 1000)
			})
		},

		/** Check if the bottom of elem is scrolled into view */
		isBottomInView(elem) {
			let docViewTop = $(window).scrollTop()
			let docViewBottom = docViewTop + $(window).height()
			let elemTop = $(elem).offset().top
			let elemBottom = elemTop + $(elem).height()
			return elemBottom <= docViewBottom
		},
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

/** no horizintal scrolling */
#appContent {
	margin-bottom: 50px; // for footer
	overflow-x: hidden;
}
// Slide animation between pages
.router-view {
	transition: transform 0.5s ease-in-out;
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