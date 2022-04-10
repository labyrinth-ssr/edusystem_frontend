import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/components/Login'
import Layout from '@/components/Layout'
import CourseTable from '@/components/CourseTable'
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
    name:'init'
  },
  // {
  //   path: '/home',
  //   component: Layout,
  //   redirect: '/home/hellopage',
  //   name:'主页',
  //   meta: {
  //     requireAuth: true
  //   },
  //   children: [
      {
        path: '/home',
        name: '首页',
        component: Layout,
      },
      // {
      //   path: 'school',
      // },
      {
        path: '/courses',
        name: '课程',
        component: Layout,
        redirect: '/courses/table',
        children: [{
            path: '/courses/table',
            name: '课程列表',
            component: CourseTable,
            meta: {
              role: ['admin','teacher']
            }
          },
          {
            path: '/courses/audit',
            name: '课程申请列表',
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
      }, 
      // {
      //   path: '/adminusers',
      //   name: '用户管理',
      //   component: AddUserForm,
      //   meta: {
      //     role: ['admin']
      //   }
      // },
      {
        path: 'academic',
        name: '教务管理',
        component: Layout,
        redirect: '/academic/classroomtable',
        meta: {
          role: ['admin']
        },
        children: [
          {
                path: '/academic/classroomtable',
                name: '教务列表',
                component: ClassroomTable
              }
              ,
          {
            path: '/academic/classselbutton',
            name: '权限开关',
            component: ClassSelbutton,
          }
        ]
      },
    // ]
  // },
  {
    path: '/user',
    name: '个人中心',
    component: Layout,
    redirect:'/user/account',
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
