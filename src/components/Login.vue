<template>
  <el-form class="login-container" label-position="left" label-width="0px">
    <h3 class="login_title">系统登录</h3>
    <el-form-item>
      <el-input
        type="text"
        v-model="loginForm.username"
        auto-complete="off"
        placeholder="账号"
        class="grid-content"
        style="width: 100%"
      ></el-input>
    </el-form-item>
    <br>
    <el-form-item>
      <el-input
        type="password"
        v-model="loginForm.password"
        auto-complete="off"
        placeholder="密码"
        style="width: 100%"
      ></el-input>
    </el-form-item>
    <br>
    <el-form-item STYLE="width: 100%">
      <el-button
        type="primary"
        style="width: 50%; background: #505458; border: none"
        round
        v-on:click="login"
        class="Typography "
        >登录</el-button>
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
      var _this = this;
      console.log(this.$store.state);
/*       this.$axios
        .post("/login", {
          username: this.loginForm.username,
          password: this.loginForm.password,
        })
        .then((successResponse) => { */
        var success_login=true
          if (success_login) {
            _this.$store.commit("login", _this.loginForm);
            var path = this.$route.query.redirect;
            this.$router.replace({
              path: path === "/" || path === undefined ? "/admin" : "/admin",
              // 没有路径就保持原页面，这边待定
              //修改了一下做测试
            });
          }
/*         })
        .catch((failResponse) => {}); */
    },
  },
};
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
.Typography{
  font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
  color: white;

}
</style>
