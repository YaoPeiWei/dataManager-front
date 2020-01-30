<template>
    <div id="content" style="min-height: 500px">
      <div id="order">
        <a-empty
          image="https://gw.alipayobjects.com/mdn/miniapp_social/afts/img/A*pevERLJC9v0AAAAAAAAAAABjAQAAAQ/original"
        >
          <span slot="description"> Customize <a href="#API">Description</a> </span>
          <a-button type="primary">Create Now</a-button>
        </a-empty>
      </div>
      <div id="order_history">
        <order-history></order-history>
      </div>
    </div>
</template>

<script>
import orderHistory from './orderHistory'
export default {
  name: 'Order',
  components: {
    orderHistory
  }
}
</script>

<style scoped>
#order {
  width: 80%;
  float: left;
}
#order_history{
  width: 20%;
  float: left;
}
</style>
