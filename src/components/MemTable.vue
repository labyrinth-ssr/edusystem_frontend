<!--WARNING:This is a test from zhx-->
<template>
  <inner-table :table="this.table" :handel1="this.handel1" :handel2="this.handel2">

  </inner-table>
</template>

<script>
import InnerTable from "./innerTable";

export default {
  name: "Notice_A_test",
  components: {InnerTable},
  created() {
    this.clear()
  },
  data(){
    function myEditable(rows) {
      console.log(rows)
      rows.setValue
      return undefined;
    }
    function myHandleDelete(rows){
      console.log(rows)
      return undefined;
    }

    return{
      table:{
        'data': [
        ],
        'head':[
          {prop:"user_id",label:"学号/工号",fix:"left",width:"120"},
          {prop:"username",label:"名字",width: "120"},
          {prop:"role",label:"身份",width: "120"},
          {prop: "id_number",label: "身份证号",width: "200"},
          {prop: "register_year",label: "注册年份",width: "100"},
          {prop: "phone_number",label: "手机号码",width: "100"},
          {prop: "department",label: "学院",width: "150"},
          {prop: "major",label: "专业",width: "150"},
          {prop: "status",label: "状态",width: "100"},
          {prop: "email",label: "邮箱",width: "150"}
        ],
        navWidth:180,
        navList:[
            {path: '/admin', name: '添加学生/教师',icon:"el-icon-circle-plus-outline"
              ,'children':[
                {
                  path:'/admin/adduserform',
                  icon:null,
                  name:'单次添加'
                },
                {
                  path: '/admin/upload',
                  icon: null,
                  name: '批量添加'
                }
              ]},
        ]
      },
      handel1:{
        text:"编辑",
        edit: myEditable
        },
      handel2:{
        text:"修改状态",
        del:myHandleDelete
      },

    }
  },
  methods: {
    clear(){
      this.$axios.post("/userinfo/admin/getusers",{})
          .then((response) => {
            console.log(response.data)
            this.$data.table.data = response.data
          }).catch((failResponse)=>{console.log(failResponse)});
    }
  }

}
</script>
<style>

</style>