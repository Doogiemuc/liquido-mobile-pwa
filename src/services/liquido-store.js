/**
 * This is a very simple and lightweight Store singleton.
 * Here we store local data that many liquido Vue components need.
 *
 * See https://vuejs.org/v2/guide/state-management.html#Simple-State-Management-from-Scratch
 *
 * LIQUIDO doesn't need - and I also don't like - VUEX, because its plain and simple over-engineered.
 */

import { uniqueId } from "lodash"
//import testPolls from "../../cypress/fixtures/testPolls"

// Client side cache for data that was fetched from the server
let cache = {
	
	// User's own team
	team: {
		name: undefined,
		members: [],
		inviteCode: undefined,
		qrCode: undefined,
	},

	// Currently logged in User
	user: {
		profile: {
			name: undefined,
		},
		email: undefined,
		isAdmin: false,
	},
	
	// Json Web Token when authenticated
	jwt: undefined,

	// User's voterToken for casting LIQUIDO votes
	voterToken: undefined,

	// Polls by their ID in the team. Each poll has proposals
	//TODO: move polls to their own cache (by poll.Id)  This way we can make a generic vue-cache module
	polls: {} // testPolls
}



export default {
	/**
	 * Local application state.
	 * Vue components can directly use these values, for example in computed getter methods
	 * and then reactively update the UI when the state changes.
	 */
	state: {
		// Current filter on the /polls page: undefined|ELABORATION|VOTING|FINISHED
		// This is used in polls-footer.vue and in polls.vue
		pollStatusFilter: undefined,
	},



	/** Put obj into the cache under key */
	put(key, obj) {
		cache[key] = obj
	},

	/** Get object from cache. Use `defaultValue` if there is nothing yet cached under this key. */
	get(key, defaultValue) {
		return cache[key] || defaultValue
	},

	/**
	 * Fetch a value from the cache or 
	 * call a "fetch" function, remember the returned result in the cache and return this result
	 * @param {String} key cache key
	 * @param {Function} fetchFunc Function that will lazily be called if there is no value under key yet.
	 * @returns {Promise} A Promise that will resolve to the value. Either directly from the cache or otherwise what the fetchFunc returns
	 */
	remember(key, fetchFunc) {
		// Nice idea from https://yarkovaleksei.github.io/vue2-storage/en/api.html#set
		let valueFromCache = get(key)
		if (valueFromCache) return Promise.resolve(valueFromCache)
		return fetchFunc().then(res => {
			this.put(key, res)
			return Promise.resolve(res)
		})
	},

	getProposalById(poll, proposalId) {
		return poll.proposals.find((prop) => prop.id == proposalId)
	},

	/** 
	 * Get a poll by its ID (either from the cache or from the backend)
	 * @return A Promise that resolves to the poll or a rejected Promise if there is no poll with that ID
	 */
	getPollById(pollId) {
		return cache.polls[pollId]
	},

	/**
	 * Cache the given poll under its ID
	 * @param {Object} poll poll that MUST have an ID
	 */
	cachePoll(poll) {
		if (!poll.id) {
			console.error("Cannot cache poll. (title='"+poll.title+"') It has no ID")
		} else {
			cache.polls[poll.id] = poll
		}
	},


	//
	// Little utility methods
	// 
	isAuthenticated() {
		return cache.jwt !== undefined
	},

	isAdmin() {
		return cache.user && cache.user.isAdmin
	},

	getProposalById(poll, proposalId) {
		return poll.proposals.find((prop) => prop.id == proposalId)
	},


	//
	// ========== These methods change the content of the store ("mutations" in vuex) ==========
	//

	/*
	savePoll(poll) {
		if (!typeof poll === "object")
			return Promise.reject("Cannot savePoll. Need poll object")
		if (!poll.title) return Promise.reject("Cannot savePoll. Need title")
		//TODO: savePoll() call backend
		if (!poll.id) {
			console.log("Creating new poll: '" + poll.title + "'")
			poll.id = uniqueId()
			poll.status = "ELABORATION"
			this.polls.push(poll)
		} else {
			let existingPoll = this.polls.find((p) => p.id === poll.id)
			if (existingPoll === undefined)
				return Promise.reject(
					"Cannot savePoll. Cannot find poll with id=" + poll.id
				)
			existingPoll = poll
			poll.id = existingPoll.id
			console.log("poll(id=" + poll.id + ") saved.")
		}
		return Promise.resolve(poll)
	},
	*/

	/**
	 * Add or update a proposal in a poll.
	 * @param {Object} poll An existing poll
	 * @param {Object} proposal a new proposal to add (without an ID) or an existing proposal that shall be updated (with ID)
	 */
	saveProposal(poll, proposal) {
		if (!poll || !poll.id) return Promise.reject("Need poll to saveProposal()")
		if (!proposal) return Promise.reject("Need proposal to saveProposal()")
		// more sanity checks in the backend ...
		if (!poll.proposals) poll.proposals = []
		proposal.createdBy = this.getCurrentUser()
		if (proposal.id) {
			// update existing proposal
			let prop = this.getProposalById(poll, proposal.id)
			prop = proposal
			console.log(
				"Updated proposal in poll(id=" + poll.id + "): '" + prop.title + "'"
			)
		} else {
			proposal.id = uniqueId()
			poll.proposals.push(proposal)
			console.log(
				"Added new proposal to poll(id=" +
				poll.id +
				"): '" +
				proposal.title +
				"'"
			)
		}

		return Promise.resolve(poll)
	},
}
