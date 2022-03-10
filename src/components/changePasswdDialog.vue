<template>
        <el-dialog
        title="提示"
        :visible.sync="visible"
        width="60%"
        >
      <span>
        <el-form :model="changePasswd" style="text-align: left" ref="changePasswd" :rules="rules">
          <el-form-item label="请输入旧密码" prop="oldPassword">
            <el-input
                id = 'old'
                type="password"
                v-model="changePasswd.oldPassword"
                auto-complete="off"
                placeholder="旧密码"
                style="width: 100%"
            ></el-input>
          </el-form-item>
          <br>
          <el-form-item label="请新输入新密码" prop="newPassword">
            <el-input
                id = 'new'
                type="password"
                v-model="changePasswd.newPassword"
                auto-complete="off"
                placeholder="新密码"
                style="width: 100%"
            ></el-input>
          </el-form-item>
          <br>
          <el-form-item label="请再次输入新密码" prop="confirmPassword">
            <el-input
                id = 'conf'
                type="password"
                v-model="changePasswd.confirmPassword"
                auto-complete="off"
                placeholder="再次输入"
                style="width: 100%"
            ></el-input>

          </el-form-item>
          <br>
          <div id="tips"></div>
          </el-form>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button id="button" type="primary" @click="onSubmit" >确 定</el-button>
      </span>
    </el-dialog>
</template>

<script>
export default {
  name: "changePasswdDialog",
  props:['visible','user_id'],
  beforeUpdate(){
    this.dialogVisible=this.visible
  },
  data() {
     var validatePass = (rule, value, callback) => {
        if (this.changePasswd.newPassword === '') {
                callback(new Error('请输入密码'));
        } else {
          // if (this.changePasswd.confirmPassword !== '') {
          //     this.$refs.dataForm.validateField('confirmPassword');
          // }
          callback();}
      };
      var validatePass2 = (rule, value, callback) => {
         if (this.changePasswd.confirmPassword === '') {
              callback(new Error('请再次输入密码'));
          }
          if (this.changePasswd.confirmPassword !== this.changePasswd.newPassword) {
            console.log(this.changePasswd.newPassword)

              callback(new Error('两次输入密码不一致!'));
          } else {
              callback();
          }
      };
    return {
      dialogVisible: this.visible,
      changePasswd: {
        user_id:this.user_id,
        oldPassword: '',
        newPassword: '',
        confirmPassword:''},
        rules: {
          newPassword: [
            // { required: true, message: '请输入', trigger: 'blur' },
            { validator: validatePass, trigger: 'blur', required: true}
          ],
          confirmPassword:[
            // { required: true, message: '请确认密码', trigger: 'blur' },
            //这里不知道为啥不能用rules判断，value没有值，只能自定义函数了
            { validator: validatePass2, trigger: 'blur', required: true }
          ]
        }
    }
  },
  methods: {
    onSubmit() {
      let data = new FormData();
//       String visitor_id;//user_id
// String old_passwd;
// String new_passwd;
console.log(this.changePasswd,this.user_id)
      data.append('visitor_id',this.user_id)
      data.append('old_passwd',this.changePasswd.oldPassword)
      data.append('new_passwd',this.changePasswd.newPassword)
      this.$axios
        .post("/change_passwd", data,{
          headers: {
 	            "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
 	          }
        })
        .then((resp) => {
          console.log(resp);
          //   if (resp && resp.status === 200) {
          this.dialogVisible = false;
          //   }
        });
    }
    // handleClose(done) {
    //   this.$confirm('确认更改？')
    //   .then(_=>{
    //         done();
    //       }
    //   ).catch(_=>{});
    // },
  }
}
</script>

<style scoped>

</style>