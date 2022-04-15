<template>
<div>
<h3>学生选课权限开关</h3>
  <el-switch
  v-model="class_sel_permit"
  active-text="允许"
  inactive-text="禁止"
  @change="changeSel"
  >
</el-switch>
</div>
</template>

<script>
export default {
  name: 'ClassSelButton',
  data() {
    return {
      class_sel_permit: ''
    }
  },
  created(){
this.$axios.get('/permission/common/check_choose_course').then((resp)=>{
  console.log(resp.data)
              this.class_sel_permit=resp.data
  })
  },
  methods: {
    changeSel() {
      console.log(this.class_sel_permit)
      this.$axios({
        method: 'post',
        url: '/permission/admin/choose_course',
  params: {
    'approved': this.class_sel_permit
  }
}).then((resp) => {
        console.log(resp.data)
      })
    }
  }
}
</script>

<style>

</style>