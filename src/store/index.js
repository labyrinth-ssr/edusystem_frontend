import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
      first_login:false,
      user_id: window.localStorage.getItem('user' || '[]') == null ? '' : JSON.parse(window.localStorage.getItem('user_id' || '[]'))
  },
  mutations: {
    login (state, user_id) {
      state.user_id = user_id
      window.localStorage.setItem('user_id', JSON.stringify(user_id))
    },
    first_login_func(state,is_first_log){
      state.first_login=is_first_log
      window.localStorage.setItem('first_login',JSON.stringify(is_first_log))
    }
  }
})
