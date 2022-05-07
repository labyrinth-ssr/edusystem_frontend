<template>
  <el-row :gutter="20">
    <el-col :span="6" v-for="item in myCourseList" :key="item.title" >
      <el-card style="{ padding: 0;margin: 5px;border-radius: 10px;}" :body-style = "{padding:'0px'}">
        <span class="image">&nbsp;</span>
        <div style="padding: 0px;">
          <el-link type="primary">{{item.id +"-"+ item.name + "-"+item.teacher_name}}</el-link>
          <el-button type="text" class="button" @click="myCourseView($event)">{{item.id +"-"+ item.name + "-"+item.teacher_name}}</el-button>
          <br>
          <div class="bottom">
            <span>{{item.semester}}</span>
          </div>
        </div>
      </el-card>
    </el-col>
  </el-row>
</template>
<script src="https://code.jquery.com/jquery-latest.js"></script>
<script >
export default {
  name: "myCourse",
  created() {
    let form = {};

    if(this.$store.state.role ==='teacher'){
      form['teacherId'] = this.$store.state.user_id;}
    else if(this.$store.state.role ==="student"){
      form['studentId'] = this.$store.state.user_id;
    }
      this.$axios.post("/course_sel/common/get_course/by_course_sel",form).then((response) =>{
        this.myCourseList = response.data;
        console.log(response.data)
      }).catch((error) =>{
        this.myCourseList = [];
        console.log(error)
      })

    console.log(this.myCourseList)
  },
  data(){
    return {
      myCourseList:[],
      clickHref: ""
    };
  },
  methods:{
    myCourseView($event){
      let Href = $event.target.innerText.split('-')[0];
      console.log(Href)
      this.$router.push({
        name
      })
      const {target} = this.$router.resolve({
        path:'/courses/mycourseView/${courseId}',
        // params:{
        //   courseId:Href
        // }
      });
      window.open(target,'_blank');
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