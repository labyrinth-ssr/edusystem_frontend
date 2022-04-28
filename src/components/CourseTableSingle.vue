<template>
   <el-table  :data="row_search()" style="width: 100%" @row-click="row_click" :row-style="row_style" :cell-style="{padding:'0px'}" highlight-current-row>
            <el-table-column prop="id" label="课程代码" width="130">
                <template slot="header" slot-scope="scope">
            <el-input
                v-model="course_id"
                size="mini"
                placeholder="课程代码"/>
                </template>
            </el-table-column>
            <el-table-column prop="number" label="课程编号" width="80">
            </el-table-column>
            <el-table-column prop="name" label="课程名" width="130">
                <template slot="header" slot-scope="scope">
            <el-input
                v-model="course_name"
                size="mini"
                placeholder="课程名"/>
                </template>
            </el-table-column>
            <el-table-column prop="department" label="开课院系" width="80">
            </el-table-column>
            <el-table-column prop="classes_per_week" label="学时" width="80">
            </el-table-column>
            <el-table-column prop="point" label="学分" width="80">
            </el-table-column>
            <el-table-column prop="teacher_name" label="任课教师" width="100">
                <template slot="header" slot-scope="scope">
                <el-input
                v-model="course_teacher"
                size="mini"
                placeholder="教师"/>
                </template>
            </el-table-column>
            <el-table-column prop="introduction" label="课程介绍">
            </el-table-column>
            <el-table-column prop="class_time" label="上课时间" :filters="classtime_list"
      :filter-method="classtimeFilterHandler" width="180">
            </el-table-column>
            <el-table-column prop="classroom_id" label="上课地点" :filters="classroom_list"
      :filter-method="classroomFilterHandler" width="100">
            </el-table-column>
            <el-table-column prop="display_num" label="任课容量" width="80" :key="componentKey">
            </el-table-column>
            <el-table-column label="操作" >
                <template slot-scope="scope">
                    <el-link :underline="true" @click="selectCourse(scope.row)" v-if="status=='unselect'&&canSelect(scope.row)" type="primary">选课</el-link>
                    <div v-else>{{scope.row.message}}</div>
                    <el-link :underline="true" @click="cancelCourse(scope.row)" v-if="status=='selected'" type="primary">退选</el-link>
                </template>
            </el-table-column>
        </el-table>
</template>

<script>
export default {
    name:'CourseTableSingle',
    data(){
        return{
            highlight_rowid:'',
            classroom_list:this.format_classroom(this.tableData),
            classtime_list:this.format_time(this.tableData),
            seltime_list:[],
            course_id:'',
            course_name:'',
            course_teacher:'',
            user_department:'',
            display_data:[],
            componentKey:0,
        }
    },
    //什么时候
     watch: {
            tableData: function (val) { //监听props中的属性
                this.classtime_list = this.format_time(val);
                this.classroom_list=this.format_classroom(val);
                val.forEach((course)=>{
                    const formData = new FormData()
                    formData.append('courseId', course.id)
                    formData.append('semester', this.semester)
                    this.$axios.post('/course_sel/common/count/by_course_id_and_semester',formData).then((resp)=>{
                        console.log(course.id,this.semester)
                        console.log(resp.data)
                        course.selected_num=resp.data
                        course.display_num=(resp.data)+'/'+(course.max_student)
                        console.log(course.selected_num)
                        this.componentKey+=1
                        //这个似乎很影响效率。。。。改变key强制重新渲染已选人数那一栏
                    })
                })
            },
            selected_data:function(val){
                this.seltime_list = this.format_timelist(val);
            },
        },
    computed:{
        // noselect_message:function (row){
        //     return row.me
        // }
    },
    created(){
        //课程时间filter：字符串匹配？无法使用级联...
        //多选时间段后，只要部分匹配即可
        this.format_time(this.classroom_list,this.tableData)
        this.$axios.get('/userinfo/common/getuserinfo').then((resp) => {
                    this.user_department = resp.data.department
                })

    },
    methods:{
        selectCourse(row){
            const sel_data={
                courseId: row.id, 
                studentId: this.student_id
            }
            this.$axios.post('/course_sel/student/add_course_sel',sel_data).then((resp)=>{
                this.$message({message:resp.data.ok,type:'success'})
            }
            )
        },
        cancelCourse(row){
            const cancel_data={
                courseId: row.id, 
                studentId: this.student_id
            }
            console.log(cancel_data)
            this.$axios.post('/course_sel/student/del_course_sel',cancel_data).then((resp)=>{
                this.$message({message:resp.data,type:'success'})
            }
            )

        },
        format_timelist(data){
        var time_set=new Set();
        data.forEach((ele)=>{
            ele.class_time.split(',').forEach((time)=>{
                time_set.add(time)
            })
        })
        var set_arr=Array.from(time_set).sort()
        return set_arr
        },
        format_time(data){
            var time_set=new Set();
        data.forEach((ele)=>{
            ele.class_time.split(',').forEach((time)=>{
                time_set.add(time)
            })
        })
        var set_arr=Array.from(time_set).sort()
        return Array.from(set_arr,(ele)=>{return {text:ele,value:ele}}).sort();
        },
        format_classroom(data){
        var classroom_set=new Set();
        data.forEach((ele)=>{
                classroom_set.add(ele.classroom_id)
        })
        return Array.from(classroom_set,(ele)=>{return {text:ele,value:ele}});
        },
        canSelect(row){
            var noconflict=true;
            const row_time=row.class_time.split(',');
            row_time.forEach((time)=>{
                if(this.seltime_list.indexOf(time)!=-1){
                    noconflict=false;
                }
            })
            if(row.department!=this.user_department) row.message='专业受限'
            else if(Array.from(this.selected_data,x=>x.number).indexOf(row.number)!=-1) row.message='已选同编号课程'
            else if(!noconflict) row.message='时间冲突'
            else if(this.stage==2&&row.selected_num>=row.max_student) row.message='人数受限'

            return (row.department==this.user_department)&&( Array.from(this.selected_data,x=>x.number).indexOf(row.number)==-1)&&noconflict&&(!(this.stage==2&&row.selected_num>=row.max_student))
        },
        row_search(){
            console.log(this.tableData)
            return this.tableData.filter(data =>( !this.course_id || data.id.toLowerCase().includes(this.course_id.toLowerCase()) )&&
            ( !this.course_name || data.name.toLowerCase().includes(this.course_name.toLowerCase()) )&&
            ( !this.course_teacher || data.teacher_name.toLowerCase().includes(this.course_teacher.toLowerCase()) ))
        },
        classtimeFilterHandler(value, row, column) {
        return row['class_time'].indexOf(value)!=-1;
      },
        classroomFilterHandler(value, row, column) {
        return row['classroom_id'] === value;
      },
        row_style({row, rowIndex}){
            return { height: "0px" };
        },
        row_click(row){
            console.log(row)
            this.highlight_rowid=row.index;
            var table_hightlight=[]
            row.class_time.split(',').forEach(ele => {
                ele.split('-')
                table_hightlight.push({col:ele.split('-')[0],row:ele.split('-')[1]})
            });
            console.log(table_hightlight)
            this.$emit('click_row',table_hightlight);
        }

    },
    props:['status','tableData','selected_data','learned_data','semester','student_id','stage']

}
</script>

<style>

</style>