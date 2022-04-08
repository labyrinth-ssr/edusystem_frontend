<template>
<div>
<h3>学生选课权限开关</h3>
  <el-switch
  v-model="class_sel_permit"
  active-text="允许"
  inactive-text="禁止"
  >
</el-switch>
</div>
</template>

<script>
export default {
    name:'ClassSelButton',
    data() {
      return {
        class_sel_permit: true
      }
    }
}
</script>

<style>

</style>