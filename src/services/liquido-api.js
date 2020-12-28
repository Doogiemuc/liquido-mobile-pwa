/**
 * REST client for LIQUIDO backend API.
 * This module only handles the HTTP REST layer.
 * It uses the awesome populating-cache to locally cache values that were fetched from the server.
 */

import axios from "axios"
import config from "config"
import assert from "assert"
import PopulatingCache from "populating-cache"

// Console Logging
const log = require("loglevel").getLogger("liquido-api");

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

if (process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test") {
	log.enableAll()
	
	// mock HTTP REST requests to axios
	log.debug("Liquido API: Mocking REST requests.")

	// Manually log requests to console.
	axios.interceptors.request.use(function (config) {
		log.debug("[MOCK AXIOS] "+config.method.toUpperCase()+" "+config.url, config)
		return config;
	}, function (error) {
		// Do something with request error
		return Promise.reject(error);
	})

	const { v4: uuidv4 } = require("uuid");
	let MockAdapter = require("axios-mock-adapter");
	let mock = new MockAdapter(axios);
	let mockData = require("../../cypress/fixtures/mockData")
	let pollById = {}
	mockData.polls.forEach(poll => pollById[poll.id] = poll) // poll.id are Strings!

	// Super simple micro MOCK BACKEND

	mock.onGet("/polls").reply(200, mockData.polls)

	mock.onGet(/\/polls\/\w+/).reply(config => {
		let pollId = config.url.substring(7) // pollId is an alphanumeric String!
		let poll = pollById[pollId]
		if (!poll.proposals) poll.proposals = []
		return [200, poll]
	})

	mock.onPost("/polls").reply(config => {
		let newPoll = JSON.parse(config.data)
		newPoll.id = uuidv4()
		newPoll.proposals = []
		newPoll.status = "ELABORATION"
		newPoll.createdBy = { $refPath: "users/"+mockData.team.admin.id }
		mockData.polls.push(newPoll)
		pollById[newPoll.id] = newPoll
		return [201, newPoll]
	})

	let createProposalRegEx = /\/polls\/([\w-]+)\/proposals/
	mock.onPost(createProposalRegEx).reply(config => {
		let newProposal = JSON.parse(config.data)
		log.debug("MOCK BACKEND: create Proposal", newProposal)
		let match = config.url.match(createProposalRegEx) 
		let pollId = match[1]
		let poll = pollById[pollId]
		if (!poll) return [400, "cannot find poll with id="+pollId]
		newProposal.id = uuidv4()
		newProposal.createdBy = { $refPath: "users/"+mockData.team.admin.id }
		poll.proposals.push(newProposal)
		return [200, poll]
	})

}

/* Configuration for populating-cache */
const cacheConfig = {
	fetchFunc: function(path) {
		log.debug("Call to global fetchFunc: ", path)
	},
	ttl: 10*60*1000,
	referencedPathAttr: "$ref",
	idAttr: "id",
}


export default {
	/* Local cache for most basic data, e.g. JWT of logged in user, his team etc. */
	loginData: {},

	/** Cache for polls. Each poll is cached by its id */
	pollsCache: new PopulatingCache(cacheConfig),

	/** Smoke test if the backend is available at all. */
	backendIsAvailable() {
		return axios.get("/")
	},

	/**
	 * Login the current user. Must pass the loginData that has been returned by the backend.
	 * Caches that data in the liquido-store.js
	 * @param {Object} loginData: user, team, jwt, voterToken and polls
	 */
	login(loginDataRes) {
		assert(loginDataRes, "Need loginData")
		assert(loginDataRes.team, "Need team to login")
		assert(loginDataRes.user, "Need user to login")
		assert(loginDataRes.jwt, "Need jwt to login")
		assert(loginDataRes.voterToken, "Need voterToken to login")
		loginDataRes.polls = loginDataRes.polls || []
		this.loginData = loginDataRes

		// Set JWT header for all future REST requests
		axios.defaults.headers.common["Authorization"] = "Bearer " + this.loginData.jwt;

		// Cache all current polls of the team in pollsCache by their poll.id
		this.pollsCache.put("polls", this.loginData.polls)
		// Cache all known users in this team, so that we can use them for population
		this.pollsCache.put("users", this.loginData.team.members)

		console.log("Login <"+this.loginData.user.email+"> in "+this.loginData.team.name)
	},

	isAuthenticated() {
		return this.loginData.jwt !== undefined
	},

	isAdmin() {
		return this.loginData.user && this.loginData.user.isAdmin
	},

	getCurrentUser() {
		return this.loginData.user
	},

	/* login for development. Only available in NODE_ENV=development or test */
	async devLogin(userEmail, teamName) {
		if (process.env.NODE_ENV !== "development" && process.env.NODE_ENV !== "test")
			throw Error("devLogin is only allowed in NODE_ENV development or test")

		let devLoginData = require("../../cypress/fixtures/mockData")

		console.log("devLogin", userEmail, teamName, devLoginData)

		this.login(devLoginData)
		return devLoginData
		/*
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
		*/
	},

	/** Logout the current user. Remove JWT */
	logout() {
		axios.defaults.headers.common["Authorization"] = undefined
		this.pollsCache.emptyCache()
		console.log("API: logout")
	},

	/**
	 * Create a new team.
	 * This method will also save the current user, jwt and voterToken to the local cache.
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
			this.pollsCache.put("polls/"+createdPoll.id, createdPoll)
			log.info("Poll created:", createdPoll)
			return createdPoll
		})
	},

	/**
	 * Get one poll by ID from backend.
	 * @param {Number} pollId poll.id
	 * @returns A Promise that will resolve to the poll if it exists.
	 */
	async getPollById(pollId) {
		let fetchFunc = () => axios.get("/polls/"+pollId).then (res => res.data)
		return this.pollsCache.remember("polls/"+pollId, fetchFunc)
	},

	/**
	 * Get all polls of this team. (Either from cache or from the backend)
	 * @param {Boolean} forceRefresh set to true to force a call to the backend
	 * @returns A Promise that will resolve to the list of polls in this team
	 */
	async getPolls(forceRefresh = false) {
		let fetchFunc = () => axios.get("/polls").then (res => res.data)
		return this.pollsCache.get("polls", {
			"fetchFunc": fetchFunc,
			"callBackend": forceRefresh ? this.pollsCache.FORCE_BACKEND_CALL : this.pollsCache.CALL_BACKEND_WHEN_EXPIRED
		}).then(polls => {
			return this.pollsCache.populate(polls, "createdBy")
		})
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
		if (!poll) throw new Error("Cannot populate undefined. poll")
		if (!poll.proposals) return  // nothing todo, when poll has no proposals yet
		return this.pollsCache.populate(poll, "createdBy")
	},


	/*
	async startVotingPhase(pollId) {
		return Promise.reject("Not yet implemented")
	},

	async castVote(pollId, ballot) {
		return Promise.reject("Not yet implemented")
	},

	async endVotingPhase(pollId) {
		return Promise.reject("not yet implemented")
	},
	*/

}
