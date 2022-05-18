<template>
  <div>
    <el-form :v-model="form" style="text-align: left" ref="form" :rules="rules"
             label-position="right" label-width="80px">
      <el-form-item label="课程名" prop="name">
        <el-input v-model="form.name" :disabled="judgeDisable2" />
      </el-form-item>
      <el-form-item label="课程编号" prop="number">
        <el-input v-model="form.number" :disabled="judgeDisable" />
      </el-form-item>
      <el-form-item label="开课学院" prop="department">
        <el-select v-model="form.department" placeholder="请选择" :disabled="judgeDisable">
          <el-option v-for="item in departments" :key="item" :label="item" :value="item">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="课程类型" prop="course_sort">
        <el-select
            v-model="form.course_sort"
            :options="course_options"
            @change="course_select_enabled">
          <el-option
              v-for="item in course_options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              :disabled="judgeDisable"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item  v-if="necessary" label="开设专业" prop="acceptMajor" >
        <el-cascader
            v-model="form.acceptMajor"
            :options="major_department_options"
            :props="{ expandTrigger: 'hover' ,multiple:course_multiple}"
            collapse-tags
            @change="handleChange" :disabled="judgeDisable"></el-cascader>
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
        <el-cascader v-for="i in time_loop" :key="i" size="small" style="width:100px;margin-right:2%;"
                     :disabled="judgeDisable2"
                     v-model="rawTime[i-1]"
                     :options="time_options"
                     :props="{ expandTrigger: 'hover' }"
                     @change="time_select"></el-cascader>
      </el-form-item>
      <el-form-item label="开课学期" prop="courseTerm">
        <el-cascader size="small" style="width:100px;margin-right:2%;"
                     v-model="form.courseTerm"
                     :options="term_options"
                      :props="{ multiple:'true'}"
                      @change="semester_select"
                      >
        </el-cascader>
      </el-form-item>
      <el-form-item label="上课教室" prop="classroom_id">
        <el-select v-model="form.classroom_id" placeholder="请选择" :disabled="judgeDisable2">
          <el-option v-for="item in classrooms" :key="item.id" :label="item.id" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="选课容量" prop="max_student">
        <el-input-number v-model="form.max_student" :disabled="judgeDisable2" :min="1"
                         :placeholder="(typeof(form.classroom_id)=='undefined'||typeof(classrooms.find(x=>
                           x.id==form.classroom_id))=='undefined'?1: classrooms.find(x=>
                           x.id==form.classroom_id).space).toString()"
                         :max="typeof(form.classroom_id)=='undefined'||typeof(classrooms.find(x=>
                           x.id==form.classroom_id))=='undefined'?1: classrooms.find(x=>
                           x.id==form.classroom_id).space"
        ></el-input-number>
        <template slot="append">max</template>
      </el-form-item>
    </el-form>

  </div>

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
      // this.form.class_time=[['']]
      console.log(this.form)
      return this.form.classes_per_week==''?1:parseInt(this.form.classes_per_week);
    },

  },
    watch: {
        formdata_prop:function (newval) {
          console.log('change')
          this.rawTime= this.format_classtime(newval)
          this.form.courseTerm= this.format_semester(newval)
          this.form=newval
          this.format_major(newval);
          console.log(this.form)

        },
        action_prop:function (newval) {
          this.action = newval
          if(this.action=='add'){
            // this.flush()
          }
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
      let temp_term =[];
      console.log(this.$store.state.currentTerm.toString())
      let temp0 = (this.$store.state.currentTerm.toString()).split('.')[1]-1;
      let temp1 = (this.$store.state.currentTerm.toString()).split('.')[0];
      for(let i = 0; i < 4;i++){

        temp0++;
        if( temp0 >= this.$store.state.termsPerY){
          temp0 = 0;
          temp1 ++;
        }
        console.log(temp1,temp0,temp_term)
        temp_term.push({
          label: temp1.toString() +'.'+temp0.toString(),
          value: temp1.toString() +'.'+temp0.toString()
        })
      }
      this.term_options = temp_term;
      console.log(this.form)
      this.$axios.get('/classroom/common/getclassrooms').then((resp)=>{
          this.classrooms=resp.data
        console.log(this.classrooms)
      })
      this.$axios.get("/org/common/getorgs").then((resp)=>{
        var departments=new Set()
        resp.data.forEach((ele)=>{
          departments.add(ele.department)
        })
        this.departments=departments
        console.log(resp.data)
      })

      // this.form=this.formdata_prop

      this.$axios.get("/org/common/getorgs",{})
          .then(response => {

            console.log(response.data)
            this.majorList = response.data
            var res = {}
            var res2 = []
            response.data.forEach(element => {
              if (element.department in res) {
                if ('children' in res[element.department]) {
                  res[element.department].children.push({label:element.major,value:element.id})
                }
              } else res[element.department] = {
                children: [{label:element.major,value:element.id}]
              }
            });
            Object.keys(res).forEach((key) => {
              res2.push({
                label: key,
                value:key,
                children: res[key].children
              })
            })
            console.log(res2)
            this.major_department_options = res2

          }).catch((error) => {
        console.log(error)
      })
      this.form.courseTerm=this.format_semester(this.formdata_prop),
      this.time_options=this.gen_time_options()
      this.format_major()
      this.course_select_enabled()

    },
    data() {
        
        return {
          majorList:[],
          rawTime:this.format_classtime(this.formdata_prop),
          classrooms:[],
          time_options:this.gen_time_options(),
          departments:[],
          term_options:[],
          course_options:[
            {
              label:"通用课程",
              value:"通用课程",
            },{
              label:"面向部分专业课",
              value:"面向部分专业课",
            },{
              label:"专业课",
              value:"专业课",
            },
          ],
          course_multiple:false,
          necessary:false,
          major_department_options:[],
          role:this.$store.state.role,
            action:this.action_prop,
            form: this.formdata_prop,
            resp:this.resp_prop,
            rules:{
            name:[
              {
                required: true,
                validator: (rule, value, callback)=>{
                   typeof(this.resp)=='undefined'||this.resp.name||typeof(this.resp.name)=="undefined"?callback() : callback(new Error("课程名填写错误"));
                },
                trigger: "blur",
              }
            ],
            number:[
              {
                required: true,
                validator: (rule, value, callback)=>{
                  typeof(this.resp)=='undefined'||this.resp.number||typeof(this.resp.number)=="undefined"?callback() : callback(new Error("课程编号填写错误"));
                },
                trigger: "blur",
              }
            ],
            department:[
              { required: true,
                validator: (rule, value, callback)=>{
                  typeof(this.resp)=='undefined'||this.resp.department||typeof(this.resp.department)=="undefined"?callback() : callback(new Error("学院填写错误"));
                },
                trigger: "change",
              }
            ],
            course_sort:[
              {
                type:"String",
                required: true,
                trigger: "change",
                validator: (rule, value, callback)=>{
                  typeof(this.resp)=='undefined'||this.resp.course_sort||typeof(this.resp.course_sort)=="undefined"?callback() : callback(new Error("课程类型为空"));
                },
              }
            ],
            acceptMajor:[
            ],
              courseTerm:[
                {required: true,
                trigger: "blur",}
              ],
            classes_per_week:[
              { required: true,
                validator: (rule, value, callback)=>{
                  typeof(this.resp)=='undefined'||this.resp.classes_per_week||typeof(this.resp.classes_per_week)=="undefined"?callback() : callback(new Error("周课时填写错误"));
                },
                trigger: "blur",
              }
            ],
            point:[
              {required: true,
              validator: (rule, value, callback)=>{
                typeof(this.resp)=='undefined'||this.resp.point||typeof(this.resp.point)=="undefined"?callback() : callback(new Error("学分填写错误"));
              },
              trigger: "blur",
              }
            ],
            teacher_id:[
            {
                required: true,
                validator: (rule, value, callback)=>{
                  typeof(this.resp)=='undefined'||this.resp.teacher_id||typeof(this.resp.teacher_id)=="undefined"?callback() : callback(new Error("教师id填写错误"));
                },
                trigger: "blur",
              }
            ],
            introduction:[
              {
                validator: (rule, value, callback)=>{
                  typeof(this.resp)=='undefined'||this.resp.introduction||typeof(this.resp.introduction)=="undefined"?callback() : callback(new Error("课程介绍填写错误"));
                },
                trigger: "blur",
              }
            ],
            max_student:[
              {
                required: true,
                validator: (rule, value, callback)=>{
                  typeof(this.resp)=='undefined'||this.resp.max_student||typeof(this.resp.max_student)=="undefined"?callback() : callback(new Error("最大学生数填写错误"));
                },
                trigger: "blur",
              },
              {
                required: true,
                validator:(rule, value, callback)=>{
                  const _this =this;
                  typeof(this.form.classroom_id)=="undefined"||this.form.max_student<= this.classrooms.find(function(item, index, arr){
                    if(item.id === _this.form.classroom_id){
                      return item;
                    }
                  },this.classrooms).space?callback() : callback(new Error("教室容量不足！"))
                },
                trigger: "blur",
              }
            ],
            classroom_id:[
            {
                required: true,
                validator: (rule, value, callback)=>{
                  typeof(this.resp)=='undefined'||this.resp.classroom_id||typeof(this.resp.classroom_id)=="undefined"?callback() : callback(new Error("教室填写错误"));
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
                  typeof(this.resp)=='undefined'||this.resp.class_time||typeof(this.resp.class_time)=="undefined"?callback() : callback(new Error("上课时间填写错误"));
                },
                trigger: "change",
              }
            ]
          },
        }
    },
    methods: {
      format_classtime(newval){
          var time_sel=[]
          var period=[]
          console.log(newval)
            if (typeof(newval.class_time)=='undefined'|| newval.class_time=='') return [['']]

          newval.class_time.split(',').forEach((ele)=>{
            period=[]
            period.push(+ele.split('-')[0],+ele.split('-')[1]) 
            time_sel.push(period)
          })
          console.log(time_sel)
              return time_sel

      },
      format_semester(newval){
          var period=[]
            var semesters=[]
          console.log(newval)

            if (typeof(newval.semester)=='undefined'|| newval.semester=='') return [['']]
          newval.semester.split(',').forEach((ele)=>{
            period=[]
            period.push(ele)
            semesters.push(period)
          })
          console.log(semesters)

          return semesters
      },
      format_major(newval){
        if(this.form.allowed_major.length ==0){
          this.form.course_sort = "通用课程"
        }else if(this.form.allowed_major.toLowerCase().includes(",".toLowerCase())){
          this.form.course_sort = "面向部分专业课"
        }else {
          this.form.course_sort = "专业课"
        }
        console.log(this.format_major.name)
        this.necessary = this.form.course_sort !="通用课程";
        this.course_multiple = this.form.course_sort =="面向部分专业课"
        if(this.necessary){
          if(this.course_multiple){
            this.form.acceptMajor = this.form.allowed_major.toString().split(',').map(ele=>{
               let temp= this.majorList.find(item=>item.id ==ele)
              let res=[]
              res.push(temp.department)
              res.push(temp.id)
              return res
            })
          }else {
            let temp= this.majorList.find(item=>item.id ==this.form.allowed_major)
            let res=[]
            res.push(temp.department)
            res.push(temp.id)
            this.form.allowed_major = res
          }
          console.log(this.form.course_sort)
          console.log(this.form.acceptMajor)
        }
      },
      course_select_enabled(){
        const temp = this.form.course_sort;
        if(temp ==='通用课程' || temp ===''){
          this.necessary = false;
        }else {
          this.necessary = true;
        }
        if(temp ==="面向部分专业课"){
          this.course_multiple = true;
        }else {
          this.course_multiple = false;
        }
      },
      handleChange(value){
        console.log(this.form.acceptMajor)

      },
      time_select(){
        if(this.rawTime.length==this.form.classes_per_week){
          this.format_time()
        }
        console.log(this.rawTime)
        // this.format_time()
      },
      semester_select(){
        console.log(this.courseTerm)
              this.form.semester = this.courseTerm.join(',')

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
      },
      flush(){
        this.form=[]
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