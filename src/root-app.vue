<template>
	<div id="app">
		<transition :name="transitionName">
			<div>
				<liquido-header ref="liquido-header" :back-link="backLink" />
				<router-view id="appContent" class="router-view container-lg" />
			</div>
		</transition>
		<navbar-bottom></navbar-bottom>
		<popup-modal 
			id="rootPopupModal"
			ref="rootPopupModal"
			:type="modalType"
			:title="modalTitle"
			:message="modalMessage"
			:content-class="modalContentClass"
			:primary-button-text="modalPrimaryButtonText"
			:secondary-button-text="modalSecondaryButtonText"
		>
		</popup-modal>
		<mobile-log-viewer v-if="showDebugLog"></mobile-log-viewer>
	</div>
</template>

<script>
import liquidoHeader from "@/components/liquido-header"
import navbarBottom from "@/components/navbar-bottom"
import popupModal from "@/components/popup-modal"
import mobileLogViewer from "@/components/mobile-debug-log.vue"



/** Pages will slide from right to left in this order */
const page_order = {
	"index": 0,
	"welcome": 1,
	"login": 2,
	"teamHome": 3,
	"polls": 4,
	"createPoll": 5,
	"showPoll": 6,
	"addProposal": 7,
	"castVote": 8,
}


/** Liquido Root App */
export default {
	name: "LiquidoApp",
	components: { liquidoHeader, navbarBottom, popupModal, mobileLogViewer },
	// vue-i18n is configured in main.js ! Do not overwrite it here!
	// These data attributes are reactive and available in EVERY sub-component as this.$root.<attributeName>
	data() { 
		return {
			transitionName: "", 	// CSS sliding transition between page components
			// Global popup-modal
			modalType: "success",
			modalTitle: "",
			modalMessage: "",
			modalContentClass: undefined,
			modalPrimaryButtonText: undefined,
			modalSecondaryButtonText: undefined,
		}
	},
	computed: {
		/**
		 * Show appropriate backlink in liquido-header
		 *
		 * show one poll -> back to list of polls
		 * add proposal  -> back to poll
		 * cast vote     -> back to poll
		 * otherwise don't show a back link
		 */
		backLink() {
			if (/^\/polls\/\d+$/.test(this.$route.path)) {
				return "/polls"
			} else if (/^\/polls\/\d+\/castVote$/.test(this.$route.path)) {
				return "BACK"
			} else if (/^\/polls\/\d+\/add$/.test(this.$route.path)) {
				return "BACK"
			}
			return undefined
		},
		/** which footer to show */
		showPollsFooter() {
			return this.$route.path === "/polls"
		},
		showDebugLog() {
			return false
		}
	},
	// watch the `$route` to determine the transition to use
	// https://router.vuejs.org/guide/advanced/transitions.html#per-route-transition
	watch: {
		$route(to, from) {
			this.transitionName = ""
			const fromOrder = page_order[from.name]
			const toOrder = page_order[to.name]
			if (fromOrder < toOrder)  { this.transitionName = "slide-left" } else
			if (fromOrder > toOrder)  { this.transitionName = "slide-right"}
			else { this.transitionName = "fade" }  // default is fade
		},
	},
	created() {
	},
	mounted() {
		this.$api.pingApi()
			.catch(() => {
				this.$refs.rootPopupModal.showWarning(this.$t("BackendNotReachable"))
			})
	},
	methods: {
		//
		// Here comes some HTML UX magic.
		//

		/** scroll to the very bottom of the content. Show last chat message */
		scrollToBottom() {
			this.$nextTick(() => {
				$("#appContent").animate({ scrollTop: $("#app").height() }, 1000)
			})
		},

		/**
		 * scroll an HTML elemant right under the header
		 * (as far up as possible, depending on content below the elem)
		 * @param {String} elem JQuery selector for dom elem
		 * @param {Number} margin margin below headerHeight in pixels (default 0)
		 */
		scrollElemToTop(elem, margin = 0) {
			let scrollTop = $("#appContent").scrollTop() + $(elem).offset().top - margin
			this.$nextTick(() => {
				$("#appContent").animate({ scrollTop: scrollTop }, 1000)
			})
		},

		/** Check if the bottom of elem is scrolled into view */
		isBottomInView(elem) {
			let docViewTop = $(window).scrollTop()
			let docViewBottom = docViewTop + $(window).height()
			let elemTop = $(elem).offset().top
			let elemBottom = elemTop + $(elem).height()
			return elemBottom <= docViewBottom
		},
	},
}
</script>

<style lang="scss">
// Import liquido specific global styles
@import "styles/liquido.scss";

#app {
	max-width: 1140px; // bootstrap breakpoint of container-lg
	height: 100vh;
	margin: 0 auto;  
	position: relative;
	overflow-x: hidden;
}

/** 
 * Main app content below the header
 * no horizintal scrolling 
 */
#appContent {
	padding-top: 0;     // behind header. MUTS be padding!
	padding-bottom: 70px;  // bottom because of navbar
	padding-left: 10px;    // smaller than bootsraps default 15px. But still enough for iOS scrollbar.
	padding-right: 10px;
	overflow-x: hidden;
	height: 100%;
}

// Slide animation between pages
.router-view {
	transition: all 0.5s ease-in-out;
}
.fade-enter,
.fade-leave-to {
	opacity: 0;
}
.fade-leave-active {
	position: absolute;
	width: 100%;
}

.slide-left-enter,
.slide-right-leave-to {
	-webkit-transform: translate(100%, 0);
	transform: translate(100%, 0);
}
.slide-left-leave-active,
.slide-right-leave-active {
	position: absolute;
	width: 100%;
}
.slide-left-leave-to,
.slide-right-enter {
	-webkit-transform: translate(-100%, 0);
	transform: translate(-100%, 0);
}

.slide-up-enter {
	-webkit-transform: translate(0, 100%);
	transform: translate(0, 100%);
}
.slide-up-leave-active {
	position: absolute;
	width: 100%;
}
.slide-up-leave-to {
	-webkit-transform: translate(0, 0);
	transform: translate(0, 0);
}



</style>
