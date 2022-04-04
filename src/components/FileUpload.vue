<template>
  <el-upload
      class="upload-demo"
      drag
      accept="csv"
      :headers="headers"
      :action="action"
      :with-credentials='true'
      multiple
      :limit="limitNum"
      :on-success="loadSuccess(response,file,fileList)"
  >
    <i class="el-icon-upload"></i>
    <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
    <div class="el-upload__tip" slot="tip">只能上传csv文件，且不超过500kb</div>
  </el-upload>
</template>

<script>
export default {
  name: "FileUpload", uploadUrl: "",

  data(){
    return{
      headers : '',
      action: "https://jsonplaceholder.typicode.com/posts/",
      true: '',
      limitNum: 100,
    }
  },
  methods: {
    loadSuccess(response,file,fileList){
      console.log(response)
      return undefined
    }
  },
  mounted() {undefined
    this.headers['X-CSRFToken'] =this.getToken()
//this.uploadUrl是后台上传接口
    this.action='http://127.0.0.1:8000'+this.uploadUrl

  }
}
</script>

<style scoped>

</style>