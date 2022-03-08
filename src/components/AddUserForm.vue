<template xmlns:background-image="http://www.w3.org/1999/xhtml">
  <div >
    <!-- <i class="el-icon-circle-plus-outline"  @click="dialogFormVisible = true"></i> -->
    <el-dialog
      title="添加用户"
      :visible.sync="dialogFormVisible"
      @close="clear">
      <el-form v-model="form" style="text-align: left" ref="dataForm">
        <el-form-item label="用户角色" :label-width="formLabelWidth" prop="role">
            <el-select v-model="form.role" placeholder="请选择" style="width: 20%">
              <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
              </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="学号/工号" :label-width="formLabelWidth" prop="user_id">
          <el-date-picker
              v-model="form.user_id_suffix"
              style="width: 20%"
              type="year"
              placeholder="选择年">
          </el-date-picker><el-input v-model="form.user_id_append" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="身份证号" :label-width="formLabelWidth" prop="id_number">
          <el-input v-model="form.id_number" autocomplete="off" maxlength="18" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="手机号" :label-width="formLabelWidth" prop="phone_number" >
          <el-input v-model="form.phone_number" autocomplete="off" maxlength="11" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth" prop="email">
          <el-input v-model="form.email" autocomplete="off" >
          </el-input>
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

<script>
  export default {
    name: 'AddUserForm',
    data () {
      return {
        options: [{
          value: '1',
          label: '老师'
        }, {
          value: '2',
          label: '学生'
        }],
          dialogFormVisible: true,
          Input2:"",
        form: {
          id: '',
          role: '',
          user_id_suffix :'',
          user_id_append :'',
          user_id: '',
          id_number: '',
          phone_number: '',
          email: '',
        },
        formLabelWidth: '120px'
      }
    },
    methods: {
      clear () {
        this.form = {
          id: '',
          role: '',
          user_id: '',
          id_number: '',
          phone_number: '',
          email: ''
        }
      },
      onSubmit () {
        // this.$axios
        //   .post('/books', {
        //     id: this.form.id,
        //     email: this.form.email,
        //     role: this.form.role,
        //     user_id: this.form.user_id,
        //     id_number: this.form.id_number,
        //     phone_number: this.form.phone_number
        //   }).then(resp => {
        //   if (resp && resp.status === 200) {
            this.dialogFormVisible = false
            this.$emit('onSubmit')
        //   }
        // })
      }
    }
  }
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
body{
  background-image: linear-gradient(to right, #4facfe 0%, #00f2fe 100%);
  background-size: 100% 100vh;
}
</style>