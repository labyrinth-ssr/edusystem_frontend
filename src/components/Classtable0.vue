<template>
<div>
  <el-button @click="dialogVisible=true">
    排课管理
  </el-button>
  <el-dialog :visible.sync="dialogVisible" :close-on-click-modal='false'>
      <el-form :model="form" style="text-align: left" ref="form" >
                  <el-form-item label="课程编号">
                      <el-input v-model="form.number"/>
                  </el-form-item>
                  <el-form-item label="教室">
                      <el-input v-model="form.classroom_id"/>
                  </el-form-item>
                  <el-form-item label="上课时间">
                      <el-input v-model="form.class_time"/>
                  </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align: center">
        <el-button  type="primary" @click="arrange_class">修改排课</el-button>
      </div>
  </el-dialog>
   <el-table :data="tabledata" style="width: 100%">
     <el-table-column prop="classroom" label="教室" width="80">
     </el-table-column>
     <el-table-column v-for="index in classnum" :key="index" :prop="index+''" :label="'第'+(index+1)+'节'" width="86"/>
   </el-table>
   <div style="text-align: center;margin-top: 30px;">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="total"
        @current-change="current_change">
      </el-pagination>
    </div>
</div>
</template>

<script>
export default {
    name:'ClassroomTable',
    data() {
      return{
        dialogVisible:false,
        multabledata:[],
        tabledata:[],
        page:0,
        classnum:[...(new Array(14)).keys()],
        total:70,
        form:{
          requester_id:this.$store.state.user_id,
          number:'',
          suffix:1,
          class_time:'', //周次和节次，前者为1-7，后者为1-14
          classroom_id:''
        }
      }
    },
    created(){
      this.$axios.get('/class_table/common/timetable').then((resp)=>{
        console.log(resp.data)
        const respdata=Object.values(resp.data)
        respdata.forEach(daytable => {
          const keys = Object.keys(daytable)
          const tabledata = keys.map(key=>{
            var tabledict={}
            for(var i of daytable[key].keys()){
            tabledict[i]=daytable[key][i].name
        }
        tabledict.classroom=key
        return tabledict
    })
          this.multabledata.push(tabledata)
          console.log(tabledata)
        });
          this.tabledata=this.multabledata[this.page]
          console.log(this.multabledata)

      })
    },
    methods:{
      current_change(currentPage){
        this.page = currentPage-1;
          this.tabledata=this.multabledata[this.page]
      },
      clear_form(){
        this.form={
          requester_id:this.$store.state.user_id,
          number:'',
          suffix:1,
          class_time:'', //周次和节次，前者为1-7，后者为1-14
          classroom_id:''
        }
      },
      arrange_class(){
        console.log(this.form)
        this.$axios.post('/class_table/admin/arrange',this.form).then((resp)=>{
          console.log(resp.data)
          if(resp.data.isOk){
            this.$message("排课成功");
            this.dialogVisible=false
          }
          else{
            this.$message("排课失败，请检查表单内容");
          }
        })
      }
    }
}
</script>

<style>

</style>