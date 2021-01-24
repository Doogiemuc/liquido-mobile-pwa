//
// Configuration for LIQUIDO mobile PWA in INT environment
//

import _ from "lodash"
import commonConfig from "./config.common.js"

let config = {
	LIQUIDO_API_URL: '/liquido-api',  // will be proxied by Vue devServer. See vue.config.js
	//DB_URI: "mongodb+srv://" + DB_USER + ":" + DB_PASS + "@" + DB_HOST // + DB_NAME + "?retryWrites=true&w=majority",
}

_.merge(config, commonConfig)

export default config