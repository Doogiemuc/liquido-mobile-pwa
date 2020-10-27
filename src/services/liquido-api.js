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
				store.put("team", res.data.team)
				store.put("user", res.data.team.admin)
				store.put("jwt",  res.data.jwt)
				store.put("voterToken", res.data.voterToken)
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
			store.put("team", res.data.team)
			store.put("user", res.data.user)
			store.put("jwt",  res.data.jwt)
			store.put("voterToken", res.data.voterToken)
			return res.data
		})
	},

	async getTeam() {
		return Promise.reject("not yet implemented")
	},

	async getPollById(pollId) {
		return Promise.reject("not yet implemented")
	},

	async getPolls(status = undefined) {
		return Promise.reject("not yet implemented")
	},

	async savePoll(poll) {
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
