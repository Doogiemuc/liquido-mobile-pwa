/**
 * LIQUIDO GraphQL client
 */

import axios from "axios"
import config from "config"
import PopulatingCache from "populating-cache"

const log = require("loglevel").getLogger("liquido-api");
if (process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test") {
	log.enableAll()
}

// Configure axios HTTP REST client to point to our graphQL backend
axios.defaults.baseURL = config.LIQUIDO_GRAPHQL_URL

/** 
 * Client side local cache for all data about team, current user and jwt 
 */
const shouldNotBeCalled = function(path) {
	log.error("This fetch function should not have been called", path)
	throw new Error("This fetch function should not be called! path="+JSON.stringify(path))
}
const teamsCacheConfig = {
	fetchFunc: shouldNotBeCalled,
	ttl: 10*60*1000,
	referencedPathAttr: "$ref",
	idAttr: "id",
}
const teamCache  = new PopulatingCache(teamsCacheConfig)

/**
 * fetch function for polls or one pollByID
 */
const fetchPollFunc = function(path) {
	log.debug("Fetch Poll: "+JSON.stringify(path))
	if (path[0] === "polls") {
		let graphQL = `query { polls { id, title, proposals { id, title, description, status, createdAt, numSupporters, createdBy { id } } } }`
		return axios.post("/", {query: graphQL}).then(res => res.data.polls)
	} else if (path[0].polls) {
		let pollId = path[0].polls
		let graphQL = `query { poll(pollId:${pollId}) { id, title, proposals { id, title, description,  } } }`
		return axios.post("/", {query: graphQL}).then(res => res.data.poll)
	} else {
		return Promise.reject(new Error("Cannot fetch poll(s) at path: "+JSON.stringify(path)))
	}
}

const pollsCacheConfig = {
	fetchFunc: fetchPollFunc,
	ttl: 10*60*1000,
	referencedPathAttr: "$ref",
	idAttr: "id",
}

const pollsCache = new PopulatingCache(pollsCacheConfig)

export default {
	async pingApi() {
		return axios.get("/")
	},

	/**
	 * Create a new team. 
	 * @param {Object} newTeam teamName, adminName, adminEmail and adminMobilephone
	 */
	async createNewTeam(newTeam) {
		let graphQL = `mutation {
			createNewTeam(teamName: "${newTeam.teamName}", adminName: "${newTeam.adminName}", adminEmail: "${newTeam.adminEmail}") {
				team {
					id
					teamName
					inviteCode
					members {
						id
						email
						profile { name }
					}
				}
				jwt
			}
		}`
		return axios.post("", {query: graphQL})
			.then(res => {
				let team = res.data.createNewTeam.team
				teamCache.put("team", team)
				teamCache.put("currentUser", team.members[0])
				teamCache.put("jwt", res.data.createNewTeam.jwt)
				this.loginJWT(res.data.createNewTeam.jwt)
				log.info("Created new team:", team)
				return team
			})
			// There is deliberately no error handling here, because we can't handle the error in this method :-)
			// Only catch errors if you can do something about it. Otherwise simply let the rejection bubble up the call chain.
			// Further up some UI method will do something about the error, e.g. show an meaningful error message to the user.
	},

	loginJWT(jwt) {
		axios.defaults.headers.common["Authorization"] = "Bearer " + jwt
		log.debug("Login with JWT")
	},

	logout() {
		axios.defaults.headers.common["Authorization"] = undefined
		log.debug("Logout")
	},

	isAuthenticated() {
		return axios.defaults.headers.common["Authorization"] !== undefined
	},

	getCurrentUser() {
		let currentUser = teamCache.getSync("currentUser")  // get from cache, without calling the backend
		if (!currentUser) throw new Error("No current user. Not logged in!")
		return currentUser
	},

	isAdmin() {
		return this.getCurrentUser().isAdmin
	},

	async devLogin(userEmail, teamName) {
		if (process.env.NODE_ENV !== "development" && process.env.NODE_ENV !== "test")
			throw Error("devLogin is only allowed in NODE_ENV development or test")
		return axios({
			method: "GET", 
			url: config.DEV_GET_JWT_URL,
			params: {
				userEmail: userEmail,
				teamName: teamName
			}
		}).then(res => {
			console.log("API: devLogin for <"+userEmail+"> in team '"+teamName+"'", res.data)
			throw new Error("Not yet implemented")
			//this.login(res.data)
			//return res.data
		}).catch(err => { 
			console.error(err.response ? err.response : err)
			return Promise.reject(err.response ? err.response : err)
		})
	},

	async createPoll(pollTitle) {
		let graphQL = `mutation {	createPoll(title: "${pollTitle}") {	id, title }	}`
		return axios.post("", {query: graphQL})
			.then(res => {
				let poll = res.data.createPoll
				pollsCache.put("polls/"+poll.id, poll)
				log.info("Created new poll:", poll)
				return poll
			})
	},

	async getPollById(pollId, force = false) {
		return pollsCache.get("polls/"+pollId, {
			callBackend: force ? pollsCache.FORCE_BACKEND_CALL : pollsCache.CALL_BACKEND_WHEN_EXPIRED
		})
	},

	async addProposalToPoll(pollId, propTitle, propDescription) {
		let graphQL = `mutation { addProposal(pollId: "${pollId}", title: "${propTitle}", description: "${propDescription}") { id, title, proposals { id, title, description } } }`
		return axios.post("", {query: graphQL})
			.then(res => {
				let poll = res.data.addProposal
				pollsCache.put("polls/"+poll.id, poll)
				log.info("Added proposal to poll:", poll)
				return poll
			})
	}

}
