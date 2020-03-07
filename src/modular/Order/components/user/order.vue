<template>
    <div id="content" style="min-height: 550px">
      <div id="order">
        <div id="createOrder" v-show="!hasOrder">
          <a-empty
            v-if="visible"
            image="https://gw.alipayobjects.com/mdn/miniapp_social/afts/img/A*pevERLJC9v0AAAAAAAAAAABjAQAAAQ/original"
          >
            <span slot="description"> Customize <a href="#API">Description</a> </span>
            <a-button type="primary" @click="createCarParking">Create Now</a-button>
          </a-empty>
          <order-form v-if="!visible" @close="createCarParking" @insertOrder="insertOrder"></order-form>
        </div>
        <div id="ordering" v-show="hasOrder">
          <ordering ref="ordering" @CancelBack="cancelBack"></ordering>
        </div>
      </div>
      <div id="order_history">
        <order-history ref="orderHistory"></order-history>
      </div>
    </div>
</template>

<script>
import orderHistory from './orderHistory'
import orderForm from './orderForm'
import ordering from './ordering'
export default {
  name: 'Order',
  components: {
    orderHistory,
    orderForm,
    ordering
  },
  data () {
    return {
      hasOrder: false,
      visible: true
    }
  },
  mounted () {
    this.showOrder()
  },
  methods: {
    cancelBack () {
      this.hasOrder = false
      this.createCarParking()
    },
    showOrder () {
      this.$refs.ordering.initData().then(res => {
        this.hasOrder = res
      })
    },
    createCarParking () {
      this.visible = !this.visible
    },
    insertOrder () {
      this.showOrder()
      this.$refs.orderHistory.initData()
      this.openNotification()
    },
    openNotification () {
      this.$notification.open({
        message: '我们的故事从这开始了',
        icon: <a-icon type='check' style='color: #108ee9' />,
        description:
          '恭喜您预约成功，请在指定时间内到达停车位停车',
        onClick: () => {
          console.log('Notification Clicked!')
        }
      })
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
