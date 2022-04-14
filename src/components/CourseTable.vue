<template>
    <div class="app-container">
        <div v-if="role=='admin'||role=='teacher'" class="controller-container">
            <el-button @click="addcourse">
                单条添加课程
            </el-button>
            <el-button @click="uploaddialog">
                批量添加课程
            </el-button>
        </div>
        <el-table :data="tableData" height="600" style="width: 100%">
            <el-table-column prop="id" label="课程代码" width="80">
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
                    <el-button size="mini"  v-if="edit_render(scope.row)" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button size="mini"  v-if="edit_render(scope.row)" type="danger" @click.native.prevent="handleDelete(scope.$index, tableData,scope.row)">删除</el-button>
                    </div>
                </template>
            </el-table-column>
        </el-table>
          <el-dialog title="添加课程" :visible.sync="dialogVisible" :close-on-click-modal='false' @close="close">
              <course-form :action_prop="form_op" :formdata_prop="form" :resp_prop="resp" :trigger_prop="trigger"/>
              <div slot="footer" class="dialog-footer">
                  <el-button @click="test">
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

import CourseForm from './CourseForm.vue'
export default {
  components: { CourseForm },
  name:'CourseTable',
mounted (){
      this.get_table()
  },
data() {
      return {
          trigger:0,
          resp:{},
        fileList: [],
        tableData: [],
        form:{
            number: "",
            name: "",
            point: '',
            classes_per_week: '',
            teacher_id: "",
            max_student: '',
            introduction: "",
            department: "",
            class_time:'',
            classroom_id:'',
            id:'',
            suffix:1
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
        edit_render(row){
            return this.role=='admin'||(this.role=='teacher'&&row.teacher_id==this.$store.state.user_id)
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
            classroom_id:'',
        }
        },
      handleEdit(index, row) {
        this.form_op='edit'
        this.dialogVisible=true
        row.suffix=1
        this.form={...row}
      },
      handleDelete(index, rows,row) {
        console.log(this.$store.state.user_id);
        this.$axios.delete('/course/admin_teacher/del', {
            data: {
                requester_id: this.$store.state.user_id,
                del_keyword: 'id', // id, number, department, teacher
                number: row.id.split('.')[0],
                department: '',
                teacher: '',
                suffix: parseInt(row.id.split('.')[1])
            }
        }).then((resp) => {
            console.log(resp.data)
            if (resp.data.submitted) {
                if (this.role == 'admin') {
                    this.$message("删除成功");
                } else {
                    this.$message("成功提交删除申请");
                }
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
      admin_teacher_add_course() {
              console.log(this.form)
              if (this.role == 'teacher') {
                  this.form.teacher_id = this.$store.state.user_id
              }
              this.$axios.post('/course/admin_teacher/add', {
                  requester_id: this.$store.state.user_id,
                  courseInfo: this.form
              }).then((resp) => {
                  this.resp=resp.data.courseInfoFormat
                  this.trigger+=1;
                  console.log(this.trigger)
                  console.log(resp.data)
                  if (resp.data.submitted) {
                      if(this.role=='admin'){
const arr_form = {
                          requester_id: this.$store.state.user_id,
                          number: this.form.number,
                          class_time: this.form.class_time, //周次和节次，前者为1-7，后者为1-14
                          classroom_id: this.form.classroom_id,
                        suffix:resp.data.suffix
                      }
                      console.log(arr_form)
                      this.$axios.post('/class_table/admin/arrange', arr_form).then((resp) => {
                          if (resp.data.isOk) {
                              this.$message("添加成功");
                              this.dialogVisible = false
                              this.get_table()
                          }else{
                          console.log(resp)

                      this.$message("课程时间或地点填写错误");
                          }
                      })
                      }
                  } else {
                      this.$message("提交失败，请检查表单内容");
                  }
              })
          },
          admin_teacher_edit_course() {
              this.form.suffix=parseInt(this.form.id.split('.')[1])
              console.log(this.form,this.$store.state.user_id)
              this.$axios.put('/course/admin_teacher/alt', {
                  requester_id: this.$store.state.user_id,
                  courseInfo: this.form
              }).then((resp) => {
                  console.log(resp.data)
                  this.resp=resp
                  this.trigger+=1;
                  if (resp.data.submitted) {
                      if(this.role=='admin'){

                      const arr_form = {
                          requester_id: this.$store.state.user_id,
                          number: this.form.number,
                          class_time: this.form.class_time, //周次和节次，前者为1-7，后者为1-14
                          classroom_id: this.form.classroom_id,
                        suffix:parseInt(this.form.id.split('.')[1])
                      }
                      console.log(arr_form)

                      this.$axios.post('/class_table/admin/arrange', arr_form).then((resp) => {
                          console.log(resp)
                          if (resp.data.isOk) {
                              this.$message("修改成功");
                              this.dialogVisible = false
                              this.get_table()
                          }
                          else{
                      this.$message("课程时间或地点填写错误");
                          }
                      })}else{
                          this.$message("申请修改成功");
                              this.dialogVisible = false
                      }
                  } else {
                      this.$message("提交失败，请检查表单内容");
                  }
              })

          },
      confirm_form(){
        // this.$axios.post('/course')
        this.empty_form()
      },
      fileChange(file,fileList){
          console.log(file)
          console.log(fileList)
          this.fileList = fileList;
      },
      submitUpload(){
          console.log(this.fileList)
        //   this.$axios.post('/upload/csv/admin/batch_add_course',null,{params:{
        //       requester_id:this.$store.state.user_id,
        //       file:this.fileList[0].raw
        //   }}).then((resp)=>{
        //       console.log(resp.data)
        //   })
        const formData = new FormData() //FormData对象，添加参数只能通过append('key', value)的形式添加
        formData.append('file', this.fileList[0].raw) //添加文件对象
        formData.append('requester_id', this.$store.state.user_id)
          this.$axios.post('/upload/csv/admin/batch_add_course',formData/* ,{params:formData} */).then((resp)=>{
              console.log(resp.data)
                            if(!resp.data.infoFormat.classes_per_week) this.$message('课程时间错误')
              else if(!resp.data.infoFormat.department) this.$message('学院错误')
              else if(!resp.data.infoFormat.introduction) this.$message('课程介绍错误')
              else if(!resp.data.infoFormat.max_student) this.$message('可容纳学生数错误')
              else if(!resp.data.infoFormat.name) this.$message('课程名错误')
              else if(!resp.data.infoFormat.number) this.$message('课程编号错误')
              else if(!resp.data.infoFormat.suffix) this.$message('课程后缀错误')
              else if(!resp.data.infoFormat.teacher_id) this.$message('教师id错误')
              else if(!resp.data.infoFormat.point) this.$message('学分错误')
          })
      },
      uploaddialog(){
          this.dialogVisible2=true
      },
      close(){
          console.log('close')
          this.resp={}
      }
    }
}

</script>

<style>

</style>

