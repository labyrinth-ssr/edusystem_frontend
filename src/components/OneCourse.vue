<template>

</template>

<script>
export default {
  name: "OneCourse",
  created() {
    this.$axios.get().then((response)=>{

    }).catch((error)=>{

    })
  },
  data(){
    return{
      student_list: [],
      teacher_list: [],
    }
  }
}
</script>

<style scoped>

</style>