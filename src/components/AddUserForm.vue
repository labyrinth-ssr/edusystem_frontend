<template xmlns:background-image="http://www.w3.org/1999/xhtml">
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
validate-event
<script>
export default {
  name: "AddUserForm",
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
    const validateUserId2 = (rule, value, callback) => {
      this.$axios.get("/register/user_id/" + this.form.user_id).then((resp) => {
        resp.data ? callback() : callback(new Error("该学号/工号已注册"));
      });
    };
    const validateIdNum = (rule, value, callback) => {
      this.$axios
        .get("/register/id_number/" + this.form.id_number)
        .then((resp) => {
          resp.data ? callback() : callback(new Error("该身份证号已注册"));
        });
    };
    return {
      rules: {
        id_number: [
          {
            min: 18,
            max: 18,
            message: "身份证长度必须为18位",
            trigger: "blur",
          },
          { required: true,
            message: "身份证号为必填项",
            trigger: "blur" ,
          },
          {
            validator: validateIdNum,
            trigger: "blur",
          }
        ],
        role: [
          {
            required: true,
            message: "请输入用户角色",
            trigger: "change",
          },
        ],
        user_id: [
          {
            required: true,
            message: "请输入学号/工号",
            trigger: "blur",
          },
          {
            validator: validateUserId1,
            trigger: "blur",
          },
          {
            validator: validateUserId2,
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
        ],
        phone_number: [
          {
            /*
            中国电信号段
            133、153、173、177、180、181、189、190、191、193、199
            中国联通号段
            130、131、132、145、155、156、166、167、171、175、176、185、186、196
            中国移动号段
            134(0-8)、135、136、137、138、139、1440、147、148、150、151、152、157、158、159、172、178、182、183、184、187、188、195、197、198
            ————————————————
            版权声明：本文为CSDN博主「bcdon」的原创文章，遵循CC 4.0 BY-SA版权协议，转载请附上原文出处链接及本声明。
            原文链接：https://blog.csdn.net/qq_35293533/article/details/122779708*/
            pattern: /^1(3[0-9]|4[4578]|5[0-35-9]|7[1-35-8]|8[0-9]|9[0135-9])\d{8}$/,
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
      };
    },
    cancel() {
      this.clear();
      this.$router.replace("/index");
    },
    onSubmit() {
      this.$axios
        .post("/register", {
          username: this.form.username,
          user_id: this.form.user_id,
          id_number: this.form.id_number,
          email: this.form.email,
          role: this.form.role,
          phone_number: this.form.phone_number,
        })
        .then((resp) => {
          if (resp.data) {
            this.$router.replace("/index");
          } else {
            this.$message("提交失败，请检查表单内容");
          }
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