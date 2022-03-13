<template>
  <div >
  <div class="line"></div>
  <el-menu
      :default-active="activeIndex2"
      class="el-menu-demo"
      mode="horizontal"
      @select="handleSelect"
      background-color="#409EFF"
      text-color="#fff"
      active-text-color="#ffd04b">
    <el-menu-item index="1">处理中心</el-menu-item>
    <el-submenu index="2" text-color="#ffd04b" >
      <template slot="title"><i class="el-icon-circle-plus-outline"/>增加信息</template>
      <el-menu-item index="2-1" v-on:click="addUsers">学生/老师</el-menu-item>
      <el-menu-item index="2-3">课程</el-menu-item>
      <el-submenu index="2-4">
        <template slot="title">批量添加</template>
        <el-menu-item index="2-4-1">学生</el-menu-item>
        <el-menu-item index="2-4-2">教师</el-menu-item>
        <el-menu-item index="2-4-3">课程</el-menu-item>
      </el-submenu>
    </el-submenu>
    <el-menu-item index="3" disabled>消息中心</el-menu-item>
  </el-menu>
  </div>
</template>

<script>

export default {
  name: "AdminHome",
  data() {
    return {
      activeIndex: '1',
      activeIndex2: '1'
    };
  },
  methods: {
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    },
    addUsers(){
      // var path = this.$route.query.redirect;
      this.$router.replace(
      "/adduserform"
      );
    }
  }
}
</script>

<style scoped>

</style>
<style >
body{
  background-image: linear-gradient(to top, #fff1eb 0%, #ace0f9 100%);
  background-size: 100% 100vh;
}
</style>