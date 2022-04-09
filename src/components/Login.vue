<template>
<div>
  <el-form class="login-container" label-position="left" label-width="0px">
    <h3 class="login_title">系统登录</h3>
    <el-form-item>
      <el-input
        type="text"
        v-model="loginForm.user_id"
        auto-complete="off"
        placeholder="账号"
        class="grid-content"
        style="width: 100%"
      ></el-input>
    </el-form-item>
    <br />
    <el-form-item>
      <el-input
        type="password"
        v-model="loginForm.password"
        :show-password="true"
        auto-complete="off"
        placeholder="密码"
        style="width: 100%"
      ></el-input>
    </el-form-item>
    <br />
    <el-form-item STYLE="width: 100%">
      <el-button
        type="primary"
        style="width: 50%; background: #505458; border: none"
        round
        v-on:click="login"
        class="Typography"
        >登录</el-button
      >
    </el-form-item>
  </el-form>
    <!-- :visible="reset_passwd_needed" -->
</div>
</template>
<script>
export default {
  name: "Login",
  data() {
    return {
      loginForm: {
        user_id: "",
        password: "",
        role:''
      },
      responseResult: [],
      reset_passwd_needed:false,
      ip:""
    };
  },//:data
  mounted(){},
  methods: {
    login() {
      //todo 通过调用后端接口获取用户角色信息
      this.$axios
      .post("/login", {
        visitor_id: this.loginForm.user_id,
        passwd:this.loginForm.password,
        login_url:'127.0.0.1',
      })
      .then((response) => {
        console.log(response)
        const success_login=response.data.login_approved
        const first_login=(response.data.passwd_check===false)
        this.loginForm.role=response.data.role
        if (success_login) {
          this.$store.commit("login", this.loginForm.user_id)
          this.$store.commit("role",this.loginForm.role)
          this.$store.dispatch('GenerateRoutes', this.loginForm.role).then(() => { // 生成可访问的路由表
            this.$store.state.addRouters.forEach((route)=>{
              if (!this.$router.hasRoute(route)){
              this.$router.addRoute(route) // 动态添加可访问路由表

              }
            })
          })
          if(first_login) this.$store.commit('first_login_func',true)
          var path = this.$route.query.redirect;
          this.$router.replace({path: path === "/" || path === undefined ? "/home" : path});
        }

        else if(typeof response.data.find_id !="undefined"        && !response.data.find_id) this.$message.info("学号/工号填写错误");
        else if(typeof response.data.passwd_correct !="undefined" && !response.data.passwd_correct) this.$message.info("密码错误");
        else if(typeof response.data.repeat_login !="undefined"   && !response.data.repeat_login) this.$message.info("该账号异地登录");
        else this.$message.info("登陆失败！");
      }).catch((failResponse) => {console.log(failResponse)});
    }
  }//:method
}



</script>

<style scoped>
.login-container {
  border-radius: 15px;
  background-clip: padding-box;
  margin: 90px auto;
  width: 350px;
  padding: 35px 35px 15px 35px;
  background: #fff;
  border: 1px solid #eaeaea;
  box-shadow: 0 0 25px #cac6c6;
}

.login_title {
  margin: 0 auto 40px auto;
  text-align: center;
  color: #505458;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.Typography {
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB",
    "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
  color: white;
}
/* body {
  background-image: linear-gradient(to right, #4facfe 0%, #8ee1ff 100%);
  background-size: 100% 100vh;
} */
</style>