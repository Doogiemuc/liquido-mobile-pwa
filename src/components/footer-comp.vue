<template>
  <footer class="bg-white">
    <router-link to="/about" class="navbar-item">About</router-link>
    <router-link to="/contact" class="navbar-item">Contact</router-link>
    <span>&copy; {{ year }}</span>
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
    }
  },
  beforeCreate() {},
  created() {},
  beforeMount() {},
  mounted() {},
  computed: {
    showFooter: get("ui/showFooter"),
  },
  methods: {},
  beforeUpdate() {},
  updated() {},
  beforeDestroy() {},
}
</script>

<style lang="scss" scoped>
footer {
	width: 100%;
	margin-top: 5rem;
	border-top: 1px solid $primary;
	padding-top: 5px;
	padding-bottom: 5px;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
}
</style>
