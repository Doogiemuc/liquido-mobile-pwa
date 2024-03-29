/**
 * Main entry point for LIQUIDO mobile app.
 */
import config from "config"  // automatically mapped to environment specific config file config/config.<env>.jsin vue.config.js as a webpack alias
const log = require("loglevel")
if (process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test") {
	Vue.config.debug = true
	log.enableAll()
	console.log("NODE_ENV="+process.env.NODE_ENV+"   LIQUIDO configuration:\n", config)
}

import Vue from "vue"
import RootApp from "@/root-app.vue"
import router from "@/services/router"
// import "@/registerServiceWorker"
import "bootstrap/dist/css/bootstrap.css"
import { BootstrapVue } from "bootstrap-vue"
import "bootstrap-vue/dist/bootstrap-vue.css"
import VueI18n from "vue-i18n"

import liquidoGraphQLApi from "@/services/liquido-graphql-client"

Vue.use(BootstrapVue)
Vue.use(VueI18n)

/** This will install the liquido-api as a Vue plugin under this.$api for all Vue components */
const liquidoApiPlugin = {
	install(Vue /*, options*/) {
		Vue.prototype.$api = liquidoGraphQLApi
	}
}
Vue.use(liquidoApiPlugin)

Vue.config.productionTip = false



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
		Menue: "Menü",
		Team: "Team",
		
		Save: "Speichern",
		Cancel: "Abbrechen",
		Back: "Zurück",
		Search: "Suche",
		Warning: "Warnung",
		Attention: "Achtung",
		Error: "Fehler",
		Login: "Login",
		Loading: "Lade ...",

		// Singular and plural form
		Idea: "Idee",
		Ideas: "Ideen",
		Proposal: "Vorschlag",
		Proposals: "Vorschläge",
		// Entscheidung zur deutschen Übersetzung von Poll == "Abstimmung" !!!
		// Nein nicht "Wahl". Wir stimmen ab in LIQUIDO. Der Begriff "Wahl" passt eher zu einer Wahl von Kandidaten, also Personen.
		vote: "abstimmen",   // Verb
		Poll: "Abstimmung",
		Polls: "Abstimmungen",
		Law: "Regel",
		Laws: "Regeln",

		newPoll: "Neue Abstimmung",
		allPolls: "Alle eure Abstimmungen",           // this has exactly two lines of text in iPhone, als all the other titles too
		pollInElaboration: "Abstimmung zur Diskussion",
		pollsInElaboration: "Abstimmungen zur Diskussion",
		pollInVoting: "Laufende Abstimmung",
		pollsInVoting: "Laufende Abstimmungen",
		finishedPoll: "Abgeschlossene Abstimmung",
		finishedPolls: "Abgeschlossene Abstimmungen",

		Elaboration: "Diskussion",	
		InVoting: "Wahl läuft", 		// Abstimmung im Status "die Wahl läuft gerade"
		Finished: "Abgeschlossen",

		NetworkOffline: "Du bist offline. Bitte schalte dein WLAN ein.",
		BackendNotReachable: "Ich kann den LIQUIDO Server gerade nicht erreichen. Bitte veruche es später noch einmal.",
	},
}

// Create VueI18n instance for translations.
const i18n = new VueI18n({
	locale: "de",
	//fallbackLocale: "de",
	silentFallbackWarn: true,
	messages: globalTranslations,
})

//TODO: sanity check config for required attributes

// Vue Root App
const rootApp = new Vue({
	i18n,
	router,
	...RootApp, // merge these attributes into root-app.vue
	//render: (h) => h(App),
})

rootApp.$mount("#app")
