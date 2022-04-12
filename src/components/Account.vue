<template>
<div >
  <user-form :formdata_prop="form"/>
      <div slot="footer" class="dialog-footer" style="text-align: center">
        <el-button  type="primary" @click="SubmitEdit">修改个人信息</el-button>
        <el-button  type="primary" @click="change_passwd">修改密码</el-button>
      </div>
      <change-passwd-dialog :visible="dialogVisible" @dialogclose='dialogclose'/>
</div>
</template>

<script>
import ChangePasswdDialog from '@/components/ChangePasswdDialog.vue';
import UserForm from './UserForm.vue';
export default {
  components: { ChangePasswdDialog, UserForm },
    name:'Account',
 data() {
    return {
      dialogVisible:false,
    role:this.$store.state.role,
      form:{
        username: "",
        role: "",
        user_id: "",
        id_number: "",
        phone_number: "",
        email: "",
        major_department: [],
        major: "",
        department: ""
      },
    };
  },
  created(){
    this.$axios.get('/userinfo/common/getuserinfo').then((resp)=>{
      console.log(resp.data);
      this.form=resp.data
      this.form.major_department=Array.from([resp.data.department,resp.data.major])
    })
  },
  methods: {
    dialogclose(){
      console.log('dialog close')
      this.dialogVisible=false
    },
    clear() {
      this.form = {
        username: "",
        role: "",
        user_id: "",
        id_number: "",
        phone_number: "",
        email: "",
        major_department: [],
        major: "",
        department: ""
      };
    },
    cancel() {
      this.clear();
      this.$router.replace("/");
    },
    change_passwd(){
      this.dialogVisible=false
      this.dialogVisible=true
    },
    SubmitEdit() {
        this.$axios.get('/userinfo/user/altemailandphone?email='+this.form.email+'&phone='+this.form.phone_number).then((resp)=>{
          if(resp.data){
            this.$message("修改成功");
          }
          else{
            this.$message("修改失败，请检查表单内容");
          }
        })
    },
  },
};

</script>

<style scoped>
 .el-input{
   width: 30%;
 }
</style>