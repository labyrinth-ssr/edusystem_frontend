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
      class_sel_permit: true
    }
  },
  methods: {
    changeSel() {
      console.log({
          'approved': false
      })
      this.$axios({
        method: 'post',
        url: '/permission/admin/choose_course',
  params: {
    'approved': true
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