<template>
  <div class = "inner-table">
    <el-table
        :data="table.data"
        style="width: 100%"
        :stripe = "true"
        border
        flex="left">
      <template v-for="col in table.head" >
        <el-table-column :key="col"
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
            <!-- <el-menu :default-active="'/index'" router mode="horizontal" background-color="white" text-color="#222"
                     active-text-color="red" style="min-width: 1300px">
              <inner-menu :navList="table.navList"></inner-menu>
            </el-menu> -->
            <el-button @click="dialogVisible=true" size="middle">{{table.navList[0].name}}</el-button>
          </template>
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.row)" size="middle">{{handel1.text}}</el-button>
            <el-button size="middle" @click="handleDelete(scope.row)">{{handel2.text}}</el-button>
          </template>
        </el-table-column>
    </el-table>
    <el-dialog :visible.sync="dialogVisible">
      <department-form :formdata_prop="departmentForm"/>
      <div slot="footer" class="dialog-footer">
                  <el-button >
                      取消
                  </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import InnerMenu from './innerMenu.vue'
import DepartmentForm from './DepartmentForm.vue';

export default {
  name: "InnerTable",
  props: {
    table: {},
    handel1: {
      text: '',
      edit: {
        type: Function
      }
    },
    handel2: {
      text: '',
      del: {
        type: Function
      }
    }
  },
  components: {
    InnerMenu,
    DepartmentForm
  },
  data() {

    return {
      dialogVisible: false,
      departmentForm: this.table.data

    }
  },
  methods: {
    handleClick(row) {
      this.handel1.edit(row)
    },
    handleDelete(row) {
      this.handel2.del(row)
    }
  }


}
</script>

<style scoped>

</style>