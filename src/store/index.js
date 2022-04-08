    import Vue from 'vue'
import Vuex from 'vuex'
import { asyncRouterMap, constantRouterMap } from '../router/index.js';


Vue.use(Vuex)

function hasPermission(role, route) {
  if (route.meta && route.meta.role) {
    return/*  role.some(role =>  */route.meta.role.indexOf(role) >= 0/* ) */
  } else {
    return true
  }
}

export default new Vuex.Store({
  state: {
    routers: constantRouterMap,
    addRouters: [],
    first_login: false,
    user_id:
      window.localStorage.getItem('user_id' || '[]') == null ? '' : JSON.parse(window.localStorage.getItem('user_id' || '[]')),
    role:
      window.localStorage.getItem('role' || '[]') == null ? '' : JSON.parse(window.localStorage.getItem('role' || '[]'))
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers;
      state.routers = constantRouterMap.concat(routers);
    },
    login(state, user_id) {
      state.user_id = user_id
      window.localStorage.setItem('user_id', JSON.stringify(user_id))
    },
    role(state, role) {
      state.role = role
      window.localStorage.setItem('role',JSON.stringify(role))
    },
    first_login_func(state, is_first_log) {
      state.first_login = is_first_log
      // window.localStorage.setItem('first_login',JSON.stringify(is_first_log))
    }
  },
  actions: {
    GenerateRoutes({ commit }, data) {
      return new Promise(resolve => {
        const role = data;
        const accessedRouters = asyncRouterMap.filter(v => {
          if (hasPermission(role, v)) {
            if (v.children && v.children.length > 0) {
              v.children = v.children.filter(child => {
                if (hasPermission(role, child)) {
                  if (child.children && child.children.length > 0) {
                    child.children = child.children.filter(grandchild => {
                      if (hasPermission(role, grandchild)) {
                        return grandchild
                      }
                      return false;
                    });
                    return child
                  } else {
                    return child
                  }
                }
                return false;
              });
              return v
            } else {
              return v
            }
          }
          return false;
        });
        console.log(accessedRouters)
        commit('SET_ROUTERS', accessedRouters);
        resolve();
      })
    }
  }
})
