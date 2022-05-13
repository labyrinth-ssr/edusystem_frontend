<script src="../router/index.js"></script>
<template>
  <div>
    <el-table
        :data="table.data.filter(filter
        )"
        style="width: 100%"
        :stripe = "true"
        border
        flex="left">
      <el-table-column prop="user_id" key="user_id" label="学号/工号" fix="left" width="150px">
        <template slot="header" slot-scope="scope">
          <el-input
              v-model="search_id"
              size="medium"
              clearable
              placeholder="学号/工号"/>
        </template>
      </el-table-column>
      <el-table-column prop="username" key="username" label="名字" width="120px">

        <template slot="header" slot-scope="scope">
          <el-input
              v-model="search_name"
              size="medium"
              clearable
              placeholder="名字"/>
        </template>
      </el-table-column>
      <el-table-column prop="role" key="role" label="身份" width="120px">
        <template slot="header" slot-scope="scope">

          <el-select v-model="search_role" size="medium" clearable placeholder="身份">
            <el-option
                key="teacher"
                label="教师"
                value="teacher">
            </el-option>
            <el-option
                key="student"
                label="学生"
                value="student">
            </el-option>
            <el-option
                key="admin"
                label="管理员"
                value="admin">
            </el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column prop="id_number" key="id_number" label="身份证号" width="200px"></el-table-column>
      <el-table-column prop="register_year" key="register_year" label="注册年份"  width="150px">
        <template slot="header" slot-scope="scope">
          <el-date-picker
          v-model="search_year"
          type="year"
          clearable
          :style="{width:'120px'}"
          placeholder="注册年份">
          </el-date-picker>
        </template>
      </el-table-column>
      <el-table-column prop="phone_number" key="phone_number" label="手机号码"  width="100px"></el-table-column>
      <el-table-column prop="department" key="department" label="学院" width="120px">
        <template slot="header" slot-scope="scope">
          <el-input
              v-model="search_department"
              size="medium"
              clearable
              placeholder="学院"/>
        </template>
      </el-table-column>
      <el-table-column prop="major" key="major" label="专业"  width="120px">
        <template slot="header" slot-scope="scope">
          <el-input
              v-model="search_major"
              size="medium"
              clearable
              placeholder="专业"/>
        </template>
      </el-table-column>
      <el-table-column prop="status" key="status" label="状态"  width="120px"></el-table-column>
      <el-table-column prop="email" key="email"  label="邮箱" width="120px"></el-table-column>
      <el-table-column
          align="right"
          :width=table.navWidth
          fixed = "right">
        <template slot="header" >
          <el-menu :default-active="'/index'" router mode="horizontal" background-color="white" text-color="#222"
                   active-text-color="red" style="min-width: 1300px">
            <el-submenu index>
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
      search_id:'',
      search_name:'',
      search_role:'',
      search_major:'',
      search_department:'',
      search_year:'',
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
        data: [
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
    filter(ele){
console.log(ele.user_id)
          return  (!this.search_id|| ele.user_id.toLowerCase().includes(this.search_id.toLowerCase()))
          &&(!this.search_name|| ele.username.toLowerCase().includes(this.search_name.toLowerCase()))
          &&(!this.search_major|| ele.major.toLowerCase().includes(this.search_major.toLowerCase()))
          &&(!this.search_department || ele.department.includes(this.search_department))
          &&(!this.search_role|| ele.role.toLowerCase().includes(this.search_role.toLowerCase()))
          &&(!this.search_year||ele.register_year.toLowerCase().includes(this.search_year.toLowerCase()))
    },
    clear(){
      this.$axios.post("/userinfo/admin/getusers",{})
          .then((response) => {
            console.log(response.data)
            this.table.data = response.data.filter((ele)=>ele.user_id!='root')
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