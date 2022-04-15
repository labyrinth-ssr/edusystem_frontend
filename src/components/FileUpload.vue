<template>
<div>
  <el-upload action="fakeaction" :auto-upload="false" :on-change="fileChange" :file-list="fileList">
                  <el-link type="primary">选取文件</el-link>
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
          if(this.fileList.length==0){
            this.$message('缺少文件')
          }
        //   this.$axios.post('/upload/csv/admin/batch_add_course',null,{params:{
        //       requester_id:this.$store.state.user_id,
        //       file:this.fileList[0].raw
        //   }}).then((resp)=>{
        //       console.log(resp.data)
        //   })
        const formData = new FormData() //FormData对象，添加参数只能通过append('key', value)的形式添加
        formData.append('file', this.fileList[0].raw) //添加文件对象
        formData.append('requester_id', this.$store.state.user_id)
        console.log(this.$store.state.user_id)
          this.$axios.post('/userinfo/admin/addusers_csv',formData).then((resp)=>{
            console.log(resp.data)
            if(resp.data.valid === true){
              this.$message({
                type: "success",
                message:"批量导入成功！"
              })
            }else {
              const str ='失败！'
              const len = resp.data.addUserFileLog.length
              console.log(len)
              for (let i = 0; i < len; i++) {
                const dict = resp.data.addUserFileLog[i].registerFormat
                if(dict.isOk === true) continue
                if (dict.id_numberUnique !== true)
                {
                  str.concat("第"+toString(i)+"行身份证号已存在!")
                }
                if(dict.id_numberFormat !==false){
                  str.concat("第"+toString(i)+"行身份证号格式错误!")
                }if(dict.emailFormat !== true){
                  str.concat("第"+toString(i)+"行邮件格式错误!")
                }
                if(dict.phone_numberFormat!==true){
                  str.concat("第"+toString(i)+"行手机号码格式错误!")
                }
                if(dict.usernameFormat !== true){
                  str.concat("第"+toString(i)+"行姓名格式错误!")
                }
                if(dict.roleFormat !== true){
                  str.concat("第"+toString(i)+"行身份格式错误!")
                }
                if(dict.user_idFormat !== true){
                  str.concat("第"+toString(i)+"行用户id错误!")
                }
                if(dict.user_idUnique !== true){
                  str.concat("第"+toString(i)+"行用户id已存在!")
                }
                if(dict.departmentExist!==true)
                {
                  str.concat("第"+toString(i)+"行学院不存在!")
                }
                if (dict.majorExist!==true){
                  str.concat("第"+toString(i)+"行专业不存在!")
                }

              }
              this.$message({
                type: "error",
                message:str,
                duration: 3000
              })

            }

          })
      },
  },
}
</script>

<style scoped>

</style>