<template>
  <footer class="container-lg">
		<div class="row">
			<div class="col text-center">
				<router-link to="/proposals" class="navbar-item"><i class="fas fa-vote-yea"></i></router-link>
			</div>
			<div class="col text-center">
				<div class="circle-1">
					<router-link to="/addIdea" class="navbar-item"><i class="far fa-lightbulb"></i></router-link>
				</div>
			</div>
			<div class="col text-center">
				<router-link to="/polls" class="navbar-item"><i class="fas fa-person-booth"></i></router-link>
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

},
  beforeUpdate() {},
  updated() {},
  beforeDestroy() {},
}
</script>

<style lang="scss" scoped>

// mobile navbar at the bottom
footer {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	z-index: 999;
	//transform: translateY(calc(100% - 40px));
	//transition: all .3s ease;

	font-size: 1.7rem;
	border-top: 1px solid $primary;
	background-color: rgba(220, 236, 255, 0.8);
}

.circle-1 {
	background: white;
  width: 50px;
  height: 50px;
	border: 1px solid $primary;
  border-radius: 50%;
	font-size: 2rem;
	position: fixed;
	bottom: 0;
	left: 50%;
	transform: translateX(-50%);
}

</style>
