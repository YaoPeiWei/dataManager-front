<template>
  <div class="scroller">
    <a-timeline pending="未来可期">
      <div v-for="(order,index) in data" :key="order.id">
        <a-timeline-item :color="order.finishFlag === '1'?(order.isFail=== '1'?'green':'red'):'blue'">
          <a-popover placement="leftTop">
            <template slot="content">
              <div>
                <span><description title="费用($)" :content="order.price" /></span>
                <span><a @click="showDrawer(order)">了解更多</a></span>
              </div>
            </template>
            <template slot="title">
              <span>第{{index+1}}单<span v-if="order.finishTime">: {{order.finishTime}}</span></span>
            </template>
            第{{index+1}}单<span v-if="order.finishTime">: {{order.finishTime}}</span>
          </a-popover>
        </a-timeline-item>
      </div>
    </a-timeline>
    <a-drawer width="350" placement="right" :closable="false" :visible="visible" title="订单详情" @close="onClose">
      <p class="pStyle">订单信息</p>
      <a-row>
        <a-col :span="12">
          <description title="车牌号" :content="order.carNumber" />
        </a-col>
        <a-col :span="12">
          <description title="费用($)" :content="order.price" />
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="24">
          <description title="预约时间" :content="order.appointmentTime" />
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="24">
          <description title="结束时间" :content="order.finishTime" />
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="12">
          <description title="订单状态" :content="order.isFail | filterStatusVal" />
        </a-col>
      </a-row>
      <a-row v-if="order.isFail === '0'">
        <a-col :span="24">
          <description title="取消原因" :content="order.failResource" />
        </a-col>
      </a-row>
      <a-divider>With Text</a-divider>
      <p class="pStyle">车位信息</p>
      <a-row>
        <a-col :span="12">
          <description title="区域" :content="carPark.region" />
        </a-col>
        <a-col :span="12">
          <description title="状态" :content="carPark.isRoom === '0'?'室外':'室内'" />
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="12">
          <description title="每小时单价($)" :content="carPark.price" />
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="24">
          <description title="车位位置" :content="carPark.location" />
        </a-col>
      </a-row>
    </a-drawer>
  </div>
</template>

<script>
import {getCarParkByID} from '../../api/carPark'
import {getLoginUserOrders} from '../../api/order'
import description from '../../../Index/components/description'
let that
export default {
  name: 'orderHistory',
  components: {
    description
  },
  data () {
    return {
      visible: false,
      data: [],
      order: {},
      carPark: {},
      status: [
        {key: '0', val: '失败'}, {key: '1', val: '成功'}
      ]
    }
  },
  beforeCreate () {
    that = this
  },
  mounted () {
    this.initData()
  },
  filters: {
    filterStatusVal: (key) => {
      // console.log(JSON.stringify(that.status))
      const array = that.status.filter(item => item.key === key)
      return array.length > 0 ? array[0].val : null
    }
  },
  methods: {
    initData () {
      getLoginUserOrders('/order/getLoginUserOrders').then(res => {
        // console.log(res)
        if (res.code === 0) {
          this.data = res.result
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    showDrawer (data) {
      this.visible = true
      this.order = data
      getCarParkByID('/carPark/getCarParkByID', {id: data.carparkId}).then(res => {
        // console.log(res)
        if (res.code === 0) {
          this.carPark = {}
          this.carPark = res.result
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    onClose () {
      this.visible = false
    }
  }
}
</script>

<style scoped>
.scroller {
  overflow-y: auto;
  height: 550px;
  padding-top: 15px;
  text-align: left;
}
.pStyle {
  padding: auto;
  fontSize: '16px';
  font-weight: bolder;
  color: rgba(0,0,0,0.85);
  lineHeight: '24px';
  display: block;
  marginBottom: '16px';
  marginBottom: '24px';
}
</style>
