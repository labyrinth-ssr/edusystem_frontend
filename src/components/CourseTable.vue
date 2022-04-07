<template>
    <div class="app-container">
        <div class="controller-container">
            <el-button @click="addcourse">
                Add
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

              <el-form :model="form" style="text-align: left" ref="form" :rules="rules">
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
                  <el-button type="primary" @click="dialogFormVisible = false" v-if="role=='admin'">
                      确认
                  </el-button>
                  <el-button type="primary" @click="dialogFormVisible = false" v-else>
                      申请
                  </el-button>
              </div>
          </el-dialog>
    </div>
</template>

<script>
import axios from 'axios'
export default {
  name:'CourseTable',
mounted (){
      axios.get('http://localhost:5000/courses')
      .then((resp)=>{
          this.tableData=resp.data
      })
  },
data() {
      return {
        tableData: [],
        form:{
            class_time: "",
            classes_per_week: '',
            classroom_id: "",
            department: "",
            id: "",
            introduction: "",
            max_student: '',
            name: "",
            number: "",
            point: '',
            teacher_id: ""
        },
        form_op:'add',
        dialogVisible:false,
        role:'teacher'
      }
    },
    methods: {
        empty_form(){
            this.form={
            class_time: "",
            classes_per_week: '',
            classroom_id: "",
            department: "",
            id: "",
            introduction: "",
            max_student: '',
            name: "",
            number: "",
            point: '',
            teacher_id: ""
        }
        },
      handleEdit(index, row) {
        console.log(index, row);
          this.dialogVisible=true

        this.form=row
      },
      handleDelete(index, row) {
        console.log(index, row);
      },
      addcourse(){
          this.empty_form
          this.dialogVisible=true
      },
      confirm_form(){
        //   this.$axios.post('/course')
        this.empty_form
      }
    }
}
</script>

<style>

</style>