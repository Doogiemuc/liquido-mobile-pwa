/**
 * REST client for LIQUIDO backend API.
 * This module only handles the HTTP REST layer. For local storage of data see liquido-store.js
 */

import axios from 'axios'
import store from "./liquido-store"
import config from 'config'
import assert from 'assert'
import NodeCache from 'node-cache'


//TODO:  WORK IN PROGRESS  finish using NodeCache instead of liquido-store.vue



/** Cache for polls. Each poll is cached by its id */
const pollsCache = new NodeCache({
	stdTTL: 60,					// seconds
	useClones: false,		// use references
})
/** Cache for team, currentUser, jwt, voterToken, all users in the team */
const liquidoCache = new NodeCache({
	stdTTL: 600,				// seconds
	useClones: false,		// use references
})




const log = require('loglevel').getLogger('liquido-api');
//log.debug("Liquido-api pointing to", config.LIQUIDO_API_URL)
//log.enableAll()

// Configure axios HTTP REST client
axios.defaults.baseURL = config.LIQUIDO_API_URL
//axios.defaults.headers.common['Authorization'] = "Bearer " + JWT;   // Will be set in login()

/*
// alternative way to configre a specific AXIOS HTTP client instanace
const HTTP = () => {
	return axios.create({
		baseURL: config.LIQUIDO_API_URL,
		headers: {
			//Authorization: `Bearer ${bearerToken}`,
		},
	})
}
*/

export default {

	backendIsAvailable() {
		return axios.get("/")
	},

	/**
	 * Login the current user. Must pass the loginData that has been returned by the backend.
	 * Caches that data in the liquido-store.js
	 * @param {Object} loginData: user, team, jwt, voterToken and polls
	 */
	login(loginData) {
		assert(loginData.team, "Need team to login")
		assert(loginData.user, "Need user to login")
		assert(loginData.jwt, "Need jwt to login")
		assert(loginData.voterToken, "Need voterToken to login")
		
		store.put("team", loginData.team)
		store.put("user", loginData.user)
		store.put("voterToken", loginData.voterToken)
		store.put("jwt",  loginData.jwt)
		axios.defaults.headers.common['Authorization'] = "Bearer " + loginData.jwt;

		// Cache all current polls of the team in pollsCache by their poll.id
		if (loginData.polls) {
			loginData.polls.forEach(poll => {
				pollsCache.set(poll.id, poll)
			})
		}
		console.log("Login <"+loginData.user.email+"> in "+loginData.team.name)
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
			console.log("API: devLogin for <"+userEmail+"> in team '"+teamName+"'", res.data)
			this.login(res.data)
			return res.data
		}).catch(err => { 
			console.error(err.response ? err.response : err)
			return Promise.reject(err.response ? err.response : err)
		})
	},

	/** Logout the current user. Remove JWT */
	logout() {
		axios.defaults.headers.common['Authorization'] = undefined
		pollsCache.flushAll()
		liquidoCache.flushAll()
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
				this.login(res.data)
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
			this.login(res.data)
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
		return axios.post("/polls", poll).then(res => {
			let createdPoll = res.data
			log.info("Poll created:", createdPoll)
			pollsCache.set(createdPoll.id, createdPoll)
			return createdPoll
		})
	},

	/**
	 * Get one poll by ID
	 * @param {Number} pollId poll.id
	 * @param {Boolean} forceRefresh by default cache from liquido-store will be used. Set this to true to force an API call to the backend
	 * @returns A Promise that will resolve to the poll if it exists.
	 */
	async getPollById(pollId, forceRefresh = false) {
		let pollFromCache = pollsCache.get(pollId)
		if (!pollFromCache || forceRefresh) {  
			return axios.get("/polls/"+pollId).then(res => { 
				let poll = res.data
				this.populateProposalData(poll)
				pollsCache.set(poll.id, poll)
				return poll
			})
		}
		return Promise.resolve(pollFromCache)
	},

	/**
	 * Get all polls from the cache
	 */
	getPollsFromCacheAsArray() {
		let keys = pollsCache.keys()
		return keys.map(key => pollsCache.get(key)).filter(elem => elem !== undefined)
		//let pollsFromCache = pollsCache.mget(pollsCache.keys())  // returns polls mapped by their id
		//return Array.from(pollsFromCache.values())
	},

	/**
	 * Get all polls of this team. (Either from cache or from the backend)
	 * @param {Boolean} forceRefresh set to true to force a call to the backend
	 * @returns A Promise that will resolve to the list of polls in this team
	 */
	async getPolls(forceRefresh = false) {
		let pollsFromCache = this.getPollsFromCacheAsArray()
		if (!pollsFromCache || forceRefresh) {
			return axios.get("/polls").then(res => { 
				res.data.forEach(poll => {
					pollsCache.set(poll.id, poll)
				})
				return res.data
			})
		}
		return Promise.resolve(pollsFromCache)
	},

	/**
	 * Add proposal to poll or update existing one
	 * @param {Number} pollId poll that must be in status ELABORATION
	 * @param {Object} proposal new proposal
	 */
	async saveProposal(pollId, proposal) {
		return axios.post("/polls/"+pollId+"/proposals", proposal).then(res => {
			let proposal = res.data
			log.info("Added proposal to poll(id="+pollId+"): ", proposal)
			return proposal
		})
	},


	/**
	 * When the server returns a poll, it contains ObjectIds for Users
	 * Here we resolve these IDs to the actual User objects.
	 * We try to use the local cache as much as possible.
	 * @param {Object} poll a poll as fetched from the server
	 */
	populateProposalData(poll) {
		if (!poll) throw new Error("Cannot populate undefined.")
		if (!poll.proposals) return  // nothing todo, when poll has no proposals yet

		let usersById = {}
		store.get("team").members.forEach(member => usersById[member.id] = member)

		poll.proposals.forEach(prop => {
			prop.createdBy = usersById[prop.createdById]
		})
	},


	async startVotingPhase(pollId) {
		return Promise.reject("Not yet implemented")
	},

	async castVote(pollId, ballot) {
		return Promise.reject("Not yet implemented")
	},

	async endVotingPhase(pollId) {
		return Promise.reject("not yet implemented")
	},

}
