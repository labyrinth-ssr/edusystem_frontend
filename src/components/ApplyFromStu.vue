<template>
  <div v-if ="applyPermit">
    <el-form :v-model="form" style="text-align: left" ref="form" :rules="rules"
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
    <div class="app-container" style="text-align:center;">
      <el-table :data="tableData" height="620" style="width:90%;">
        <el-table-column prop="requester_id" label="请求id" >
        </el-table-column>
        <el-table-column prop="request_class" label="请求类型" >
          <template slot-scope="scope">
            <el-tag size="medium" :type="tag_color_reqtype(scope.row.request_class)" effect="plain">{{ get_request_type(scope.row.request_class) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="request_content.courseId" label="请求课程" >
        </el-table-column>
        <el-table-column prop="request_content.reason" label="申请理由" >
        </el-table-column>
        <el-table-column prop="handler_id" label="处理人" >
        </el-table-column>
        <el-table-column prop="point" label="状态" >
          <template slot-scope="scope">
            <el-tag size="medium" :type="tag_color(scope.row.handle_result)">{{ scope.row.handle_result }}</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
  <div v-else>
    <h5>当前选课申请未开放！</h5>
  </div>

</template>

<script>

export default {
  name: "ApplyFromStu",
  mounted () {
    this.$axios.get("/permission/common/check_choose_course")
        .then((resp)=>{
          this.applyPermit= resp.data==2
          // this.applyPermit= true
        }).catch((error)=>{
      console.log(error)
    })

    this.form.studentId=this.$store.state.user_id;
    this.get_table()

  },
  data() {
    return{
      applyPermit: false,
      tableData:[],
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
    tag_color(val){
      if(val=='processing'){
        return 'primary'
      }
      else if(val=='rejected'){
        return 'danger'
      }
      else if(val=='approved'){
        return 'success'
      }
    },
    tag_color_reqtype(val){
      if(val=='UpdateCourseRequest'){
        return 'primary'
      }
      else if(val=='DeleteCourseRequest'){
        return 'danger'
      }
      else if(val=='AddCourseRequest'){
        return 'success'
      }else return "info"
    },
    get_table(){
      this.$axios.get('/requests/courses/user/view/by_requester',{params:{"requester_id":this.form.studentId}})
          .then((resp)=>{
            console.log(resp.data)
            this.tableData = resp.data;
          }).catch((error)=>{
        console.log(error)
      })
    },
    stuApply(){
      this.$axios.post('/course_sel/student/request_course_sel',this.form)
      .then((resp)=>{
        console.log(resp)
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
    },
    get_request_type(val){
      console.log(val)
      if (val=='AddCourseSelRequest') {
        return "选课申请"
      }
      else if(val=='AddCourseRequest'){
        return "添加课程"
      }
      if(val=='UpdateCourseRequest'){
        return "编辑课程"
      }
      else if(val=='DeleteCourseRequest'){
        return "删除课程"
      }
    },
  }
}
</script>

<style scoped>

</style>