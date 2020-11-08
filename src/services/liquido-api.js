/**
 * REST client for LIQUIDO backend API.
 * This module only handles the HTTP REST layer. For local storage of data see liquido-store.js
 */

import axios from 'axios'
import store from "./liquido-store"
import config from 'config'
//import { getOwnPropertyNames } from 'core-js/fn/object';

const log = require('loglevel').getLogger('liquido-api');
log.enableAll()

axios.defaults.baseURL = config.LIQUIDO_API_URL
//axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
console.log("liquido-api: "+axios.defaults.baseURL)

// AXIOS HTTP client
const HTTP = () => {
	return axios.create({
		/*
		baseURL: config.LIQUIDO_API_URL,
		headers: {
			Authorization: `Bearer ${bearerToken}`,
		},
		*/
	})
}

export default {

	backendIsAvailable() {
		return axios.get("/")
	},

	login(user, team, jwt, voterToken) {
		store.put("team", team)
		store.put("user", user)
		store.put("jwt",  jwt)
		store.put("voterToken", voterToken)
		axios.defaults.headers.common['Authorization'] = "Bearer " + jwt;
		console.log("Login <"+user.email+"> in "+team.name)
	},

	/* login for development. Only available in NODE_ENV=development or test */
	async devLogin(userEmail, teamName) {
		if (process.env.NODE_ENV !== "development" && process.env.NODE_ENV !== "test") throw Error("devLogin is only allowed in NODE_ENV development or test")
		//console.log("API: devLogin email="+email+" in team="+teamName)
		return axios({
			method: "GET", 
			url: "/devLogin", 
			params: {
				userEmail: userEmail,
				teamName: teamName
			}
		}).then(res => {
			console.log("API: devLogin for <"+userEmail+"> in team '"+teamName+"'")
			this.login(res.data.user, res.data.team, res.data.jwt, res.data.jwt)
			return res.data
		}).catch(err => { 
			console.error(err.response ? err.response : err)
			return Promise.reject(err.response ? err.response : err)
		})
	},

	/** Logout the current user. Remove JWT */
	logout() {
		axios.defaults.headers.common['Authorization'] = undefined
		console.log("API: logout")
	},

	/**
	 * Create a new team.
	 * This method will also save the current user, jwt and voterToken to liquido-store.
	 * @param {Object} newTeam data for new Team: teamName, adminName and adminEmail
	 * @returns {Object} response from the server with { team, jwt, voterToken}
	 */
	createNewTeam(newTeam) {
		return axios.post("/team", newTeam)
			.then(res => {
				log.info("Created new team:", res.data)
				this.login(res.data.user, res.data.team, res.data.jwt, res.data.voterToken)
				return res.data
			})
			// There is deliberately no error handling here, because we can't handle the error in this method :-)
			// Only catch errors if you can do something about it. Otherwise simply let the rejection bubble up the call chain.
			// Further up some UI method will do something about the error, e.g. show an meaningful error message to the user.
	},

	async joinTeam(joinTeamRequest) {
		return axios.put("/team/join", joinTeamRequest)
		.then(res => {
			log.info("Joined team:", res.data)
			this.login(res.data.user, res.data.team, res.data.jwt, res.data.voterToken)
			return res.data
		})
	},

	async getTeam() {
		return Promise.reject("not yet implemented")
	},

	/**
	 * Create a new poll and cache the returned result
	 * @param {Object} poll 
	 */
	async createPoll(poll) {
		return axios.post("polls", poll)
		.then(res => {
			let createdPoll = res.data
			log.info("Poll created:", createdPoll)
			store.cachePoll(createdPoll)
			return createdPoll
		})
	},

	/**
	 * 
	 * @param {Number} pollId poll.id
	 * @param {Boolean} forceRefresh by default cache from liquido-store will be used. Set this to true to force an API call to the backend
	 */
	async getPollById(pollId, forceRefresh = false) {
		let pollFromCache = store.getPollById(pollId)
		if (!pollFromCache || noCache) {
			return axios.get("/polls/"+pollId)
				.then(res => { 
					store.cachePoll(res.data)
					return res.data
				})
		}
		return Promise.resolve(pollFromCache)
	},

	async getPolls(status = undefined) {
		return Promise.reject("not yet implemented")
	},

	

	/** save new or update existing proposal */
	async saveProposal(proposal) {
		return Promise.reject("not yet implemented")
	},

	async startVotingPhase(pollId) {
		//TODO: call backend
		console.log("starting voting phase of poll(id=" + pollId + ")")
		let poll = store.getPollById(pollId)
		if (!poll) return Promise.reject("Cannot start voting phase. Cannot find poll(id=" + pollId)
		poll.status = "VOTING"
		return Promise.resolve(poll)
	},

	async castVote(pollId, ballot) {
		console.log("Cast vote in poll(id=" + pollId + ")")
		//TODO: call backend
		let poll = store.getPollById(pollId)
		if (!poll)
			return Promise.reject("Cannot cast vote. Cannot find poll(id=" + pollId)
		if (poll.status !== "VOTING")
			return Promise.reject("Cannot cast vote in poll(id=" + pollId + "): Poll is not in status VOTING")
		if (!poll.ballots) poll.ballots = []
		poll.ballots.push(ballot)   //TODO: SECURITY: The poll in the client should not contain all ballots. Only store ballots in the backend
		poll.usersBallot = ballot   // only return usesr own ballot to the client
		return Promise.resolve(poll)
	},

	async endVotingPhase(pollId) {
		return Promise.reject("not yet implemented")
	},

}
