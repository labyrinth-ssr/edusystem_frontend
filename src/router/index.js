import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/components/Login'
import AppIndex from '@/components/home/AppIndex'
import Home from '@/components/Home'
import AddUserForm from '@/components/AddUserForm'
import changePasswdDialog from '@/components/changePasswdDialog' 
Vue.use(VueRouter)

const routes = [
  {
    path:'',
    redirect: '/login'
  },
  {path: 'admin/adduserform',
  name: 'AddUserForm',
  component: AddUserForm,
  meta: {
    requireAuth: true
  }
},
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    //一个不会进入，只包含导航栏的页面
    path: '/home',
    name: 'Home',
    component: Home,
    redirect: '/index',
    children: [
      {
        path: '/index',
        name: 'AppIndex',
        component: AppIndex,
        meta: {
          requireAuth: true
        }
      }
    ]
  },
  {
    path: '/admin/adduserform',
    name: 'AddUserForm',
    component: AddUserForm,
    meta: {
      requireAuth: true
    }
  },
  {
    path: '/user/changepasswd',
    name: 'ChangePasswd',
    component: changePasswdDialog,
    meta: {
      requireAuth: true
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  // base: process.env.BASE_URL,
  routes
})

export default router
