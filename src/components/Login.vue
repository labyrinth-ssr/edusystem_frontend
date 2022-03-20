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
import store from '../store'
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
  },
  mounted(){
  },
  methods: {
    login() {
      if(this.loginForm.user_id=='root'){
        this.loginForm.role='admin'
      }
      else{
      this.loginForm.role= this.loginForm.user_id.length==6?'student':'teacher'
      }

      // let data = new FormData();
      // data.append("visitor_id", this.loginForm.user_id);
      // data.append("passwd",this.loginForm.password);
      // data.append("login_url",'127.0.0.1')
      // data.append("role",this.loginForm.role)
      // this.$axios
      //   .post("/login", data,{
      //     headers: {
 	    //         "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
 	    //       }
      //   })

        this.$axios
        .post("/login", {
          visitor_id: this.loginForm.user_id,
          passwd:this.loginForm.password,
          login_url:'127.0.0.1',
          role:this.loginForm.role,
        })
        .then((response) => {
          console.log(response)
          const success_login=response.data.login_approved
          const first_login=(response.data.passwd_check===false)
          if (success_login) {
            // console.log(first_login)
            // this.$store.user_id = this.loginForm.user_id
            store.user_id = this.loginForm.user_id;
            store.role = this.loginForm.role;
            this.$store.commit("login", this.loginForm.user_id)
            this.$store.commit("role",this.loginForm.role)
            if(first_login){
              this.$store.commit('first_login_func',true)
            }
            var path = this.$route.query.redirect;
            this.$router.replace({
              path: path === "/" || path === undefined ? "/index" : path,
            });
          }
          else if(typeof response.data.find_id !="undefined" && !response.data.find_id){
            this.$message.info("学号/工号填写错误");
          }
          else if(typeof response.data.passwd_correct !="undefined"&&!response.data.passwd_correct){
            this.$message.info("密码错误");
          }
          else if(typeof response.data.repeat_login !="undefined"&&!response.data.repeat_login){
            this.$message.info("该账号异地登录");
          }
          else{
            this.$message.info("登陆失败！");
          }
    })
    .catch((failResponse) => {console.log(failResponse)});
  }

  }}
</script>

<style>
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
body {
  background-image: linear-gradient(to right, #4facfe 0%, #00f2fe 100%);
  background-size: 100% 100vh;
}
</style>