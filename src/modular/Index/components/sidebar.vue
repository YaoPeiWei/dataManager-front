<template>
  <a-layout id="components-layout-demo-fixed-sider">
    <a-layout-sider :style="{ overflow: 'auto', height: '100vh', position: 'fixed', left: 0 }">
      <div class="logo">
        <div class="touxiang">
          <div v-if="flag">
            <a-avatar :src="touxiang" :size="100"/>
          </div>
          <div v-else>
            <a-avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" :size="100"/>
          </div>
        </div>
      </div>
      <a-menu theme="dark" mode="inline" :defaultSelectedKeys="selectKeys" class="menu" @select="selectMenu">
        <template v-for="item in menu">
          <a-menu-item v-if="item.role === user.role" :key="item.key">
            <a-icon :type="item.icon" />
            <span>{{item.title}}</span>
          </a-menu-item>
        </template>
      </a-menu>
      <div class="sidebarFooter">
        <div class="edit" @click="edit">
          <div style="margin-top: 10px;border-right: solid 1px #e8e8e8;cursor: pointer" @mouseover="changEditColor" @mouseout="overLeave">
            <a-icon type="edit" v-if="!over"/>
            <a-icon type="edit" :style="{ color: 'hotpink' }" v-if="over"/>
          </div>
        </div>
        <div class="logout">
          <div style="margin-top: 10px;cursor: pointer" @mouseover="changLogoutColor" @mouseout="lougotLeave">
            <a-popconfirm placement="rightBottom" okText="确认" cancelText="取消" @confirm="logout">
              <template slot="title">
                是否注销登陆？
              </template>
              <a-icon type="logout" v-if="!lover"/>
              <a-icon type="logout" :style="{ color: 'hotpink' }" v-if="lover"/>
            </a-popconfirm>
          </div>
        </div>
      </div>
      <a-row>
        <Edit ref="Edit"></Edit>
      </a-row>
    </a-layout-sider>
  </a-layout>
</template>

<script>
import {logout} from '../api/sidebar'
import {delCookie} from '../../../cookie'
import Edit from '../../Login/components/Edit'
import menu from '../assets/menu'
export default {
  name: 'sidebar',
  data () {
    return {
      menu: [],
      selectKeys: [],
      touxiang: undefined,
      flag: false,
      user: {
        username: undefined,
        role: undefined
      },
      over: false,
      lover: false
    }
  },
  components: {
    Edit
  },
  watch: {
    touxiang (val) {
      if (this.touxiang) {
        this.flag = true
      } else {
        this.flag = false
      }
    }
  },
  mounted () {
    this.initData()
  },
  methods: {
    async initData () {
      this.user = await this.$store.getters.getLoginUser
      this.initSelectKeys()
      this.loadTouXiang()
      // console.log(JSON.stringify(menu))
      // console.log(JSON.stringify(this.user))
      // console.log(menu.filter(item => item.role === this.user.role))
      // console.log(this.$store.getters)
      // console.log(this.$store)
      this.menu = menu.filter(item => item.role === this.user.role)
    },
    initSelectKeys () {
      // console.log(this.$route.path.split('/'))
      this.selectKeys.push(this.$route.path.split('/')[2].toString())
    },
    async loadTouXiang () {
      // console.log(this.$store.getters.getUserId)
      if (this.$store.getters.getUserId) {
        this.touxiang = 'http://localhost:8080/api/attach/getAttachByUid?uid=' + this.$store.getters.getUserId
      }
    },
    changEditColor () {
      this.over = !this.over
    },
    overLeave () {
      this.over = false
    },
    changLogoutColor () {
      this.lover = !this.lover
    },
    lougotLeave () {
      this.lover = false
    },
    logout () {
      logout('/user/logout/LogOut', null).then(res => {
        if (res.code === 0) {
          this.$store.commit('clearLoginUser')
          delCookie('authorization')
          this.$router.push({
            path: '/login'
          })
        } else {
          this.$message.error('注销失败')
        }
      })
    },
    edit () {
      this.$refs.Edit.showDrawer()
    },
    selectMenu (val) {
      this.$router.push({
        path: '/index/' + val.selectedKeys[0]
      })
      // console.log(val)
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
  .logo{
    margin-top: 20px;
  }
  .touxiang{
    margin-left: 8px;
  }
  .info{
    margin-left: 8px;
  }
  .sidebarFooter{
    width: 200px;
    height: 50px;
    position: fixed;
    bottom: 0px;
  }
  .edit{
    float: left;
    width: 50%;
    height: 100%;
  }
  .logout{
    float: left;
    width: 50%;
    height: 100%;
  }
</style>
