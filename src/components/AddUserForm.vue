<template xmlns:background-image="http://www.w3.org/1999/xhtml">
  <div>
    <el-dialog title="添加用户" :visible.sync="dialogFormVisible" @close="clear">
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
          <el-input v-model="form.username" autocomplete="off" maxlength="18" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="身份证号" :label-width="formLabelWidth" prop="id_number">
          <el-input v-model="form.id_number" autocomplete="off" maxlength="18" show-word-limit></el-input>
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
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="onSubmit">确 定</el-button>
      </div>
    </el-dialog>
    <footer></footer>
  </div>
</template>
validate-event
<script>
export default {
  name: "AddUserForm",
  data() {
    // const validateIdNumber = (rule, value, callback) => {
    //   this.$depot.get({
    //     url: "/register",
    //     config: {
    //       params: {
    //         taskName: 1,
    //         userId: 1,
    //       },
    //     },
    //     cb: (res) => {
    //       this.nameOK = res.data == 1 ? true : false;
    //     },
    //   });
    //   if (this.nameOK != false) {
    //     callback();
    //   } else {
    //     callback(new Error("经验证，该项目已存在于数据库中"));
    //   }
    // };

    return {
      rules: {
        role: [
          {
            required: true,
            message: "请输入用户角色",
            trigger: "change",
          }
        ],
        //callback：判断role（可能需要validatefiled，）之后对返回值判断。
        user_id: [
          {
            required: true,
            message: "请输入学号/工号",
            trigger: "blur",
          },
          {
            // validator:
          },
        ],
        username: [
          { required: true, message: "请输入姓名", trigger: "blur" },
          {
            min: 2,
            max: 10,
            message: "长度在 2 到 10 个字符",
            trigger: "blur",
          },
          {
            required: true,
            pattern: /^[\u4e00-\u9fa5_a-zA-Z0-9.·-]+$/,
            message: "姓名不支持特殊字符",
            trigger: "blur",
          },
        ],
        id_number: [
          {
            required: true,
            message: "请输入身份证号",
            trigger: "blur",
          },
          {
            // validator: validateIdNumber,
          },
        ],
        phone_number: [
          {
            pattern: /^((0\d{2,3}-\d{7,8})|(1[3584]\d{9}))$/,
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
          key:'1',
          value: "teacher",
          label: "老师",
        },
        {
          key:'2',
          value: "student",
          label: "学生",
        },
      ],
      dialogFormVisible: true,
      Input2: "",
      form: {
        id: "",
        role: "",
        user_id_suffix: "",
        user_id_append: "",
        user_id: "",
        id_number: "",
        phone_number: "",
        email: "",
      },
      formLabelWidth: "120px",
    };
  },
  methods: {
    clear() {
      this.form = {
        id: "",
        role: "",
        user_id: "",
        id_number: "",
        phone_number: "",
        email: "",
      };
    },
    onSubmit() {
      this.$axios
        .post("/register", {
      username: this.form.id,
      user_id: this.form.user_id,
      id_number: this.form.id_number,
      email: this.form.email,
      role: this.form.role,
      phone_number: this.form.phone_number
        })
        .then((resp) => {
          console.log(resp);
          //   if (resp && resp.status === 200) {
          this.dialogFormVisible = false;
          this.$emit("onSubmit");
          //   }
        });
    },
  },
};
</script>

<style scoped>
.el-icon-circle-plus-outline {
  margin: 50px 0 0 20px;
  font-size: 100px;
  float: left;
  cursor: pointer;
}
</style>
<style >
body {
  background-image: linear-gradient(to right, #4facfe 0%, #00f2fe 100%);
  background-size: 100% 100vh;
}
</style>