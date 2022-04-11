<template>
<div>
  <el-upload action="fakeaction" :auto-upload="false" :on-change="fileChange" :file-list="fileList">
                  选取文件
              </el-upload>
              <el-button type="primary" size="small" @click="submitUpload">上传</el-button>
</div>
</template>

<script>

export default {
  name: "FileUpload",
  data(){

    return{

      fileList:[]
    }
  },
  methods: {
    fileChange(file,fileList){
          console.log(file)
          console.log(fileList)
          this.fileList = fileList;
      },
      submitUpload(){
          console.log(this.fileList)
        //   this.$axios.post('/upload/csv/admin/batch_add_course',null,{params:{
        //       requester_id:this.$store.state.user_id,
        //       file:this.fileList[0].raw
        //   }}).then((resp)=>{
        //       console.log(resp.data)
        //   })
        const formData = new FormData() //FormData对象，添加参数只能通过append('key', value)的形式添加
        formData.append('file', this.fileList[0].raw) //添加文件对象
        formData.append('requester_id', this.$store.state.user_id)
          this.$axios.post('/userinfo/admin/addusers_csv',{
              requester_id:this.$store.state.user_id,
              file:this.fileList[0].raw
          }/* ,{params:formData} */).then((resp)=>{
              console.log(resp.data)
          })
      },
  },
}
</script>

<style scoped>

</style>