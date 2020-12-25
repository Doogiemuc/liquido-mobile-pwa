console.log("%cLIQUIDO Mobile", "font-size: 40px; color:blue; font-face: Baskerville, serif; font-weight: bold; border: 1px solid blue; padding: 20px;")

const log = require("loglevel").getLogger("liquido-main");
log.enableAll()

import config from "config"  // automatically mapped to environment specific config file vue.config.js as a webpack alias
log.debug("NODE_ENV="+process.env.NODE_ENV+"   configuration:\n", config)

import Vue from "vue"
import RootApp from "@/root-app.vue"
import liquidoApi from "@/services/liquido-api"
import router from "@/services/router"
import "@/registerServiceWorker"
import { BootstrapVue } from "bootstrap-vue"
import "bootstrap/dist/css/bootstrap.css"
import "bootstrap-vue/dist/bootstrap-vue.css"
import VueI18n from "vue-i18n"


Vue.use(BootstrapVue)
Vue.use(VueI18n)

/** This will install the liquido-api as a Vue plugin under this.$api for all Vue components */
const liquidoApiPlugin = {
	install(Vue /*, options*/) {
		Vue.prototype.$api = liquidoApi
	}
}
Vue.use(liquidoApiPlugin)

Vue.config.productionTip = false
Vue.config.debug = true

/** 
 * Global translations that are available to all components 
 * 
 * Capital translations also have a capital key, eg.  Cancel: "Cancel" both with capital 'C'.
 */
const globalTranslations = {
	en: {
		HelloWorld: "Hello world!",
		Ok: "Ok",
		Yes: "Yes",
		No: "No",
		Cancel: "Cancel",
	},
	de: {
		HelloWorld: "Hallo Welt!",
		Ok: "Ok",
		Yes: "Ja",
		No: "Nein",
		Save: "Speichern",
		Cancel: "Abbrechen",
		Back: "Zurück",
		Search: "Suche",
		Error: "Fehler",

		// Singular and plural form
		Idea: "Idee",
		Ideas: "Ideen",
		Proposal: "Vorschlag",
		Proposals: "Vorschläge",
		Poll: "Abstimmung", 					// Entscheidung von Robert: nein nicht "Wahl" oder "Wahlen"!! Deutsche Übersetzung von poll ist Abstimmung! Wir stimmen ab in LIQUIDO. Der Begriff "Wahl" passt eher zu einer Wahl von Kandidaten, also Personen.
		Polls: "Abstimmungen",
		Law: "Regel",
		Laws: "Regeln",

		newPoll: "Neue Abstimmung",
		pollInElaboration: "Abstimmung in Diskussion",
		pollsInElaboration: "Abstimmungen in Diskussion",
		pollInVoting: "Laufende Abstimmung",
		pollsInVoting: "Laufende Abstimmungen",
		finishedPoll: "Abgeschlossene Abstimmung",
		finishedPolls: "Abgeschlossene Abstimmungen",

		Elaboration: "Diskussion",	
		InVoting: "Wahl läuft", 		// Abstimmung im Status "die Wahl läuft gerade"
		Finished: "Abgeschlossen",
	},
}

// Create VueI18n instance for translations.
const i18n = new VueI18n({
	locale: "de",
	fallbackLocale: "en",
	silentFallbackWarn: true,
	messages: globalTranslations,
})

// Vue Root App
const rootApp = new Vue({
	i18n,
	router,
	data: {
 		headerHeight: 0, 			// will be set to height of header in liquido-header.vue
		transitionName: "", 	// CSS sliding transition between page components
	},
	...RootApp, // merge these attributes into root-app.vue
	//render: (h) => h(App),
})

rootApp.$mount("#app")
