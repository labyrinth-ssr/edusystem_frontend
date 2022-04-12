<template>
<div >
  <el-form :model="form" style="text-align: left" ref="form" :rules="rules" >
        <el-form-item  label="用户角色" :label-width="formLabelWidth" prop="role">
          <el-select :disabled="action==='user_edit'||action==='admin_add'" v-model="form.role" placeholder="请选择" >
            <el-option v-for="item in options" :key="item.label" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="学号/工号" :label-width="formLabelWidth" prop="user_id">
          <el-input :disabled="action==='user_edit'||action==='admin_add'" v-model="form.user_id" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item  label="姓名" :label-width="formLabelWidth" prop="username">
          <el-input :disabled="action=='user_edit'" v-model="form.username" autocomplete="off" show-word-limit></el-input>
        </el-form-item>
      <el-form-item label="学院/专业" :label-width="formLabelWidth" prop="major_department">
        <el-cascader
            :disabled="action=='user_edit'"
        v-model="form.major_department"
            :options="major_department_options"
            :props="{ expandTrigger: 'hover' }"
            @change="handleChange"></el-cascader>
      </el-form-item>
        <el-form-item label="身份证号" :label-width="formLabelWidth" prop="id_number">
          <el-input :disabled="action=='user_edit'" v-model="form.id_number" autocomplete="off" maxlength="18" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="手机号（选填）" :label-width="formLabelWidth" prop="phone_number">
          <el-input v-model="form.phone_number" autocomplete="off" maxlength="11" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="邮箱（选填）" :label-width="formLabelWidth" prop="email">
          <el-input v-model="form.email" autocomplete="off"> </el-input>
        </el-form-item>
    <el-form-item label="状态" :label-width="formLabelWidth" prop="status">
      <el-select :disabled="action=='user_edit'"  v-model="form.status" placeholder="请选择状态">
        <template v-for="item1 in status_list">
          <el-option :label="item1" :value="item1"></el-option>
        </template>
      </el-select>
    </el-form-item>
      </el-form>
<!--      <div slot="footer" class="dialog-footer" style="text-align: center">-->
<!--        <el-button v-if="action=='admin_add'" @click="-->
<!--            dialogFormVisible = false;-->
<!--            cancel();-->
<!--          ">取 消</el-button>-->
<!--        <el-button v-if="action=='admin_add'" type="primary" @click="SubmitAdd">添加/修改</el-button>-->
<!--        <el-button v-if="action=='user_edit'" type="primary" @click="SubmitEdit">修改</el-button>-->
<!--        <el-button v-if="action=='user_edit'" type="primary" @click="change_passwd">修改密码</el-button>-->
<!--      </div>-->
<!--      <change-passwd-dialog :visible="dialogVisible" @dialogclose='dialogclose'/>-->
</div>
</template>

<script>
// import ChangePasswdDialog from '@/components/ChangePasswdDialog.vue';
export default {
//   components: { ChangePasswdDialog },
    name:'UserForm',
    props:['formdata_prop','action_prop'],
    data() {
    const validateUserId1 = (rule, value, callback) => {
      if (this.form.role == "student") {
        /^\d{6}$/.test(value)
          ? callback()
          : callback(new Error("学生学号为6位数字"));
      } else if (this.form.role == "teacher") {
        /^\d{8}$/.test(value)
          ? callback()
          : callback(new Error("教师工号为8位数字"));
      } else {
        /^(\d{6}|\d{8})$/.test(value)
          ? callback()
          : callback(new Error("学号/工号为6位或8位数字"));
      }
    };
    return {
      role:this.$store.state.role,
      rules: {
        id_number: [
          { required: true, message: "身份证号为必填项", trigger: "blur" },
          {pattern:/^\d{17}[1-9x]$/, message: "身份证号格式错误", trigger: "blur",},
        ],
        role: [{required: true, message: "请输入用户角色", trigger: "change",},],
        user_id: [
          {required: true, message: "请输入学号/工号", trigger: "blur",},
          {validator: validateUserId1, trigger: "blur",},

        ],
        username: [
          { required: true, message: "请输入姓名", trigger: "blur" },
          {
            pattern: /^[\u4e00-\u9fa5a-zA-Z]+$/,
            message: "姓名仅能出现英文字符与中文字符",
            trigger: "blur",
          },
        ],
        phone_number: [
          {
            pattern: /^1\d{10}$/,
            message: "请输入合法手机号",
            trigger: "blur",
          },
        ],
        email: [
          {
            type: "email",
            message: "请输入正确的e-mail",
            trigger: "blur",
          },
        ],
      },
      options: [
        {
          value: "teacher",
          label: "老师",
        },
        {
          value: "student",
          label: "学生",
        },
      ],
      dialogFormVisible: true,

      form: {
        username: "",
        role: "",
        user_id: "",
        id_number: "",
        phone_number: "",
        email: "",
        major_department: "",
        major: "",
        department: "",
        status: "",
      },
      formLabelWidth: "120px",
      action:'user_edit',
      major_department_options:[],
      status_list:[]
    };
  },
  watch:{
      formdata_prop:function(newval){
          this.form=newval
    },
    action_prop:function(newval){
          this.action=newval
      console.log(newval)
    }
  },
  created(){
    console.log(this.formdata_prop)
    this.$axios.get("/org/admin/getorgs",{})
        .then(response => {
          console.log(response.data)
          var res = {}
          var res2 = []
          response.data.forEach(element => {
            if (element.department in res) {
              if ('children' in res[element.department]) {
                res[element.department].children.push({label:element.major,value:element.major})
              }
            } else res[element.department] = {
              children: [{label:element.major,value:element.major}]
            }
          });
          Object.keys(res).forEach((key) => {
            res2.push({
              label: key,
              value:key,
              children: res[key].children
            })
          })
          console.log(res2)
          // const list = Array.from(response.data).map(item1 =>({
          //     value: item1.department,
          //     label: item1.department,
          //     children:
          //     Array.from(response.data).map((item)=> {
          //         if(item.department === item1.department)
          //         {
          //           return({
          //             value: item.major,
          //             label: item.major
          //           })
          //         }
          //       })
          // }));
          // console.log(list)
          this.major_department_options = res2

        }).catch((error) => {
      console.log(error)
    })

    this.form=this.formdata_prop
    if(this.$store.state.role==='admin')
    {
      this.action=this.action_prop
    }
    console.log("act=",this.action_prop)
    this.form.major_department=Array.from([this.form.department, this.form.major])
    if (this.form.role =="teacher"){
      this.$axios.get("/userinfo/admin/getStatusList/teacher",)
          .then((response)=>{
            this.status_list = Array.from(response.data)
            console.log(response.data)
          })
    }else if (this.form.role == "student"){
      this.$axios.get("/userinfo/admin/getStatusList/student")
          .then((response)=>{
            this.status_list = response.data.slice()
            console.log(response.data)
          })
    }else if(this.form.role == "admin"){
      this.$axios.get("/userinfo/admin/getStatusList/admin")
          .then((response)=>{
            this.status_list = Array.from(response.data)
            console.log(response.data)
          })
    }
    if(this.$store.state.role!=='admin')
    {
      this.action = 'user_edit'
    }
    console.log(this.status_list)
  },
  methods: {
    clearUserForm() {
      this.form = {
        username: "",
        role: "",
        user_id: "",
        id_number: "",
        phone_number: "",
        email: "",
        major_department: "",
        major: "",
        department: "",
        status: "",
      };
    },
    handleChange(value) {
      this.$data.form.major = this.$data.form.major_department[1];
      this.$data.form.department = this.$data.form.major_department[0];
      console.log(this.$data.form.major)
      console.log(this.$data.form.department)
      console.log(value);
    }
  },

};

</script>

<style scoped>
 .el-input{
   width: 350px;
 }
</style>