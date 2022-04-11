<template>
  <el-form :model="form" style="text-align: left" ref="form" >
                  <el-form-item label="学院">
                      <el-input v-model="form.department" />
                  </el-form-item>
                  <el-form-item label="专业" >
                      <el-input v-model="form.major" />
                  </el-form-item>
              </el-form>
</template>
<script>
export default {
    name: 'DepartmentForm',
    props: ['formdata_prop'],
    computed: {
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
            form: this.formdata_prop
        }
    }
}
</script>

<style>

</style>