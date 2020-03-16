<template>
  <div class="adminOrderIndex">
    <a-card
      style="width:100%;min-height: 600px"
      title="订单"
      :tabList="tabList"
      :activeTabKey="key"
      @tabChange="key => onTabChange(key)"
    >
      <span slot="unFinishedOrder" slot-scope="item"> <a-icon type="home" />{{item.name}} </span>
      <span slot="HistoryedOrder" slot-scope="item"> <a-icon type="home" />{{item.name}} </span>
      <a href="javascript:;" slot="extra" @click="moveUserPage">GO TO USER PAGE  <a-icon type="double-right" /></a>
      <div class="unFinishedOrderTab" v-if="tab === 'unFinishedOrder'">
        <adminOrder></adminOrder>
      </div>
      <div class="HistoryedOrder" v-if="tab === 'HistoryedOrder'">
        Connect 2
      </div>
    </a-card>
<!--    <a-tabs defaultActiveKey="1" :tabPosition="mode">-->
<!--      <a-tab-pane tab="进行中的订单" key="1"></a-tab-pane>-->
<!--      <a-tab-pane tab="Tab 2" key="2">Content of Tab 2</a-tab-pane>-->
<!--      <a-tab-pane tab="Tab 3" key="3">Content of Tab 3</a-tab-pane>-->
<!--      <a-button slot="tabBarExtraContent">-->

<!--      </a-button>-->
<!--    </a-tabs>-->
  </div>
</template>

<script>
import adminOrder from './adminOrder'
export default {
  name: 'adminOrderIndex',
  components: {
    adminOrder
  },
  data () {
    return {
      tab: 'unFinishedOrder',
      key: '0',
      tabList: [
        {
          key: '0',
          name: '进行中的订单',
          tabId: 'unFinishedOrder',
          scopedSlots: { tab: 'unFinishedOrder' }
        },
        {
          key: '1',
          name: '历史订单',
          tabId: 'HistoryedOrder',
          scopedSlots: { tab: 'HistoryedOrder' }
        }
      ]
    }
  },
  methods: {
    onTabChange (key) {
      const tab = this.tabList.filter(item => item.key === key)
      this.tab = tab[0].tabId
      this.key = tab[0].key
    },
    moveUserPage () {
      this.$router.push({
        path: '/index'
      })
    }
  }
}
</script>

<style scoped>
.adminOrderIndex{
  min-height: 600px;
  text-align: left;
}
</style>
