<template>
  <el-upload
      class="upload-demo"
      drag
      accept=".csv"
      :headers="headers"
      :action="action"
      :with-credentials='true'
      :limit="limitNum"
      :on-success="load_success"
      :on-error="load_fail"
  >
    <i class="el-icon-upload"></i>
    <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
    <div class="el-upload__tip" slot="tip">只能上传csv文件，且不超过500kb</div>
  </el-upload>
</template>

<script>
import  API_CONFIG from "../../vue.config.js"
export default {
  name: "FileUpload",
  uploadUrl: "/userinfo/admin/addusers_csv",
  http:'',
  data(){

    return{

      headers : {
        'content-type':"application/json",
      },
      action: '/userinfo/admin/addusers_csv',
      true: '',
      limitNum: 100,
    }
  },
  methods: {
    load_success(response,file,fileList){
      console.log(response)
      return undefined
    },
    load_fail(err, file, fileList){
      console.log(err)
    }
  },
  mounted() {
    console.log("api==",API_CONFIG.devServer.proxy['/api'].target)
    this.http = API_CONFIG.devServer.proxy['/api'].target
    this.$data.action = "/userinfo/admin/addusers_csv"
    console.log(this.$data.action)

  }
}
</script>

<style scoped>

</style>