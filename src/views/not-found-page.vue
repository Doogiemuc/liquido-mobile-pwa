<template>
	<div class="hero-body">
		<div class="container">
			<h1 class="title">
				404 Not Found
			</h1>
		</div>
	</div>
</template>

<script>
export default {
	name: "NotFound",
	components: {},
	filters: {},
	// props: [],
	mixins: [],
	data() {
		return {}
	},
	computed: {},
	beforeCreate() {},
	created() {
		this.$router.push("/404")
	},
	beforeMount() {},
	mounted() {},
	beforeUpdate() {},
	updated() {},
	beforeDestroy() {},
	methods: {},
}
</script>

<style lang="scss" scoped></style>
