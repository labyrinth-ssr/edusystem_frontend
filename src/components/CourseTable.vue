<template>
    <div class="app-container">
        <div class="controller-container">
            <el-button @click="addcourse">
                单条添加课程
            </el-button>
            <el-button @click="uploaddialog">
                批量添加课程
            </el-button>
        </div>
        <el-table :data="tableData" height="600" style="width: 100%">
            <el-table-column prop="number" label="课程编号" width="80">
            </el-table-column>
            <el-table-column prop="name" label="课程名" width="80">
            </el-table-column>
            <el-table-column prop="department" label="开课院系" width="80">
            </el-table-column>
            <el-table-column prop="classes_per_week" label="学时" width="80">
            </el-table-column>
            <el-table-column prop="point" label="学分" width="80">
            </el-table-column>
            <el-table-column prop="teacher_id" label="任课教师id" width="180">
            </el-table-column>
            <el-table-column prop="introduction" label="课程介绍" width="180">
            </el-table-column>
            <el-table-column prop="class_time" label="上课时间" width="180">
            </el-table-column>
            <el-table-column prop="classroom_id" label="上课地点" width="80">
            </el-table-column>
            <el-table-column prop="max_student" label="任课容量" width="80">
            </el-table-column>
            <el-table-column label="操作" width="180">
                <template slot-scope="scope">
                    <el-button size="mini" v-if="role=='sel_student'">选课</el-button>
                    <div v-else>
                    <el-button size="mini"  @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button size="mini"  type="danger" @click.native.prevent="handleDelete(scope.$index, tableData,scope.row)">删除</el-button>
                    </div>
                </template>
            </el-table-column>
        </el-table>
          <el-dialog title="添加课程" :visible.sync="dialogVisible" :close-on-click-modal='false'>
              <course-form :action_prop="form_op" :formdata_prop="form"/>
              <div slot="footer" class="dialog-footer">
                  <el-button @click="test">
                      取消
                      <!-- dialogVisible = false -->
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

import CourseForm from './CourseForm.vue'
export default {
  components: { CourseForm },
  name:'CourseTable',
mounted (){
      this.get_table()
  },
data() {
      return {
        fileList: [],
        tableData: [],
        form:{
            number: "",
            suffix:1,
            name: "",
            point: '',
            classes_per_week: '',
            teacher_id: "",
            max_student: '',
            introduction: "",
            department: "",
            class_time:'',
            classroom_id:''
        },
        form_op:'add',
        dialogVisible:false,
        dialogVisible2:false,
        role:this.$store.state.role
      }
    },
    methods: {
        test(){
            console.log(this.tableData)
            console.log(this.form)
            this.dialogVisible=false
        },
        get_table() {
            if (this.role == 'sel_student') {
                this.$axios.get('/userinfo/common/getuserinfo').then((resp) => {
                    console.log(resp.data)
                    const department = resp.data.department
                    this.$axios({
                        method: 'get',
                        url: '/course/common/view/by_department',
                        params: {
                            'department': department
                        }
                    }).then((resp) => {
                        this.tableData = resp.data

                    })
                })

            } else {
                this.$axios.get('/course/common/view/all')
                    .then((resp) => {
                        this.tableData = resp.data

                    })
            }
        },
        empty_form(){
            this.form={
            number: "",
            suffix:1,
            name: "",
            point: '',
            classes_per_week: '',
            teacher_id: "",
            max_student: '',
            introduction: "",
            department: "",
            class_time:'',
            classroom_id:''
        }
        },
      handleEdit(index, row) {
        this.form_op='edit'
        this.dialogVisible=true
        row.suffix=1
        this.form=JSON.parse(JSON.stringify(row))
      },
      handleDelete(index, rows,row) {
        console.log(this.$store.state.user_id);
        console.log({
                    requester_id:this.$store.state.user_id,
                    del_keyword:'teacher',// id, number, department, teacher
                    number:row.number,
                    suffix:2,
                    department:'',
                    teacher:row.teacher_id
                })
        this.$axios.delete('/course/admin_teacher/del', {
                data:{
                    requester_id:this.$store.state.user_id,
                    del_keyword:'number',// id, number, department, teacher
                    number:row.number,
                    suffix:2,
                    department:'',
                    teacher:''
                }
            }).then((resp)=>{
              console.log(resp.data)
              if (resp.data.submitted) {
            this.$message("删除成功");
            this.get_table()
          } else {
            this.$message("没有删除权限");
          }
          })
        this.get_table()
      },
      addcourse(){
          this.form_op='add'
          this.empty_form()
          this.dialogVisible=true
      },
      admin_teacher_add_course(){
          console.log(this.form)
          this.$axios.post('/course/admin_teacher/add',{
              requester_id:this.$store.state.user_id,
              courseInfo:this.form
          }).then((resp)=>{
              console.log(resp.data)
              if (resp.data.submitted) {
            this.$message("添加成功");
            this.dialogVisible=false
            this.get_table()
          } else {
            this.$message("提交失败，请检查表单内容");
          }
          })
      },
      admin_teacher_edit_course(){
          console.log(this.form)
          this.$axios.put('/course/admin_teacher/alt',{
              requester_id:this.$store.state.user_id,
              courseInfo:this.form
          }).then((resp)=>{
              console.log(resp.data)
              if (resp.data.submitted) {
            this.$message("添加成功");
            this.dialogVisible=false
            this.get_table()
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

