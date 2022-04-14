<template>
  <div id="app">
    <router-view/>
  </div>
</template>
<script>
export default {
  name:'App'
}
</script>

<style >
body {
  /* background-image: linear-gradient(to right, #b7ddff 0%, #8ee1ff 100%); */
  background-color: #f7eded;
  background-size: 100% 100vh;
  margin: 0px;
  height: 100%;
  width: 100%;
}
html{
  height: 100%;
}
#app{
  height: 100%;
}
::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 0;
}

::-webkit-scrollbar {
  -webkit-appearance: none;
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-thumb {
  cursor: pointer;
  border-radius: 5px;
  background: rgba(0, 0, 0, 0.15);
  transition: color 0.2s ease;
}
.el-table{
  border-radius: 20px;
}
.up-button{
  margin-bottom: 15px;
}
 #app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: left;
  color: #2c3e50;
}
body {
  /* background-image: #FFCCCC; */
  /* linear-gradient(to top, #fff1eb 0%, #ace0f9 100%); */
  background-size: 100% 100vh;
}
/*
nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
} */
</style>

