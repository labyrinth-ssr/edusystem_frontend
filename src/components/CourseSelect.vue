<template>
<div >
  <div v-if="stage!=0">
    <h4>当前选课阶段：{{stage}}；学期：{{real_semester}}</h4>
    <el-table border :data="selected_table" style="width: 100%" :cell-style="getCellStyle" :row-style="row_style">
      <el-table-column prop="sectionId" label="节次" width="80">
      </el-table-column>
      <el-table-column v-for="index in day_num" :key="index" :prop="index + ''" :label="'星期' + index">
        <template slot-scope="scope">
          {{ scope.row[index + ""].name }}
        </template>
      </el-table-column>
    </el-table>
    <el-tabs type="border-card" class="subpage">
      <el-tab-pane label="可选课程">
        <course-table-single :tableData="can_select_courses" @click_row="highlight_toselect_cell" status="unselect"
          :selected_data="selected_courses" :learned_data="learned_courses" :semester="semester" :student_id="studentId"
          :stage="stage" @updatePage="updatePage"/>
      </el-tab-pane>
      <el-tab-pane label="已选课程">
        <course-table-single @click_row="highlight_selected_cell" :tableData="selected_courses" status="selected"
          :semester="semester" :student_id="studentId" @updatePage="updatePage"/>
      </el-tab-pane>
      <el-tab-pane label="已修课程">
        <course-table-single :tableData="learned_courses" status="learned"/>
      </el-tab-pane>
    </el-tabs>
  </div>
    <div v-else>
    <h4>当前选课未开放！</h4>
  </div>
  </div>
</template>

<script>
import CourseTableSingle from "./CourseTableSingle.vue";
export default {
  components: { CourseTableSingle },
  name: "CourseSelect",
  data() {
    return {
      real_semester:'',
      day_num: 7,
      can_select_courses: [],
      selected_courses: [],
      learned_courses: [],
      semester: "",
      stage: '',
      studentId: this.$store.state.user_id,
      selected_table: [],
      section_num: 13,
      highlight_selected: [],
      highlight_toselect: [],
    };
  },
  methods: {
    next_semester(semester){
      var arr=semester.toString().split('.')
      console.log(arr)
      var pre,su;
      if (parseInt(arr[1])==3){
        pre=(parseInt(arr[0])+1).toString()
        su='0'
      }
      else{
        pre=arr[0]
        su=(parseInt(arr[1])+1).toString()
      }
      console.log(Number(pre+'.'+su))
      return pre+'.'+su
    },
    updatePage(){
      const selected_condition = {
      studentId: this.studentId,
      semester: this.semester,
      status: this.stage-1,//stage1 预选（0）stage2 已选（1）
    };
    this.$axios
      .post("/course_sel/common/get_course/by_course_sel", selected_condition)
      .then((resp) => {
        this.selected_courses = resp.data;
        this.formattable()
      });

      const can_select_condition = {
      getCourseSelRequest: {
studentId: this.studentId
},
positiveSemester: this.semester
    };
    this.$axios
      .post(
        "/course_sel/common/get_course/by_course_sel_complement",
        can_select_condition
      )
      .then((resp) => {
        console.log(resp.data);

        this.can_select_courses = resp.data;
      });
    },
    highlight_toselect_cell(posList){
      this.highlight_toselect = posList;
    },
    highlight_selected_cell(posList) {
      this.highlight_selected = posList;
    },
    row_style() {
      return { height: "0px" };
    },
    getCellStyle(cell) {
      if (this.highlight_selected.length != 0||this.highlight_toselect.length!=0) {
         var bg_color='',border='';
        for (const pos of this.highlight_selected) {
          if (
            (cell.rowIndex + 1 )+ "" == pos.row &&
            cell.columnIndex + "" == pos.col
          ) {
            bg_color='antiquewhite'
          } 
        }
        for (const pos of this.highlight_toselect) {
          if (
            (cell.rowIndex + 1 )+ "" == pos.row &&
            cell.columnIndex + "" == pos.col
          ) {
            border="solid #96e27d"
          } 
        }
        return {"background-color": bg_color, "padding": "0px","border": border,'text-align':'center'}
      }
      return { 'padding': "0px" ,'text-align':'center'};
      // return {padding:'0px'}
    },
    // })

    formattable() {
        this.selected_table=[]

      for (let i = 1; i <= this.section_num; i++) {
        this.selected_table.push({
          sectionId: i,
          1: {},
          2: {},
          3: {},
          4: {},
          5: {},
          6: {},
          7: {},
        });
      }
      this.selected_courses.forEach((ele) => {
        var class_time = ele.class_time;
        class_time.split(",").forEach((period) => {
          const split_res = period.split("-");
          const section_id = parseInt(split_res[1]);
          this.selected_table[section_id - 1][split_res[0]] = {
            name: ele.name,
            id: ele.id,
          };
        });
      });
    },
  },
  created() {
    var getSemester=()=> {
  return this.$axios.get('/permission/common/current_semester');
}

var getStage=()=> {
  return this.$axios.get('/permission/common/check_choose_course');
}

this.$axios.all([getSemester(), getStage()])
  .then(this.$axios.spread((semester, stage) => {
      this.real_semester=semester.data
      this.semester=this.next_semester(semester.data);
      console.log(this.semester)
      this.stage=stage.data;

    const selected_condition = {
      studentId: this.studentId,
      semester: this.semester,
      status: this.stage-1,//stage1 预选（0）stage2 已选（1）
    };
    this.$axios
      .post("/course_sel/common/get_course/by_course_sel", selected_condition)
      .then((resp) => {
        console.log(resp.data)

        this.selected_courses = resp.data;
        this.formattable();
      });
    const learned_condition = {
      studentId: this.studentId,
      status: 2,
    };
    console.log(learned_condition)
    this.$axios
      .post("/course_sel/student/get_course_sel/by_student", learned_condition)
      .then((resp) => {
        this.learned_courses = resp.data;
    console.log(this.learned_courses)

      });
    const can_select_condition = {
      getCourseSelRequest: {
studentId: this.studentId
}, 
positiveSemester: this.semester

    };
    this.$axios
      .post(
        "/course_sel/common/get_course/by_course_sel_complement",
        can_select_condition
      )
      .then((resp) => {
        console.log(resp.data);

        this.can_select_courses = resp.data;
      });

    // 两个请求都完成后
  }));
    //TODO：先get permission
    // this.$axios.get('/permission/common/current_semester').then((resp)=>{
    //   console.log(resp.data)
    //   this.semester=resp.data;
    // })
    // this.$axios.get('/permission/common/choose_course_stage').then((resp)=>{
    //   console.log(resp.data)
    //   this.stage=resp.data;
    // })


  },
};
</script>

<style scoped>
.subpage{
    margin-top: 10px;
}
h4 {
  margin: 0px;
}

</style>