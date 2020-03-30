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

Vue.use(BootstrapVue)
Vue.use(accountAPI)
Vue.component("modal", modal)

Vue.config.productionTip = false
Vue.config.debug = true

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app")
