import Vue from 'vue'
import App from './App.vue'
import router from './router'

import '@/assets/css/global.css'

import '@/utils/element.js'

import '@/utils/ax.js'

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
