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
				if (!poll) return Promise.reject("Cannot find poll id="+pollId)
				poll.status = "VOTING"
				return Promise.resolve(poll)
			}
	
    }
  }
}

export default LiquidoAPI;


