/**
 * This is a very simple and lightweight Store singleton.
 * Here we store local data that many liquido Vue components need.
 *
 * See https://vuejs.org/v2/guide/state-management.html#Simple-State-Management-from-Scratch
 *
 * LIQUIDO doesn't need - and I also don't like - VUEX, because its plain and simple over-engineered.
 */

import { uniqueId } from "lodash"

// Client side cache for data that was fetched from the server
let cache = {
	JWT: undefined,

	/** Currently logged in User */
	user: {
		profile: {
			name: undefined,
		},
		email: undefined,
		isAdmin: false,
	},

	/** User's own team */
	team: {
		name: undefined,
		members: [],
		inviteCode: undefined,
		qrCode: undefined,
	},

	polls: []
}



export default {
	/**
	 * Local application state.
	 * Vue components can directly use these values, for example in computed getter methods
	 * and then reactively update the UI when the state changes.
	 */
	state: {
		// Current filter on the /polls page: undefined|ELABORATION|VOTING|FINISHED
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


	// Helper methods

	/** Find a poll by its ID. May return undefined if ID is not found! */
	getPollById(pollId) {
		return cache.polls.find(p => p.id == pollId) 		// pollId might be a String or a Number!
	},

	getProposalById(poll, proposalId) {
		return poll.proposals.find((prop) => prop.id == proposalId)
	},

	getPollStatusFilter(newVal) {
		return state.pollStatusFilter
	},
	setPollStatusFilter(newVal) {
		state.pollStatusFilter = newVal
	},

	getPollById(pollId) {
		return this.polls.find((poll) => poll.id == pollId)
	},

	//
	// ========== These methods change the content of the store ("mutations" in vuex) ==========
	//

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
