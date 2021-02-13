//
// Configuration for LIQUIDO mobile PWA in LOCAL DEVELOPMENT environment
//
import _ from "lodash"
import commonConfig from "./config.common.js"

let config = {
	LIQUIDO_API_URL: "/liquido/v2",  // will be proxied by Vue devServer. See vue.config.js
	LIQUIDO_GRAPHQL_URL: "/liquido/v2/graphql",
	voterTokenSecret: "dummyVoterTokenSecretDev",
	devLogin: {
		getJWTURL: "http://localhost:3001/liquido/v2/dev/getJWT",
		adminEmail: "teamadmin0@TestTeam0.org",
		adminTeamname: "TestTeam0",
		memberEmail: "member0@TestTeam0.org",
		memberTeamname: "TestTeam0",
		token: 998877,
	}
}

_.merge(config, commonConfig)

export default config
