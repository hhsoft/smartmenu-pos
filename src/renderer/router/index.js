import Vue from 'vue'
import Router from 'vue-router'

import SignIn from '@/components/SignIn'
import Main from '@/components/Main'

Vue.use(Router)

export default new Router({
  routes: [{
    path: "/",
    component: SignIn
  }, {
    path: "/main",
    component: Main
  }

  ]
})
