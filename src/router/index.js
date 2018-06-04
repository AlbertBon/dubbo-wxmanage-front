import Vue from 'vue'
import Router from 'vue-router'
const _import = require('./_import_' + process.env.NODE_ENV)

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
  { path: '/login', component: _import('/login/index'), hidden: true },
  { path: '/404', component: _import('/404'), hidden: true },

  {
    path: '',
    component: Layout,
    name: '主页',
    redirect: 'home',
    children: [
      {
        path: 'home',
        name: '主页',
        alwaysShow:false,
        component: _import('/dashboard/index'),
        meta: {title: '主页', icon: 'fa fa-home'}
      }
    ]
  },

  {
    path: '/admin',
    component: Layout,
    redirect: 'admin/user/list',
    name: '系统管理',
    meta: { title: '系统管理', icon: 'fa fa-cogs' },
    children: [
      {
        path: 'user/list',
        name: '用户管理',
        component: _import('/admin/UserList'),
        meta: { title: '用户管理', icon: 'fa fa-users' }
      },
      {
        path: 'role/list',
        name: '角色管理',
        component: _import('/admin/RoleList'),
        meta: { title: '角色管理', icon: 'fa fa-user-circle-o' }
      },
      {
        path: 'menu/list',
        name: '菜单管理',
        component: _import('/admin/MenuList'),
        meta: { title: '菜单管理', icon: 'fa fa-bars' }
      },
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),/*滚动行为*/
  routes: constantRouterMap
})

