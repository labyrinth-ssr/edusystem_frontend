<template>
  <el-row :gutter="20">
    <el-col :span="6" v-for="item in myCourseList" :key="item.title" >
      <el-card style="{ padding: 0;margin: 5px;border-radius: 10px;}" :body-style = "{padding:'0px'}">
        <span class="image">&nbsp;</span>
        <div style="padding: 0px;">
          <el-button type="text" class="button">{{item.name}}</el-button>
          <br>
          <div class="bottom">
            <span>{{item.term}}</span>
          </div>
        </div>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
export default {
  name: "myCourse",
  created() {
    this.myCourseList = Array.from([
      {
        name: "物理",
        term: "2020-2021学年第一学期"
      },{
        name: "物理",
        term: "2020-2021学年第一学期"
      },{
        name: "物理",
        term: "2020-2021学年第一学期"
      },{
        name: "物理",
        term: "2020-2021学年第一学期"
      },{
        name: "物理",
        term: "2020-2021学年第一学期"
      },{
        name: "物理",
        term: "2020-2021学年第一学期"
      },
    ])
    console.log(this.myCourseList)
  },
  data(){
    return {
      myCourseList:[]
    };
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