//
// Configuration for LIQUIDO mobile PWA in LOCAL DEVELOPMENT environment
//
import _ from 'lodash'
import commonConfig from "./config.common.js"

let config = {
	LIQUIDO_API_URL: '/liquido-api',  // will be proxied by Vue devServer. See vue.config.js
}

_.merge(config, commonConfig)

console.log("NODE_ENV="+process.env.NODE_ENV+"   configuration:\n", config)

export default config
