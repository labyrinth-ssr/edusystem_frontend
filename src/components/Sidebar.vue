<template>
  <el-menu :default-active="'/home'" router background-color="#5B7DB1" text-color="white" 
    active-text-color="black" >
    <inner-menu :navList="this.navList"></inner-menu>
  </el-menu>
</template>

<script>
// import store from '@/store'
import InnerMenu from './innerMenu.vue'

  export default {
    name: 'NavMenu',
    components: {
    InnerMenu
  },
  created(){
},
    data () {
      return{
        navList:this.$store.state.routers,
      }
    }
    ,
    methods:{
    },
    mounted(){
      console.log(this.$store.state.routers)
    }
  }
</script>
<style scoped>
  .el-menu{
    height: 100%;
  }
</style>



