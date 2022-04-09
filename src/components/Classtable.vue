<template>
<div>
   <el-table :data="tabledata" style="width: 100%">
     <el-table-column prop="classroom" label="教室" width="80">
     </el-table-column>
     <el-table-column v-for="index in classnum" :key="index" :prop="index+''" :label="'第'+index+'节'" width="80"/>
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
import axios from 'axios'
export default {
    name:'ClassroomTable',
    data() {
      return{
        multabledata:[],
        tabledata:[],
        page:0,
        classnum:[...(new Array(14)).keys()],
        total:70
      }
    },
    created(){
      axios.get('http://localhost:5000/classtable').then((resp)=>{
        console.log(resp)
        resp.data.forEach(daytable => {
          const keys = Object.keys(daytable)
          const tabledata = keys.map(key=>{
            var tabledict={}
            for(var i of daytable[key].keys()){
            tabledict[i]=daytable[key][i]
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

      }
    }
}
</script>

<style>

</style>