import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/components/Login'
import AppIndex from '@/components/home/AppIndex'
import Home from '@/components/Home'
import AddUserForm from '@/components/AddUserForm'

Vue.use(VueRouter)

const routes = [
  {path: '/adduserform',
  name: 'AddUserForm',
  component: AddUserForm
},
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    // home页面并不需要被访问
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
  }
]

const router = new VueRouter({
  mode: 'history',
  // base: process.env.BASE_URL,
  routes
})

export default router
