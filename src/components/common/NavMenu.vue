<template>
    <el-menu
      :default-active="'/index'"
      router
      mode="horizontal"
      background-color="white"
      text-color="#222"
      active-text-color="red"
      style="min-width: 1300px">
      <inner-menu :navList="this.navList"></inner-menu>
    </el-menu>
</template>

<script>
import InnerMenu from './innerMenu.vue'

  export default {
    name: 'NavMenu',
    components: {
    InnerMenu
  },
  created(){

},
    data () {
      if(this.$store.state.user_id=='root'){
return {
        navList: [
          //不知道为啥index设成路径可以直接跳转路径
          {path: '/index', name: '首页',icon:null},
          {path: '/admin', name: '管理',icon:null
            ,'children':[
              {
                path:'/admin/adduserform',
                icon:"el-icon-circle-plus-outline",
                name:'添加学生/教师'
              }
            ]},
          {path: '/user', name: '个人中心',icon:null,'children':[
              {
                path:'/user/changepasswd',
                icon:null,
                name:'修改密码'
              }
            ]}
        ]
      }
      }
      else return{
        navList: [
          //不知道为啥index设成路径可以直接跳转路径
          {path: '/index', name: '首页',icon:null},
          {path: '/user', name: '个人中心',icon:null,'children':[
              {
                path:'/user/changepasswd',
                icon:null,
                name:'修改密码'
              }
            ]}
        ]
      }
      
    }
    ,
    methods:{

    }
  }
</script>


