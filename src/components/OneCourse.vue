<template>
<h1>我的课程</h1>
</template>

<script>
export default {
  name: "OneCourse",
  created() {
    this.$axios.get("/course_sel/common/get_course_sel/by_all",
    {
      consoleId: this.$store.params.courseId
    }).then((response)=>{
      console.log(response.data)
      this.course_list = response.data
    }).catch((error)=>{
      console.log(error)
    })
  },
  data(){
    return{
      course_list: [],
    }
  }
}
</script>

<style scoped>

</style>