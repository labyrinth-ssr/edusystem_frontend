<template>
    <el-table :data="row_search()" style="width: 100% " @row-click="row_click" :row-style="row_style"
        :cell-style="{padding:'0px'}" highlight-current-row>
        <el-table-column prop="id" label="课程代码" width="130" v-if="status=='unselect'">
            <template slot="header" slot-scope="scope">
                <el-input v-model="course_id" size="mini" placeholder="课程代码" />
            </template>
        </el-table-column>
        <el-table-column prop="id" label="课程代码" width="130" v-else />
        <el-table-column prop="number" label="课程编号" width="80" />
        <el-table-column prop="name" label="课程名" width="130" v-if="status=='unselect'">
            <template slot="header" slot-scope="scope">
                <el-input v-model="course_name" size="mini" placeholder="课程名" />
            </template>
        </el-table-column>
        <el-table-column prop="name" label="课程名" width="130" v-else />
        <el-table-column prop="department" label="开课院系" width="80" />
        <el-table-column prop="classes_per_week" label="学时" width="80" />
        <el-table-column prop="point" label="学分" width="80" />
        <el-table-column prop="teacher_name" label="任课教师" width="100" v-if="status=='unselect'">
            <template slot="header" slot-scope="scope">
                <el-input v-model="course_teacher" size="mini" placeholder="教师" />
            </template>
        </el-table-column>
        <el-table-column prop="teacher_name" label="任课教师" width="100" v-else />
        <el-table-column prop="this_semester" label="修课学期" v-if="status=='learned'" width="130" :filters="semester_list"
            :filter-method="semesterFilterHandler" />
        <el-table-column prop="introduction" label="课程介绍" />
        <el-table-column prop="class_time" label="上课时间" :filters="classtime_list"
            :filter-method="classtimeFilterHandler" width="180" v-if="status=='unselect'" />
        <el-table-column prop="class_time" label="上课时间" width="180" v-else-if="status=='selected'" />
        <el-table-column prop="classroom_id" label="上课地点" v-if="status=='unselect'" :filters="classroom_list"
            :filter-method="classroomFilterHandler" width="100" />
            <el-table-column prop="classroom_id" label="上课地点" v-else-if="status=='selected'" width="100" />
        <el-table-column prop="display_num" label="任课容量" v-if="status!='learned'" width="80" :key="componentKey" />
        <el-table-column label="操作" v-if="status!='learned'">
            <template slot-scope="scope">
                <el-link :underline="true" @click="selectCourse(scope.row)"
                    v-if="status=='unselect'&&canSelect(scope.row)" type="primary">选课</el-link>
                <div v-else>{{scope.row.message}}</div>
                <el-link :underline="true" @click="cancelCourse(scope.row)" v-if="status=='selected'" type="primary">退选
                </el-link>
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
            user_major:'',
            display_data:[],
            componentKey:0,
            semester_list:this.format_semester(this.tableData)
        }
    },
    //什么时候
     watch: {
            tableData: function (val) { //监听props中的属性
                this.classtime_list = this.format_time(val);
                this.classroom_list=this.format_classroom(val);
                this.semester_list=this.format_semester(val);

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
                    })
                })
            },
            selected_data:function(val){
                this.seltime_list = this.format_timelist(val);
            },
        },
    created(){
        //课程时间filter：字符串匹配？无法使用级联...
        //多选时间段后，只要部分匹配即可
        this.format_time(this.classroom_list,this.tableData)
        this.$axios.get('/userinfo/common/getuserinfo').then((resp) => {
                    // this.user_major = resp.data.major
                    this.$axios.get('/org/common/getorgs').then((resp2)=>{
                        console.log(resp2.data.find(x=>x.major==resp.data.major))
            this.user_major =resp2.data.find(x=>x.major==resp.data.major).id
            console.log(this.user_major)
        })

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
            this.$emit('updatePage');

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
            this.$emit('updatePage');

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
        format_semester(data){
        var semester_set=new Set();
        data.forEach((ele)=>{
                semester_set.add(ele.this_semester)
        })
        return Array.from(semester_set,(ele)=>{return {text:ele,value:ele}});
        },
        canSelect(row){
            // if (this.status!='learned') {
                this.tableData.forEach((ele)=>{
                ele.majors=this.format_major(ele.allowed_major)
            })
            // }
            console.log(this.tableData)
            var noconflict=true;
            const row_time=row.class_time.split(',');
            row_time.forEach((time)=>{
                if(this.seltime_list.indexOf(time)!=-1){
                    noconflict=false;
                }
            })
            var major_limit=false
            if (typeof(row.majors)!='undefined'&& row.majors.length!=0&&typeof(row.majors.find(x=>x==this.user_major))=='undefined') {
                major_limit=true
            }
            if(major_limit) row.message='专业受限'
            else if(Array.from(this.selected_data,x=>x.number).indexOf(row.number)!=-1) row.message='已选同编号课程'
            else if(!noconflict) row.message='时间冲突'
            else if(this.stage==2&&row.selected_num>=row.max_student) row.message='人数受限'

            return (!major_limit)&&( Array.from(this.selected_data,x=>x.number).indexOf(row.number)==-1)&&noconflict&&(!(this.stage==2&&row.selected_num>=row.max_student))
        },
        row_search(){
            

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
      semesterFilterHandler(value, row, column) {
        return row['this_semester'] === value;
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
        },
        format_major(majorstr){
            if (majorstr=='') return []
            console.log(majorstr.split(',').map(x=>parseInt(x)))
            return majorstr.split(',').map(x=>parseInt(x))
        }
    },
    props:['status','tableData','selected_data','learned_data','semester','student_id','stage']
}
</script>

<style>
.el-table td.el-table__cell div {
    box-sizing: border-box;
}

</style>