/**
 * Vue plugin for backend api
 * Currently all methods in this class are only mocks
 */

import store from "@/services/liquido-store"

const LiquidoAPI = {
  install(Vue, options) {
    Vue.prototype.$api = {

			startVotingPhase(pollId) {
				//TODO: call backend
				console.log("starting voting phase of poll(id="+pollId+")")
				var poll = store.getPollById(pollId)
				if (!poll) return Promise.reject("Cannot start voting phase. Cannot find poll(id="+pollId)
				poll.status = "VOTING"
				return Promise.resolve(poll)
			},

			castVote(pollId, ballot) {
				console.log("Cast vote in poll(id="+pollId+")")
				//TODO: call backend
				var poll = store.getPollById(pollId)
				if (!poll) return Promise.reject("Cannot cast vote. Cannot find poll(id="+pollId)
				if (poll.status !== "VOTING") return Promise.reject("Cannot cast vote in poll(id="+pollId+"): Poll is not in status VOTING")
				if (!poll.ballots) poll.ballots = []
				poll.ballots.push(ballot)					//TODO: SECURITY: The poll in the client should not contain all ballots. Only store ballots in the backend
				return Promise.resolve(poll)
			}
	
    }
  }
}

export default LiquidoAPI;


