<template>
  <el-form :model="form" style="text-align: left" ref="form" >
                  <el-form-item label="课程名">
                      <el-input v-model="form.name" :disabled="judgeDisable2"/>
                  </el-form-item>
                  <el-form-item label="课程编号" >
                      <el-input v-model="form.number" :disabled="judgeDisable"/>
                  </el-form-item>
                  <el-form-item label="开课院系" >
                      <el-input v-model="form.department" :disabled="judgeDisable"/>
                  </el-form-item>
                  <el-form-item label="学时" >
                      <el-input v-model="form.classes_per_week" :disabled="judgeDisable"/>
                  </el-form-item>
                  <el-form-item label="学分" >
                      <el-input v-model="form.point" :disabled="judgeDisable"/>
                  </el-form-item>
                  <el-form-item label="任课教师" >
                      <el-input v-model="form.teacher_id" :disabled="judgeDisable"/>
                  </el-form-item>
                  <el-form-item label="课程介绍" >
                      <el-input v-model="form.introduction" :disabled="judgeDisable"/>
                  </el-form-item>
                  <el-form-item label="上课时间">
                      <el-input v-model="form.class_time" :disabled="judgeDisable2"/>
                  </el-form-item>
                  <el-form-item label="上课教室">
                      <el-input v-model="form.classroom_id" :disabled="judgeDisable2"/>
                  </el-form-item>
                  <el-form-item label="选课容量" >
                      <el-input v-model="form.max_student" :disabled="judgeDisable"/>
                  </el-form-item>
              </el-form>
</template>
<script>
export default {
    name: 'CourseForm',
    props: ['formdata_prop', 'action_prop'],
    computed: {
    judgeDisable: function () {
      return this.action=='watch'||(this.role=='teacher'&&this.action=='edit')
    },
    judgeDisable2: function () {
      return this.action=='watch'
    }
  },
    watch: {
        formdata_prop:function (newval) {
              this.form=newval
        }
    },
    created() {
          this.form=this.formdata_prop
    },
    data() {
        return {
            role:this.$store.state.role,
            action:this.action_prop,
            form: this.formdata_prop
            // {
            //     number: "",
            //     suffix: 0,
            //     name: "aaa",
            //     point: '',
            //     classes_per_week: '',
            //     teacher_id: "",
            //     max_student: '',
            //     introduction: "",
            //     department: "",
            //     class_time: ''
            // }
        }
    }
}
</script>

<style>

</style>