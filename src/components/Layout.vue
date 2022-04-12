<template>
<el-container>
      <change-passwd-dialog :visible="dialogVisible" @dialogclose='this.dialogVisible=false'/>

  <el-aside width="200px">
    <sidebar class="sidebar-container" />
  </el-aside>
  <el-container>
    <el-header>
        <navbar />
    </el-header>
    <el-main>
      <router-view/>
    </el-main>
  </el-container>
</el-container>
</template>

<script>
import Sidebar from './Sidebar.vue'
import Navbar from './NavBar.vue'
import ChangePasswdDialog from '@/components/ChangePasswdDialog.vue';

export default {
  name: 'Layout',
  components: {
    Navbar,
    Sidebar,
    ChangePasswdDialog
  },
      mounted(){
        console.log(this.$store.state.first_login)
      if(this.$store.state.first_login){
        this.dialogVisible=true
      }
      else{
        this.dialogVisible=false
      }
    },
    data(){
      return{
        dialogVisible:''
      }
    }
}
</script>

<style scoped>
  .el-header{
    background-color: aliceblue;
  }
  .el-container{
    height: 100%;
  }
</style>
