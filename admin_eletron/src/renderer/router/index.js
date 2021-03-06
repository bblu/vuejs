import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
**/
export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: 'dashboard', icon: 'dashboard' }
    }]
  },
  {
    path: '/line',
    component: Layout,
    meta: { title: 'line', icon: 'example' },
    children: [
      {
        path: 'table',
        name: 'LineTable',
        component: () => import('@/views/line/table'),
        hidden: false,
        meta: { title: 'lineTable', icon: 'form' }
      },
      {
        path: 'cloud',
        name: 'PointCloud',
        component: () => import('@/views/line/cloud'),
        meta: { title: 'lineTower', icon: 'form' }
      },
      {
        path: 'earth',
        name: 'EarthCloud',
        component: () => import('@/views/line/earth'),
        meta: { title: 'lineEarth', icon: 'form' }
      }
    ]
  },
  {
    path: '/fly',
    component: Layout,
    redirect: '/fly/tower',
    name: 'Fly',
    meta: { title: 'fly', icon: 'example' },
    children: [
      {
        path: 'style',
        name: 'style',
        component: () => import('@/views/fly/style'),
        meta: { title: 'flystyle', icon: 'table' }
      },
      {
        path: 'tower',
        name: 'tower',
        component: () => import('@/views/fly/tower'),
        meta: { title: 'flytower', icon: 'tree' }
      }
    ]
  },
  {
    path: '/data',
    component: Layout,
    redirect: '/data/upload',
    name: 'Data',
    meta: { title: 'data', icon: 'example' },
    children: [
      {
        path: 'upload',
        name: 'upload',
        component: () => import('@/views/table/index'),
        meta: { title: 'upload', icon: 'table' }
      },
      {
        path: 'analyze',
        name: 'analyze',
        component: () => import('@/views/tree/index'),
        meta: { title: 'analyze', icon: 'tree' }
      },
      {
        path: 'statistics',
        name: 'statistics',
        component: () => import('@/views/tree/index'),
        meta: { title: 'statistics', icon: 'tree' }
      }
    ]
  },
  {
    path: '/form',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'form',
        component: () => import('@/views/form/index'),
        meta: { title: 'form', icon: 'form' }
      }
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

