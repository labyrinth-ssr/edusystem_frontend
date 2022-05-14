<script src="../store/index.js"></script>
<template>
    <div class="app-container" v-if="authorized">
      <div>
        <el-form label="条件搜索" class="filter">
          <el-form-item label="关键字筛选" prop="search">
            <el-input
                v-model="search"
                placeholder="输入关键字搜索"
                size="small"
                style="width:200px;margin-right:2%;"/>
          </el-form-item>
          <el-form-item label="上课时间" prop="class_time">
            <el-cascader size="small" style="width:200px;margin-right:2%;"
                         v-model="rawTime"
                         clearable
                         :options="time_options"
                         :props="{expandTrigger :'hover'}"
                         @change="changeT"></el-cascader>
          </el-form-item>
          <el-form-item label="上课教室" prop="classroom_id">
            <el-select v-model="classroom_id" size="small" clearable placeholder="请选择教室" style="width:200px;margin-right:2%;">
              <el-option v-for="item in classrooms" :key="item.id" :label="item.id" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="学期" prop="term_filter">
            <el-quarter-picker size="small" v-model="value" placeholder="选择学期" @change ="term_change"/>
          </el-form-item>
        </el-form>
        <span v-if="role=='admin'||role=='teacher'" class="controller-container side">
            <el-button type="primary" @click="addcourse" class="up-button" style="margin-bottom:15px;">
                单条添加课程
            </el-button>
            <el-button type="primary" @click="uploaddialog" class="up-button" style="margin-bottom:15px;">
                批量添加课程
            </el-button>
        </span>
      </div>

        <el-table @row-click="courseView" :data="tableData.filter(data => ((!search || data.name.toLowerCase().includes(search.toLowerCase())||
        data.id.toLowerCase().includes(search.toLowerCase())||
        data.teacher_id.toLowerCase().includes(search.toLowerCase()))
        && (!classroom_id || data.classroom_id.toLowerCase().includes(classroom_id.toLowerCase()))
        &&(!filterTime || data.class_time.toLowerCase().includes(filterTime.toLowerCase()))))" height="572" style="width: 100%"
        >
            <el-table-column prop="id" label="课程代码" width="100px"  >
            </el-table-column>
            <el-table-column prop="number" label="课程编号" width="80px">
            </el-table-column>
            <el-table-column prop="name" label="课程名" width="80px">
            </el-table-column>
          <el-table-column prop="course_sort" label="课程类型" width="80px">
          </el-table-column>
            <el-table-column prop="department" label="开课院系" width="80px">
            </el-table-column>
          <el-table-column prop="acceptMajor_dis" label="选课专业" width="200px">
          </el-table-column>
            <el-table-column prop="classes_per_week" label="学时" width="80px">
            </el-table-column>
            <el-table-column prop="point" label="学分" width="80px">
            </el-table-column>
            <el-table-column prop="teacher_id" label="任课教师id" width="100px">
            </el-table-column>
            <el-table-column prop="introduction" label="课程介绍" width="180px">
            </el-table-column>
            <el-table-column prop="semester" label="开课学期" width="180px">
            </el-table-column>
            <el-table-column prop="class_time" label="上课时间" width="180px">
            </el-table-column>
            <el-table-column prop="classroom_id" label="上课地点" width="80px">
            </el-table-column>
            <el-table-column prop="max_student" label="任课容量" width="80px">
            </el-table-column>
            <el-table-column label="操作" width="170" fix="right">
                <template slot-scope="scope">
                    <el-button size="mini" v-if="role=='student'">选课</el-button>
                    <div v-else>
                    <el-button size="mini"  v-if="edit_render(scope.row)" @click.stop="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button size="mini"  v-if="edit_render(scope.row)" type="danger" @click.native.prevent.stop="handleDelete(scope.$index, tableData,scope.row)">删除</el-button>
                    </div>
                </template>
            </el-table-column>
        </el-table>
          <el-dialog :title="form_title" :visible.sync="dialogVisible" :close-on-click-modal='false' @close="close">
              <course-form :action_prop="form_op" :formdata_prop="form" :resp_prop="resp.data" :trigger_prop="trigger"/>

            <el-table :data="tableData.filter(ele=>(
                (watch_union1(form.class_time.split(','),ele.class_time.split(',')))&&
                (watch_union(form.courseTerm, ele.semester.split(','))))
          &&( form.classroom_id==ele.classroom_id))" style="width: 100%;height: 120px" >
              <el-table-column prop="id" label="课程代码" width="100px"  >
              </el-table-column>
              <el-table-column prop="name" label="课程名" width="80px">
              </el-table-column>
              <el-table-column prop="teacher_id" label="任课教师id" width="100px">
              </el-table-column>
              <el-table-column prop="semester" label="开课学期" width="150px">
              </el-table-column>
              <el-table-column prop="class_time" label="上课时间" width="150px">
              </el-table-column>
              <el-table-column prop="classroom_id" label="上课地点" width="80px">
              </el-table-column>
            </el-table>
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

import CourseForm from '@/components/CourseForm.vue'
import ElQuarterPicker from './ElQuarterPicker.vue'
export default {
  components: { CourseForm ,ElQuarterPicker},
  name:'CourseTable',
mounted (){
  this.$axios.get("/org/common/getorgs").then((resp)=>{
    this.department=resp.data
  })
  this.$axios.get('/classroom/common/getclassrooms').then((resp)=>{
    this.classrooms=resp.data
    console.log(resp.data)
  })
  this.get_table()
    let res = []
    let res2 =[]
    for (let i = 0; i < 13; i++){
      res.push({
        label: i+1,
        value: i+1
      })
    }
    for (let i = 1; i <= 5;i++){
      res2.push({
        label: i,
        value: i,
        children:res
      })
    }
    this.time_options = res2

  },
  computed:{
      form_title:function(){
          return this.form_op=='add'?'添加课程':'修改课程';
      },
  },
data() {
      return {
        value:'',
        current_term:'',
        term_filter:'',
        department:[],
        filterTime:'',
        rawTime:'',
        classrooms:[],
        time_options:[],
        classroom_id:'',
        class_time:'',
        search:'',
          authorized:true,
          trigger:0,
          resp:{},
        fileList: [],
        tableData: [],
        tableData_conflict:[],
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
            allowed_major:'',
            suffix:1
        },
        form_op:'add',
        dialogVisible:false,
        dialogVisible2:false,
        role:this.$store.state.role
      }
    },
    methods: {
        watch_union1(obj1,obj2){
          //交集为空，则为false
          //有冲突，则为TRUE
          let obj1_ = obj1

          let  res = true
          if(typeof (obj1_)=='undefined'){
            res = true
          } else {
            obj1_ = JSON.stringify(obj1_)
            obj1_ = JSON.parse(obj1_)
            obj1_= obj1_
            if(obj1_.length==0){

              res = true
            }else {
              res = (obj1_.length + obj2.length)!==Array.from(new Set([...obj1_,...obj2])).length
            }
          }
          return res
        },
      watch_union(obj1,obj2){
        //交集为空，则为false
        //有冲突，则为TRUE
        let obj1_ = obj1

        let  res = true
        if(typeof (obj1_)=='undefined'){
          res = true
        } else {
          obj1_ = JSON.stringify(obj1_)
          obj1_ = JSON.parse(obj1_)
          if(obj1_.length==0){
            res = true
          }else {
            let temp=[]
            for(let i=0;i<obj1_.length;i++){
              temp.push(obj1_[i][0])
            }
            obj1_ = temp
            res = (obj1_.length + obj2.length)!==Array.from(new Set([...obj1_,...obj2])).length
          }
        }
        return res
      },
        term_change(){
          let temp=''
          if( isNaN(parseInt(this.value))) {
            this.get_table()
          }else {
            temp = this.value.split('-');
            temp = temp[0] +'.' + (parseInt(temp[1])-1).toString();
            console.log(temp)
            let a = new FormData()

            a.append('semester_id','temp')
            this.$axios.get('/course/common/view/by_semester',
                {params:{ 'semester_id': temp}}).then((resp1)=>{
                  this.tableData = resp1.data;
                  console.log(resp1.data)
                  this.course_sort_f();
                }).catch((error)=>{
                  console.log(error)
            })

          }
        },
        changeT(){
            let res='';
            if(this.rawTime.length>0){
              res +=this.rawTime[0];
              res += '-';
              res += this.rawTime[1];
            }
            this.filterTime= res;
            console.log(this.filterTime)
            console.log(this.rawTime)
        },
        test(){
            console.log(this.tableData)
            console.log(this.form)
            this.dialogVisible=false
        },
        edit_render(row){
            return this.role=='admin'||(this.role=='teacher'&&row.teacher_id==this.$store.state.user_id)
        },
        get_table() {
                this.$axios.get('/course/common/view/all')
                    .then((resp) => {
                      this.tableData = resp.data
                      console.log(resp.data)
                      this.course_sort_f()
                    })
          this.course_sort_f()
        },
        course_sort_f(){
          var that = this;
          for(let i = 0; i <this.tableData.length; i++){
            console.log(typeof(this.tableData[i].allowed_major))
            if(this.tableData[i].allowed_major.length ==0){
              this.tableData[i].course_sort = "通用课程"
              this.tableData[i].acceptMajor ="不限专业"
              this.tableData[i].acceptMajor_dis ="不限专业"
            }else if(this.tableData[i].allowed_major.toLowerCase().includes(",".toLowerCase())){
              this.tableData[i].course_sort = "面向部分专业课"
              console.log(this.tableData[i].allowed_major.split(','))
              const acceptMajor = this.tableData[i].allowed_major.split(',').map(function (item,index,arr){
                const temp = item
                console.log(item)
                console.log(that.department)
                const t0 = that.department.find(element=>element.id == temp);
                console.log(t0)
                return t0
              },that)
              this.tableData[i].acceptMajor_dis = acceptMajor.map(function(item){
                return item.department.toString() +'/'+item.major.toString()
              }).join('; ')
              this.tableData[i].acceptMajor = acceptMajor.map(function(item){
                return [item.department, item.major]
              })
              console.log(this.tableData[i].acceptMajor);
            }else {
              this.tableData[i].course_sort = "专业课"
              var temp = this.tableData[i].allowed_major;
              // this.tableData[i].acceptMajor ;
              console.log(that.department)
              console.log(temp)
              const t1 =  that.department.find(element=>element.id == temp);
              console.log(t1)
              this.tableData[i].acceptMajor_dis = t1.department.toString()+'/' +t1.major.toString()
              this.tableData[i].acceptMajor = [t1.department, t1.major]
            }
          }

        },
        courseView(row, column, $event){
          if(this.$store.state.role=='admin')
          {

            console.log(row)
            this.$store.state.courseInfo = row;
            let temp =''
            if( isNaN(parseInt(this.value))) {
              this.$store.state.courseInfo.this_semester =row.semester.split(',')[0]
            }else {
              temp= this.value.split('-');
              temp = temp[0] +'.' + (parseInt(temp[1])-1).toString();
              console.log(temp)
              this.$store.state.courseInfo.this_semester = temp
            }

            this.$router.push('/courses/mycourseView');
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
            semester:'',
            courseTerm:[],
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
        this.$message({
          type: "info",
          message:"请提前根据课程列表的筛选功能确定时间无冲突！",
          customClass:'info-message'
        })
          this.form_op='add';
          this.empty_form();
          this.dialogVisible=true
          console.log("open")
      },
      admin_teacher_add_course() {

              if (this.role == 'teacher') {
                  this.form.teacher_id = this.$store.state.user_id
              }
              let str = ''
              if(this.form.course_sort ==="专业课")
              {
                str = this.form.acceptMajor[1].toString();
              }else if(this.form.course_sort ==="面向部分专业课")
              {
                for (let i = 0; i < this.form.acceptMajor.length; i++) {
                  str += this.form.acceptMajor[i][1] + ',';
                }
                  str = str.substring(0, str.length - 1)
              }
              console.log(this.form.class_time)
              this.form.allowed_major = str;
              console.log(this.form.courseTerm)

              //NOTICE :A bad insert!!

              // this.form.class_time='2-3'
              this.form.semester = this.form.courseTerm.join(',')
              console.log(this.form)
              this.$axios.post('/course/admin_teacher/add', {
                  requester_id: this.$store.state.user_id,
                  courseInfo: this.form
              }).then((resp) => {
                  this.resp=resp.data.courseInfoFormat
                  this.trigger+=1;
                  console.log(this.trigger)
                  console.log(resp.data)
                  if (resp.data.submitted) {
                              this.$message("添加成功");
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
                          this.$message("申请修改成功");
                              this.dialogVisible = false
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
              
              if (resp.data.isOK)
                  this.$message({
                      message: "批量添加成功",
                      type: 'success'
                  })
              else if (!resp.data.fileOK)
                  this.$message({
                      message: "没有文件",
                      type: 'error'
                  })
              else if (!resp.data.authorized)
                  this.$message({
                      message: "没有权限",
                      type: 'error'
                  })
              else if (!resp.data.notNull)
                  this.$message({
                      message: "文件中无合法课程信息",
                      type: 'error'
                  })
              else if (!resp.data.unique)
                  this.$message({
                      message: "重复添加课程",
                      type: 'error'
                  })

              else {
                  const error_batch = resp.data.error_batch;
                  var error_message = ""
                  if (!resp.data.infoFormat.classes_per_week) error_message = '课程时间错误'
                  else if (!resp.data.infoFormat.department) error_message = '学院错误'
                  else if (!resp.data.infoFormat.introduction) error_message = '课程介绍错误'
                  else if (!resp.data.infoFormat.max_student) error_message = '可容纳学生数错误'
                  else if (!resp.data.infoFormat.name) error_message = '课程名错误'
                  else if (!resp.data.infoFormat.number) error_message = '课程编号错误'
                  else if (!resp.data.infoFormat.suffix) error_message = '课程后缀错误'
                  else if (!resp.data.infoFormat.teacher_id) error_message = '教师id错误'
                  else if (!resp.data.infoFormat.point) error_message = '学分错误'
                  else if (!resp.data.infoFormat.class_time) error_message = '课程时间错误'
                  else if (!resp.data.infoFormat.classroom_id) error_message = '教室错误'
                  const message = '错误编号：' + error_batch + '\n错误类型：' + error_message;
                  this.$message({
                      message: message,
                      type: "error"
                  })
              }
              
          })
      },
      uploaddialog(){
          this.dialogVisible2=true
      },
      close(){
          console.log('close')
          this.resp={}
        this.get_table()
      }
    }
}

</script>

<style>
.info-message{
  z-index:3000 !important;
}
.filter{
  vertical-align: middle;
  position: sticky;
  position: -webkit-sticky; /* Safari */
  z-index: 100;
  display: inline-flex;
  justify-content: space-around;
}
.side{
  margin-top:40px;
  float:right;
}
</style>

