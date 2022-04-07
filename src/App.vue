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
  background-image: linear-gradient(to right, #b7ddff 0%, #8ee1ff 100%);
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
/* #app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

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

