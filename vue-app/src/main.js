import Vue from 'vue'
import App from './App.vue'
require('./store.js')
Vue.config.productionTip = false
new Vue({
  render: function (h) { return h(App) },
}).$mount('#app')
