<template>
    <div class="app-container">
        <el-table :data="tableData" height="600" style="width: 100%">
            <el-table-column prop="requester_id" label="请求教师id" width="180">
            </el-table-column>
            <el-table-column prop="request_class" label="请求类型" width="180">
            </el-table-column>
            <el-table-column prop="request_content" label="请求内容" width="180">
                <template slot-scope="scope">
                  <el-link :underline="false" @click="requestDetail(scope.row.request_content)">详情</el-link>
            <!-- {{scope.row.request_content}} -->
            </template>
            </el-table-column>
            <el-table-column prop="handler_id" label="处理人" width="180">
            </el-table-column>
            <el-table-column prop="point" label="状态" width="180">
            <template slot-scope="scope">
            <el-tag size="medium">{{ scope.row.handle_result }}</el-tag>
            </template>
            </el-table-column>
            <el-table-column label="操作" width="180" >
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
      get_table(){
this.$axios.get('/requests/courses/admin/view/all')
      .then((resp)=>{
        console.log(resp.data)
        if(resp.data.handle_result=='processing'){
          this.processed=false
        }else{
          this.processed=true
        }
          this.tableData=resp.data
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