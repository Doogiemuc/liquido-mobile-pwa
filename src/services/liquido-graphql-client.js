/**
 * LIQUIDO GraphQL client
 */

import axios from "axios"
import config from "config"
import PopulatingCache from "populating-cache"
import EventBus from "@/services/event-bus"

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
	ttl: 10*60*1000,		// 10 minutes for team cache
	referencedPathAttr: "$ref",
	idAttr: "id",
}

/**
 * fetch function for polls or one pollByID
 */
const fetchPollFunc = function(path) {
	if (path[0] === "polls") {
		log.debug("fetchPollFunc: Fetch all poll of team from backend")
		let graphQL = `query { polls { id, title, status, proposals { id, title, description, status, createdAt, numSupporters, createdBy { id } } } }`
		return axios.post("/", {query: graphQL}).then(res => res.data.polls)
	} else if (path[0].polls) {
		log.debug("Fetch Poll from backend: "+JSON.stringify(path))
		let pollId = path[0].polls
		let graphQL = `query { poll(pollId:${pollId}) { id, title, status proposals { id, title, description, status, createdAt, numSupporters, createdBy { id } } } }`
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
	ttl: 60*1000,				// 60 seconds for polls Cache
	referencedPathAttr: "$ref",
	idAttr: "id",
}

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
		this.teamCache.put(this.TEAM_KEY, team)
		//TODO: add user.isAdmin    But also SECURE it in the backend!
		this.teamCache.put(this.CURRENT_USER_KEY, user)
		this.teamCache.put("jwt", jwt)
		axios.defaults.headers.common["Authorization"] = "Bearer " + jwt
		EventBus.$emit(EventBus.LOGIN, user)
		log.debug("Login: <"+user.email+"> into team '" + team.teamName  + "'")
	},

	logout() {
		axios.defaults.headers.common["Authorization"] = undefined
		this.isLoggedIn = false
		log.debug("Logout")
		EventBus.$emit(EventBus.LOGOUT)
		this.teamCache.emptyCache()
		this.pollsCache.emptyCache()
	},

	isAuthenticated() {
		return axios.defaults.headers.common["Authorization"] !== undefined && this.teamCache.getSync(this.CURRENT_USER_KEY) !== undefined
	},

	/** 
	 * Synchrounously get the currently logged in user from local cache.
	 * @return {Object} Currently logged in user from local cache or undefined if no one is logged in
	 */
	getCurrentUser() {
		return this.teamCache.getSync(this.CURRENT_USER_KEY)  // get from cache, without calling the backend
	},

	getCurrentTeam() {
		return this.teamCache.getSync(this.TEAM_KEY)
	},

	/** 
	 * Check if currently logged in user is the admin of his team. 
	 * @return false if no one is logged in or currently logged in user is not the admin
	 */
	isAdmin() {
		let currentUser = this.getCurrentUser()
		let team        = this.getCurrentTeam()
		if (!currentUser || !team || !team.admins) return false
		return team.admins.map(admin => admin.id).includes(currentUser.id)
	},

	//TODO: loginWithEmailToken(token) {  }

	/** Quick development login. Only available in dev and test env!!! */
	async devLogin(email, teamName) {
		if (process.env.NODE_ENV !== "development" && process.env.NODE_ENV !== "test")
			throw Error("devLogin is only allowed in NODE_ENV development or test")
		return axios({
			method: "GET", 
			url: config.devLogin.getJWTURL,  // must be an absolute URL! Otherwise axios basePath would be prepended.
			params: {
				email: email,
				teamName: teamName,
				token: config.devLogin.token
			}
		}).then(res => {
			console.log("API: devLogin for <"+email+"> in team '"+teamName+"'", res.data)
			this.login(res.data.team, res.data.user, res.data.jwt)
			return res.data
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
					admins  { id, email, name, website, picture, mobilephone }
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

	async joinTeam(inviteCode, userName, userEmail) {
		let graphQL = `mutation {	
			joinTeam(inviteCode: "${inviteCode}", userName: "${userName}", userEmail: "${userEmail}") {
				team {
					id
					teamName
					inviteCode
					admins  { id, email, name, website, picture, mobilephone }
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
				this.pollsCache.put("polls/"+poll.id, poll)
				log.info("Created new poll:", poll)
				return poll
			})
	},

	async getPollById(pollId, force = false) {
		//log.debug("getPollById(id="+pollId+", force="+force+")")
		return this.pollsCache.get("polls/"+pollId, {
			callBackend: force ? this.pollsCache.FORCE_BACKEND_CALL : this.pollsCache.CALL_BACKEND_WHEN_EXPIRED
		})
	},

	async getPolls(force = false) {
		return this.pollsCache.get("polls", {
			callBackend: force ? this.pollsCache.FORCE_BACKEND_CALL : this.pollsCache.CALL_BACKEND_WHEN_EXPIRED
		})
	},

	async addProposal(pollId, propTitle, propDescription) {
		let graphQL = `mutation { addProposal(pollId: "${pollId}", title: "${propTitle}", description: "${propDescription}") ` +
			`{ id, title, status, proposals { id, title, description, status, createdAt, numSupporters, createdBy { id } } } }`
		return axios.post("", {query: graphQL})
			.then(res => {
				let poll = res.data.addProposal
				this.pollsCache.put("polls/"+poll.id, poll)
				log.info("Added proposal to poll:", poll)
				return poll
			})
	},

	async startVotingPhase(pollId) {
		let graphQL = `mutation { startVotingPhase(pollId: "${pollId}") ` +
			`{ id status } }`
		return axios.post("", {query: graphQL})
			.then(res => {
				log.info(`Started voting phase of poll.id=${pollId}`)
				return res.data.castVote
			})
	},

	async finishVotingPhase(pollId) {
		let graphQL = `mutation { finishVotingPhase(pollId: "${pollId}") ` +
			`{ id status } }`
		return axios.post("", {query: graphQL})
			.then(res => {
				log.info(`Started voting phase of poll.id=${pollId}`)
				return res.data.castVote
			})
	},

	/** Get voterToken (cached) */
	async getVoterToken(tokenSecret, becomePublicProxy = false) {
		return this.teamCache.get(this.VOTER_TOKEN_KEY, {
			fetchFunc: async function() {
				let graphQL = `query { voterToken(tokenSecret: "${tokenSecret}", becomePublicProxy: ${becomePublicProxy}) }`
				const res = await axios.post("", { query: graphQL });
				log.info("OK, received valid voterToken from backend"); // SECURITY: Do not log secret voterToken!
				return res.data.voterToken;
			}
		})
	},

	/** Get voter's ballot if he voted already. MAY return null if not. */
	async getBallot(pollId, voterToken) {
		let graphQL = `query { ballot(pollId: "${pollId}", voterToken: "${voterToken}") ` +
			`{ level checksum voteOrder { id } area { id } } }`
		return axios.post("", {query: graphQL})
			.then(res => {
				log.info("Received users ballot:", res.data.ballot)
				return res.data.ballot
			})
	},

	async castVote(pollId, voteOrderIds, voterToken) {
		let voteOrderStr = "[" + voteOrderIds.join(",") + "]"
		console.log("Cast vote in poll.id="+pollId+" => ", voteOrderStr)
		let graphQL = `mutation { castVote(pollId: "${pollId}", voteOrderIds: ${voteOrderStr}, voterToken: "${voterToken}") ` +
			`{ voteCount ballot { id level checksum } } }`
		return axios.post("", {query: graphQL})
			.then(res => {
				log.info("Ballot with voteOrder sent to backend.")
				return res.data.castVote
			})
	},

	/** Liquido backend error codes.  LiquidoException.java */
	err: {
		CANNOT_CREATE_NEW_TEAM: 1,
		TEAM_WITH_SAME_NAME_EXISTS: 2,
	},

	teamCache: new PopulatingCache(teamsCacheConfig),
	pollsCache: new PopulatingCache(pollsCacheConfig),
	CURRENT_USER_KEY: "currentUser",       // key for current user object in teamCache
	TEAM_KEY: "team",
	VOTER_TOKEN_KEY: "voterToken",
}
