import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/page/Login.vue'
import Home from '@/components/common/Home.vue'
import Welcome from '@/components/page/Welcome.vue'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/login'
    }, {
      path: '/login',
      component: Login//第一种解析方式，需import引入页面
    }, {
      path: '/loginOther',
      component: resolve => require(["../components/page/Login.vue"], resolve)//第二种解析方式
    }, {
      path: '/home',
      component: Home,
      children:[
        {
          path:'/',
          components: {
            default:Welcome,
            main:Welcome,
          }
        },
      ]
    }
  ]
})
