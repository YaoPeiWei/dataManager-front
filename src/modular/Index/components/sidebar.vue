<template>
  <a-layout id="components-layout-demo-fixed-sider">
    <a-layout-sider :style="{ overflow: 'auto', height: '100vh', position: 'fixed', left: 0 }">
      <div class="logo">
        <a-avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" :size="100"/>
      </div>
      <a-menu theme="dark" mode="inline" :defaultSelectedKeys="selectKeys" class="menu">
        <a-menu-item key="order">
          <a-icon type="bar-chart" />
          <span class="nav-text">Order</span>
        </a-menu-item>
        <a-menu-item key="2">
          <a-icon type="video-camera" />
          <span class="nav-text">nav 2</span>
        </a-menu-item>
        <a-menu-item key="3">
          <a-icon type="upload" />
          <span class="nav-text">nav 3</span>
        </a-menu-item>
        <a-menu-item key="4">
          <a-icon type="user" />
          <span class="nav-text">nav 4</span>
        </a-menu-item>
        <a-menu-item key="5">
          <a-icon type="cloud-o" />
          <span class="nav-text">nav 5</span>
        </a-menu-item>
        <a-menu-item key="6">
          <a-icon type="appstore-o" />
          <span class="nav-text">nav 6</span>
        </a-menu-item>
        <a-menu-item key="7">
          <a-icon type="team" />
          <span class="nav-text">nav 7</span>
        </a-menu-item>
        <a-menu-item key="8">
          <a-icon type="shop" />
          <span class="nav-text">nav 8</span>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>
  </a-layout>
</template>

<script>
export default {
  name: 'sidebar',
  data () {
    return {
      selectKeys: []
    }
  },
  mounted () {
    this.initSelectKeys()
  },
  methods: {
    initSelectKeys () {
      // console.log(this.$route.path.split('/'))
      this.selectKeys.push(this.$route.path.split('/')[2].toString())
    }
  }
}
</script>

<style scoped>
  /*#components-layout-demo-fixed-sider .logo {*/
  /*  height:100px;*/
  /*  width: 100px;*/
  /*  background: rgba(255, 255, 255, 0.2);*/
  /*  margin: 30px auto 20px auto;*/
  /*  border-radius: 300px;*/
  /*}*/
  #components-layout-demo-fixed-sider .menu {
    margin-top: 20px;
  }
</style>
