<template>
  <div>
    <el-dialog title="添加用户" :visible.sync="dialogFormVisible" @close="cancel">
      <el-form :model="form" style="text-align: left" ref="form" :rules="rules">
        <el-form-item label="用户角色" :label-width="formLabelWidth" prop="role">
          <el-select v-model="form.role" placeholder="请选择" style="width: 40%">
            <el-option v-for="item in options" :key="item.key" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="学号/工号" :label-width="formLabelWidth" prop="user_id">
          <el-input v-model="form.user_id" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="姓名" :label-width="formLabelWidth" prop="username">
          <el-input v-model="form.username" autocomplete="off" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="身份证号" :label-width="formLabelWidth" prop="id_number">
          <el-input v-model="form.id_number" autocomplete="off" maxlength="18" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="学院/专业" :label-width="formLabelWidth" prop="major_department">
          <el-cascader
              v-model="form.major_department"
              :options="major_department_options"
              :props="{ expandTrigger: 'hover' }"
              @change="handleChange"></el-cascader>
        </el-form-item>
        <el-form-item label="手机号（选填）" :label-width="formLabelWidth" prop="phone_number">
          <el-input v-model="form.phone_number" autocomplete="off" maxlength="11" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="邮箱（选填）" :label-width="formLabelWidth" prop="email">
          <el-input v-model="form.email" autocomplete="off"> </el-input>
        </el-form-item>
        <el-form-item prop="id" style="height: 0">
          <el-input type="hidden" v-model="form.id" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="
            dialogFormVisible = false;
            cancel();
          ">取 消</el-button>
        <el-button type="primary" @click="onSubmit">确 定</el-button>
      </div>
    </el-dialog>
    <footer></footer>
  </div>
</template>
<script>
export default {
  name: "AddUserForm",
  created () {
    this.$axios.get("/org/common/getorgs",{})
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
          this.major_department_options = res2

        }).catch((error) => {
          console.log(error)
    })
  },
  data() {
    const validateUserId1 = (rule, value, callback) => {
      if (this.form.role === "student") {
        /^\d{6}$/.test(value)
          ? callback()
          : callback(new Error("学生学号为6位数字"));
      } else if (this.form.role === "teacher") {
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
      rules: {
        id_number: [
          { required: true, message: "身份证号为必填项", trigger: "blur" },
          {pattern:/^\d{17}[1-9x]$/, message: "身份证号格式错误", trigger: "blur",},
          {
            validator: (rule, value, callback)=>{
               this.resp.id_numberFormat||typeof(this.resp.id_numberFormat)=="undefined"?callback() : callback(new Error("身份证格式错误"));
            },
            trigger: "blur",
          },
          {
            validator: (rule, value, callback)=>{
               this.resp.id_numberUnique||typeof(this.resp.id_numberUnique)=="undefined"?callback() : callback(new Error("身份证号已注册"));
            },
            trigger: "blur",
          }
        ],
        role: [{required: true, message: "请输入用户角色", trigger: "change",},],
        user_id: [
          {required: true, message: "请输入学号/工号", trigger: "blur",},
          {validator: validateUserId1, trigger: "blur",},
          {
            validator: (rule, value, callback)=>{
              ((typeof(this.resp.user_idFormat)=="undefined")||this.resp.user_idFormat)?callback() : callback(new Error("学号/工号格式错误"));
            },
            trigger: "blur",
          },
          {
            validator: (rule, value, callback)=>{
               this.resp.user_idUnique||typeof(this.resp.user_idUnique)==="undefined"?callback() : callback(new Error("学号/工号已注册"));
            },
            trigger: "blur",
          },
        ],
        username: [
          { required: true, message: "请输入姓名", trigger: "blur" },
          {
            pattern: /^[\u4e00-\u9fa5a-zA-Z]+$/,
            message: "姓名仅能出现英文字符与中文字符",
            trigger: "blur",
          },
          {
            validator: (rule, value, callback)=>{
               this.resp.usernameFormat||typeof(this.resp.usernameFormat)=="undefined"?callback() : callback(new Error("用户姓名格式错误"));
            },
            trigger: "blur",
          }
        ],
        phone_number: [
          {
            pattern: /^1\d{10}$/,
            message: "请输入合法手机号",
            trigger: "blur",
          },
          {
            validator: (rule, value, callback)=>{
               this.resp.phone_numberFormat||typeof(this.resp.phone_numberFormat)=="undefined"?callback() : callback(new Error("手机号格式错误"));
            },
            trigger: "blur",
          }
        ],
        email: [
          {
            type: "email",
            message: "请输入正确的e-mail",
            trigger: "blur",
          },
          {
            validator: (rule, value, callback)=>{
               this.resp.emailFormat||typeof(this.resp.emailFormat)=="undefined"?callback() : callback(new Error("e-mail格式错误"));
            },
            trigger: "blur",
          }
        ],
      },
      options: [
        {
          key: "1",
          value: "teacher",
          label: "老师",
        },
        {
          key: "2",
          value: "student",
          label: "学生",
        },
      ],
      dialogFormVisible: true,
      Input2: "",
      form: {
        username: "",
        role: "",
        user_id: "",
        id_number: "",
        phone_number: "",
        email: "",
      },
      formLabelWidth: "120px",
      resp: {
      },
      major_department_options:[],
    };
  },
  methods: {
    clear() {
      this.form = {
        username: "",
        role: "",
        user_id: "",
        id_number: "",
        phone_number: "",
        email: "",
        major_department: "",
        major: "",
        department: ""
      };
    },
      handleChange(value) {
        this.$data.form.major = this.$data.form.major_department[1];
        this.$data.form.department = this.$data.form.major_department[0];
        console.log(this.$data.form.major)
        console.log(this.$data.form.department)
        console.log(value);
      },
    cancel() {
      this.clear();
      this.$router.replace("/users/table");
    },
    onSubmit() {
      this.$axios
        .post("/userinfo/admin/adduser", {
          visitor_id: this.$store.state.user_id,
          username: this.form.username,
          user_id: this.form.user_id,
          id_number: this.form.id_number,
          email: this.form.email,
          role: this.form.role,
          phone_number: this.form.phone_number,
          major: this.form.major,
          department: this.form.department
        })
        .then((resp) => {

          this.resp=resp.data.registerFormat
          if(resp.data === "NO_LOGIN"||resp.data==="NO_AUTHORITY") {
            this.$router.replace("/login")
            this.$message("您不具有此权限");
          }
          else if (resp.data.isOk) {
            this.$message("注册成功");
          } else {
            this.$message("提交失败，请检查表单内容");
          }
          this.$refs["form"].validate((valid) => {
            if (!valid) {
              return false;
            }
          });


        });
    },
  },
};
</script>

<style scoped>

</style>
<style >

</style>