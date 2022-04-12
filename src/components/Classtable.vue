<template>
    <div>
        <el-form>
            <el-form-item>
        <el-dropdown @command="select_sec">
            <span class="el-dropdown-link" >
                {{section==0?'节次选择':section}}<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-for="index in classNum" :key="index" :command="index">{{index+1}}</el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>
        <!-- <el-time-select placeholder="起始时间" v-model="startTime[0]" :picker-options="{
      start: '08:30',
      step: '00:15',
      end: '22:00'
    }" @change="post_time">
        </el-time-select>
        <el-time-select placeholder="起始时间" v-model="endTime[0]" :picker-options="{
      start: '08:30',
      step: '00:15',
      end: '22:00',
      minTime: startTime[0]
    }" @change="post_time">
        </el-time-select> -->
        <el-button type="primary" @click="set_classtime">
            修改上课时间
        </el-button>
            </el-form-item>
        <el-form-item v-for="item in section" :key="item">
                    <el-time-select placeholder="起始时间" v-model="startTime[item]" :picker-options="{
      start: '08:30',
      step: '00:15',
      end: '22:00',
      minTime: endTime[item-1]

    }" @change="post_time">
        </el-time-select>
        <el-time-select placeholder="起始时间" v-model="endTime[item]" :picker-options="{
      start: '08:30',
      step: '00:15',
      end: '22:00',
      minTime: startTime[item]

    }" @change="post_time">
        </el-time-select>
        </el-form-item>
            <el-form-item>
                <el-dropdown >
            <span class="el-dropdown-link">
                教室列表<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-for="item in classroomList" :key="item.id">{{item.id}}</el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>
        <el-input v-model="classroom_add" placeholder="请输入新增教室名" style="width:180px"></el-input>
        <el-button type="primary" @click="add_classroom">
            增加教室
        </el-button>
        
            </el-form-item>
        </el-form>
        <el-table :data="tabledata" style="width: 260px">
            <el-table-column prop="section" label="节次" width="80">
            </el-table-column>
            <el-table-column prop="time" label="时间段" width="180">
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
export default {
    name:'ClassroomTable',
    data() {
      return{
        startTime: [],
        endTime: [],
        classNum:[...(new Array(15)).keys()],
        classroomList:[/* {id:'H4101'},{id:'H4102'},{id:'H4103'} */],
        section:0,
        display_section:0,
        classroom_add:'',
        tabledata:[]
      }
    },
    created(){
      this.$axios.get('/classroom/admin/getclassrooms').then((resp)=>{
          
          this.classroomList=resp.data
      })
    //   this.$axios.get('/classtime/admin/getsectionnum').then((resp)=>{
    //       this.classNum=[...(new Array(resp.data)).keys()]
    //   })
      this.$axios.get('/classtime/admin/getclasstime').then((resp)=>{
          this.tabledata=resp.data
      })
    },
    methods:{
      post_time(){
          if(this.startTime!=''&&this.endTime!=''&&this.section!=0){
              console.log(this.startTime,this.endTime)
//             this.$axios.post('/classtime/admin/setclasstime',null,{params: {
//     'sectionInt': this.section,'time':this.startTime+'-'+this.endTime
//   }}).then((resp)=>{
//             console.log(resp.data)
//       })
          }
      },
      select_sec(command){
          this.section=command+1
          this.display_section=this.section-1
          console.log(this.section-1)
      },
      add_classroom(){
          this.$axios.get('/classroom/admin/addclassroom/'+this.classroom_add).then((resp)=>{
          console.log(resp)
      })
      this.$axios.get('/classroom/admin/getclassrooms').then((resp)=>{
          
          this.classroomList=resp.data
      })
      },
      set_classtime() {
          if (this.startTime != '' && this.endTime != '' && this.section != 0) {
              console.log(this.startTime, this.endTime)
              var time=''
              this.startTime.forEach((element, index) => { 
                  if(index!=(this.startTime.length-1)){
                  time+=element+'-'+this.endTime[index]+' '
                  }
                  else{
                  time+=element+'-'+this.endTime[index]
                  }
               })
               console.log(time)
              this.$axios.post('/classtime/admin/setclasstime', null, {
                  params: {
                      'sectionInt': this.section,
                      'time': time
                  }
              }).then((resp) => {
                  console.log(resp.data)
              })
          }
      }
    }
}
</script>

<style>
.el-date-editor.el-input{
    width:180px
}
</style>