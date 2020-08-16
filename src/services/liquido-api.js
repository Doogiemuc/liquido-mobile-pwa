/**
 * Vue plugin for backend api
 * Currently all methods in this class are only mocks
 */

import store from "@/services/liquido-store"
import { BIconPeopleFill } from "bootstrap-vue";

async function stall(stallTime = 3000) {
	await new Promise(resolve => setTimeout(resolve, stallTime));
}

const LiquidoAPI = {
	install(Vue, options) {
		Vue.prototype.$api = {
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
		}
	},
}

export default LiquidoAPI
