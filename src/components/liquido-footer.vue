<template>
	<footer class="container-lg">
		<div class="row">
			<div class="col text-center">
				<router-link to="/ideas" class="navbar-item"><i class="fas fa-lightbulb"></i></router-link>
			</div>
			<div class="col text-center">
				<div class="circle-1">
					<router-link to="/polls" class="navbar-item"><i class="fas fa-person-booth"></i></router-link>
				</div>
			</div>
			<div class="col text-center">
				<router-link to="/team" class="navbar-item"><i class="fas fa-users"></i></router-link>
			</div>
		</div>
	</footer>
</template>

<script>

export default {
	name: "LiquidiFooter",
	components: {},
	mixins: [],
	data() { 
		return {} 
	},
	created() {},
	mounted() {},
	computed: {},
	methods: {},
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
	border-top: 1px solid rgba(0,0,255, 0.3);
	background-color: rgba(220, 236, 255, 0.9);
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
