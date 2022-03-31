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
            width="150"
            fixed = "right">
          <template slot="header" slot-scope="scope">
            <el-button>
              <i class="el-icon-circle-plus-outline"></i>
              <span>添加内容</span>
            </el-button>

          </template>
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.row)" type="text" size="small">编辑</el-button>
            <el-button size="small" type ="danger" >删除</el-button>
          </template>
        </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: "InnerTable",
  props:['table'],
  data(){
    return{

    }
  }
}
</script>

<style scoped>

</style>