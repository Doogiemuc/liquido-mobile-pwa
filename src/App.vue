<template>
  <div id="app">
    <GlobalNavbar />
    <transition name="fadePage" mode="out-in">
      <router-view id="appContent" :key="$route.fullPath" />
    </transition>
    <GlobalFooter />
  </div>
</template>

<script>
import GlobalNavbar from "@/components/navbar-comp"

export default {
	name: "App",
	components: {
		GlobalNavbar,
		GlobalFooter: () => import("@/components/footer-comp"),
	},
	mixins: [],
	data() {
		return {}
	},
	created() {},
	mounted() {},
	computed: {},
	methods: {},
	updated() {},
	beforeDestroy() {},
}
</script>

<style lang="scss">
// Import liquido specific global styles
@import "styles/liquido.scss";

#app {
	max-width: 1024px;   // iPad horizontal
	margin: 0 auto;
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
