import Vue from "vue"
import App from "@/App.vue"
import store from "@/store/index"
import router from "@/router/index"
import "@/registerServiceWorker"
import modal from "@/components/modal-comp"
import accountAPI from "@/plugins/accountAPI"
import { BootstrapVue } from "bootstrap-vue"
import "bootstrap/dist/css/bootstrap.css"
import "bootstrap-vue/dist/bootstrap-vue.css"
import VueI18n from 'vue-i18n'

Vue.use(BootstrapVue)
Vue.use(VueI18n)
Vue.use(accountAPI)
Vue.component("modal", modal)

Vue.config.productionTip = false
Vue.config.debug = true

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
		Ok: "Ok",
		Yes: "Ja",
		No: "Nein",
		Cancel: "Abbrechen",
		back: "Zurück",
		idea: "Idee",
		ideas: "Ideen",
		newIdeas: "Neue Ideen", 
		proposal: "Vorschlag",			// Wahlvorschlag
		proposals: 'Vorschläge',
		poll: "Wahl",
		polls: 'Wahlen',  				// Abstimmungen, Umfragen ??
		elaboration: 'Diskussion',
		inVoting: 'Abstimmung',			// laufende Wahlen ??
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

new Vue({
	i18n,
	router,
	store,
	render: (h) => h(App),
}).$mount("#app")
