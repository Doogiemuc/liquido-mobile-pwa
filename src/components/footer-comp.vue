<template>
  <footer class="container-lg" :class="{'showFooterMenu': showFooterMenu}">
		<div class="row my-1" @click="toggleFooterMenu()">
			<div class="col text-center">
				<router-link to="/about" class="navbar-item">About</router-link>
			</div>
			<div class="col text-center">
				<router-link to="/contact" class="navbar-item">Contact</router-link>
			</div>
			<div class="col text-center">
				<span>&copy; {{ year }}</span>
			</div>
		</div>
		<div class="row">
			<div class="col">
			<h1>And much more</h1>
				<p>Content for a footer rlow</p>
				<p>Content for a footer rlow</p>
				<p>Content for a footer rlow</p>
				<p>Content for a footer rlow</p>
			</div>
		</div>
  </footer>
</template>

<script>
import { get } from "vuex-pathify"

export default {
  name: "GlobalFooter",
  components: {},
  mixins: [],
  data() {
    return {
			year: new Date().getFullYear(),
			showFooterMenu: false,
    }
  },
  beforeCreate() {},
  created() {},
  beforeMount() {},
  mounted() {},
  computed: {
    showFooter: get("ui/showFooter"),
  },
  methods: {
		toggleFooterMenu() {
			this.showFooterMenu = !this.showFooterMenu
		}
	},
  beforeUpdate() {},
  updated() {},
  beforeDestroy() {},
}
</script>

<style lang="scss" scoped>

// navbar height & offset
$footerHeight: 32px;

footer {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	z-index: 999;
	transform: translateY(calc(100% - 35px));
	//transition: all .3s ease;

	background-color: $grey-lighter;
}
.showFooterMenu {
	transform: none;
}
</style>
