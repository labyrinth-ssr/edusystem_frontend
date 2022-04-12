import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/components/Login'
import Layout from '@/components/Layout'
import CourseTable from '@/components/CourseTable'
import CourseAudit from '@/components/CourseAudit'
import ClassSelbutton from '@/components/ClassSelButton'
import Account from '@/components/Account'
import ClassroomTable from '@/components/Classtable'
import MajorManage from '@/components/MajorManage'
import MemTable from '@/components/MemTable'
import AddUserForm from '@/components/AddUserForm'
import FileUpload from '@/components/FileUpload'



Vue.use(VueRouter)

// const originalPush = VueRouter.prototype.push
// const originalReplace = VueRouter.prototype.replace
// // push
// VueRouter.prototype.push = function push (location, onResolve, onReject) {
//   if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
//   return originalPush.call(this, location).catch(err => err)
// }
// // replace
// VueRouter.prototype.replace = function push (location, onResolve, onReject) {
//   if (onResolve || onReject) return originalReplace.call(this, location, onResolve, onReject)
//   return originalReplace.call(this, location).catch(err => err)
// }

export const constantRouterMap = [
  {
    path: '/login',
    component: Login,
    name:'登录'
  }
]

export const asyncRouterMap = [
      {
        path: '/',
        name: '首页',
        component: Layout,
        meta: {
          role: ['admin','teacher','student','sel_student']
        }
      },
      {
        path: '/school',
        name: '学院专业',
        component: Layout,
        meta: {
          role: ['admin']
        },
        redirect: '/department/table',
        children: [{
            path: '/department/table',
            name: '学院专业列表',
            component: MajorManage,
            meta: {
              role: ['admin']
            }
          }
        ]
      },
      {
        path: '/users',
        name: '用户',
        component: Layout,
        redirect: '/users/table',
        meta: {
          role: ['admin']
        },
        children: [{
            path: '/users/table',
            name: '用户列表',
            component: MemTable,
            meta: {
              role: ['admin']
            }
          },
          {
            path: '/users/adduserform',
            component: AddUserForm,
            name:'',
            meta: {
              role: ['admin']
            }
          },
          {
            path: '/users/addusercsv',
            component: FileUpload,
            name:'',
            meta: {
              role: ['admin']
            }
          }
        ]
      },
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
              role: ['admin','teacher','sel_student']
            }
          },
          {
            path: '/courses/audit',
            name: '课程申请列表',
            component: CourseAudit,
            meta: {
              role: ['admin']
            }
          }
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
        path: '/academic',
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
      role:['teacher','student','sel_student']
    }
  }
]

const router = new VueRouter({
  mode: 'history', // base: process.env.BASE_URL,
  routes:constantRouterMap
})

export default router
