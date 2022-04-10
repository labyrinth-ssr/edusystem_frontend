<template>
    <div id="iter-menu">
    <template v-for="item in navList">
      <el-submenu v-if="item.hasOwnProperty('children')&&item.children.length>0&&norender.indexOf(item.name)==-1"
        :key="item.path"
        :index="item.path">
        <template slot="title"
          style="padding-left:10px">
          <i class="el-icon-menu"></i>
          <span slot="title">{{ item.name}}</span>
        </template>
         <!-- 如果有子级数据使用递归组件 -->
        <InnerMenu :navList="item.children"></InnerMenu>
      </el-submenu>
      <el-menu-item v-else-if="norender.indexOf(item.name)==-1"
        :index="item.path"
        :key="item.path">
        <i :class="item.icon"></i>
        <span>{{item.name}}</span>
      </el-menu-item>
    </template>
    </div>
</template>

<script>
  export default {
    name: 'InnerMenu',
    props:['navList'],
    data () {
      return {
        norender:['登录','账户','init','个人中心']
      }
    }
  }
</script>
<style>
/* #iter-menu{
    display: flex;
} */
/* .el-submenu__title {
    display: block;
} */
</style>


