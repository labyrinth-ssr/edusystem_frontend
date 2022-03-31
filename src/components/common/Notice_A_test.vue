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
    this.$axios.post("/admin/user/getusers",{})
    .then((response) => {
      console.log(response.data)
      this.$data.table.data = response.data
    }).catch((failResponse)=>{console.log(failResponse)});
  },
  data(){
    function myEditable(index, rows) {
      return undefined;
    };
    function myHandleDelete(index,rows){
      rows.splice(index,1);
      console.log(index)
      return undefined;
    };

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
        ]
      }
    }
  }

}
</script>
<style>

</style>