import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
import store from './store'
import 'element-ui/lib/theme-chalk/index.css'
import fr from "element-ui/src/locale/lang/fr";

// 设置反向代理，前端请求默认发送到 http://localhost:8080/api
var axios = require('axios')//从node_modules引入axios
axios.defaults.baseURL = '/api'
//在原型上定义，不污染全局作用域（添加实例property）
//之后可在其他组件中通过 this.$axios 发送数据，
Vue.prototype.$axios = axios
Vue.use(ElementUI)
Vue.config.productionTip = false


router.beforeEach((to, from, next) => {
  console.log("to: "+to.path);
  console.log("from：" + from.path);
  console.log("user: "+store.state.user_id);
  if(/^\/login\/?/.test(from.path)) next();
  else if(!/^\/login\/?/.test(to.path)){
    axios.get("/pagecheck",{}).then((resp)=>{
      console.log("data "+ resp.data);
      console.log(store.state.user_id);
      if(resp.data==""||resp.data == "NO_LOGIN"||resp.data=="NO_AUTHORITY" || resp.data != store.state.user_id){
        if(resp.data !== store.state.user_id) {
          store.state.user_id = resp.data
          alert("请重新登录")
        }
        next({
          path: '/login',
          query: {redirect: to.fullPath}
        })
      }
      else{ next()}
    })
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
