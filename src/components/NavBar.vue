<template>
<div>
  <el-dropdown @command="changepasswd">
    <i class="el-icon-arrow-down el-icon--right"></i>
  <el-dropdown-menu slot="dropdown">
    <el-dropdown-item v-if="role=='teacher'||role=='student'" @click="changepasswd">修改密码</el-dropdown-item>
  </el-dropdown-menu>
</el-dropdown>
<img loading="lazy" src="https://img0.baidu.com/it/u=2936316438,1380992198&fm=253&fmt=auto&app=138&f=JPEG?w=400&h=400"/>

</div>
</template>

<script>

  export default {
    name: 'NavMenu',

  created(){
    console.log(this.$store.state.role)
},
    data () {
      return{
      role:this.$store.state.role

      }
    }
    ,
    methods:{
      changepasswd(){
        this.$router.replace("/user");
        console.log(this.$router)
      }
    }
  }
</script>
<style scoped>
#navMenu{
  background-color: aliceblue;
}
  .el-dropdown-link {
    cursor: pointer;
    color: #409EFF;
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }
    img{
    width: 50px;
    min-width: 50px;
    height: 50px;
    border-radius: 25px;
    float: right;
  }
  .el-dropdown{
    float: right;
    bottom: 0px;
  }

</style>


