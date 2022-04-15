<template>
    <div class="app-container" style="text-align:center;">
        <el-table :data="tableData" height="620" style="width:90%;">
            <el-table-column prop="requester_id" label="请求教师id" >
            </el-table-column>
            <el-table-column prop="request_class" label="请求类型" >
              <template slot-scope="scope">
            <el-tag size="medium" :type="tag_color_reqtype(scope.row.request_class)" effect="plain">{{ get_request_type(scope.row.request_class) }}</el-tag>
            </template>
            </el-table-column>
            <el-table-column prop="request_content" label="请求内容" >
                <template slot-scope="scope">
                  <el-link :underline="false" @click="requestDetail(scope.row.request_content)" type="primary">详情</el-link>
            <!-- {{scope.row.request_content}} -->
            </template>
            </el-table-column>
            <el-table-column prop="handler_id" label="处理人" >
            </el-table-column>
            <el-table-column prop="point" label="状态" >
            <template slot-scope="scope">
            <el-tag size="medium" :type="tag_color(scope.row.handle_result)">{{ scope.row.handle_result }}</el-tag>
            </template>
            </el-table-column>
            <el-table-column label="操作"  >
                <template slot-scope="scope" v-if="scope.row.handle_result=='processing'">
                    <el-button size="mini" @click="handleApprove(scope.$index, scope.row)">通过</el-button>
                    <el-button size="mini" type="danger" @click="handleReject(scope.$index, scope.row)">驳回</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog :visible.sync="requestDialogVis">
          <course-form :formdata_prop="request_data" action_prop="watch"/>
        </el-dialog>
    </div>
</template>

<script>

import CourseForm from './CourseForm.vue'
export default {
  components: { CourseForm },
  name:'CourseAudit',
mounted (){
      this.get_table()
  },
data() {
      return {
        tableData: [],
        request_data:{},
        requestDialogVis:false,
        processed:false
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
        }
      },
      get_request_type(val){
return val.split(/(?=[A-Z])/)[0]
      },
      get_table(){
this.$axios.get('/requests/courses/admin/view/all')
      .then((resp)=>{
        console.log(resp.data)
        if(resp.data.handle_result=='processing'){
          this.processed=false
        }else{
          this.processed=true
        }
          this.tableData=resp.data.reverse()
      })
      },
      handleApprove(index, row) {
        this.$axios.post('/requests/courses/admin/permit',{
          handler_id: "root", 
          request_id: row.id, 
          approve: true 
        }).then((resp)=>{
          console.log(resp)
          if(resp.data.isOk){
            this.get_table()
          row.handler_id=this.$store.state.user_id
        row.handle_result='approved'
            this.$message('已审批通过')
          }
          else{
            this.$message('审批操作失败')
          }
        })
      },
      handleReject(index, row) {
        this.$axios.post('/requests/courses/admin/permit',{
          handler_id: "root", 
          request_id: row.id, 
          approve: false 
        }).then((resp)=>{
          console.log(resp)
          if(resp.data.isOk){
            this.get_table()
          row.handler_id=this.$store.state.user_id
        row.handle_result='rejected'
            this.$message('已审批拒绝')
          }
          else{
            this.$message('审批操作失败')
          }
        })
      },
      requestDetail(info){
        this.request_data=info
        this.requestDialogVis=true
      }
    }
}
</script>

<style>

</style>