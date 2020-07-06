import Vue from "vue"
import App from "@/App.vue"
//import store from "@/store/index"
import liquidoStore from "@/store/liquido-store"
import router from "@/router/index"
import "@/registerServiceWorker"
//import modal from "@/components/modal-comp"
import accountAPI from "@/plugins/accountAPI"
import { BootstrapVue } from "bootstrap-vue"
import "bootstrap/dist/css/bootstrap.css"
import "bootstrap-vue/dist/bootstrap-vue.css"
import VueI18n from 'vue-i18n'

Vue.use(BootstrapVue)
Vue.use(VueI18n)
Vue.use(accountAPI)
//Vue.component("modal", modal)

Vue.config.productionTip = false
Vue.config.debug = false

/** Global translations that are available to all components */
const globalTranslations = {
	en: {
		helloWorld: 'Hello world!',
		Ok: "Ok",
		Yes: "Yes",
		No: "No",
		Cancel: "Cancel",
	},
	de: {
		helloWorld: 'Hallo Welt!',
		ok: "Ok",
		yes: "Ja",
		no: "Nein",
		save: "Speichern",
		cancel: "Abbrechen",
		back: "Zurück",

		idea: "Idee",
		ideas: "Ideen",
		proposal: "Vorschlag",
		proposals: "Vorschläge",
		poll: "Abstimmung",							// Entscheidung von Robert: nein nicht "Wahl(en)" !!  Deutsche Übersetzung von poll ist Abstimmung!
		polls: "Abstimmungen",
		pollsAbbr: "Abst.",							// Abkürzung für Nav Arrows im Header
		law: "Regel",
		laws: "Regeln",

		elaboration: 'in Diskussion',		// oder auch "in Ausarbeitung"
		inVoting: 'Wahl läuft',					// Abstimmung im Status "wahl läuft"
		finished: 'Abgeschlossen',
	}
}

// Create VueI18n instance for translations.
const i18n = new VueI18n({
	locale: 'de',
	fallbackLocale: 'en',
	silentFallbackWarn: true,
	messages: globalTranslations,
})

// Vue Root App
const rootApp = new Vue({
	i18n,
	router,
	data: {
		store: liquidoStore				// this is available to all sub components as this.$root.store
	},	
	...App
	//render: (h) => h(App),
})

rootApp.$mount("#app")
