<template>
  <div>
    <el-table
        :data="table.data"
        style="width: 100%"
        :stripe = "true"
        :span-method="bindRow"
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
          <div>
            <el-button @click="major_edit(scope.row)" size="middle">{{handel1.text}}</el-button>
            <el-button :style="{display:handel2.visible}" size="middle" @click="department_edit(scope.row)">{{handel2.text}}</el-button>
          </div>
        </template>
      </el-table-column>

    </el-table>
    <div>
      <el-dialog title="学院删除/修改" :visible.sync="dialogVisible_department" v-if = "dialogVisible_department" :close-on-click-modal='false'>
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
      <el-dialog title="专业删除/修改" :visible.sync="dialogVisible_major" v-if ='dialogVisible_major' :close-on-click-modal='false'>
        <el-form :model="major_form" style="text-align: left">
          <el-form-item label="学院名称" prop="department_name">
            <el-input disabled v-model="major_form.department_name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="专业名称" prop="major_name">
            <el-input disabled v-model="major_form.major_name" autocomplete="off"></el-input>
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
    </div>
  </div>
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
        bind_arr:[],
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
    bindRow({ row, column, rowIndex, columnIndex }){
      var find_val=this.bind_arr.find(x=>x.dep==row.department)
      if (columnIndex === 0) {
          if (rowIndex === find_val.start) {
            return {
              rowspan: find_val.span,
              colspan: 1
            };
          } else {
            return {
              rowspan: 0,
              colspan: 0
            };
          }
        }
    },
    clear() {
      this.$axios.get("/org/common/getorgs", {})
        .then((response) => {
          console.log(response.data)
          var data = response.data
          data.sort(function (a, b) {
            if (a.department < b.department) {
              return -1;
            }
            if (a.department > b.department) {
              return 1;
            }
            return 0;
          });
          var bind_arr=[]
            var start_track=0
          data.forEach(ele=> {
            var index=bind_arr.findIndex(x=>x.dep==ele.department)
            console.log(index)
            if(index==-1){
              bind_arr.push({dep:ele.department,start:start_track,span:1})
              start_track+=1
            }
            else{
              bind_arr[index].span+=1
              start_track+=1
            }
          });
          console.log(bind_arr)
          this.bind_arr=bind_arr
          console.log(data)
          this.$data.table.data = data
        }).catch((error) => {
          console.log(error)
        });
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
        const res = response.data
        console.log(response.data)
        if(res === 0){
          this.$message({
            type:"success",
            message: "删除学院成功！"
          })
        }else if(res === 1){
          this.$message({
            type:"error",
            message: "删除学院失败！"
          })
        }else if(res === 2){
          this.$message({
            type:"error",
            message: "用户表中含有要删除学院信息！"
          })
        }else if(res === 3){
          this.$message({
            type:"error",
            message: "课程表中含有要删除学院信息！"
          })
        }else if(res === 4){
          this.$message({
            type:"error",
            message: "用户表与课程表中含有要删除学院信息！"
          })
        }
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
        const formData = new FormData()
        formData.append("old_department", this.department_form.department_name)
        formData.append("new_department", this.department_form.department_new)
        this.$axios.put("/org/admin/altdepartment",
            formData
        ).then((response)=>{
          if (response.data === true)
          {
            this.$message({type: 'success',message:"修改成功！"})
            this.department_form.department_name = this.department_form.department_new
            this.department_form.department_new = ''
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
        const res = response.data
        if(res === 0)
        {
          this.$message({
            type:"success",
            message: "删除专业成功！"
          })
        }else if(res === 1){
          this.$message({
            type:"error",
            message: "删除专业失败！"
          })
        }else if(res === 2){
          this.$message({
            type:"error",
            message: "用户表含有要删除的专业信息！"
          })
        }
        console.log(response.data)
        this.clear()
      }).catch( (response)=>{
        console.log(response.data)
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
        const formData =new FormData()
        formData.append("department", this.major_form.department_name)
        formData.append("old_major",this.major_form.major_name)
        formData.append("new_major",this.major_form.major_new)
        this.$axios.put("/org/admin/altmajor",
            formData
        ).then((response)=>{
          if (response.data === true)
          {
            this.$message({type: 'success',message:"修改成功！"})
            this.major_form.major_name = this.major_form.major_new
            this.major_form.major_new =''
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