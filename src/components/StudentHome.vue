<template>
  <div >
    <div class="line"></div>
    <el-menu
        :default-active="activeIndex2"
        class="el-menu-demo"
        mode="horizontal"
        @select="handleSelect"
        background-color="#409EFF"
        active-text-color="#ffd04b">
      <el-menu-item index="1">查看信息</el-menu-item>
      <el-submenu index="2" text-color="#ffd04b" >
        <template slot="title"><i class="el-icon-circle-plus-outline"/>选课</template>
        <el-menu-item index="2-1" >学生/老师</el-menu-item>
        <!--      <el-menu-item index="2-2">教师</el-menu-item>-->
        <el-menu-item index="2-3">课程</el-menu-item>
      </el-submenu>
      <el-menu-item index="3" text-color="#ffd04b" >消息中心</el-menu-item>
    </el-menu>
    <el-button type="text" @click="dialogVisible = true">修改密码 Dialog</el-button>
    <el-dialog
        title="提示"
        :visible.sync="dialogVisible"
        width="60%"
        :before-close="handleClose">
      <span>
        <el-form v-model="changePasswd" style="text-align: left" ref="dataForm" :rules="rules">
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
        <el-button id="button" type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>

</template>

<script>
export default {
  name: "studentHome",
  created(){
    bus.$on('reset_passwd_need',(val)=>{
      this.dialogVisible=true
    })
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
      activeIndex: '1',
      activeIndex2: '1',
      dialogVisible: false,
      changePasswd: {
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
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(done) {
      this.$confirm('确认更改？')
      .then(_=>{
            done();
          }
      ).catch(_=>{});
    },
  }
}
</script>

<style scoped>
.myStuMenu{
  text-color:"#000000";
  active-text-color:"#ffffff";
  background-color: #4facfe;
}
</style>