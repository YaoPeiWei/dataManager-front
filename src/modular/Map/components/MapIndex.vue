<template>
    <div class="MapIndex">
        <a-card
                style="width:100%;min-height: 600px"
                title="小区定位"
                :tabList="tabList"
                :activeTabKey="key"
        >
            <span slot="communityLocation" slot-scope="item"> <a-icon type="car" />{{item.name}} </span>
            <a href="javascript:;" slot="extra" @click="moveUserPage">GO TO USER PAGE  <a-icon type="double-right" /></a>
            <div class="communityLocation">
                <Map></Map>
            </div>
        </a-card>
    </div>
</template>

<script>
import Map from './Map'

export default {
  name: 'MapIndex',
  components: {
    Map
  },
  data () {
    return {
      key: '0',
      tabList: [
        {
          key: '0',
          name: '小区定位',
          tabId: 'communityLocation',
          scopedSlots: { tab: 'communityLocation' }
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
.MapIndex{
    min-height: 600px;
    text-align: left;
}
</style>
