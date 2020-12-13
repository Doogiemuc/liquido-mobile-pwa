/**
 * LIQUIDO STORE & CACHE
 * 
 * This is a very simple and lightweight cache for data that was fetched from the server.
 * The cache is just simply a local object. It contains data about the user, team and a list of polls of that team.
 *	
 * 
 * See https://vuejs.org/v2/guide/state-management.html#Simple-State-Management-from-Scratch
 */

import { uniqueId } from "lodash"
import assert from 'assert'
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
		//id: undefined,
		name: undefined,
		email: undefined,
		pictureUrl: undefined,
		isAdmin: false,
	},
	
	// Json Web Token when authenticated
	jwt: undefined,

	// User's voterToken for casting LIQUIDO votes
	voterToken: undefined,

	// Polls by their ID in the team. Each poll has proposals
	//TODO: move polls to their own cache (by poll.Id)  This way we can make a generic vue-cache module
  //DONE: Moved to pollsCache in liquido-api	polls: [] // testPolls
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



	/** Put obj into the cache under key. Use defaultValue if obj is undefined */
	put(key, obj, defaultValue) {
		assert(key, "key must be defined to put something into the cache")
		cache[key] = obj !== undefined ? obj : defaultValue 
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

	// Little utility methods
	// 
	isAuthenticated() {
		return cache.jwt !== undefined
	},

	getCurrentUser() {
		return cache.user
	},

	isAdmin() {
		return cache.user && cache.user.isAdmin
	},

	getProposalById(poll, proposalId) {
		return poll.proposals.find((prop) => prop.id == proposalId)
	},


}
