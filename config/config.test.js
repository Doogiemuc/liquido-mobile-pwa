//
// Configuration for LIQUIDO mobile PWA during testing environment
//

import _ from "lodash"
import commonConfig from "./config.common.js"

let config = {
	// no special config for test needed
}

_.merge(config, commonConfig)

export default config