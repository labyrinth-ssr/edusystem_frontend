import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/components/Login'
import Hello from '@/components/Hello'
// import Home from '@/components/Home'
import AddUserForm from '@/components/AddUserForm'
import changePasswdDialog from '@/components/ChangePasswdDialog'
import Layout from '@/components/Layout'
import CourseTable from '@/components/CourseTable'
import Blank from '@/components/Blank'
Vue.use(VueRouter)

const routes = [{
  path: '',
  redirect: '/home'
},
{
  path: '/login',
  // name: 'Login',
  component: Login
},
{
  path: '/home',
  // name: 'Layout',
  component: Layout,
  redirect: '/home/hellopage',
  children: [{
    path: 'hellopage',
    name: 'Hello',
    component: Hello,
    // meta: {
    //   requireAuth: true
    // }
  },
  // {
  //   path: 'school',
  // },
  {
    path: 'courses',
    name: 'Courses',
    component:Blank,
    redirect:'courses/table',
    children: [{
      path: 'table',
      name: 'CourseTable',
      component: CourseTable
    }
    // ,
    // {
    //   path: 'audit',
    //   name: 'CourseAudit',
    //   component: CouseAudit
    // }
    ]
  }, {
    path: 'adminusers',
    name: 'adminusers',
    component: AddUserForm
  }
  ]
},
{
  path: '/user',
  name: 'User',
  component: changePasswdDialog
}
]

const router = new VueRouter({
  mode: 'history', // base: process.env.BASE_URL,
  routes
})

export default router
