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
                v-model="teacher"
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
                <template >
                    <el-link :underline="true"  v-if="status=='unselect'" type="primary">选课</el-link>
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
            course_id:'',
            course_name:'',
            teacher:''
        }
    },
    //什么时候
    created(){
        // .filter(data => !course_id || data.id.toLowerCase().includes(course_id.toLowerCase()))
        //init filter list
        var classroom_set=new Set();
        this.tableData.forEach((ele)=>{
            classroom_set.add(ele.classroom_id)
        })
            this.classroom_list=Array.from(classroom_set,(ele)=>{return {text:ele,value:ele}})
        //课程时间filter：字符串匹配？无法使用级联...
        //多选时间段后，只要部分匹配即可
        var classtime_set=new Set();
        this.tableData.forEach((ele)=>{
            console.log(ele.class_time.split(','))
            ele.class_time.split(',').forEach((time)=>{
                classtime_set.add(time)
            })
        })
            this.classtime_list=Array.from(classtime_set,(ele)=>{return {text:ele,value:ele}})
    },
    methods:{
        row_search(){
            console.log(this.tableData)
            return this.tableData.filter(data =>( !this.course_id || data.id.toLowerCase().includes(this.course_id.toLowerCase()) )&&
            ( !this.course_name || data.name.toLowerCase().includes(this.course_name.toLowerCase()) )&&
            ( !this.teacher || data.teacher_id.toLowerCase().includes(this.teacher.toLowerCase()) ))
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
    props:['status','tableData']

}
</script>

<style>

</style>