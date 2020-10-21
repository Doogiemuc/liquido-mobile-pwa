import Vue from "vue"
import RootApp from "@/root-app.vue"
import liquidoStore from "@/services/liquido-store"
import liquidoApi from "@/services/liquido-api"
import router from "@/services/router"
import "@/registerServiceWorker"
import { BootstrapVue } from "bootstrap-vue"
import "bootstrap/dist/css/bootstrap.css"
import "bootstrap-vue/dist/bootstrap-vue.css"
import VueI18n from "vue-i18n"

Vue.use(BootstrapVue)
Vue.use(VueI18n)

/** This will install the liquido-api as a Vue plugin under Vue.$api for all Vue components */
const liquidoApiPlugin = {
	install(Vue, options) {
		Vue.prototype.$api = liquidoApi
	}
}
Vue.use(liquidoApiPlugin)

Vue.config.productionTip = false
Vue.config.debug = true

/** Global translations that are available to all components */
const globalTranslations = {
	en: {
		helloWorld: "Hello world!",
		Ok: "Ok",
		Yes: "Yes",
		No: "No",
		Cancel: "Cancel",
	},
	de: {
		helloWorld: "Hallo Welt!",
		ok: "Ok",
		yes: "Ja",
		no: "Nein",
		save: "Speichern",
		cancel: "Abbrechen",
		back: "Zurück",
		search: "Suche",

		// Every noun in singular and plural form!
		idea: "Idee",
		ideas: "Ideen",
		proposal: "Vorschlag",
		proposals: "Vorschläge",
		poll: "Abstimmung", // Entscheidung von Robert: nein nicht "Wahl(en)" !!  Deutsche Übersetzung von poll ist Abstimmung!
		polls: "Abstimmungen",
		law: "Regel",
		laws: "Regeln",

		newPoll: "Neue Abstimmung",
		pollInElaboration: "Abstimmung in Diskussion",
		pollsInElaboration: "Abstimmungen in Diskussion",
		pollInVoting: "Laufende Abstimmung",
		pollsInVoting: "Laufende Abstimmungen",
		finishedPoll: "Abgeschlossene Abstimmung",
		finishedPolls: "Abgeschlossene Abstimmungen",

		elaboration: "Diskussion", // oder auch "in Ausarbeitung"
		inVoting: "Wahl läuft", // Abstimmung im Status "wahl läuft"
		finished: "Abgeschlossen",
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
		store: liquidoStore, // this is available to all sub components as this.$root.store
		headerHeight: 0, // will be set to height of header in liquido-header.vue
		transitionName: "", // CSS sliding transition between page components
	},
	...RootApp, // merge these attributes into root-app.vue
	//render: (h) => h(App),
})

rootApp.$mount("#app")
