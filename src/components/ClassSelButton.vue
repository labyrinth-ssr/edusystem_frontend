<template>
<div>
  <h3>当前学期</h3>
  <h4>{{term}}</h4>
  <h3>学生选课</h3>
  <template>
    <el-radio-group v-model="class_sel_permit" @change="changeSel">
      <el-radio :label="0">禁止</el-radio>
      <el-radio :label="1">第一轮选课</el-radio>
      <el-radio :label="2">第二轮选课</el-radio>
    </el-radio-group>
  </template>
<!--  <el-switch-->
<!--  v-model="class_sel_permit"-->
<!--  active-text="允许"-->
<!--  inactive-text="禁止"-->
<!--  @change="changeSel"-->
<!--  >-->
<!--</el-switch>-->
</div>
</template>

<script>
export default {
  name: 'ClassSelButton',
  data() {
    return {
      term:'',
      class_sel_permit: 0
    }
  },
  created(){
    this.$axios.get('/permission/common/check_choose_course').then((resp)=>{
      console.log(resp.data)
      this.class_sel_permit=resp.data
    });
    this.$axios.get('/permission/admin/current_semester').then((resp)=>{
      console.log(resp.data)
      this.term = resp.data;
    })

  },
  methods: {
    changeSel() {
      console.log(this.class_sel_permit)
      this.$axios({
        method: 'post',
        url: '/permission/admin/choose_course',
        params: {
          'stage': this.class_sel_permit,
        }
      }).then((resp) => {
            this.$message({
              type:'success',
              message:"修改成功！"
            })
            console.log(resp.data)
          }).catch((error)=>{
            console.log(error)
      })
        }
      }
}
</script>

<style>

</style>