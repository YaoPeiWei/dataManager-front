<template>
    <div class="CarParkIndex">
        <a-card
                style="width:100%;min-height: 600px"
                title="小区管理"
                :tabList="tabList"
                :activeTabKey="key"
        >
            <span slot="community" slot-scope="item"> <a-icon type="hdd" />{{item.name}} </span>
            <a href="#" slot="extra">More</a>
            <div class="community">
                <community></community>
            </div>
        </a-card>
    </div>
</template>

<script>
import community from './community'
export default {
  name: 'CarParkIndex',
  components: {
    community
  },
  data () {
    return {
      key: '0',
      tabList: [
        {
          key: '0',
          name: '小区管理',
          tabId: 'community',
          scopedSlots: { tab: 'community' }
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
