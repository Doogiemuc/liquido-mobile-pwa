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
			if (fromDepth < toDepth) this.transitionName = "slide-left"
			if (fromDepth > toDepth) this.transitionName = "slide-right"
		},
	},
	computed: {
		/** If we show one poll, then show a backlink */
		backLink() {
			return /\/polls\/\d+/.test(this.$route.path) ? "BACK" : undefined
			//TODO: show backlinks to other URLs where apropriate
		},
		/** which footer to show */
		showPollsFooter() {
			return this.$route.path === "/polls"
		},
	},
	methods: {},
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
