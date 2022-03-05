<template>
  <el-form class="login-container" label-position="left" label-width="0px">
    <h3 class="login_title">系统登录</h3>
    <el-form-item>
      <el-input
        type="text"
        v-model="loginForm.username"
        auto-complete="off"
        placeholder="账号"
      ></el-input>
    </el-form-item>
    <el-form-item>
      <el-input
        type="password"
        v-model="loginForm.password"
        auto-complete="off"
        placeholder="密码"
      ></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" style="width: 100%;
    background: #69a1da;
    border: none" v-on:click="login">登录</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      loginForm: {
        username: "",
        password: "",
      },
      responseResult: [],
    };
  },
  methods: {
    login() {
      this.$axios
        .get(
          "/users/hello" /* , {
            username: this.loginForm.username,
            password: this.loginForm.password
          } */
        )
        .then((successResponse) => {
          console.log(successResponse.data);
          if (1) {
            //访问路由实例,替换当前位置，实现跳转
            this.$router.replace({ path: "/index" });
          }
        })
        .catch((failResponse) => {});
    },
  },
};
</script>

<style scope>
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
    margin: 0px auto 40px auto;
    text-align: center;
    color: #505458;
  }
  el-button{
    width: 100%;
    background: #69a1da;
    border: none
  }

</style>
