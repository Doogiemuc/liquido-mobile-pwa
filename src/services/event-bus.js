import Vue from "vue"

const EventBus = new Vue({
	data() {
		return {
			// "enum" for event names (these are case insensitive!)
			LOGIN: "login",
			LOGOUT: "logout",
		}
	}
})

export default EventBus

// event names (case insensitive!!!)
/*
module.export = {
	LOGIN: "login",
	LOGOUT: "logout",
}
*/
