/**
 * LIQUIDO GraphQL client
 */

import axios from "axios"
import config from "config"

const log = require("loglevel").getLogger("liquido-api");
if (process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test") {
	log.enableAll()
}

// Configure axios HTTP REST client to point to our graphQL backend
axios.defaults.baseURL = config.LIQUIDO_GRAPHQL_URL

export default {
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
						profile {
							name
							mobilephone
						}
					}
				}
				jwt
			}
		}`
		return axios.post("", {query: graphQL})
			.then(res => {
				let team = res.data.createNewTeam.team
				let jwt  = res.data.createNewTeam.jwt
				this.loginJWT(jwt)
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
			this.login(res.data)
			return res.data
		}).catch(err => { 
			console.error(err.response ? err.response : err)
			return Promise.reject(err.response ? err.response : err)
		})
	},

	async createPoll(pollTitle) {
		let graphQL = `mutation {
			createPoll(title: "${pollTitle}") {
				poll { id, title }
			}
		}`
		return axios.post("", {query: graphQL})
			.then(res => {
				let poll = res.data.createPoll.poll
				log.info("Created new poll:", poll)
				return poll
			})
	},

}
