<template>
  <div v-if ="applyPermit">
    <el-form v-if ='amIStu' :rule="rules" prop="form">
      <el-form-item label="申请人" prop="studentId">
        <el-input v-model="form.studentId" disabled></el-input>
      </el-form-item>
      <el-form-item label="申请课程" prop="courseId">
        <el-input v-model="form.courseId"></el-input>
      </el-form-item><el-form-item label="申请理由" prop="reason">
      <el-input v-model="form.reason"></el-input>
    </el-form-item>

    </el-form>
    <el-table
        :data="applyList.filter(data=>(!amIStu || data.studentId === form.studentId))">
      <el-table-column
          prop="studentId"
          label="申请人"
          width="100px">
      </el-table-column>
      <el-table-column
          prop=""
          label="申请课程id"
          width="100px">
      </el-table-column>
      <el-table-column
          prop=""
          label="申请理由"
          width="300px">
      </el-table-column>
    </el-table>
  </div>
  <div v-else>
    <h5>当前选课申请未开放！</h5>
  </div>

</template>

<script>
import form from "element-ui/packages/form";

export default {
  name: "ApplyFromStu",
  created () {
  },
  data() {
    return{
      applyPermit: this.$store.state.course_sel_stage !=0,
      amIStu:this.$store.state.role ==='student',
      applyList:[],
      form: {
        studentId: this.$store.state.user_id,
        courseId: '',
        reason: ''
      },
      rules: {
        reason:[{
          required: true,
          type:String,
          trigger:'blur'
        }],
        courseId:[{
          required: true,
          type:String,
          trigger:'change'
        }]
      }
    }
  }
}
</script>

<style scoped>

</style>