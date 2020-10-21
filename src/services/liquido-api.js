/**
 * Client for LIQUIDO backend REST api
 */

import axios from 'axios'
import store from "../services/liquido-store"
import config from '../../config/config.int.js'
const log = require('loglevel').getLogger('liquido-api');
log.enableAll()

axios.defaults.baseURL = config.LIQUIDO_API_URL
//axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;

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

	createNewTeam(newTeam) {
		return axios.post("/createTeam", newTeam)
			.then(res => {
				log.info("created new team", res.data)
				return res.data
			})
			.catch(err => {
				log.error("Cannot create new Team", err)
				return Promise.reject("Cannot create new team")
			})
	},

	async joinTeam(inviteCode) {
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

		await stall(1000)

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
