<template>
<div>
  <el-table :data="selected_table" style="width: 100%" :row-style="getRowStyle">
      <el-table-column prop="sectionId" label="节次" width="80">
      </el-table-column>
      <el-table-column v-for="index in day_num" :key="index" :prop="index+''" :label="'星期'+(index)"  />
    </el-table>
    <el-tabs type="border-card">
  <el-tab-pane label="可选课程"><course-table-single :tableData="can_select_courses"/> </el-tab-pane>
  <el-tab-pane  label="已选课程"><course-table-single :tableData="selected_courses"/> </el-tab-pane>
  <el-tab-pane  label="已修课程"><course-table-single :tableData="learned_courses"/> </el-tab-pane>
</el-tabs>
        </div>
</template>

<script>
import CourseTableSingle from './CourseTableSingle.vue'
export default {
  components: { CourseTableSingle },
    name:'CourseSelect',
    data(){
        return{
            day_num:5,
            can_select_courses:[],
            selected_courses:[],
            learned_courses:[],
            sememster:'2022.1',
            stage:'1',
            studentId:this.$store.state.user_id,
            selected_table:[],
            section_num:13
        }
    },
    methods:{
        getRowStyle({row, rowIndex}){
            // for (let i=1;i<=this.day_num;i++){
            //     console.log(row.i)
            // }
            // console.log(row)
        },
        formattable(){
            console.log(this.selected_courses)

            for (let i=1;i<=this.section_num;i++){
                this.selected_table.push({sectionId:i,'1':'','2':'','3':'','4':'','5':''})
            }
            this.selected_courses.forEach((ele)=>{
                console.log(ele)
                var class_time=ele.class_time;
                //1-3,1-4
                class_time.split(',').forEach((period)=>{
                    const split_res=period.split('-')
                    // 1-3
                    console.log(split_res)
                    const section_id=parseInt(split_res[1]);
                    this.selected_table[section_id][split_res[0]]=ele.name;
                })
            })
            // const raw=[{sectionId:1,class:['计组','','','','']},{sectionId:2,class:['计组','','','','']}]
            // raw.forEach((ele)=>{
            //     class.
            // })
        }
    },
    mounted(){
        //TODO：先get permission
        const selected_condition={
                studentId:this.studentId,
                sememster:this.sememster,
                status:0
            }
        this.$axios.post('/course_sel/common/get_course/by_course_sel',selected_condition).then((resp)=>{
            this.selected_courses=resp.data;
            console.log(resp.data)
        this.formattable();


        })
        const learned_condition={
                studentId:this.studentId,
                sememster:this.sememster,
                status:2
            }
        this.$axios.post('/course_sel/common/get_course/by_course_sel',learned_condition).then((resp)=>{
            this.learned_courses=resp.data;
            console.log(resp.data)
            

        })
        const can_select_condition={
                studentId:this.studentId,
            }
        this.$axios.post('/course_sel/common/get_course/by_course_sel_complement',can_select_condition).then((resp)=>{
            console.log(resp.data)
            this.can_select_courses=resp.data;
        })
    }

}
</script>

<style>

</style>