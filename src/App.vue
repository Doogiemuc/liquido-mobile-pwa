<template>
	<div id="app">
		<transition name="fadePage" mode="out-in">
			<router-view id="appContent" :key="$route.fullPath" />
		</transition>
		<liquido-footer v-if="$root.store.showFooter"/>
	</div>
</template>

<script>

import liquidoFooter from '@/components/liquido-footer'

export default {
	name: "App",
	components: { liquidoFooter },
	mixins: [],
	//data is set in main.js
	created() {},
	mounted() {},
	computed: {
		headerHeight() {
			return $('#behindHeader').height()
		}
	},
	methods: {},
	updated() {},
	beforeDestroy() {},
}
</script>

<style lang="scss">
// Import liquido specific global styles
@import "styles/liquido.scss";

#app {
	max-width: 1140px;   // bootstrap breakpoint of container-lg
	height: 100vh;
	margin: 0 auto;
	position: relative;
}

/** no horizintal scrolling */
#appContent {
	// margin-top: 60px !important;  // for navbar
	margin-bottom: 50px;  // for footer
	overflow-x: hidden;
}


/*
.fadePage-enter-active,
.fadePage-leave-active {
  transition: opacity 0.1s;
}
.fadePage-enter,
.fadePage-leave-to {
  opacity: 0;
}

// current route link
.router-link-active {
  color: $blue;
  font-weight: bold;
}
*/
</style>
