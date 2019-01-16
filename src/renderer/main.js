import Vue from 'vue'

import axios from 'axios'

import App from './App'
import router from './router'

import VueCookie from 'vue-cookie'
import Notifications from 'vue-notification'
import socketio from 'socket.io-client';
import VueSocketIO from 'vue-socket.io';
let ENV = process.env.NODE_ENV || "development"
import globalConfig from "./config"
let config = globalConfig[ENV]

// index.js or main.js
import 'vuetify/dist/vuetify.min.css' // Ensure you are using css-loader
// index.js or main.js
import 'material-design-icons-iconfont/dist/material-design-icons.css' // Ensure you are using css-loader
var numeral = require('numeral')


if (!process.env.IS_WEB) Vue.use(require('vue-electron'))

Vue.use(VueCookie);
Vue.use(Notifications);
Vue.filter("formatNumber", function(value, format) {
  return numeral(value).format(format);
});
axios.defaults.withCredentials = true
Vue.service = Vue.prototype.$service = axios.create({
  baseURL: 'http://localhost:3000/api/v1/',
  timeout: 15000,
  credentials: true,
  headers: {
    'X-Custom-Header': 'foobar'
  }
});
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

var io = socketio(config.host)
Vue.use(new VueSocketIO({
  connection: io,
}))

import Vuetify from 'vuetify'

Vue.use(Vuetify)

/* eslint-disable no-new */
new Vue({
  components: {
    App
  },
  router,
  template: '<App/>'
}).$mount('#app')