<template>
	<div class="container">
		<h1>
			Uuupss!
		</h1>
		<p>{{$t('NotFound')}}</p>
		<a href="/" class="btn btn-primary">{{$t('StartOver')}}</a>
	</div>
</template>

<script>
export default {
	name: "NotFound",
	i18n: {
		messages: {
			de: {
				NotFound: "Something could not be found. Sorry.",
				StartOver: "Start over"
			}
		}
	},
	components: {},
	data() {
		return {}
	},
	computed: {},
	created() {
		this.$router.push("/404")
	},
	methods: {},
}
</script>

<style lang="scss" scoped></style>
