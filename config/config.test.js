//
// Configuration for LIQUIDO mobile PWA in INT environment
//

import _ from "lodash"
import commonConfig from "./config.common.js"

let config = {
	LIQUIDO_API_URL: '/liquido/v2',  // will be proxied by Vue devServer. See vue.config.js
	mockBackend: true,
}

_.merge(config, commonConfig)

export default config