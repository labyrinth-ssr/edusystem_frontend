<script src="../router/index.js"></script>
<template>
  <div>
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
            <el-submenu>
              <template slot="title"
                        style="padding-left:10px">
                <i class="el-icon-menu"></i>
                <span slot="title">添加老师/学生</span>
              </template>
              <el-menu-item :key = "table.navList[0].path" :index="table.navList[0].path">
                <template slot="title"
                          style="padding-left:10px">
                  <span slot="title">单个添加</span>
                </template>
              </el-menu-item>
              <el-menu-item :key = "table.navList[1].path" :index="table.navList[1].path">
                <template slot="title"
                          style="padding-left:10px">
                  <span slot="title">批量添加</span>
                </template>
              </el-menu-item>
            </el-submenu>
            <el-menu-item :key = "table.navList.path" :index="table.navList.path">
              <template slot="title"
                        style="padding-left:10px">
                <i class="el-icon-menu"></i>
                <span slot="title">添加学院/专业</span>
              </template>
            </el-menu-item>
          </el-menu>
        </template>
        <template slot-scope="scope">
          <el-button @click="handleClick(scope.row)" size="middle">{{handel1.text}}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="修改学生/教师" :visible.sync="dialogVisible" :close-on-click-modal='false' v-if = "dialogVisible" :modal="false">
      <div>
        <user-form :action_prop="form_op" :formdata_prop="form"/>
        <el-button  type="primary" @click="SubmitAdd">提交修改</el-button>

      </div>
    </el-dialog>
  </div>
</template>

<script>
import InnerTable from "./innerTable";
import UserForm from "./UserForm"
export default {
  name: "MemTable",
  components: {InnerTable,UserForm},
  created() {
    this.clear()
  },
  data(){
    return{
      form_op:"add",
      dialogVisible:false,
      form:{
        username: "",
        role: "",
        user_id: "",
        id_number: "",
        phone_number: "",
        email: "",
        major_department: [],
        major: "",
        department: ""
      },
      raw:{
        username: "",
        role: "",
        user_id: "",
        id_number: "",
        phone_number: "",
        email: "",
        major_department: [],
        major: "",
        department: ""
      },
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
                {
                  path:'/users/adduserform',
                  icon:null,
                  name:'单次添加'
                },
                {
                  path: '/users/addusercsv',
                  icon: null,
                  name: '批量添加'
                }
        ]
      },
      handel1:{
        text:"编辑",
        edit: this.myEditable
        },
      handel2:{
        visible:false,
        text:"",
        del:this.myHandleDelete
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
    },
    myEditable(rows) {
      this.form_op='admin_add'
      this.dialogVisible=true
      this.form=JSON.parse(JSON.stringify(rows))
      this.form.major_department =Array.from([rows.department, rows.major])
      this.raw =  JSON.parse( JSON.stringify(rows) )
      this.raw.major_department =Array.from([rows.department, rows.major])
    },
    myHandleDelete(rows){
      let temp = rows;
      temp.status ="quit";
      console.log(rows)
      this.$axios.put("/userinfo/admin/altuser",temp)
          .then((response)=>{
            console.log(response.data)
            this.clear()
          }).catch((err)=>{
            console.log(err.data)
      })

      return undefined;
    },
      handleClick(row){
        this.handel1.edit(row)
      },
      handleDelete(row){
        this.handel2.del(row)
      },
    SubmitAdd() {
      this.$axios.put("userinfo/admin/altuser", this.$data.form)
          .then((response) => {
            this.dialogVisible = false
            console.log(response.data);
            console.log(response.data['isOk'])
            if (response.data['isOk'] === true) {

              if (JSON.stringify(this.form) === JSON.stringify(this.raw)) {

                this.$message(
                    {
                      type: "error",
                      message: "尚未修改！"
                    });
              } else {

                this.$message(
                    {
                      type: "success",
                      message: "修改成功！"
                    });
                this.raw =  JSON.parse( JSON.stringify(this.form) )
              }
              this.clear();
            } else {
              this.$message(
                  {
                    type: "error",
                    message: "修改失败！"
                  })
              this.form =  JSON.parse( JSON.stringify(this.raw) )
            }
          }).catch((error) => {
        // this.raw =  JSON.parse( JSON.stringify(this.form) )
        this.form =  JSON.parse( JSON.stringify(this.raw) )
        this.$message(
            {
              type: "error",
              message: "请求出错！"
            })
        console.log(error)

      })
    }
  }

}
</script>
<style>

</style>