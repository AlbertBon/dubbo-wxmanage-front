import Cookies from 'js-cookie'
const _import = require('@/router/_import_' + process.env.NODE_ENV)
/* Layout */
import Layout from '@/views/layout/Layout'

const app = {
  state: {
    /**初始路由规则
     * hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
     * alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
     *                                if not set alwaysShow, only more than one route under the children
     *                                it will becomes nested mode, otherwise not show the root menu
     * redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
     * name:'router-name'             the name is used by <keep-alive> (must set!!!)
     * meta : {
     *   title: 'title'               the name show in submenu and breadcrumb (recommend set)
     *   icon: 'svg-name'             the icon show in the sidebar,
     * }
     **/
    menuRouterMap:[],
    sidebar: {
      opened: !+Cookies.get('sidebarStatus'),
      withoutAnimation: false
    },
    device: 'desktop'
  },
  mutations: {
    TOGGLE_SIDEBAR: state => {
      if (state.sidebar.opened) {
        Cookies.set('sidebarStatus', 1)
      } else {
        Cookies.set('sidebarStatus', 0)
      }
      state.sidebar.opened = !state.sidebar.opened
      state.sidebar.withoutAnimation = false
    },
    CLOSE_SIDEBAR: (state, withoutAnimation) => {
      Cookies.set('sidebarStatus', 1)
      state.sidebar.opened = false
      state.sidebar.withoutAnimation = withoutAnimation
    },
    TOGGLE_DEVICE: (state, device) => {
      state.device = device
    },
    INIT_MENU_ROUTER:(state,routers) =>{
      state.menuRouterMap=state.menuRouterMap.concat(routers);
    },
    SET_MENU_ROUTER:(state,routers) =>{
      Cookies.set('userMenu', routers)
    },
  },
  actions: {
    ToggleSideBar: ({ commit }) => {
      commit('TOGGLE_SIDEBAR')
    },
    CloseSideBar({ commit }, { withoutAnimation }) {
      commit('CLOSE_SIDEBAR', withoutAnimation)
    },
    ToggleDevice({ commit }, device) {
      commit('TOGGLE_DEVICE', device)
    },
    InitMenuRouter({ commit },routers){
      commit('INIT_MENU_ROUTER',routers)
    },
    setMenuRouter({ commit },routers){
      commit('SET_MENU_ROUTER',routers)
    },
  }
}

export default app
