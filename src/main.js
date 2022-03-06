import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
import store from './store'
// import Vuex from 'vuex'; 

// 设置反向代理，前端请求默认发送到 http://localhost:8080/api
var axios = require('axios')//从node_modules引入axios
axios.defaults.baseURL = '/api'
//在原型上定义，不污染全局作用域（添加实例property）
//之后可在其他组件中通过 this.$axios 发送数据，
Vue.prototype.$axios = axios
Vue.use(ElementUI)

Vue.config.productionTip = false

// router.beforeEach((to, from, next) => {
//   next()
//   /* if (to.meta.requireAuth) {
//     if (store.state.user.username) {
//       next()
//     } else {
//       next({
//         path: 'login',
//         query: {redirect: to.fullPath}
//       })
//     }
//   } else {
//     next()
//   } */
// }
// )

new Vue({
  el: '#app',// el 配置项指实例负责管理的区域；#app 指 id="app" 的dom标签里的所有内容
  router,
  store,
  components:{App},
  render: h => h(App)
}).$mount('#app')
