<template>
	<div>
		<h1 class="page-title">LIQUIDO - DevLogin</h1>
		<div class="alert alert-secondary">NODE_ENV="{{nodeEnv}}"</div>
		<div v-if="successMessage" class="alert alert-success">{{ successMessage }}</div>
		<div v-if="errorMessage" class="alert alert-danger">{{ errorMessage }}</div>
		<div v-if="showDetails">
			<h4>User</h4>
			<pre>{{ $root.store.get('user')}}</pre>
			<h4>Team</h4>
			<pre>{{ $root.store.get('team')}}</pre>
			<div v-if="polls">
				<h4>Polls of Team</h4>
				<ul>
					<li v-for="poll in polls" :key="poll.id"><router-link :to="{ name: 'showPoll', params: { pollId: ''+poll.id }}">{{poll.title}}</router-link></li>
				</ul>
			</div>			
		</div>
	</div>
</template>

<script>
/**
 * Quick & easy hack to login a user during testing.
 * This component is only available in NODE_ENV=test or development!
 */
export default {
	name: "devLogin",
	props: {
		userEmail: String,
		teamName: String
	},
	data() {
		return { 
			successMessage: "",
			errorMessage: "",
			polls: undefined,
		}
	},
	created() {},
	mounted() {
		this.message = "Sending /devLogin request ..."
		this.$api.devLogin(this.userEmail, this.teamName)
			.then(res => { 
				this.polls = res.polls
				this.successMessage = "devLogin successfull"
			})
			.catch(err => {	this.errorMessage = "ERROR: "+JSON.stringify(err) })
	},
	computed: {
		nodeEnv() { return process.env.NODE_ENV },
		showDetails() { return true }
	},
	methods: {},
	filters: {},
	beforeUpdate() {},
	updated() {},
	beforeDestroy() {},
}
</script>

<style lang="scss" scoped></style>
