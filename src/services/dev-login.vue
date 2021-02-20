<template>
	<div>
		<h1 class="page-title">
			LIQUIDO - DevLogin
		</h1>
		<div class="alert alert-secondary">
			NODE_ENV="{{ nodeEnv }}"
		</div>
		<div
			v-if="successMessage"
			id="devLoginSuccessful"
			class="alert alert-success"
		>
			{{ successMessage }}
		</div>
		<div class="clearfix" />


		<router-link
			id="GoToPollsButton"
			tag="button"
			class="btn btn-primary"
			:to="{name: 'polls'}"
		>
			Polls
		</router-link>
		<router-link
			id="GoToTeamButton"
			tag="button"
			class="btn btn-primary ml-3"
			:to="{name: 'teamHome'}"
		>
			Team
		</router-link>

		<div
			v-if="errorMessage"
			class="alert alert-danger"
		>
			{{ errorMessage }}
		</div>
		
		<div v-if="polls">
			<router-link :to="{ name: 'polls'}">
				<h4>Polls of Team</h4>
			</router-link>
			<ul>
				<li
					v-for="poll in polls"
					:key="poll.id"
				>
					<router-link :to="{ name: 'showPoll', params: { pollId: ''+poll.id }}">
						{{ poll.title }}
					</router-link>
				</li>
			</ul>
		</div>
		
		<h4 class="mt-3">LoginData</h4>
		<pre><small>{{ loginData }}</small></pre>
	</div>
</template>

<script>
/**
 * Quick & easy hack to login a user during testing.
 * This component is only available in NODE_ENV=test or development!
 */
export default {
	name: "DevLogin",
	props: {
		userEmail: { type: String, required: true, default: undefined },
		teamName:  { type: String, required: true, default: undefined },
	},
	data() {
		return { 
			successMessage: undefined,
			errorMessage: undefined,
			polls: undefined,
			loginData: undefined
		}
	},
	computed: {
		nodeEnv() { return process.env.NODE_ENV },
		showDetails() { return true },
	},
	created() {},
	mounted() {
		this.message = "Sending /devLogin request ..."
		this.$api.devLogin(this.userEmail, this.teamName)
			.then(loginData => { 
				this.loginData = loginData
				this.polls = loginData.polls
				this.errorMessage = undefined
				this.successMessage = "devLogin successfull"
			})
			.catch(err => {	
				console.log("devLogin ERROR: ", err)
				this.errorMessage = "ERROR: "+JSON.stringify(err) 
			})
	},
	methods: {},
}
</script>

<style lang="scss" scoped></style>
