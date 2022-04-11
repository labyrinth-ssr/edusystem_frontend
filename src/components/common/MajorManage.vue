<template>
  <inner-table :table="this.table" :handel1="this.handel1" :handel2="this.handel2">

  </inner-table>
</template>


<script>
import InnerTable from "./innerTable"

export default {
  name: "MajorManage",
  components: {InnerTable},
  created(){
    this.clear()
  },
  data(){
    function major_del(data){
      console.log(data.major);
      this.$axios.delete("/org/admin/delmajor",{
        data:{
          department:data.department,
          major:data.major
        }}
      ).then( (response)=>{
        console.log(response)
        this.clear()
      }).catch( (response)=>{
        windows.alert("删除专业失败！")
      })

      return undefined
    }
    function department_del(data)
    {
      console.log(data.department)
      const formData = new FormData()
      formData.append("department", data.department)
      this.$axios.delete("org/admin/deldepartment",
          formData).then( (response)=>{
        console.log(response)
        this.clear()
      }).catch( (response)=>{
        windows.alert("删除学院失败！")
      })

      return undefined
    }
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
      },
      handel1:{
        text:"删除专业",
        edit:major_del
      },
      handel2:{
        text:"删除学院",
        del:department_del
      }
    }
  },
  methods: {
    clear(){
      this.$axios.get("/org/admin/getorgs",{})
          .then((response) => {
            console.log(response.data)
            this.$data.table.data = response.data
          }).catch((error) => {console.log(error)});
    }
  }
}
</script>

<style scoped>

</style>