<template>
  <div>

  <el-descriptions class="margin-top" title="课程信息" :column="3"  border>
    <el-descriptions-item>
      <template slot="label">
        <i class="el-icon-mobile-phone"></i>
        课程id
      </template>
      <el-tag
          closable
          :disable-transitions="false"
          @close="handleClose">
        {{courseInfo.id}}
      </el-tag>
    </el-descriptions-item>
    <el-descriptions-item>
      <template slot="label">
        <i class="el-icon-reading"></i>
        课程名
      </template>
      {{courseInfo.name}}
    </el-descriptions-item>
    <el-descriptions-item>
      <template slot="label">
        <i class="el-icon-location-outline"></i>
        上课地点
      </template>
      {{courseInfo.classroom_id}}
    </el-descriptions-item>
    <el-descriptions-item>
      <template slot="label">
        <i class="el-icon-tickets"></i>
        备注
      </template>
      {{courseInfo.introduction}}
    </el-descriptions-item>
    <el-descriptions-item>
      <template slot="label">
        <i class="el-icon-date"></i>
        上课时间
      </template>
      <span v-if="amIadmin">
        {{courseInfo.semester+"\\"+ courseInfo.class_time }}
      </span>
      <span v-else>
        {{courseInfo.this_semester+"\\"+ courseInfo.class_time }}
      </span>

    </el-descriptions-item>
    <el-descriptions-item>
      <template slot="label">
        <i class="el-icon-s-opportunity"></i>
        学分
      </template>
      {{ courseInfo.point }}
    </el-descriptions-item>
  </el-descriptions>

  <el-descriptions class="margin-top" title="教师信息" :column="3"  border>
    <el-descriptions-item>
      <template slot="label">
        <i class="el-icon-user"></i>
        教师
      </template>

        {{courseInfo.teacher_name}}
    </el-descriptions-item>
    <el-descriptions-item>
      <template slot="label">
        <i class="el-icon-mobile-phone"></i>
        教师id
      </template>
      {{courseInfo.teacher_id}}
    </el-descriptions-item>
    <el-descriptions-item>
      <template slot="label">
        <i class="el-icon-s-promotion"></i>
        department
      </template>
      {{courseInfo.department}}
    </el-descriptions-item>
  </el-descriptions>
  <template v-if="amIadmin">
    <el-descriptions class="margin-top" title="学期筛选" :column="1"  style="{width:200px}" border>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-date"></i>
          开课学期
        </template>
        <el-select v-model="term_filter" placeholder="请选择" @change="fetchInfo">
          <el-option
              v-for="item in term_options"
              :key="item"
              :label="item"
              :value="item">
          </el-option>
        </el-select>
      </el-descriptions-item>
    </el-descriptions>

  </template>
  <el-descriptions class="margin-top" title="学生信息" :column="2"  border>
    <el-descriptions-item>
      <template slot="label">
        <i class="el-icon-user"></i>
        最大数量
      </template>
      {{courseInfo.max_student}}
    </el-descriptions-item>
    <el-descriptions-item>
      <template slot="label">
        <i class="el-icon-user"></i>
        学生数量
      </template>
      {{students}}
    </el-descriptions-item>
    <el-descriptions-item v-for="item in studentsList" :key="item.userId" >
      <template slot="label">
        <i class="el-icon-user"></i>
        {{item.userId}}
      </template>
      {{item.userName}}
    </el-descriptions-item>
  </el-descriptions>

  </div>
</template>

<script>
export default {
  name: "OneCourse",

  created() {
    this.courseInfo = this.$store.state.courseInfo;
    console.log(this.courseInfo)
    const my_id = this.courseInfo.teacher_id.toString()
    if(this.$store.state.role =='admin'){
      this.$axios.get(`userinfo/admin_teacher/getUserInfoById/${my_id}`)
      .then((resp)=>{
        this.courseInfo.teacher_name = resp.data
      }).catch((error)=>{
        this.courseInfo.teacher_name ="佚名"
        console.log(error)
      })
    }
    this.amIadmin = this.$store.state.role=='admin';
    if(this.amIadmin){

      this.term_options=this.courseInfo.semester.split(',')
      this.term_filter = this.courseInfo.this_semester
    }

    this.fetchInfo()
  },
  data(){
    return{
      amIadmin:this.$store.state.role=='admin',
      term_options:[],
      term_filter: '',
      courseInfo: {},
      course_list: [],
      students: 0,
      studentsList:[]
    }
  },
  methods:{
    handleClose(){
      this.$router.go(-1)
    },
    fetchInfo(){
      let temp ={};
      if(this.amIadmin){
        this.courseInfo.this_semester = this.term_filter
      }
      temp['courseId'] = this.$store.state.courseInfo.id;
      temp['teacherId'] = this.courseInfo.teacher_id;
      // if (this.$store.state.role ==='teacher'){
      //   temp['teacherId'] = this.$store.state.user_id
      // }else if(this.$store.state.role ==='student'){
      //   temp['studentId'] = this.$store.state.user_id;
      // }
      temp['semester'] = this.courseInfo.this_semester
      console.log(temp)
      console.log(this.$store.state.courseInfo.id)
      this.$axios.post("/course_sel/common/get_course_sel/by_all",
          temp).then((response)=>{
        this.course_list = response.data
        console.log(this.course_list)
      }).catch((error)=>{
        console.log(error)
      })
      let temp2 = new FormData();
      const t1 = this.courseInfo.id
      const t2 = this.courseInfo.semester
      temp2.append('courseId', `${this.courseInfo.id}`)
      temp2.append('semester',`${this.courseInfo.this_semester}`)
      this.$axios.post("/course_sel/common/count/by_course_id_and_semester",temp2)
          .then((response) =>{
            console.log(response.data)
            this.students = response.data
          }).catch((error)=>{
        console.log(error)
      })
      this.$axios.post("course_sel/common/getUserByCourse",temp2)
      .then((resp)=>{
        this.studentsList = resp.data
      }).catch((error)=>{
        console.log(error)
      })
    }
  }
}
</script>

<style scoped>

</style>