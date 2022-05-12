import Vue from 'vue'
import Vuex from 'vuex'
import { asyncRouterMap, constantRouterMap } from '../router/index.js';
import current from "element-ui/packages/table/src/store/current";


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
    first_login:  window.localStorage.getItem('first_login' || '[]') == null ? '' : JSON.parse(window.localStorage.getItem('first_login' || '[]')),
    user_id:
      window.localStorage.getItem('user_id' || '[]') == null ? '' : JSON.parse(window.localStorage.getItem('user_id' || '[]')),
    role:
    // 'student'
      window.localStorage.getItem('role' || '[]') == null ? '' : JSON.parse(window.localStorage.getItem('role' || '[]')),
    courseInfo:{},
    currentTerm:window.localStorage.getItem('term' || '[]') == null ? '' : JSON.parse(window.localStorage.getItem('term' || '[]')),
    termsPerY: 3,
    course_sel_stage:0
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers;
      state.routers = constantRouterMap.concat(routers);
    },
    login(state, {user_id,term}) {
      state.user_id = user_id
      state.currentTerm=term
      window.localStorage.setItem('user_id', JSON.stringify(user_id))
      window.localStorage.setItem('term', JSON.stringify(term))

    },
    role(state, role) {
      state.role = role
      window.localStorage.setItem('role',JSON.stringify(role))
    },
    first_login_func(state, is_first_log) {
      state.first_login = is_first_log
      window.localStorage.setItem('first_login',JSON.stringify(is_first_log))
      // window.localStorage.getItem('first_login' || '[]') == null ? '' : JSON.parse(window.localStorage.getItem('first_login' || '[]'))

      // window.localStorage.setItem('first_login',JSON.stringify(is_first_log))
    }
  },
  actions: {
    GenerateRoutes({ commit }, data1) {
      return new Promise(resolve => {
        const role = data1;
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
