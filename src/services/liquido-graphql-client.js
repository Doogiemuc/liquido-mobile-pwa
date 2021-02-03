/**
 * LIQUIDO GraphQL client
 */

import axios from "axios"
import config from "config"
import PopulatingCache from "populating-cache"

const log = require("loglevel").getLogger("liquido-api");
if (process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test") {
	log.enableAll()
	log.info("liquido-graphql-client => " + config.LIQUIDO_GRAPHQL_URL)
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
const CURRENT_USER_KEY = "currentUser"   // key for current user object in teamCache

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

/**
 * Cache for polls
 */
const pollsCacheConfig = {
	fetchFunc: fetchPollFunc,
	ttl: 10*60*1000,
	referencedPathAttr: "$ref",
	idAttr: "id",
}
const pollsCache = new PopulatingCache(pollsCacheConfig)

/**
 * Nice logging of HTTP error messages
 */
axios.interceptors.response.use(function (response) {
	// Any status code that lie within the range of 2xx cause this function to trigger
	return response;
}, function (error) {
	// Any status codes that falls outside the range of 2xx cause this function to trigger
	if (error.response.status >= 500) log.error("liquido-graphql-api ERROR:", error)
	if (error.response && error.response.data) log.debug("liquido-graphql-api: "+error.response.data.message, error.response.data)
	return Promise.reject(error);
});


/**
 * export API methods
 */
export default {
	async pingApi() {
		return axios.post("", {query: "query { ping }"})
	},

	/**
	 * Login user into team. Store JWT for future requests.
	 * Will also put currentUser, team and jwt into the `teamCache`
	 * @param {Object} team Team with members[]
	 * @param {Object} user currently logged in user
	 * @param {String} jwt JsonWebToken
	 */
	login(team, user, jwt) {
		teamCache.put("team", team)
		teamCache.put(CURRENT_USER_KEY, user)
		teamCache.put("jwt", jwt)
		axios.defaults.headers.common["Authorization"] = "Bearer " + jwt
		log.debug("Login: <"+user.email+"> into team '" + team.name  + "'")
	},

	logout() {
		axios.defaults.headers.common["Authorization"] = undefined
		log.debug("Logout: "+teamCache.getSync(CURRENT_USER_KEY))
		teamCache.emptyCache()
	},

	isAuthenticated() {
		return axios.defaults.headers.common["Authorization"] !== undefined && teamCache.getSync(CURRENT_USER_KEY) !== undefined
	},

	/** Get the currently logged in user. Will throw Error, if no one is logged in! */
	getCurrentUser() {
		let currentUser = teamCache.getSync(CURRENT_USER_KEY)  // get from cache, without calling the backend
		if (!currentUser) throw new Error("No current user. Not logged in!")
		return currentUser
	},

	/** 
	 * Check if currently logged in user is the admin of his team. 
	 * @return false if no one is logged in or currently logged in user is not the admin
	 */
	isAdmin() {
		let currentUser = teamCache.getSync(CURRENT_USER_KEY)
		return currentUser && currentUser.isAdmin
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
					members { id, email, name, website, picture, mobilephone }
				}
				user { id, email, name, website, picture, mobilephone }
				jwt
			}
		}`
		return axios.post("", {query: graphQL})
			.then(res => {
				let team = res.data.createNewTeam.team
				this.login(
					team,
					res.data.createNewTeam.user,  // admin
					res.data.createNewTeam.jwt
				)
				log.info("Created new team:", team)
				return team
			})
			// There is deliberately no error handling here, because we can't handle the error in this method :-)
			// Only catch errors if you can do something about it. Otherwise simply let the rejection bubble up the call chain.
			// Further up some UI method will do something about the error, e.g. show an meaningful error message to the user.
	},

	async joinTeam(inviteCode, userName, userEmail, userMobilephone) {
		let graphQL = `mutation {	
			joinTeam(inviteCode: "${inviteCode}", userName: "${userName}", userEmail: "${userEmail}", userMobilephone: "${userMobilephone}") {
				team {
					id
					teamName
					inviteCode
					members { id, email, name, website, picture, mobilephone }
				}
				user { id, email, name, website, picture, mobilephone }
				jwt
			}
		}`
		return axios.post("", {query: graphQL})
			.then(res => {
				let team = res.data.joinTeam.team
				this.login(
					team,
					res.data.joinTeam.user,
					res.data.joinTeam.jwt
				)
				log.info("Joined team:", team)
				return team
			})
	},

	async createPoll(pollTitle) {
		let graphQL = `mutation {	createPoll(title: "${pollTitle}") {	id, title, status, proposals { id } }	}`
		return axios.post("", {query: graphQL})
			.then(res => {
				let poll = res.data.createPoll
				pollsCache.put("polls/"+poll.id, poll)
				log.info("Created new poll:", poll)
				return poll
			})
	},

	async getPollById(pollId, force = false) {
		console.log("getPollById(id="+pollId+", force="+force+")")
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
	},

	/** Liquido backend error codes */
	err: {
		CANNOT_CREATE_NEW_TEAM: 1,
		TEAM_WITH_SAME_NAME_EXISTS: 2,
	}

}
