<template>
  <div class = "inner-table">
    <el-table
        :data="table.data"
        style="width: 100%"
        :stripe = "true"
        border
        flex="left">
      <template v-for="col in table.head">
        <el-table-column :key="col.prop"
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
          <template slot="header" >
            <el-menu :default-active="'/index'" router mode="horizontal" background-color="white" text-color="#222"
                     active-text-color="red" style="min-width: 1300px">
              <inner-menu :navList="table.navList"></inner-menu>
            </el-menu>
          </template>
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.row)" size="middle">{{handel1.text}}</el-button>
            <el-button :style="{display:handel2.visible}" size="middle" @click="handleDelete(scope.row)">{{handel2.text}}</el-button>
          </template>
        </el-table-column>
    </el-table>
  </div>
</template>

<script>
import InnerMenu from './innerMenu.vue'

export default {
  name: "InnerTable",
  props: {
    'table': {},
    handel1: {
      text: '',
      edit: {
        type: Function
      }
    },
    handel2: {
      visible:'none',
      text: '',
      del: {
        type: Function
      }
    }
  },
  components: {InnerMenu},
  data(){

    return{

    }
  },
  methods: {
    handleClick(row){
      this.handel1.edit(row)
    },
    handleDelete(row){
      this.handel2.del(row)
    }
  }


}
</script>

<style scoped>

</style>