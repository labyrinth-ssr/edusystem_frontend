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
    return{
      table: {
        'data':[

        ],
        'head':[
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
        edit:this.major_del
      },
      handel2:{
        visible:'',
        text:"删除学院",
        del:this.department_del
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
    },
    department_del(data)
    {
      console.log(data.department)
      const formData = new FormData() 
        formData.append('department', data.department) 
      this.$axios.delete("org/admin/deldepartment",{
        data:formData
      }).then( (response)=>{
        console.log(response.data)
        this.clear()
      }).catch( (response)=>{
        windows.alert("删除学院失败！")
      })
      return undefined
    },
    major_del(data){
      console.log(data.major, data.department);
      const formData = new FormData() 
        formData.append('department', data.department) 
        formData.append('major', data.major)
      this.$axios.delete("/org/admin/delmajor",{
        data:formData
      }).then( (response)=>{
        console.log(response.data)
        this.clear()
      }).catch( (response)=>{
        windows.alert("删除专业失败！")
      })

      return undefined
    }
  }
}
</script>

<style scoped>

</style>