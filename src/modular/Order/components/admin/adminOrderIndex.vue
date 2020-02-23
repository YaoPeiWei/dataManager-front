<template>
  <div class="adminOrderIndex">
    <a-tabs defaultActiveKey="1" :tabPosition="mode">
      <a-tab-pane tab="进行中的订单" key="1"><adminOrder></adminOrder></a-tab-pane>
      <a-tab-pane tab="Tab 2" key="2">Content of Tab 2</a-tab-pane>
      <a-tab-pane tab="Tab 3" key="3">Content of Tab 3</a-tab-pane>
      <a-button slot="tabBarExtraContent">

      </a-button>
    </a-tabs>
  </div>
</template>

<script>
import adminOrder from './adminOrder'
export default {
  name: 'adminOrderIndex',
  components: {
    adminOrder
  },
  data() {
    return {
      mode: 'top'
    };
  },
  methods: {
    callback(val) {
      console.log(val)
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
