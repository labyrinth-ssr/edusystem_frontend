<template>
  <inner-table :table="this.table">

  </inner-table>
</template>


<script>
import InnerTable from "./innerTable"

export default {
  name: "MajorManage",
  components: {InnerTable},
  created(){
    console.log("enter majormanage")
    this.$axios.post("/admin/org/getorgs",{})
    .then((response) => {
      console.log(response.data)
      this.$data.table.data = response.data
    }).catch((error) => {console.log(error)});
  },
  data(){
    return{
      table: {
        'data':[

        ],
        'head':[
          {prop:"id",label:"id",fix:"left",width:"200"},
          {prop:"department",label:"院系",width:"250"},
          {prop:"major",label:"专业",width:"250"}
        ],
        navWidth:180,
        navList:[
          {path:'/admin/orgmanage',name:'添加学院/专业',icon:"el-icon-circle-plus-outline"}
        ]
      }
    }
  }
}
</script>

<style scoped>

</style>