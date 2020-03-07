<template>
  <div class="index">
    <sidebar></sidebar>
    <contents></contents>
  </div>
</template>

<script>
import sidebar from './sidebar'
import contents from './content'
import {logout} from '../api/sidebar'
import {delCookie} from '../../../cookie'
export default {
  name: 'Index',
  destroyed () {
    this.logout()
  },
  components: {
    sidebar,
    contents
  },
  methods: {
    logout () {
      logout('/user/logout/LogOut', null).then(res => {
        if (res.code === 0) {
          this.$store.commit('clearLoginUser')
          delCookie('authorization')
          // this.$router.push({
          //   path: '/login'
          // })
        }
      })
    }
  }
}
</script>

<style scoped>
</style>
