import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/components/Login'
import Layout from '@/components/Layout'
import CourseTable from '@/components/CourseTable'
import CourseAudit from '@/components/CourseAudit'
import ClassSelbutton from '@/components/ClassSelButton'
import Account from '@/components/Account'
import ClassroomTable from '@/components/Classtable'
import ClassroomTable0 from '@/components/Classtable0'
import MajorManage from '@/components/MajorManage'
import MemTable from '@/components/MemTable'
import AddUserForm from '@/components/AddUserForm'
import FileUpload from '@/components/FileUpload'
import DepartmentForm from "@/components/DepartmentForm"
import CourseSelect from "@/components/CourseSelect"
import  MyCourseSelect from "@/components/MyCourse"
import MyCourse from "@/components/MyCourse";
import OneCourse from "@/components/OneCourse";


Vue.use(VueRouter)

export const constantRouterMap = [
  {
    path: '/login',
    component: Login,
    name:'登录'
  },
  // {
  //   path: '/',
  //   name: '首页',
  //   component: Layout,
  //   meta: {
  //     role: ['admin','teacher','student']
  //   }
  // },
]

export const asyncRouterMap = [
      {
        path: '/',
        name: '首页',
        component: Layout,
        meta: {
          role: ['admin','teacher','student']
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
          },
        {
            path: '/department/addform',
            component: DepartmentForm,
            name:'',
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
        meta: {
          role: ['admin','teacher','student']
        },
        children: [
            {
            path: '/courses/mycourse',
            name: '我的课程',
            component:MyCourse,
            meta: {
                role: ['teacher','student']
                }
            },
            {
                path: '/courses/mycourseView/:courseId',
                name: '',
                component:OneCourse,
                meta: {
                    role: ['teacher','student','admin'],
                }
            },
            {
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
          },{
            path: '/courses/select',
            name: '选课',
            component: CourseSelect,
            meta: {
              role: ['student']
            }
          }
        ]
      }, 
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
          },
          {
            path: '/academic/classroomtable0',
            name: '课程表',
            component: ClassroomTable0
          }
        ]
      },
  {
<<<<<<< HEAD
    path: '/admin/orgmanage',
    name: 'OrgManage',
    component: MajorManage,
  },
  {
    path: '/user/changepasswd',
    name: 'ChangePasswd',
    component: changePasswdDialog,
    // meta: {
    //   requireAuth: true
    // }
  },
  {
    path: '/admin/getusers',
    name: 'Notice_A_test',
    component: Notice_A_test
  },
  {
    path: '/admin/upload',
    name: "fileUpload",
    component: FileUpload
=======
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
>>>>>>> 36a2b848bd8a97152a40f9c21b7198da82c6e535
  }
]

const router = new VueRouter({
  mode: 'history', // base: process.env.BASE_URL,
  routes:constantRouterMap
})

export default router
