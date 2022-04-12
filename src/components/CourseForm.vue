<template>
  <el-form :model="form" style="text-align: left" ref="form" :rules="rules" label-width="80px">
                  <el-form-item label="课程名" prop="name">
                      <el-input v-model="form.name" :disabled="judgeDisable2"/>
                  </el-form-item>
                  <el-form-item label="课程编号" prop="number">
                      <el-input v-model="form.number" :disabled="judgeDisable"/>
                  </el-form-item>
                  <el-form-item label="开课院系" prop="department">
                      <el-input v-model="form.department" :disabled="judgeDisable"/>
                  </el-form-item>
                  <el-form-item label="学时" prop="classes_per_week">
                      <el-input v-model="form.classes_per_week" :disabled="judgeDisable"/>
                  </el-form-item>
                  <el-form-item label="学分" prop="point">
                      <el-input v-model="form.point" :disabled="judgeDisable"/>
                  </el-form-item>
                  <el-form-item label="任课教师" v-if="this.role!='teacher'" prop="teacher_id">
                      <el-input v-model="form.teacher_id" :disabled="judgeDisable" />
                  </el-form-item>
                  <el-form-item label="课程介绍" prop="introduction">
                      <el-input v-model="form.introduction" :disabled="judgeDisable"/>
                  </el-form-item>
                  <!-- <el-form-item label="上课时间" prop="class_time">
                      <el-input v-model="form.class_time" :disabled="judgeDisable2"/>
                  </el-form-item>
                  <el-form-item label="上课教室" prop="classroom_id">
                      
                  </el-form-item> -->
                  <el-form-item label="选课容量" prop="max_student">
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
        console.log(this.role,this.action)
      return this.action=='watch'||(this.role=='teacher'&&this.action=='edit')
    },
    judgeDisable2: function () {
      return this.action=='watch'
    }
  },
    watch: {
        formdata_prop:function (newval) {
              this.form=newval
        },
        action_prop:function (newval) {
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
            form: this.formdata_prop,
            rules:{
                
            },
            classrooms:[]
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