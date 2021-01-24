//
// Configuration for LIQUIDO mobile PWA in LOCAL DEVELOPMENT environment
//
import _ from "lodash"
import commonConfig from "./config.common.js"

let config = {
	LIQUIDO_API_URL: "/liquido/v2",  // will be proxied by Vue devServer. See vue.config.js
	LIQUIDO_GRAPHQL_URL: "/liquido/v2/graphql",
	DEV_GET_JWT_URL: "/liquido/v2/dev/getJWT",
	DEV_LOGIN_TOKEN: 998877,  // must be same as in backend for development login
}

_.merge(config, commonConfig)

export default config
