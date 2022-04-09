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
import CourseAudit from '@/components/CourseAudit'
import ClassSelbutton from '@/components/ClassSelButton'
import Account from '@/components/Account'
import ClassroomTable from '@/components/Classtable'
Vue.use(VueRouter)

export const constantRouterMap = [
  {
    path: '/login',
    component: Login,
    name:'登录'
  }
]

export const asyncRouterMap = [{
    path: '/',
    redirect: '/home',
    hidden:true
  },
  {
    path: '/home',
    component: Layout,
    redirect: '/home/hellopage',
    name:'主页',
    meta: {
      requireAuth: true
    },
    children: [{
        path: '/home/hellopage',
        name: 'Hello',
        component: Hello,
      },
      // {
      //   path: 'school',
      // },
      {
        path: 'courses',
        name: 'Courses',
        component: Blank,
        redirect: 'courses/table',
        children: [{
            path: '/home/courses/table',
            name: 'CourseTable',
            component: CourseTable,
            meta: {
              role: ['admin','teacher']
            }
          },
          {
            path: '/home/courses/audit',
            name: 'CourseAudit',
            component: CourseAudit,
            meta: {
              role: ['admin']
            }
          }/* ,{
            path: 'studensel',
            name: 'StuSel',
            component: StuSel,
            meta: {
              role: ['student'],
              selPermmision:true
            }
          }, */
        ]
      }, {
        path: '/home/adminusers',
        name: 'adminusers',
        component: AddUserForm,
        meta: {
          role: ['admin']
        }
      },
      {
        path: 'academic',
        name: 'Academic',
        component: Blank,
        redirect: 'academic/classroomtable',
        meta: {
          role: ['admin']
        },
        children: [
          {
                path: '/home/academic/classroomtable',
                name: 'ClassroomTable',
                component: ClassroomTable
              }
              ,
          {
            path: '/home/academic/classselbutton',
            name: 'ClassSelbutton',
            component: ClassSelbutton,
          }
        ]
      }
    ]
  },
  {
    path: '/user',
    name: 'User',
    component: Layout,
    children:[{
      path:'/user/account',
      component: Account,
      name:'账户'
    }],
    meta: {
      requireAuth: true,
      role:['teacher','student']
    }
  }
]

const router = new VueRouter({
  mode: 'history', // base: process.env.BASE_URL,
  routes:constantRouterMap
})

export default router
