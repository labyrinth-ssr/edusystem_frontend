<template>
    <el-form :model="form" style="text-align: left" ref="form" :rules="rules" label-width="80px">
        <el-form-item label="课程名" prop="name">
            <el-input v-model="form.name" :disabled="judgeDisable2" />
        </el-form-item>
        <el-form-item label="课程编号" prop="number">
            <el-input v-model="form.number" :disabled="judgeDisable" />
        </el-form-item>
        <el-form-item label="开课学院" prop="department">
        <el-select v-model="form.department" placeholder="请选择" :disabled="judgeDisable">
                <el-option v-for="item in departments" :key="item.id" :label="item.department" :value="item.department">
                </el-option>
            </el-select>
      </el-form-item>
        <el-form-item label="学时" prop="classes_per_week">
            <el-input v-model="form.classes_per_week" :disabled="judgeDisable" />
        </el-form-item>
        <el-form-item label="学分" prop="point">
            <el-input v-model="form.point" :disabled="judgeDisable" />
        </el-form-item>
        <el-form-item label="任课教师" v-if="this.role!='teacher'" prop="teacher_id">
            <el-input v-model="form.teacher_id" :disabled="judgeDisable" />
        </el-form-item>
        <el-form-item label="课程介绍" prop="introduction">
            <el-input v-model="form.introduction" :disabled="judgeDisable" />
        </el-form-item>
        <el-form-item label="上课时间" prop="class_time">
          <el-cascader v-for="i in time_loop" :key="i" size="small" style="width:80px;margin-right:2%;"
            :disabled="judgeDisable2"
            v-model="rawTime[i-1]"
            :options="time_options"
            :props="{ expandTrigger: 'hover' }"
            @change="time_select"></el-cascader>
            <!-- <el-input v-model="form.class_time" :disabled="judgeDisable2" /> -->
        </el-form-item>
        <el-form-item label="上课教室" prop="classroom_id">
            <el-select v-model="form.classroom_id" placeholder="请选择" :disabled="judgeDisable2">
                <el-option v-for="item in classrooms" :key="item.id" :label="item.id" :value="item.id">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="选课容量" prop="max_student">
            <el-input v-model="form.max_student" :disabled="judgeDisable" />
        </el-form-item>
    </el-form>
</template>
<script>
export default {
    name: 'CourseForm',
    props: ['formdata_prop', 'action_prop','resp_prop','trigger_prop'],
    computed: {
    judgeDisable: function () {
        console.log(this.role,this.action)
      return this.action=='watch'||(this.role=='teacher'&&this.action=='edit')
    },
    judgeDisable2: function () {
      return this.action=='watch'
    },
    time_loop:function(){
      this.form.class_time=[['']]
      return this.form.point==''?1:parseInt(this.form.point)
      // if (this.form.point==''){
      // return [...(new Array(1).keys())]
      // }
      // else{
      // return [...(new Array(parseInt(this.form.point))).keys()]

      // }
    }
  },
    watch: {
        formdata_prop:function (newval) {
              this.form=newval
        },
        action_prop:function (newval) {
              this.form=newval
        },
        resp_prop:function (newval) {
              this.resp=newval
                console.log(this.resp)
                this.$refs["form"].validate((valid) => {
            if (!valid) {
              return false;
            }
          });
        },
        trigger_prop:function (newval) {
            if (newval){
                console.log('validate')
            this.$refs["form"].validate((valid) => {
            if (!valid) {
              return false;
            }
          });
            }
            
        }
    },
    created() {
          this.$axios.get('/classroom/common/getclassrooms').then((resp)=>{
              this.classrooms=resp.data
          })
    this.$axios.get("/org/common/getorgs").then((resp)=>{
      this.departments=resp.data
      console.log(resp.data)
    })
          this.form=this.formdata_prop
          this.time_options=this.gen_time_options()
    },
    data() {
        
        return {
          rawTime:[['']],
          time_options:this.gen_time_options(),
          departments:[],
            role:this.$store.state.role,
            action:this.action_prop,
            form: this.formdata_prop,
            resp:this.resp_prop,
            rules:{
            name:[
                {
                    required: true,
            validator: (rule, value, callback)=>{
               this.resp.name||typeof(this.resp.name)=="undefined"?callback() : callback(new Error("课程名填写错误"));
            },
            trigger: "blur",
          }
            ],
            number:[
                {
                    required: true,
            validator: (rule, value, callback)=>{
               this.resp.number||typeof(this.resp.number)=="undefined"?callback() : callback(new Error("课程编号填写错误"));
            },
            trigger: "blur",
          }
            ],
            department:[
                {
                    required: true,
            validator: (rule, value, callback)=>{
               this.resp.department||typeof(this.resp.department)=="undefined"?callback() : callback(new Error("学院填写错误"));
            },
            trigger: "change",
          }
            ],
            classes_per_week:[
                {
                    required: true,
            validator: (rule, value, callback)=>{
               this.resp.classes_per_week||typeof(this.resp.classes_per_week)=="undefined"?callback() : callback(new Error("周课时填写错误"));
            },
            trigger: "blur",
          }
            ],
            point:[
                {
                    required: true,
            validator: (rule, value, callback)=>{
               this.resp.point||typeof(this.resp.point)=="undefined"?callback() : callback(new Error("学分填写错误"));
            },
            trigger: "blur",
          }
            ],
            teacher_id:[
                {
                    required: true,
            validator: (rule, value, callback)=>{
               this.resp.teacher_id||typeof(this.resp.teacher_id)=="undefined"?callback() : callback(new Error("教师id填写错误"));
            },
            trigger: "blur",
          }
            ],
            introduction:[
                {
            validator: (rule, value, callback)=>{
               this.resp.introduction||typeof(this.resp.introduction)=="undefined"?callback() : callback(new Error("课程介绍填写错误"));
            },
            trigger: "blur",
          }
            ],
            max_student:[
                {
                    required: true,
            validator: (rule, value, callback)=>{
               this.resp.max_student||typeof(this.resp.max_student)=="undefined"?callback() : callback(new Error("最大学生数填写错误"));
            },
            trigger: "blur",
          }
            ],
            classroom_id:[
                {
                    required: true,
            validator: (rule, value, callback)=>{
               this.resp.classroom_id||typeof(this.resp.classroom_id)=="undefined"?callback() : callback(new Error("教室填写错误"));
            },
            trigger: "change",
          }
            ],
            class_time:[
              {
                    required: true,
                    validator: (rule, value, callback)=>{
               this.rawTime.length==this.form.point?callback() : callback(new Error("上课时间填写错误"));
            },
            trigger: "change",
          message:'请输入完整课程时间'
              },
                {
                    required: true,
                    validator: (rule, value, callback)=>{
               this.resp.class_time||typeof(this.resp.class_time)=="undefined"?callback() : callback(new Error("上课时间填写错误"));
            },
            trigger: "change",
          }
            ]
            },
            classrooms:[]
        }
    },
    methods: {
      time_select(){
        if(this.rawTime.length==this.form.point){
          this.format_time()
        }
        console.log(this.rawTime)
      },
      format_time(){
        this.form.class_time=''
        this.rawTime.forEach((ele ,i)=> {
          if(i!=this.rawTime.length-1){
            this.form.class_time+=(ele[0]+'-'+ele[1]+',')
          }
          else{
            this.form.class_time+=(ele[0]+'-'+ele[1])
          }
        });
        console.log(this.form.class_time)
      },
      gen_time_options() {
        var ret = []
        for (var i = 1; i <= 7; i++) {
          var res = {
            value: i,
            label: i,
            children: []
          }
          for (var j = 1; j <= 13; j++) {
            var res1 = {
              value: j,
              label: j
            }
            res.children.push(res1)
          }
          ret.push(res)
        }
        return ret;
      }
    }
}
</script>

<style scoped>
.el-input {
    position: relative;
    font-size: 14px;
    display: inline-block;
    width: 90%;
}
</style>