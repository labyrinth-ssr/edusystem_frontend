<template>
  <div>
    <el-dialog title="添加学院/专业" :visible.sync="dialogFormVisible" @close="cancel">
      <el-form :model="form" style="text-align: left" ref="form" >
                      <el-form-item label="学院">
                          <el-input v-model="form.department" />
                      </el-form-item>
                      <el-form-item label="专业" >
                          <el-input v-model="form.major" />
                      </el-form-item>
                  </el-form>
      <el-button  type="primary" @click="onSubmit">提交</el-button>
              </el-dialog>
          </div>
</template>
<script>
export default {
  name: 'DepartmentForm',
  created() {
      this.clear()
  },
  data() {
    return {
      form: {
        department:'',
        major:''
      },
      dialogFormVisible: true,
    }
  },
  methods: {
    clear() {
      this.form = {
        department:'',
        major: "",
      };
    },
    cancel() {
      this.clear();
      this.$router.replace("/department/table");
    },
    onSubmit() {
      console.log(this.form.major)
      this.$axios
        .post("/org/admin/addorg?department="+this.form.department +"&major="+this.form.major)
        .then((resp) => {
          if (resp.data === true) {
            this.$message(
                {type: "success", message: "增加成功！"})
          } else {
            this.$message(
                {
                  type: "error",
                  message: "提交失败，请检查表单内容"
                })
          }
        })
        .catch((error)=>{
          console.log(error)
        })
      }
    }
}
</script>

<style>

</style>