import router from './router'
import store from './store'
import Cookies from 'js-cookie'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css'// progress bar style
import { getToken } from '@/utils/auth' // getToken from cookie
import MenuUtils from '@/utils/MenuUtils'

NProgress.configure({ showSpinner: false })// NProgress Configuration

// permissiom judge function
function hasPermission(roles, permissionRoles) {
  if (roles.indexOf('admin') >= 0) return true // admin permission passed directly
  if (!permissionRoles) return true
  return roles.some(role => permissionRoles.indexOf(role) >= 0)
}

const whiteList = ['/login', '/authredirect']// no redirect whitelist

let data = Cookies.get('userMenu')
if (data){
  //这里是防止用户手动刷新页面，整个app要重新加载,动态新增的路由，会消失，所以我们重新add一次
  let routers = []
  MenuUtils(routers, JSON.parse(data))
  console.log('---缓存中的菜单---')
  console.log(routers)
  store.dispatch('InitMenuRouter', routers)
  router.addRoutes(store.state.app.menuRouterMap)
}

router.beforeEach((to, from, next) => {
  NProgress.start(); // start progress bar
  console.log(to.path+'--'+from.path);
  let data = Cookies.get('userMenu')
  if(data&&to.path === '/login'){
    //这里不使用router进行跳转，是因为，跳转到登录页面的时候，是需要重新登录，获取数据的，这个时候，会再次向router实例里面add路由规则，
    //而next()跳转过去之后，没有刷新页面，之前的规则还是存在的，但是使用location的话，可以刷新页面，当刷新页面的时候，整个app会重新加载
    //而我们在刷新之前已经把sessionStorage里的user移除了，所以上面的添加路由也不行执行
    Cookies.remove('userMenu')
    window.location.href = '/'
    NProgress.done()
    return false
  }

  if (!data && to.path !== '/login') {
    next({ path: '/login' })
    NProgress.done()
  } else {
    if (to.path) {
      next()
      NProgress.done()
    } else {
      next({ path: '/404' })
      NProgress.done()
    }
  }

  // if (getToken()) { // determine if there has token
  //   /* has token*/
  //   if (to.path === '/login') {
  //     console.log(router.options.routers)
  //     window.location.href = '/'
  //     console.log(router.options.routers)
  //     NProgress.done() // if current page is dashboard will not trigger	afterEach hook, so manually handle it
  //   }
  //   next();
  // } else {
  //   /* has no token*/
  //   if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
  //     next()
  //   } else {
  //     next('/login') // 否则全部重定向到登录页
  //     NProgress.done() // if current page is login will not trigger afterEach hook, so manually handle it
  //   }
  // }
})

router.afterEach(() => {

  NProgress.done() // finish progress bar
})
