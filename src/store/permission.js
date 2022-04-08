import { asyncRouterMap, constantRouterMap } from 'src/router';

function hasPermission(role, route) {
  if (route.meta && route.meta.role) {
    return/*  role.some(role =>  */route.meta.role.indexOf(role) >= 0/* ) */
  } else {
    return true
  }
}

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers;
      state.routers = constantRouterMap.concat(routers);
    }
  },
  actions: {
    GenerateRoutes({ commit }, data) {
      return new Promise(resolve => {
        const role = data;
        const accessedRouters = asyncRouterMap.filter(v => {
        //   if (role.indexOf('admin') >= 0) return true;
          if (hasPermission(role, v)) {
            if (v.children && v.children.length > 0) {
              v.children = v.children.filter(child => {
                if (hasPermission(role, child)) {
                  return child
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
};

export default permission;