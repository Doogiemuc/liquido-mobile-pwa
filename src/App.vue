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
  beforeCreate() {},
  created() {},
  beforeMount() {},
  mounted() {},
  computed: {},
  methods: {},
  filters: {},
  beforeUpdate() {},
  updated() {},
  beforeDestroy() {},
}
</script>

<style lang="scss">
// setting Buefy variables from the _variables.scss file
@import "~bulma/sass/utilities/_all";
$primary-invert: findColorInvert($primary);
$colors: (
  "white": (
    $white,
    $black,
  ),
  "black": (
    $black,
    $white,
  ),
  "light": (
    $light,
    $light-invert,
  ),
  "dark": (
    $dark,
    $dark-invert,
  ),
  "primary": (
    $primary,
    $primary-invert,
  ),
  "info": (
    $info,
    $info-invert,
  ),
  "success": (
    $success,
    $success-invert,
  ),
  "warning": (
    $warning,
    $warning-invert,
  ),
  "danger": (
    $danger,
    $danger-invert,
  ),
);
$link: $primary;
$link-invert: $primary-invert;
$link-focus-border: $primary;
@import "~bulma";
@import "~buefy/src/scss/buefy";

html,
body {
  margin: 0;
  padding: 0;
  line-height: 1.5;
  box-sizing: border-box;
  overflow-x: hidden;
}

*,
*:before,
*:after {
  box-sizing: inherit;
}

a,
a:visited,
a:hover {
  text-decoration: none;
}

#app {
  margin: 0;
  padding: 0;
  z-index: 1;
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  min-height: 94vh;
  min-height: calc(100vh - #{$stickyNavHeight + 2px});
}

#appContent {
	flex-grow: 1;
	padding: 0.75rem;
}

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



// margin and padding shortcuts (inspired by bootstrap)
.mb-1 { margin-bottom: 0.5rem; }
.mb-2 { margin-bottom: 1.0rem; }
.mb-3 { margin-bottom: 1.5rem; }
.mt-1 { margin-top: 0.5rem; }
.mt-2 { margin-top: 1.0rem; }
.mt-3 { margin-top: 1.5rem; }
.my-1 { margin-top: 0.5rem; padding-bottom: 0.5rem; }
.my-2 { margin-top: 1.0rem; padding-bottom: 1.0rem; }
.my-3 { margin-top: 1.5rem; padding-bottom: 1.5rem; }
.p-0  { padding: 0; }
.px-0 { padding-left: 0; padding-right: 0; }
.py-0 { padding-top: 0; padding-bottom: 0; }

</style>
