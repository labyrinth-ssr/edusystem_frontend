<template>
   <el-table :data="row_search()" style="width: 100%" @row-click="row_click" :row-style="row_style" :cell-style="{padding:'0px'}" highlight-current-row>
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
            <el-table-column prop="teacher_id" label="任课教师id" width="100">
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
            <el-table-column prop="max_student" label="任课容量" width="80">
            </el-table-column>
            <el-table-column label="操作" >
                <template slot-scope="scope">
                    <el-link :underline="true"  v-if="status=='unselect'&&canSelect(scope.row)" type="primary">选课</el-link>
                    <el-link :underline="true"  v-if="status=='selected'" type="primary">退选</el-link>
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
            classroom_list:[],
            classtime_list:[],
            seltime_list:[],
            course_id:'',
            course_name:'',
            course_teacher:'',
            user_department:'',
        }
    },
    //什么时候
     watch: {
            tableData: function (val) { //监听props中的属性
                this.classtime_list = this.format_time(val);
                this.classroom_list=this.format_classroom(val);
            },
            selected_data:function(val){
                this.seltime_list = this.format_timelist(val);
            },
        },
    mounted(){
        console.log(this.tableData)

        // .filter(data => !course_id || data.id.toLowerCase().includes(course_id.toLowerCase()))
        //init filter list

            console.log(this.classroom_list)
        //课程时间filter：字符串匹配？无法使用级联...
        //多选时间段后，只要部分匹配即可
        this.format_time(this.classroom_list,this.tableData)
        console.log(this.classroom_list)
        // var classtime_set=new Set();
        // this.tableData.forEach((ele)=>{
        //     console.log(ele.class_time.split(','))
        //     ele.class_time.split(',').forEach((time)=>{
        //         classtime_set.add(time)
        //     })
        // })
        // this.classtime_list=Array.from(classtime_set,(ele)=>{return {text:ele,value:ele}})

        this.$axios.get('/userinfo/common/getuserinfo').then((resp) => {
                    this.user_department = resp.data.department
                    
                })
        
    },
    methods:{
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
            console.log(row.class_time)
            const row_time=row.class_time.split(',');
            row_time.forEach((time)=>{
                if(this.seltime_list.indexOf(time)!=-1){
                    noconflict=false;
                }
            })
            console.log(noconflict)
            return (row.department==this.user_department)&&( Array.from(this.selected_data,x=>x.number).indexOf(row.number)==-1)&&noconflict
        },
        row_search(){
            console.log(this.tableData)
            return this.tableData.filter(data =>( !this.course_id || data.id.toLowerCase().includes(this.course_id.toLowerCase()) )&&
            ( !this.course_name || data.name.toLowerCase().includes(this.course_name.toLowerCase()) )&&
            ( !this.course_teacher || data.teacher_id.toLowerCase().includes(this.course_teacher.toLowerCase()) ))
        },
        classtimeFilterHandler(value, row, column) {
        // const property = column['property'];
        return row['class_time'].indexOf(value)!=-1;
      },
        classroomFilterHandler(value, row, column) {
        // const property = column['property'];
        
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
    props:['status','tableData','selected_data','learned_data']

}
</script>

<style>

</style>