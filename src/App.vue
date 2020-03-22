<template>
  <div id="app">
<!--    <img src="./assets/logo.png">-->
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 0px;
}
/* 设置滚动条的样式 */
::-webkit-scrollbar {
    width:8px;
    background-color: #2c3e50;
}

/* 滚动槽 */
::-webkit-scrollbar-track {
    border-radius:10px;
}

/* 滚动条滑块 */
::-webkit-scrollbar-thumb {
    border-radius:10px;
    background: darkgray;
}
</style>
