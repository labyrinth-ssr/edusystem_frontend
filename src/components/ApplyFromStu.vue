<template>
  <div v-if ="applyPermit">
    <el-form :v-model="form" v-if ='amIStu' style="text-align: left" ref="form" :rules="rules"
             label-position="right" label-width="100px">
      <el-form-item label="申请人 :" prop="studentId">
        <el-input v-model="form.studentId" disabled style="width:180px"></el-input>
      </el-form-item>
      <el-form-item label="申请课程:" prop="courseId">
        <el-input v-model="form.courseId" style="width:180px"></el-input>
      </el-form-item><el-form-item label="申请理由:" prop="reason">
      <el-input type="textarea" v-model="form.reason" style="width:180px"></el-input>
    </el-form-item>
      <el-form-item >
      <el-button @click="stuApply" size="small" type="primary">提交</el-button>
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
  mounted () {
    this.$axios.get("/permission/common/check_choose_course")
        .then((resp)=>{
          this.applyPermit= resp.data!=0
        }).catch((error)=>{
      console.log(error)
    })
     this.form.studentId=this.$store.state.user_id;
  },
  data() {
    return{
      applyPermit: false,
      amIStu:this.$store.state.role ==='student',
      applyList:[],
      form: {
        studentId: '',
        courseId: '',
        reason: ''
      },
      rules: {
        reason:[{
          required: true,
          type:String,
          trigger:'blur',
          validator: (rule, value, callback)=>{
            typeof(this.form.reason)=='undefined'?callback(new Error("请填写申请理由")) : callback();
          },
        }],
        courseId:[{
          required: true,
          type:String,
          trigger:'change',
          validator: (rule, value, callback)=>{
            typeof(this.form.courseId)=='undefined'?callback(new Error("课程名填写错误")) : callback();
          },
        }]
      }
    }
  },
  methods: {
    stuApply(){

      this.$axios.post('/course_sel/student/request_course_sel',JSON.stringify(this.form))
      .then((resp)=>{
        if(resp.data.ok){
          this.$message({
            type:'success',
            message:"申请成功！"
          })
        }else {
          this.$message({
            type:'error',
            message:"申请失败！请检查表单。否则课程未满。"
          })
        }
      })
    }
  }
}
</script>

<style scoped>

</style>