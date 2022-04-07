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


router.beforeEach((to, from, next) => {
  //注意：login页面必须判断成功登录后存储user_id
  if(!/^\/login\/?/.test(to.path)){
    //注意：/pagecheck接口不会被后端拦截器拦截
    axios.get("/pagecheck",{}).then((resp)=>{
      console.log(resp)
      if(resp.data!=""&&resp.data == store.state.user_id) next();
      else {
        if (resp.data != "") alert("请重新登录")
        else if(resp.data == "") alert("请先登录")
        next({path: '/login'})
      }}
    )
  }
  else next();
})


new Vue({
  el: '#app',// el 配置项指实例负责管理的区域；#app 指 id="app" 的dom标签里的所有内容
  router,
  store,
  components:{App},
  render: h => h(App)
}).$mount('#app')
