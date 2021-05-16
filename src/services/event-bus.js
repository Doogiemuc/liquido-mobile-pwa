/**
 * Event-bus is a very lightweight vuex.
 * Here we simply use the $emit functionality of Vue components.
 * Other components can fire events eg. `EventBus.$emit(EventBus.LOGIN)`
 * and listeners can subscribe with `EventBus.$on(EventBus.LOGIN, function(evt) { ... })
 */

import Vue from "vue"

const EventBus = new Vue({
	data() {
		return {
			// "enum" for event names (these are case insensitive!)
			LOGIN: "login",								// called with {team, polls, jwt }
			LOGOUT: "logout",
			POLLS_LOADED: "polls-loaded",  // array of polls was loaded
			POLL_LOADED: "poll-loaded",    // ONE poll was loaded from the backend
			SET_POLLS_FILTER: "set-polls-filter"   // Set the filter on the polls page
		}
	}
})

export default EventBus
