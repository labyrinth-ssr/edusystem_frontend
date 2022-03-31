<!--WARNING:This is a test from zhx-->
<template>
  <inner-table :table="this.table">

  </inner-table>
</template>

<script>
import InnerTable from "./innerTable";

export default {
  name: "Notice_A_test",
  components: {InnerTable},
  created() {
  },
  data(){
    function editable(index, col) {
      return undefined;
    };
    function handleDelete(index,col){
      return undefined;
    };

    return{
      table:{
        'data': [
            {
              date: '2016-05-02',
              name: '王小虎',
              address: '上海市普陀区金沙江路 1518 弄'
            }, {
              date: '2016-05-04',
              name: '王小虎',
              address: '上海市普陀区金沙江路 1517 弄'
            }, {
              date: '2016-05-01',
              name: '王小虎',
              address: '上海市普陀区金沙江路 1519 弄'
            }, {
              date: '2016-05-03',
              name: '王小虎',
              address: '上海市普陀区金沙江路 1516 弄'
            }
        ],
        'head':[
          {prop:"date",label:"日期"},
          {prop:"name",label:"名字"},
          {prop:"address",label:"地址"}
        ],
        method(){
          editable = this.editable;
          handleDelete = this.handleDelete
        }
      }
    }
  }
}
</script>
<style>

</style>