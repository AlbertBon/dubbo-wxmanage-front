// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'    // 默认主题
Vue.use(ElementUI)

import axios from 'axios'
axios.defaults.headers.post['Content-Type']='application/json';  //设置默认post为json格式
Vue.prototype.$axios = axios;  //为axios设置全局方法变量

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
