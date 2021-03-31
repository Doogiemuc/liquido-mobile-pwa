/**
 * LIQUIDO GraphQL client
 * 
 * Every call to the backend goes through this class.
 * Here we also handle data caching.
 * And login and logout because the currently logged in use with his team is also cached.
 * 
 * This is a service class. It does not have a frontend. It does no navigation.
 */
import axios from "axios"
import config from "config"
import PopulatingCache from "populating-cache"
import EventBus from "@/services/event-bus"
import log from "@/components/mobile-debug-log.js"

if (!config || !config.LIQUIDO_API_URL) {
	log.error("liquido-graphql-client: ERROR I have no config!")
} else {
	log.debug("liquido-graphql-client => " + config.LIQUIDO_API_URL)
}

// Configure axios HTTP REST client to point to our graphQL backend
axios.defaults.baseURL = config.LIQUIDO_API_URL
const GRAPHQL = "/graphql"

/** Shorthands for JQL return values */
const JQL_PROPOSAL =  "{ id, title, description, status, createdAt, numSupporters, createdBy { id name email } area { id } }"
const JQL_TEAM = `team {
		id
		teamName
		inviteCode
		admins  { id, email, name, website, picture, mobilephone }
		members { id, email, name, website, picture, mobilephone }
	}`
const JQL = {
	TEAM: JQL_TEAM,
	PROPOSAL: JQL_PROPOSAL,  // Javascript cannot reference own object property. So JQL_PROPOSAL must be its own const abaove. :-(
	CREATE_OR_JOIN_TEAM_RESULT: `{ ${JQL_TEAM} user { id, email, name, website, picture, mobilephone } jwt }`,
	//POLL_IN_ELABORATION:  `{ id, title, status, area { id } votingStartAt votingEndAt proposals ${JQL_PROPOSAL} }`,
	POLL: `{ id, title, status, area { id } votingStartAt votingEndAt proposals ${JQL_PROPOSAL} numBallots winner ${JQL_PROPOSAL} duelMatrix { data } }`,
}

/** 
 * Client side local cache for all data about team, current user and jwt 
 */
const shouldNotBeCalled = function(path) {
	console.error("This fetch function should not have been called", path)
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
		console.debug("fetchPollFunc: Fetch all poll of team from backend")
		let graphQL = `query { polls ${JQL.POLL} }`
		return axios.post(GRAPHQL, {query: graphQL}).then(res => res.data.polls)
	} else if (path[0].polls) {
		console.debug("Fetch Poll from backend: "+JSON.stringify(path))
		let pollId = path[0].polls
		let graphQL = `query { poll(pollId:${pollId}) ${JQL.POLL} }`
		return axios.post(GRAPHQL, {query: graphQL}).then(res => res.data.poll)
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
 * Sophisticated logging of HTTP error messages is crucial!
 */
axios.interceptors.response.use(function (response) {
	// Any status code that lie within the range of 2xx cause this function to trigger
	return response;
}, function (error) {
	// Any status codes that falls outside the range of 2xx cause this function to trigger
	if (error.response.status >= 500) console.error("liquido-graphql-api ERROR:", error)
	if (error.response && error.response.data) {
		let msg = "liquido-graphql-api: " + error.response.data.message
		if (error.response.data.liquidoErrorPayload)
			msg += "\n" + JSON.stringify(error.response.data.liquidoErrorPayload)
		console.debug(msg, error.response.data)
	}

	return Promise.reject(error);
});

/**
 * ===================== exported API methods =======================
 */
let graphQlApi = {
	async pingApi() {
		return axios.post(GRAPHQL, {query: "query { ping }"})
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
		// Set user.isAdmin = true if user is admin. This must of course also be secured in the backend!
		if (team.admins.find(u => u.id === user.id)) user.isAdmin = true
		this.teamCache.put(this.CURRENT_USER_KEY, user)
		this.teamCache.put(this.JWT_KEY, jwt)
		localStorage.setItem(this.LIQUIDO_JWT_KEY, jwt)
		axios.defaults.headers.common["Authorization"] = "Bearer " + jwt
		EventBus.$emit(EventBus.LOGIN, {team, user, jwt})
		console.debug("Login <"+user.email+"> into team '" + team.teamName  + "'")
	},

	logout() {
		axios.defaults.headers.common["Authorization"] = undefined
		let userEmail = this.getCachedUser() ? this.getCachedUser().email : ""
		console.debug("Logout <"+userEmail+">")
		localStorage.removeItem(this.LIQUIDO_JWT_KEY)
		axios.defaults.headers.common["Authorization"] = undefined
		this.teamCache.emptyCache()
		this.pollsCache.emptyCache()
		EventBus.$emit(EventBus.LOGOUT, userEmail)
	},

	/* ===== Synchronous utility methods that do not call the backend ========= */

	/** Check if there currently is an authenticated user. This is called quite often and needs to be sync and fast. */
	isAuthenticated() {
		return axios.defaults.headers.common["Authorization"] !== undefined && this.teamCache.getSync(this.CURRENT_USER_KEY) !== undefined
	},

	/** 
	 * Synchrounously get the currently logged in user from local cache.
	 * @return {Object} Currently logged in user from local cache or undefined if no one is logged in
	 */
	getCachedUser() {
		return this.teamCache.getSync(this.CURRENT_USER_KEY)  // get from cache, without calling the backend
	},

	/**
	 * Synchronously get the current user's team from the local cache.
	 * @returns currently logged in user (if any)
	 */
	getCachedTeam() {
		return this.teamCache.getSync(this.TEAM_KEY)
	},

	/** 
	 * Check if currently logged in user is the admin of his team. 
	 * @return false if no one is logged in or currently logged in user is not the admin
	 */
	isAdmin() {
		let cachedUser = this.getCachedUser()
		let team        = this.getCachedTeam()
		if (!cachedUser || !team || !team.admins) return false
		return team.admins.map(admin => admin.id).includes(cachedUser.id)
	},
	


	/* ===== API calls against backend (or cache) ===== */


	/**
	 * Load data about the user's team. This call must be authenticated with a JWT.
	 * @returns Info about user's team
	 * @throws When JWT is missing, invalid, expired, ...
	 */
	loginWithJwt(jwt) {
		if (!jwt) throw new Error("Need JWT to login!")
		let graphQL = `query { loginWithJwt ${JQL.CREATE_OR_JOIN_TEAM_RESULT} }`
		axios.defaults.headers.common["Authorization"] = "Bearer " + jwt
		return axios.post(GRAPHQL, {query: graphQL})
			.then(res => {
				this.login(res.data.loginWithJwt.team, res.data.loginWithJwt.user, res.data.loginWithJwt.jwt)
				return res.data.loginWithJwt
			})
	},


	//TODO: loginWithEmailToken(token) {  }

	/** Quick development login. Only available in dev and test env!!! */
	async devLogin(email, teamName) {
		if (process.env.NODE_ENV !== "development" && process.env.NODE_ENV !== "test")
			throw Error("devLogin is only allowed in NODE_ENV development or test")
		return axios({
			method: "GET", 
			url: "/dev/getJWT",
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
		let graphQL = `mutation { createNewTeam(teamName: "${newTeam.teamName}", adminName: "${newTeam.adminName}", adminEmail: "${newTeam.adminEmail}") ` +
			JQL.CREATE_OR_JOIN_TEAM_RESULT + "}"
		return axios.post(GRAPHQL, {query: graphQL})
			.then(res => {
				let team = res.data.createNewTeam.team
				this.login(
					team,
					res.data.createNewTeam.user,  // admin
					res.data.createNewTeam.jwt
				)
				console.debug("Created new team:", team)
				return team
			})
			// There is deliberately no error handling here, because we can't handle the error in this method :-)
			// Only catch errors if you can do something about it. Otherwise simply let the rejection bubble up the call chain.
			// Further up some UI method will do something about the error, e.g. show an meaningful error message to the user.
	},

	async joinTeam(inviteCode, userName, userEmail) {
		let graphQL = `mutation {	joinTeam(inviteCode: "${inviteCode}", userName: "${userName}", userEmail: "${userEmail}") ` +
			JQL.CREATE_OR_JOIN_TEAM_RESULT + "}"
		return axios.post(GRAPHQL, {query: graphQL})
			.then(res => {
				let team = res.data.joinTeam.team
				this.login(
					team,
					res.data.joinTeam.user,
					res.data.joinTeam.jwt
				)
				console.debug("Joined team:", team)
				return team
			})
	},

	async createPoll(pollTitle) {
		let graphQL = `mutation {	createPoll(title: "${pollTitle}") ${JQL.POLL}	}`
		return axios.post(GRAPHQL, {query: graphQL})
			.then(res => {
				let poll = res.data.createPoll
				this.pollsCache.put("polls/"+poll.id, poll)
				console.debug("Created new poll:", poll)
				return poll
			})
	},

	async getPollById(pollId, force = false) {
		//console.debug("getPollById(id="+pollId+", force="+force+")")
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
		let graphQL = `mutation { addProposal(pollId: "${pollId}", title: "${propTitle}", description: "${propDescription}") ${JQL.POLL} }`
		return axios.post(GRAPHQL, {query: graphQL})
			.then(res => {
				let poll = res.data.addProposal
				this.pollsCache.put("polls/"+poll.id, poll)
				console.debug("Added proposal to poll:", poll)
				return poll
			})
	},

	async startVotingPhase(pollId) {
		let graphQL = `mutation { startVotingPhase(pollId: "${pollId}") ${JQL.POLL} }`
		return axios.post(GRAPHQL, {query: graphQL})
			.then(res => {
				let poll = res.data.startVotingPhase
				console.debug("Started voting phase of poll", poll)
				return poll
			})
	},

	/**
	 * Finish the currently runnign voting phase of a poll in VOTING.
	 * @param {Number} pollId poll.id in VOTING
	 * @returns {Object} the winning proposal
	 */
	async finishVotingPhase(pollId) {
		let graphQL = `mutation { finishVotingPhase(pollId: "${pollId}") ${JQL.PROPOSAL} }`
		return axios.post(GRAPHQL, {query: graphQL})
			.then(res => {
				console.debug(`Finsihed voting phase of poll.id=${pollId}`)
				return res.data.finishVotingPhase
			})
	},

	/** Get voterToken (cached) */
	async getVoterToken(tokenSecret, becomePublicProxy = false) {
		return this.teamCache.get(this.VOTER_TOKEN_KEY, {
			fetchFunc: async function() {
				let graphQL = `query { voterToken(tokenSecret: "${tokenSecret}", becomePublicProxy: ${becomePublicProxy}) }`
				const res = await axios.post(GRAPHQL, { query: graphQL });
				console.debug("GetVoterToken: OK, received valid voterToken from backend."); // SECURITY: Do not log secret voterToken!
				return res.data.voterToken;
			}
		})
	},

	async castVote(pollId, voteOrderIds, voterToken) {
		let voteOrderStr = "[" + voteOrderIds.join(",") + "]"
		console.debug("Cast vote in poll(id="+pollId+") => ", voteOrderStr)
		let graphQL = `mutation { castVote(pollId: "${pollId}", voteOrderIds: ${voteOrderStr}, voterToken: "${voterToken}") ` +
			`{ voteCount ballot { level checksum voteOrder { id } } } }`
		return axios.post(GRAPHQL, {query: graphQL})
			.then(res => {
				console.debug("CastVote: Ballot was casted successfully.")
				return res.data.castVote
			})
	},

	/** Get voter's ballot if he voted already. MAY return null if not. */
	async getBallot(pollId, voterToken) {
		let graphQL = `query { ballot(pollId: "${pollId}", voterToken: "${voterToken}") ` +
			`{ level checksum voteOrder { id } area { id } } }`
		return axios.post(GRAPHQL, {query: graphQL})
			.then(res => {
				console.debug("User's ballot in poll(id="+pollId+") is", res.data.ballot)
				return res.data.ballot
			})
	},

	/** Verify a voter's ballot with its checksum. */
	async verifyBallot(pollId, checksum) {
		let graphQL = `query { verifyBallot(pollId: "${pollId}", checksum: "${checksum}") ` +
			`{ level checksum voteOrder { id } } }`  
		// returns user's ballot if found
		return axios.post(GRAPHQL, {query: graphQL})
	},

	/** Liquido backend error codes.  LiquidoException.java */
	err: {
		CANNOT_CREATE_NEW_TEAM: 1,
		TEAM_WITH_SAME_NAME_EXISTS: 2,
	},

	/** client side caches */
	teamCache: new PopulatingCache(teamsCacheConfig),
	pollsCache: new PopulatingCache(pollsCacheConfig),

	/** Keys for the above caches */
	JWT_KEY: "jwt",
	CURRENT_USER_KEY: "currentUser",       // key for current user object in teamCache
	TEAM_KEY: "team",
	VOTER_TOKEN_KEY: "voterToken",
	LIQUIDO_JWT_KEY: "LIQUIDO_JWT",        // JWT in localStorage

	/** default JQL queries for common models */
	JQL: JQL,

}

export default graphQlApi