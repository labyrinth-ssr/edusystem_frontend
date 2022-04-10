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
            <el-table-column label="操作" width="180">
                <template slot-scope="scope">
                    <el-button size="mini" @click="handleApprove(scope.$index, scope.row)">通过</el-button>
                    <el-button size="mini" type="danger" @click="handleReject(scope.$index, scope.row)">驳回</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog :visible.sync="requestDialogVis">
          <course-form :formdata_prop="request_data" />
        </el-dialog>
    </div>
</template>

<script>

import axios from 'axios'
import CourseForm from './CourseForm.vue'
export default {
  components: { CourseForm },
  name:'CourseAudit',
mounted (){
      axios.get('http://localhost:5000/requests')
      .then((resp)=>{
          this.tableData=resp.data
      })
  },
data() {
      return {
        tableData: [],
        request_data:{},
        requestDialogVis:false
      }
    },
    methods: {
      handleApprove(index, row) {
        console.log(index, row);
        row.handle_result='approved'
      },
      handleReject(index, row) {
        console.log(index, row);
        row.handle_result='rejected'
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