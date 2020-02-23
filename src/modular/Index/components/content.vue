<template>
  <a-layout :style="{ marginLeft: '200px' }">
<!--    <a-layout-header :style="{ background: '#fff', padding: 0 }" >-->
<!--      随便写点什么-->
<!--    </a-layout-header>-->
    <a-layout-content :style="{ margin: '24px 16px 0', overflow: 'initial' }">
      <router-view></router-view>
    </a-layout-content>
    <a-layout-footer :style="{ textAlign: 'center' }">
      Ant Design ©2018 Created by Ant UED
    </a-layout-footer>
  </a-layout>
</template>

<script>
export default {
  name: 'contents'
}
</script>

<style scoped>
  .ant-layout{
    background: white;
  }
</style>
