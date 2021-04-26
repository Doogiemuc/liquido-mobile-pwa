//
// Configuration for LIQUIDO mobile PWA in PROD environment
//
import _ from "lodash"
import commonConfig from "./config.common.js"

let config = {
	configSource: "production",
	BASE_URL: "/liquido-mobile",
	LIQUIDO_API_URL: "http://ec2-52-208-204-181.eu-west-1.compute.amazonaws.com/liquido-api/v3",
}

export default _.merge(commonConfig, config)
