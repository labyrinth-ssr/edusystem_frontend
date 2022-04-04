<template>
  <div class = "inner-table">
    <el-table
        :data="table.data"
        style="width: 100%"
        :stripe = "true"
        border
        flex="left">
      <template v-for="col in table.head">
        <el-table-column
            :prop="col.prop"
            :label="col.label"
            :fixed="col.fix"
            :width="col.width">
        </el-table-column>
      </template>
        <el-table-column
            align="right"
            :width=table.navWidth
            fixed = "right">
          <template slot="header" slot-scope="scope">
            <el-menu :default-active="'/index'" router mode="horizontal" background-color="white" text-color="#222"
                     active-text-color="red" style="min-width: 1300px">
              <inner-menu :navList="table.navList"></inner-menu>
            </el-menu>
          </template>
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.row)" size="middle">编辑</el-button>
            <el-button size="middle" type ="danger" >删除</el-button>
          </template>
        </el-table-column>
    </el-table>
  </div>
</template>

<script>
import InnerMenu from './innerMenu.vue'

export default {
  name: "InnerTable",
  props:['table'],
  components: {InnerMenu},
  data(){
    return{

    }
  }
}
</script>

<style scoped>

</style>