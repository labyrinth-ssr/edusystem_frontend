<template>
   <el-table :data="tableData" height="572" style="width: 100%">
            <el-table-column prop="id" label="课程代码" width="80">
            </el-table-column>
            <el-table-column prop="number" label="课程编号" width="80">
            </el-table-column>
            <el-table-column prop="name" label="课程名" width="80">
            </el-table-column>
            <el-table-column prop="department" label="开课院系" width="80">
            </el-table-column>
            <el-table-column prop="classes_per_week" label="学时" width="80">
            </el-table-column>
            <el-table-column prop="point" label="学分" width="80">
            </el-table-column>
            <el-table-column prop="teacher_id" label="任课教师id" width="100">
            </el-table-column>
            <el-table-column prop="introduction" label="课程介绍" width="180">
            </el-table-column>
            <el-table-column prop="class_time" label="上课时间" width="180">
            </el-table-column>
            <el-table-column prop="classroom_id" label="上课地点" width="80">
            </el-table-column>
            <el-table-column prop="max_student" label="任课容量" width="80">
            </el-table-column>
            <el-table-column label="操作" width="170">
                <template >
                    <el-button size="mini" >选课</el-button>
                </template>
            </el-table-column>
        </el-table>
</template>

<script>
export default {
    name:'CourseTableSingle',
    data(){
        return{
            // status:'',
            // tableData:[]
        }
    },
    methods:{

    },
    props:['status','tableData']

}
</script>

<style>

</style>