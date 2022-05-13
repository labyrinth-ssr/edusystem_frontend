<template>
<div>
  <h3>当前学期</h3>
  <h4>{{currentTerm }}</h4>
<!--  <el-form>-->
<!--    <el-form-item label="选择学期">-->
<!--      <el-quarter-picker size="small" v-model="term_value" placeholder="选择学期" @change ="term_change"/>-->
<!--    </el-form-item>-->
<!--    <el-form-item>-->
<!--      <el-button type="primary" size="small" @click="termEdit">修改学期</el-button>-->
<!--    </el-form-item>-->
<!--  </el-form>-->
  <el-button @click="termGo">学期向前进</el-button>
  <el-button @click="termBack">学期向后退</el-button>
  <h3>学生选课</h3>
  <template>
    <el-radio-group v-model="class_sel_permit" @change="changeSel">
      <el-radio :label="0">禁止</el-radio>
      <el-radio :label="1">第一轮选课</el-radio>
      <el-radio :label="2">第二轮选课</el-radio>
    </el-radio-group>
  </template>
</div>
</template>

<script>
import ElQuarterPicker from './ElQuarterPicker.vue'
export default {
  components:{ElQuarterPicker},
  name: 'ClassSelButton',
  data() {
    return {
      term_value:'' ,
      currentTerm :'',
      class_sel_permit: ''
    }
  },
  mounted(){
    this.$axios.get("/permission/common/current_semester")
        .then((resp)=>{
          this.currentTerm = resp.data.toString()
          if(this.currentTerm.length==4){
            this.currentTerm +='.0'
          }
          console.log(this.currentTerm)

          this.term_value=this.currentTerm.split('.')[0]+'-0'+
              this.currentTerm.split('.')[1]
          console.log(this.term_value)
        }).catch((error)=>{
      console.log(error)
    })
    this.flush();
  },
  methods: {
    flush(){
      this.$axios.get("/permission/common/current_semester")
          .then((resp)=>{
            this.currentTerm = resp.data.toString()
            if(this.currentTerm.length == 4){
              this.currentTerm = this.currentTerm + '.0';
            }
            this.term_value=this.currentTerm.split('.')[0]+'-0'+
                this.currentTerm.split('.')[1]
            console.log(this.term_value)
          }).catch((error)=>{
            console.log(error)
      })
      this.$axios.get("/permission/common/check_choose_course")
          .then((resp)=>{
            this.class_sel_permit= resp.data
          }).catch((error)=>{
        console.log(error)
      })
    },
    changeSel() {
      console.log(this.class_sel_permit)
      this.$axios({
        method: 'post',
        url: '/permission/admin/choose_course',
        params: {
          stage: this.class_sel_permit,
        }
      }).then((resp) => {
        console.log(resp.data)
        if(resp.data){
          this.$message({
            type:'success',
            message:"修改成功！"
          })
          this.flush();
        }else {
          this.$message({
            type:'error',
            message:"修改失败！"
          })
        }
      }).catch((error)=>{
            console.log(error)
      })
      this.$axios.get("/permission/common/check_choose_course").then((response)=>{
        console.log("选课阶段:"+response.data)
      })
    },
    termGo(){

      let temp1 = this.currentTerm.split('.')
      console.log("temp1:"+temp1)
      if(parseInt(temp1[1] )+1>= this.$store.state.termsPerY){
        temp1 = (parseInt(temp1[0])+1).toString()+'.0';
      }else {
        temp1 = temp1[0]+'.'+(parseInt(temp1[1])+1)
      }
      console.log("current:"+ this.currentTerm)
      console.log("temp1:"+temp1)
      this.$axios.post("/permission/admin/set_semester?semester="+temp1.toString()).then((resp)=>{
        console.log(resp.data)
        if(resp.data){
          this.$axios.get('/permission/common/current_semester').then((resp)=>{
            this.$store.state.currentTerm=resp.data
            console.log("学期:"+ this.$store.state.currentTerm)
          });
        }
        this.flush();
      })
    },termBack(){

      let temp1 = this.currentTerm.split('.')
      if(parseInt(temp1[1]) == 0){
        temp1 = (parseInt(temp1[0])-1).toString() + '.'+(this.$store.state.termsPerY-1)
      }else {
        temp1 = temp1[0]+'.'+(parseInt(temp1[1])-1).toString()
      }
      console.log("current:"+ this.currentTerm)
      console.log("temp1:"+temp1)
      this.$axios.post("/permission/admin/set_semester?semester="+temp1.toString()).then((resp)=>{
        console.log(resp.data)
        if(resp.data){
          this.$axios.get('/permission/common/current_semester').then((resp)=>{
            this.$store.state.currentTerm=resp.data
            console.log("学期:"+ this.$store.state.currentTerm)
          });
        }
        this.flush()
      })
    },
    // termEdit(){
    //
    // },
    term_change() {
      console.log(this.$store.state.currentTerm)
      console.log(this.term_value)
      let  temp=this.term_value.split('-');
      temp = temp[0] +'.' + parseInt(temp[1]).toString();
      if(Number(temp) < Number(this.$store.state.currentTerm)){
        this.$message({
          type:"warning",
          message:"你正在回退学期，请注意！"
        })
      }
      if(Number(temp) >Number(this.$store.state.currentTerm) + 0.1){
        this.$message({
          type:"warning",
          message:"你正在跳过一些学期，请注意！"
        })
      }
    }
  }
}
</script>

<style>

</style>