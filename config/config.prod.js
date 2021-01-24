//
// Configuration for LIQUIDO mobile PWA in PROD environment
//
import _ from "lodash"
import commonConfig from "./config.common.js"

let config = {
	LIQUIDO_API_URL: 'http://liquido.me:8080/liquido-api/v2',  // will be proxied by Vue devServer. See vue.config.js
}

_.merge(config, commonConfig)

export default config
