import Vue from 'vue'
import Router from 'vue-router'
import HelloPotree from '@/components/HelloPotree'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloPotree',
      component: HelloPotree
    }
  ]
})
