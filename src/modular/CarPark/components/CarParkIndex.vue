<template>
    <div class="CarParkIndex">
        <a-card
                style="width:100%;min-height: 600px"
                title="车位管理"
                :tabList="tabList"
                :activeTabKey="key"
        >
            <span slot="carPark" slot-scope="item"> <a-icon type="car" />{{item.name}} </span>
            <a href="javascript:;" slot="extra" @click="moveUserPage">GO TO USER PAGE  <a-icon type="double-right" /></a>
            <div class="carPark">
                <carPark></carPark>
            </div>
        </a-card>
    </div>
</template>

<script>
import carPark from './carPark'
export default {
  name: 'CarParkIndex',
  components: {
    carPark
  },
  data () {
    return {
      key: '0',
      tabList: [
        {
          key: '0',
          name: '车位管理',
          tabId: 'carPark',
          scopedSlots: { tab: 'carPark' }
        }
      ]
    }
  },
  methods: {
    moveUserPage () {
      this.$router.push({
        path: '/index/order'
      })
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
