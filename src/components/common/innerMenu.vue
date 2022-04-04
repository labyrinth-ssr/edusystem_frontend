<template>
    <div id="iter-menu">
    <template v-for="item in navList">
      <el-submenu v-if="item.hasOwnProperty('children')&&item.children.length>0"
        :key="item.path"
        :index="item.path">
        <template slot="title"
          style="padding-left:10px">
          <i :class="item.icon"></i>
          <span slot="title">{{ item.name}}</span>
        </template>
         <!-- 如果有子级数据使用递归组件 -->
        <InnerMenu :navList="item.children"></InnerMenu>
      </el-submenu>
      <el-menu-item v-else
        :index="item.path"
        :key="item.path"
        mode="horizontal">
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
      }
    }
  }
</script>
<style>
#iter-menu{
    display: flex;
}
/* .el-submenu__title {
    display: block;
} */
</style>


