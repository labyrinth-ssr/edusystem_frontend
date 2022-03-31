<template>
  <div class = "inner-table">
    <el-table
        :data="table.data"
        style="width: 100%"
        stripe = "true">
      <template v-for="col in table.head">
        <el-table-column
            :prop="col.prop"
            :label="col.label">
        </el-table-column>
      </template>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
              size="mini"
              @click="table.editable(scope.$index, scope.row)">编辑</el-button>
          <el-button
              size="mini"
              type="danger"
              @click="table.handleDelete(scope.$index, scope.row)">删除</el-button>
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