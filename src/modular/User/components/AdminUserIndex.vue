<template>
    <div class="CarParkIndex">
        <a-card
                style="width:100%;min-height: 600px"
                title="用户管理"
                :tabList="tabList"
                :activeTabKey="key"
        >
            <span slot="adminUserAccount" slot-scope="item"> <a-icon type="team" />{{item.name}} </span>
            <a href="#" slot="extra">More</a>
            <div class="adminUserAccount">
                <AdminUserAccount></AdminUserAccount>
            </div>
        </a-card>
    </div>
</template>

<script>
import AdminUserAccount from './AdminUserAccount'
export default {
  name: 'AdminUserIndex',
  components: {
    AdminUserAccount
  },
  data () {
    return {
      key: '0',
      tabList: [
        {
          key: '0',
          name: '账户管理',
          tabId: 'adminUserAccount',
          scopedSlots: { tab: 'adminUserAccount' }
        }
      ]
    }
  }
}
</script>

<style scoped>
.CarParkIndex {
    min-height: 600px;
    text-align: left;
}
</style>
