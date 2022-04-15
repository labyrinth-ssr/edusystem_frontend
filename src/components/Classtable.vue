<template>
    <div style="display:flex;">
        <div id="classroom_sontainer" class="container">
            <el-form>
                <!-- <el-dropdown @command="select_sec">
            <span class="el-dropdown-link" >
                {{section==0?'节次选择':section}}<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-for="index in classNum" :key="index" :command="index">{{index+1}}</el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown> -->
                <el-form-item>
                    <el-input v-model="classroom_add" placeholder="请输入新增教室名" style="width:180px"></el-input>
                    <el-button type="primary" @click="add_classroom">
                        增加教室
                    </el-button>
                </el-form-item>
                <el-form-item>
                    <el-input v-model="classroom_edit.oldname" placeholder="待修改教室" style="width:110px"></el-input>
                    <el-input v-model="classroom_edit.newname" placeholder="修改为" style="width:110px"></el-input>
                    <el-button type="primary" @click="edit_classroom">
                        修改教室
                    </el-button>
                </el-form-item>
                <el-form-item>
                    <el-input v-model="classroom_delete" placeholder="请输入要删除的教室名" style="width:180px"></el-input>
                    <el-button type="primary" @click="delete_classroom">
                        删除教室
                    </el-button>
                </el-form-item>
                <el-form-item>
                    <el-dropdown>
                        <span class="el-dropdown-link">
                            教室列表<i class="el-icon-arrow-down el-icon--right"></i>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item v-for="item in classroomList" :key="item.id">{{item.id}}
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </el-form-item>
            </el-form>
        </div>
        <div id="time_input_container" class="container">
            <div v-for="item in section" :key="item">
                <el-time-select placeholder="开始时间" v-model="startTime[item-1]" :picker-options="{
      start: '08:30',
      step: '00:15',
      end: '22:00',
      minTime: endTime[item-2]

    }" >
                </el-time-select>
                <el-time-select placeholder="结束时间" v-model="endTime[item-1]" :picker-options="{
      start: '08:30',
      step: '00:15',
      end: '22:00',
      minTime: startTime[item-1]
    }" >
                </el-time-select>
            </div>
            <div id="button_container">
                <el-button type="primary" @click="set_classtime">
                    修改上课时间
                </el-button>
            </div>
        </div>
        <div id="timetable_container" class="container">
        <el-table :data="tabledata" style="width: 260px">
            <el-table-column prop="section" label="节次" width="80">
            </el-table-column>
            <el-table-column prop="time" label="时间段" width="180">
            </el-table-column>
        </el-table>
        </div>
    </div>
</template>

<script>
export default {
    name:'ClassroomTable',
    data() {
      return{
        startTime: [],
        endTime: [],
        classroomList:[/* {id:'H4101'},{id:'H4102'},{id:'H4103'} */],
        section:13,
        classroom_add:'',
        tabledata:[],
        classroom_edit:{
            oldname:'',
            newname:''
        },
        classroom_delete:''
      }
    },
    created(){
      this.$axios.get('/classroom/admin/getclassrooms').then((resp)=>{
          this.classroomList=resp.data
      })
      this.$axios.get('/classtime/admin/getclasstime').then((resp)=>{
          this.tabledata=resp.data
          console.log(resp.data)
          resp.data.forEach((ele,index)=>{
              const split_time= ele.time.split('-')
              this.startTime.push(split_time[0])
              this.endTime.push(split_time[1])
          })
        //   console.log
      })
    },
    methods:{
        edit_classroom() {
            const formData = new FormData()
            formData.append('old_name', this.classroom_edit.oldname)
            formData.append('new_name', this.classroom_edit.newname)
            this.$axios.put('/classroom/admin/altclassroom', formData).then((resp) => {
                if (resp.data) {this.$message({
                    message: '修改成功',
                    type: 'success'
                });
                this.classroom_edit={
            oldname:'',
            newname:''
        }
        this.$axios.get('/classroom/admin/getclassrooms').then((resp)=>{
          this.classroomList=resp.data
          })
                }
                else this.$message.error('修改失败');
            })
        },
        clear_class(){
        this.startTime= []
        this.endTime= []
        },
        clear_classroom(){
            this.classroom_add=''
        },
        update_info(){
        },
        delete_classroom(){
            const formData = new FormData()
            formData.append('classroom', this.classroom_delete)
            this.$axios.delete('/classroom/admin/delclassroom/',{data:formData}).then((resp)=>{
          if (resp.data) {
          this.$message("删除成功")
          this.classroom_delete=''
          this.$axios.get('/classroom/admin/getclassrooms').then((resp)=>{
          this.classroomList=resp.data
          })
          } else {
          this.$message("删除失败")
          }
          })
        },
      add_classroom(){
          this.$axios.get('/classroom/admin/addclassroom/',{params:{classroom:this.classroom_add}}).then((resp)=>{
          console.log(resp)
          if (resp.data) {
          this.$message("添加成功")
          this.clear_classroom()
          this.$axios.get('/classroom/admin/getclassrooms').then((resp)=>{
          this.classroomList=resp.data
          })
          } else {
          this.$message("添加失败")
          }
          })
      },
      set_classtime() {
              if (this.startTime != '' && this.endTime != '' && this.section != 0) {
                  console.log(this.startTime, this.endTime)
                  var time = ''
                  this.startTime.forEach((element, index) => {
                      if (index != (this.startTime.length - 1)) {
                          time += element + '-' + this.endTime[index] + ' '
                      } else {
                          time += element + '-' + this.endTime[index]
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
                      if (resp.data) {
                          this.$message("修改成功")
                          this.clear_class()
                          this.$axios.get('/classtime/admin/getclasstime').then((resp)=>{
          this.tabledata=resp.data
          resp.data.forEach((ele,index)=>{
              const split_time= ele.time.split('-')
              this.startTime.push(split_time[0])
              this.endTime.push(split_time[1])
          })
      })
                      } else {
                          this.$message("修改失败，请检查时间是否冲突")
                      }
                  })
              } else {
                  this.$message("输入不完整")
              }
      }
    }
}
</script>

<style scoped>
#classroom_container{
    flex: 0 0 30%;
}
#time_input_container{
    flex: 0 0 40%;
    text-align: center;
}
#timetable_container{
    flex: 0 0 30%;

}
/* #button_container{
    text-align: right;
} */
/* .el-table{
    flex: 0 0 260px;
}
.el-form{
    flex:0 0 60%;
} */

</style>