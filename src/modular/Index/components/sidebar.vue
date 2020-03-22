<template>
  <a-layout id="components-layout-demo-fixed-sider">
    <a-layout-sider :style="{ overflow: 'auto', height: '100vh', position: 'fixed', left: 0 }">
      <div class="logo">
        <div class="touxiang">
            <a-upload
                    accept=".jpg,.png,.jpeg"
                    :custom-request="upload"
                    :multiple="false"
                    :show-upload-list="false"
            >
                <div>
                    <a-avatar :size="100" :src="touxiang?touxiang:'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png'"></a-avatar>
                </div>
                <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
                    <img alt="example" style="width: 100%" :src="touxiang?touxiang:'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png'" />
                </a-modal>
            </a-upload>
        </div>
      </div>
      <a-menu theme="dark" mode="inline" :defaultSelectedKeys="selectKeys" class="menu" @select="selectMenu">
        <template v-for="item in menu">
          <a-menu-item v-if="item.role === user.role" :key="item.key" :id="item.key">
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
import {logout, uploadImage} from '../api/sidebar'
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
      user: {
        username: undefined,
        role: undefined
      },
      over: false,
      lover: false,
      previewVisible: false
    }
  },
  components: {
    Edit
  },
  watch: {
    $route: {
      handler: function (val, oldVal) {
        // console.log(val)
        const id = this.$route.path.split('/')[2].toString()
        // console.log(id)
        // console.log(document.getElementById(id))
        document.getElementById(id).click()
      },
      // 深度观察监听
      deep: true
    }
  },
  mounted () {
    this.initData()
  },
  methods: {
    async initData () {
      this.user = await this.getLoginUser()
      this.loadTouXiang()
      // console.log(JSON.stringify(menu))
      // console.log(JSON.stringify(this.user))
      // console.log(menu.filter(item => item.role === this.user.role))
      // console.log(this.$store.getters)
      // console.log(this.$store)
      this.menu = menu.filter(item => item.role === this.user.role)
      this.initSelectKeys()
    },
    async getLoginUser () {
      const loginUserArray = JSON.parse(sessionStorage.getItem(this.$store.state.User))
      if (loginUserArray) {
        const user = loginUserArray.filter(item => item.id === sessionStorage.getItem(this.$store.state.userId))
        return user[0]
      }
      return null
    },
    initSelectKeys () {
      // console.log(this.$route.path.split('/'))
      this.selectKeys.push(this.$route.path.split('/')[2].toString())
    },
    async loadTouXiang () {
      // console.log(sessionStorage.getItem(this.$store.state.userId))
      if (sessionStorage.getItem(this.$store.state.userId)) {
        this.touxiang = 'http://localhost:8080/api/attach/getAttachByUid?uid=' + sessionStorage.getItem(this.$store.state.userId) + '&r=' + Math.random()
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
    async logout () {
      let flag = false
      await logout('/user/logout/LogOut', null).then(res => {
        if (res.code === 0) {
          flag = true
        } else {
          this.$message.error('注销失败')
        }
      })
      if (flag) {
        this.$store.commit('clearLoginUser')
        delCookie('authorization')
        this.$router.push({
          path: '/login'
        })
      }
    },
    edit () {
      this.$refs.Edit.showDrawer()
    },
    selectMenu (val) {
      this.$router.push({
        path: '/index/' + val.selectedKeys[0]
      })
      // console.log(val)
    },
    /**
     * 文件选择
     */
    upload (file) {
      const params = new FormData()
      params.append('file', file.file)
      params.append('userId', this.$store.getters.getUserId)
      uploadImage(params).then(res => {
        if (res.data.code === 0) {
          this.flag = false
          this.loadTouXiang()
        } else {
          this.$message.error('上传图片失败')
        }
      })
    },
    handleCancel () {
      this.previewVisible = false
    },
    async handlePreview (file) {
      this.previewVisible = true
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
    cursor: pointer;
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
