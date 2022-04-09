<template>
  <el-dialog title="重设密码" :visible.sync="dialogVisible" width="60%" @close="cancel" :close-on-click-modal='false'>
    <span>
      <el-form :model="changePasswd" style="text-align: left" ref="changePasswd" :rules="rules">
        <el-form-item label="请输入旧密码" prop="oldPassword">
          <el-input id="old" type="password" v-model="changePasswd.oldPassword" :show-password="true"
            auto-complete="off" placeholder="旧密码" style="width: 100%"></el-input>
        </el-form-item>
        <br />
        <el-form-item label="请输入新密码" prop="newPassword">
          <el-input id="new" type="password" v-model="changePasswd.newPassword" auto-complete="off" placeholder="新密码"
            :show-password="true" style="width: 100%"></el-input>
        </el-form-item>
        <br />
        <el-form-item label="请再次输入新密码" prop="confirmPassword">
          <el-input id="conf" type="password" :show-password="true" v-model="changePasswd.confirmPassword"
            auto-complete="off" placeholder="再次输入" style="width: 100%"></el-input>
        </el-form-item>
        <br />
        <div id="tips"></div>
      </el-form>
    </span>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false;cancel()">取 消</el-button>
      <el-button id="button" type="primary" @click="onSubmit">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: "changePasswdDialog",
  props:['visible'],
  watch:{
    visible:function(newval){
      this.dialogVisible=newval
    }
  },
  created(){
    if(this.$store.state.first_login) this.$message.info("初次登录，请重置密码")
    this.changePasswd.user_id=this.$store.state.user_id
    console.log(this.$store.state.user_id)
  },
  data() {
    var validatePass2 = (rule, value, callback) => {
      if (this.changePasswd.confirmPassword === "") {
        callback(new Error("请再次输入密码"));
      }
      if (this.changePasswd.confirmPassword !== this.changePasswd.newPassword) {
        callback(new Error("两次输入密码不一致"));
      } else {
        callback();
      }
    };

    return {
      dialogVisible: false,
      changePasswd: {
        user_id: '',
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      },
      rules: {
        oldPassword: [
          {
            required: true,
            message: "旧密码为必填项",
            trigger: "blur",
          },
        ],
        newPassword: [
          { required: true, message: "新密码为必填项", trigger: "blur" },
          { min: 6, max: 32, message: "长度在 6 到 32 个", trigger: "blur" },
          {
            pattern: /^(?![\d]+$)(?![a-zA-Z]+$)(?![-_]+$)[\da-zA-Z-_]{6,32}$/,
            message: "字母，数字或者特殊字符（-_）至少包含两种",
            trigger: "blur",
          },
        ],
        confirmPassword: [
          { required: true, message: "请确认密码", trigger: "blur" },
          { validator: validatePass2, trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    clear() {
      this.changePasswd = {
        user_id: "",
        old_passwd: "",
        new_passwd: "",
        confirmPassword:''
      };
    },
    cancel(e) {
      this.clear();
      this.$emit('dialogclose')
      this.dialogVisible=false
    },
    formatData() {
      let data = new FormData();
      
      return data;
    },
    onSubmit() {
      const data = this.formatData();
      if(this.changePasswd.confirmPassword !== this.changePasswd.newPassword){
        this.$message.info("提交失败")
        return
      }
      this.$axios.post("/change_passwd", {
          visitor_id: this.changePasswd.user_id,
          old_passwd: this.changePasswd.oldPassword,
          new_passwd: this.changePasswd.newPassword
        })
        .then((resp) => {

          if (resp.data.change_approved) {
            this.visible = false;
            this.$store.commit('first_login_func',false)
            this.$router.replace("/home");
          } else if (!resp.data.old_passwd_correct){
            this.$message.info("旧密码错误")
          } else if (!resp.data.passwdFormat.legal) {
            const format = resp.data.passwdFormat;
            if (format.too_long) this.$message.info("新密码太长")
            else if (format.too_short) this.$message.info("新密码太短")
            else if (format.too_simple) this.$message.info("新密码太简单，字母，数字或者特殊字符（-_）至少包含两种。")
          }
        });
    },
  },
};
</script>

<style scoped>
</style>