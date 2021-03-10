//
// Configuration for LIQUIDO mobile PWA in LOCAL DEVELOPMENT environment
//
import _ from "lodash"
import commonConfig from "./config.common.js"

let config = {
	LIQUIDO_API_URL: "/liquido/v2",  // will be proxied by Vue devServer. See vue.config.js
	voterTokenSecret: "dummyVoterTokenSecretDev",
	inviteLinkPrefix: "http://localhost:3001/invite?inviteCode=",
	devLogin: {
		adminEmail: "admin@TeamOne.org",
		adminTeamname: "TeamOne",
		memberEmail: "member0@TeamOne.org",
		memberTeamname: "TeamOne",
		token: 998877,
	}
}

_.merge(config, commonConfig)

export default config
