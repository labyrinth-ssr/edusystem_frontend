<template>
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
          <el-button @click="major_edit(scope.row)" size="middle">{{handel1.text}}</el-button>
          <el-button :style="{display:handel2.visible}" size="middle" @click="department_edit(scope.row)">{{handel2.text}}</el-button>
      </template>
    </el-table-column>

  <el-dialog title="学院删除/修改" :visible.sync="dialogVisible_department" :close-on-click-modal='false'>
            <el-form :model="department_form" style="text-align: left">
              <el-form-item label="学院名称" prop="department_name">
                <el-input disabled v-model="department_form.department_name" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="重命名名称" prop="department_new">
                <el-input v-model="department_form.department_new" autocomplete="off" placeholder="请输入新名称"></el-input>
              </el-form-item>
            </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="admin_del_depart" >
                  删除学院
                </el-button>
                <el-button type="primary" @click="admin_rename_depart">
                  学院重命名
                </el-button>
              </div>
            </el-dialog>
  <el-dialog title="专业删除/修改" :visible.sync="dialogVisible_major" :close-on-click-modal='false'>
    <el-form :model="major_form" style="text-align: left">
      <el-form-item disabled label="学院名称" prop="department_name">
        <el-input v-model="major_form.department_name" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item disabled label="专业名称" prop="major_name">
        <el-input v-model="major_form.major_name" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="重命名名称" prop="major_new">
        <el-input v-model="major_form.major_new" autocomplete="off" placeholder="请输入新名称"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="admin_del_major" >
        删除专业
      </el-button>
      <el-button type="primary" @click="admin_rename_major">
        专业重命名
      </el-button>
    </div>
  </el-dialog>
  </el-table>
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
        navWidth:250,
        navList:
            {
              path:'/department/addform',
              icon: null,
              name:"添加学院/专业"
            }
      },
      handel1:{
        text:"编辑专业",
      },
      handel2:{
        visible:'',
        text:"编辑学院",
      },
      dialogVisible_major:false,
      dialogVisible_department:false,
      major_form:{
        department_name:'',
        major_name:'',
        major_new:''
      },
      department_form:{
        department_name:'',
        department_new:''
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
    department_edit(data)
    {
      this.department_form =
          {
            department_name:data.department,
            department_new:''
          }
      console.log(this.department_form)
      this.dialogVisible_department = true

      return undefined
    },
    major_edit(data){
      this.major_form=
          {
            department_name:data.department,
            major_name:data.major,
            major_new:''
          }
      console.log(this.major_form)
      this.dialogVisible_major = true
    },
    admin_del_depart(){
      let formData = new FormData()
      formData.append('department', this.department_form.department_name)
      this.$axios.delete("org/admin/deldepartment",{
        data:formData
      }).then( (response)=>{
        console.log(response.data)
        this.clear()
      }).catch( (response)=>{
        this.$message({
          type:"error",
          message: "删除学院失败！"
        })
        console.log(response)
      })
    },
    admin_rename_depart()
    {
      if(this.department_form.department_new ==='')
      {
        this.$message({type: 'error',message:"表单不能为空"})
      }else if(this.department_form.department_new === this.department_form.department_name)
      {
        this.$message({type: 'error',message:"新名称与之前形同！"})
        this.department_form.department_new=''
      }else {
        this.$axios.put("/org/admin/altdepartment",
            {
              "old_department":this.department_form.department_name,
              "new_department":this.department_form.department_new
            }).then((response)=>{
              if (response.data === true)
              {
                this.$message({type: 'success',message:"修改成功！"})
                this.clear()
              }
            }).catch((response)=>{
              console.log(response)
        })
      }
    },
    admin_del_major(){
      const formData = new FormData()
      formData.append('department', this.major_form.department_name)
      formData.append('major', this.major_form.major_name)
      this.$axios.delete("/org/admin/delmajor",{
        data:formData
      }).then( (response)=>{
        console.log(response.data)
        this.clear()
      }).catch( (response)=>{
        this.$message({
          type:"error",
          message: "删除专业失败！"
        })
      })
    },
    admin_rename_major()
    {
      if(this.major_form.major_new ==='')
      {
        this.$message({type: 'error',message:"表单不能为空"})
      }else if(this.major_form.major_new === this.major_form.major_name)
      {
        this.$message({type: 'error',message:"新名称与之前形同！"})
        this.major_form.major_new=''
      }else {
        this.$axios.put("/org/admin/altmajor",
            {
              department: this.major_form.department_name,
              old_major:this.major_form.major_name,
              new_major:this.major_form.major_new
            }).then((response)=>{
          if (response.data === true)
          {
            this.$message({type: 'success',message:"修改成功！"})
            this.clear()
          }
        }).catch((response)=>{
          console.log(response)
        })
      }
    },

  }
}
</script>

<style scoped>

</style>