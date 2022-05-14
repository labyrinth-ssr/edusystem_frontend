<template>
  <div>
    <template  v-for="oneList in myCourseList">
      <el-divider content-position="center"><span style="color: #409EFF;font-family:'Times New Roman'; opacity: 1">{{oneList[0].this_semester}}</span></el-divider>
      <el-row :gutter="20">
        <el-col :span="6" v-for="item in oneList" :key="item.title" >
          <el-card style="{ padding: 0;margin: 5px;border-radius: 10px;}" :body-style = "{padding:'0px'}">
            <span class="image">&nbsp;</span>
            <div style="padding: 0px;">
              <el-button type="text" class="button" @click="myCourseView($event)">{{item.id +"-"+ item.name + "-"+item.teacher_name}}</el-button>
              <br>
              <div class="bottom">

                <span>{{item.this_semester}}</span>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </template>
  </div>



</template>
<script src="https://code.jquery.com/jquery-latest.js"></script>
<script >
export default {
  name: "myCourse",
  created() {
    let form = {};

    if(this.$store.state.role ==='teacher'){
      form['teacherId'] = this.$store.state.user_id;
      this.$axios.post("/course_sel/common/get_course/by_course_sel",form).then((response) =>{
        this.rawCourseList = response.data;
        const temp=[]
        console.log(this.rawCourseList)
        for(let i=0;i<this.rawCourseList.length;i++){
          let x= this.rawCourseList[i].semester.split(',')
          console.log(x)
          for(let j=0;j<x.length;j++){
            let inner1 =  JSON.parse(JSON.stringify(this.rawCourseList[i]))
            inner1.this_semester = x[j]
            console.log(x[j])
            temp.push(inner1)
            console.log(inner1)
          }
        }
        console.log( temp)
        let term_index=temp.map(ele=>ele.this_semester)
        term_index = Array.from(new Set(term_index))
        term_index.sort()
        this.myCourseList = []
        for(let i=0;i<term_index.length;i++){
          this.myCourseList.push([])
          this.myCourseList[i] = temp.filter(ele=>Number(ele.this_semester)==Number(term_index[i]))
        }
        console.log(response.data)
      }).catch((error) =>{
        this.rawCourseList= [];
        console.log(error)
      })
    }
    else if(this.$store.state.role ==="student"){
      form['studentId'] = this.$store.state.user_id;
      this.$axios.post('course_sel/student/get_course_sel/by_student',{"studentId":this.$store.state.user_id})
      .then((response)=>{
        console.log(response)
        console.log("student_course:"+ response.data)
        this.rawCourseList = response.data
        for(let i=0;i<this.rawCourseList.length;i++){
          const a = this.rawCourseList[i].this_semester
          this.rawCourseList[i].semester = a.toString()
        }
        let term_index = this.rawCourseList.map(ele=>ele.this_semester)
        term_index = Array.from(new Set(term_index))

        // term_index.push("2032.8")
        // term_index.push("2098.9")
        term_index.sort()
        console.log(term_index)
        let temp=[]
        for(let i=0;i<term_index.length;i++){
          temp.push([])
          temp[i]=this.rawCourseList.filter(ele=>Number(ele.this_semester)==Number(term_index[i]))
        }
        // if(term_index.length ==1){
        //   temp = [temp]
        // }
        this.myCourseList = temp
        console.log(this.myCourseList)
      }).catch((error) =>{
        this.myCourseList =[]
      })


    }


    console.log(this.myCourseList)
  },
  data(){
    return {
      rawCourseList:[],
      myCourseList:[[]],
      clickHref: "",
      amIStu:this.$store.state.role ==='student',
    };
  },
  methods:{
    myCourseView($event){
      let Href = $event.target.innerText.split('-')[0];
      this.$store.state.courseInfo = this.rawCourseList.find(item=>item.id == Href);
      let this_sem = $event.currentTarget.nextElementSibling.nextElementSibling.firstElementChild.innerText
      console.log("this_sem:"+this_sem)
      this.$store.state.courseInfo.this_semester = this_sem.toString()
      console.log(this.$store.state.courseInfo)
      this.$router.push('/courses/mycourseView');
    }
  }
}
</script>

<style scoped>
el-row {
  margin-bottom: 0px;
}
el-row:last-child {
   margin-bottom: 0;
}

el-col {
  border-radius: 4px;
}
.bottom {
  width:100%;
  line-height: 12px;
  font-size: 10px;
  margin-bottom:20px;
  padding: 10px;
}

.button {
  padding: 10px;
  font-size: 16px;
}

.image {
  width: 100%;
  display: block;
  height: 200px;
  background-color: #409EFF;
  border-radius: 10px 10px 0 0;
}

</style>