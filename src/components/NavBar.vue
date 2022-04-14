<template>
<div>
  <span>用户名:{{this.$store.state.user_id}},身份:{{this.$store.state.role}}</span>
  <el-dropdown @command="userCommand">
    <i class="el-icon-arrow-down el-icon--right"></i>
  <el-dropdown-menu slot="dropdown">
    <el-dropdown-item v-if="role=='teacher'||role=='student'||role=='sel_student'" command="getAccount">账户信息</el-dropdown-item>
    <el-dropdown-item command="relogin">重新登录</el-dropdown-item>
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
      role:this.$store.state.role,
      }
    }
    ,
    methods:{
      userCommand(command){
        if(command=='getAccount'){
          this.$router.replace("/user/account");
        }
        else if (command=='relogin'){
          this.$router.replace("/login");
        }
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
        margin-top: 34px;
  }
  span{
    height: 100%;
position: absolute;
top: 50%;
transform: translateY(-50%);
}

</style>


