import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
import store from './store'
import 'element-ui/lib/theme-chalk/index.css'
import './mock/courses'
// 设置反向代理，前端请求默认发送到 http://localhost:8080/api
var axios = require('axios')
axios.defaults.baseURL = '/api'
Vue.prototype.$axios = axios
Vue.use(ElementUI)
Vue.config.productionTip = false

const whiteList=[]
var routeflag=false

router.beforeEach((to, from, next) => {
  // console.log(router.getRoutes())
  if (store.state.user_id) { // 判断是否有token
    if (to.path === '/login') {
      next();
    } else if (routeflag){
      next()
    }
    else {
          const role = store.state.role;
          console.log(role)
          store.dispatch('GenerateRoutes', role).then(() => { // 生成可访问的路由表
            routeflag=true
            store.state.addRouters.forEach((route)=>{
              router.addRoute(route) // 动态添加可访问路由表
            })
            next({ ...to, replace: true }) // hack方法 确保addRoute已完成 ,set the replace: true so the navigation will not leave a history record
          })
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
      next();
    } else {
      next('/login'); // 否则全部重定向到登录页
    }
  }
})


new Vue({
  el: '#app',// el 配置项指实例负责管理的区域；#app 指 id="app" 的dom标签里的所有内容
  router,
  store,
  components:{App},
  render: h => h(App)
}).$mount('#app')
