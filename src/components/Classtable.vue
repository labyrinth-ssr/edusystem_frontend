<template>
    <div style="display:flex;">
        <div id="classroom_sontainer" class="container">
            <span>
              <el-tag>{{currentTerm }}</el-tag>
            </span>
            <span >
            <el-tag v-if="class_sel_permit==0">禁止选课</el-tag>
            <el-tag v-else-if="class_sel_permit==1">第一轮选课</el-tag>
            <el-tag v-else-if="class_sel_permit==2">第二轮选课</el-tag>
            </span>
            <el-button @click="next_stage" type="primary" size="mini" >进入下一阶段</el-button>
          <br>
          <br>
            <el-form>
                <el-form-item :rule="class_rule">
                    <el-input v-model="classroom_add" placeholder="新增教室名" style="width:90px">
                    </el-input><el-input v-model="space" placeholder="教室容量" style="width:90px"></el-input>
                    <el-button type="primary" @click="add_classroom">
                        增加教室
                    </el-button>
                </el-form-item>
                <el-form-item :rule="class_edit_rule">
                    <el-input v-model="classroom_edit.old_name" size="small"  placeholder="待修改教室" style="width:110px"></el-input>
                    <el-input v-model="classroom_edit.new_name" size="small"  placeholder="修改为" style="width:110px"></el-input>
                    <el-input v-model="classroom_edit.new_space" size="small" placeholder="教室容量" type="number" min="10" style="width:110px"></el-input>
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
                <el-table :data="classroomList" style="width: 200px">
                  <el-table-column prop="id" label="教室" width="100px">
                    </el-table-column>
                  <el-table-column prop="space" label="容量" width="100px">
                    </el-table-column>
            
                  </el-table>
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
        term_value:'' ,
        currentTerm :'',
        class_sel_permit: '',
        startTime: [],
        endTime: [],
        classroomList:[/* {id:'H4101'},{id:'H4102'},{id:'H4103'} */],
        section:13,
        classroom_add:'',
        space:'',
        tabledata:[],
        classroom_edit:{
            old_name:'',
            new_name:'',
            new_space:''
        },
        classroom_delete:'',
        class_rule:{
          space:[
            {
              required: true,
              validator: (rule, value, callback)=>{
                parseInt(this.space)>0?callback():callback(new Error("容量错误！"));
              },
              trigger: "blur"
            }
          ],
          classroom_add:[
            {
              required: true,
              validator: (rule, value, callback)=>{
                /^\[A-Z]d{4}$/.test(this.classroom_add)?callback():callback(new Error("教师格式错误！"));
              },
              trigger: "blur",
            }
          ]
        },
        class_edit_rule:{
          old_name:[
            {
              required: true
            }
          ],
          new_name:[
            {
              required: true,
              validator: (rule, value, callback)=>{
                /^\[A-Z]d{4}$/.test(this.classroom_edit.newname)?callback():callback(new Error("教师格式错误！"));
              },
              trigger: "blur",
            }
          ],
          new_space: [
            {
              required: true,
              trigger:"blur"
            }
          ]
        }
      }
    },
    created(){
      this.$axios.get("/permission/common/current_semester")
          .then((resp)=>{
            this.currentTerm = resp.data.toString()
            if(this.currentTerm.length==4){
              this.currentTerm +='.0'
            }
            console.log(this.currentTerm)

            this.term_value=this.currentTerm.split('.')[0]+'-0'+
                this.currentTerm.split('.')[1]
            console.log(this.term_value)
          }).catch((error)=>{
        console.log(error)
      })
      this.flush();
      this.$axios.get('/classroom/common/getclassrooms').then((resp)=>{
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
        flush(){
          this.$axios.get("/permission/common/current_semester")
              .then((resp)=>{
                this.currentTerm = resp.data.toString()
                if(this.currentTerm.length == 4){
                  this.currentTerm = this.currentTerm + '.0';
                }
                this.term_value=this.currentTerm.split('.')[0]+'-0'+
                    this.currentTerm.split('.')[1]
                console.log(this.term_value)
              }).catch((error)=>{
            console.log(error)
          })
          this.$axios.get("/permission/common/check_choose_course")
              .then((resp)=>{
                this.class_sel_permit= resp.data
              }).catch((error)=>{
            console.log(error)
          })
        },
        next_stage(){
          console.log(this.class_sel_permit)
          if(this.class_sel_permit==1){
            this.$axios.get('/course_sel/admin/filter_in_first_stage')
                .then((resp)=>{
                  console.log(resp)
                  if (resp.data){
                    console.log("stage_filter")
                  }
                }).catch((error)=>{
              console.log(error)
            })
          }else if(this.class_sel_permit==2){
            let tem = new FormData()
            tem.append('semester',`${this.currentTerm}`)
            console.log(tem)
            this.$axios.get('/course_sel/admin/filter_in_semester_change',{params:tem})
            .then((resp)=>{
              console.log(resp.data)
              console.log("flush")
              if(resp.data){
                this.$message({
                  type:'success',
                  message:'学期已切换！'
                })
              }else {
                console.log(resp.data)
              }
            }).catch((error)=>{
              console.log(error)
            })
          }
          this.$axios.post('/permission/admin/next_stage',{stage:1})
              .then((resp)=>{
                if(resp.data){
                  this.$message({
                    type:'success',
                    message:"操作成功！"
                  })
                  this.flush()
                }else {
                  this.$message({
                    type:'warning',
                    message:"操作失败！"
                  })
                }
              }).catch((error)=>{
            console.log(error)
          })
        },
        edit_classroom() {
            const formData = new FormData()
            formData.append('old_name', this.classroom_edit.old_name)
            formData.append('new_name', this.classroom_edit.new_name)
            formData.append('new_space', this.classroom_edit.new_space)
            this.$axios.put('/classroom/admin/altclassroom', formData).then((resp) => {
                if (resp.data) {this.$message({
                    message: '修改成功',
                    type: 'success'
                });
                this.classroom_edit={
                  old_name:'',
                  new_name:'',
                  new_space:''

                  }
               this.$axios.get('/classroom/common/getclassrooms').then((resp)=>{
                this.classroomList=resp.data
                 })
                }
                else this.$message.error('修改失败');
              }).catch((error)=>{
                console.log(error)
            })
        },
        clear_class(){
        this.startTime= []
        this.endTime= []
        },
        clear_classroom(){
          this.classroom_add=''
          this.space =''
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
          this.$axios.get('/classroom/common/getclassrooms').then((resp)=>{
          this.classroomList=resp.data
          })
          } else {
          this.$message("删除失败")
          }
          })
        },
      add_classroom(){
          this.$axios.get('/classroom/admin/addclassroom/',{params:{classroom:this.classroom_add,space:this.space}}).then((resp)=>{
          console.log(resp)
          if (resp.data) {
          this.$message({
            type:"success",message:"添加成功"})
          this.clear_classroom()
          this.$axios.get('/classroom/common/getclassrooms').then((resp)=>{
          this.classroomList=resp.data
          })
          } else {
          this.$message({
            type:"error",message:"添加失败"})
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

</style>