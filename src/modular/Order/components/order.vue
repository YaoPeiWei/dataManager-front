<template>
    <div id="content" style="min-height: 550px">
      <div id="order">
        <a-empty
          v-if="visible"
          image="https://gw.alipayobjects.com/mdn/miniapp_social/afts/img/A*pevERLJC9v0AAAAAAAAAAABjAQAAAQ/original"
        >
          <span slot="description"> Customize <a href="#API">Description</a> </span>
          <a-button type="primary" @click="createCarParking">Create Now</a-button>
        </a-empty>
        <order-form v-if="!visible" @close="createCarParking"></order-form>
      </div>
      <div id="order_history">
        <order-history></order-history>
      </div>
    </div>
</template>

<script>
import orderHistory from './orderHistory'
import orderForm from './orderForm'
export default {
  name: 'Order',
  components: {
    orderHistory,
    orderForm
  },
  data () {
    return {
      visible: true
    }
  },
  methods: {
    createCarParking () {
      this.visible = !this.visible
    }
  }
}
</script>

<style scoped>
#order {
  width: 78%;
  float: left;
  margin-right: 10px;
}
#order_history{
  width: 20%;
  float: left;
}
</style>
