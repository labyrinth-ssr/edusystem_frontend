<template>
    <div class="app-container">
        <div class="controller-container">
            <el-button @click="addcourse">
                Add
            </el-button>
            <el-button @click="uploaddialog">
                批量添加课程
            </el-button>
        </div>
        <el-table :data="tableData" height="600" style="width: 100%">
            <el-table-column prop="number" label="课程编号" width="80">
            </el-table-column>
            <el-table-column prop="name" label="课程名" width="180">
            </el-table-column>
            <el-table-column prop="department" label="开课院系" width="80">
            </el-table-column>
            <el-table-column prop="classes_per_week" label="学时" width="80">
            </el-table-column>
            <el-table-column prop="point" label="学分" width="80">
            </el-table-column>
            <el-table-column prop="number" label="任课教师" width="80">
            </el-table-column>
            <el-table-column prop="introduction" label="课程介绍" width="180">
            </el-table-column>
            <el-table-column prop="class_time" label="上课时间" width="180">
            </el-table-column>
            <el-table-column prop="classroom_id" label="上课地点" width="80">
            </el-table-column>
            <el-table-column prop="max_student" label="任课容量" width="80">
            </el-table-column>
            <el-table-column label="管理" width="180">
                <template slot-scope="scope">
                    <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
          <el-dialog title="添加课程" :visible.sync="dialogVisible" :close-on-click-modal='false'>
              <el-form :model="form" style="text-align: left" ref="form" >
                  <el-form-item label="课程名">
                      <el-input v-model="form.name" />
                  </el-form-item>
                  <el-form-item label="课程编号" v-if="role=='admin'">
                      <el-input v-model="form.number" />
                  </el-form-item>
                  <el-form-item label="开课院系" v-if="role=='admin'">
                      <el-input v-model="form.department" />
                  </el-form-item>
                  <el-form-item label="学时" v-if="role=='admin'">
                      <el-input v-model="form.classes_per_week" />
                  </el-form-item>
                  <el-form-item label="学分" v-if="role=='admin'">
                      <el-input v-model="form.point" />
                  </el-form-item>
                  <el-form-item label="任课教师" v-if="role=='admin'">
                      <el-input v-model="form.teacher_id" />
                  </el-form-item>
                  <el-form-item label="课程介绍" v-if="role=='admin'">
                      <el-input v-model="form.introduction" />
                  </el-form-item>
                  <el-form-item label="上课时间">
                      <el-input v-model="form.class_time" />
                  </el-form-item>
                  <el-form-item label="上课教室">
                      <el-input v-model="form.classroom_id" />
                  </el-form-item>
                  <el-form-item label="选课容量" v-if="role=='admin'">
                      <el-input v-model="form.max_student" />
                  </el-form-item>
              </el-form>
              <div slot="footer" class="dialog-footer">
                  <el-button @click="dialogFormVisible = false">
                      取消
                  </el-button>
                  <el-button type="primary" @click="admin_teacher_add_course" v-if="role=='admin'&&form_op=='add'">
                      确认增加
                  </el-button>
                  <el-button type="primary" @click="admin_teacher_add_course" v-if="role=='teacher'&&form_op=='add'">
                      申请增加
                  </el-button>
                  <el-button type="primary" @click="admin_teacher_edit_course" v-if="role=='admin'&&form_op=='edit'">
                      确认修改
                  </el-button>
                  <el-button type="primary" @click="admin_teacher_edit_course" v-if="role=='teacher'&&form_op=='edit'">
                      申请修改
                  </el-button>
              </div>
          </el-dialog>
          <el-dialog title="批量添加课程" :visible.sync="dialogVisible2" :close-on-click-modal='false'>
              <el-upload action="fakeaction" :auto-upload="false" :on-change="fileChange" :file-list="fileList">
                  选取文件
              </el-upload>
              <el-button type="primary" size="small" @click="submitUpload">上传</el-button>
          </el-dialog>
    </div>
</template>

<script>

import axios from 'axios'
export default {
  name:'CourseTable',
mounted (){
      this.get_table()
  },
data() {
      return {
          fileList: [],
        tableData: [],
        form:{
            class_time: "",
            classes_per_week: '',
            classroom_id: "",
            department: "",
            introduction: "",
            max_student: '',
            name: "",
            number: "",
            point: '',
            teacher_id: ""
        },
        form_op:'add',
        dialogVisible:false,
        dialogVisible2:false,
        role:'teacher'
      }
    },
    methods: {
        get_table(){
            axios.get('http://localhost:5000/courses')
        .then((resp)=>{
          this.tableData=resp.data
        })
        },
        empty_form(){
            this.form={
            class_time: "",
            classes_per_week: '',
            classroom_id: "",
            department: "",
            introduction: "",
            max_student: '',
            name: "",
            number: "",
            point: '',
            teacher_id: "",
            suffix:0
        }
        },
      handleEdit(index, row) {
        console.log(index, row);
        this.form_op='edit'
        this.dialogVisible=true
        this.form=row
      },
      handleDelete(index, row) {
        // console.log(index, row);
        // this.$axios.delete('/',{data:})
        // this.get_table()
      },
      addcourse(){
          this.form_op='add'
          this.empty_form()
          this.dialogVisible=true
      },
      admin_teacher_add_course(){
          this.$axios.post('/course/admin_teacher/add',{
              requester_id:this.$store.state.user_id,
              courseInfo:this.form
          }).then((resp)=>{
              console.log(resp.data)
              if (resp.data.submitted) {
            this.$message("添加成功");
          } else {
            this.$message("提交失败，请检查表单内容");
          }
          })
      },
      admin_teacher_edit_course(){
          this.$axios.post('/course/admin_teacher/add',{
              requester_id:this.$store.state.user_id,
              courseInfo:this.form
          }).then((resp)=>{
              console.log(resp.data)
              if (resp.data.submitted) {
            this.$message("添加成功");
          } else {
            this.$message("提交失败，请检查表单内容");
          }
          })
      },
      confirm_form(){
        // this.$axios.post('/course')
        this.empty_form
      },
      fileChange(){
          this.fileList = fileList;
      },
      submitUpload(){
          this.$axios.post('/upload/csv/admin/batch_add_course',{
              user_id:this.$store.state.user_id,
              file:this.fileList[0]
          }).then((resp)=>{
              console.log(resp.data)
          })
      },
      uploaddialog(){
          this.dialogVisible2=true
      }
    }
}
</script>

<style>

</style>