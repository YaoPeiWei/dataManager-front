<template>
  <div style="background: white; padding: 30px;text-align: left">
    <a-row :gutter="16">
      <a-card v-show="!paying" title="进行中的订单" style="width:100%">
        <div>
          <a-col :span="12">
            <a-card>
              <div style="min-height: 90px">
                <a-statistic title="费用" :value="order.price" style="margin-right: 50px;margin-bottom: 30px" :valueStyle="{color: '#3f8600'}">
                  <template v-slot:suffix>
                    $
                  </template>
                  <template v-slot:prefix>
                    <a-icon type="pay-circle" />
                    <a-icon type="arrow-up" />
                  </template>
                </a-statistic>
              </div>
            </a-card>
          </a-col>
          <a-col :span="12">
            <a-card>
              <div style="min-height: 90px">
                <span style="">停车时长</span>
                <timer ref="timer" style=" color: #cf1322;margin-top: 4px;font-size: 24px"></timer>
              </div>
            </a-card>
          </a-col>
          <a-col :span="12" style="margin-top: 20px">
            <span style="font-weight: bolder;font-size: 20px"><a-icon type="car"/>  车牌号 :</span>
            <span style="margin-left: 20px;font-size: 14px">{{order.carNumber}}</span>
          </a-col>
          <a-col :span="12" style="margin-top: 20px">
            <span style="font-weight: bolder;font-size: 20px"><a-icon type="tag" />  区域 :</span>
            <span style="margin-left: 20px;font-size: 14px">{{carPark.region}}</span>
          </a-col>
          <a-col :span="12" style="margin-top: 20px">
            <span style="font-weight: bolder;font-size: 20px"><a-icon type="money-collect" />  每小时单价($) :</span>
            <span style="margin-left: 20px;font-size: 14px">{{carPark.price}}</span>
          </a-col>
          <a-col :span="12" style="margin-top: 20px">
            <span style="font-weight: bolder;font-size: 20px"><a-icon type="notification" />  车位位置 :</span>
            <span style="margin-left: 20px;font-size: 14px">{{carPark.location}}</span>
          </a-col>
          <a-col :span="12" style="margin-top: 20px">
            <span style="font-weight: bolder;font-size: 20px"><a-icon type="notification" />  车位位置 :</span>
            <span style="margin-left: 20px;font-size: 14px">{{carPark.communityName}}</span>
          </a-col>
          <a-col :span="12" style="margin-top: 20px">
            <span style="font-weight: bolder;font-size: 20px"><a-icon type="dashboard" />  订单状态 :</span>
            <span style="margin-left: 20px;font-size: 14px">{{order.status | filterStatusVal}}</span>
          </a-col>
          <a-col :span="12" style="margin-top: 20px" v-if="order.comptime">
            <span style="font-weight: bolder;font-size: 20px"><a-icon type="dashboard" />  预约时间 :</span>
            <span style="margin-left: 20px;font-size: 14px">{{order.comptime}}</span>
          </a-col>
        </div>
        <template class="ant-card-actions" slot="actions">
          <span v-if="order.status==='0'" @click="cancelOrder"> <a-icon type="delete" /><span style="margin-left: 8px">取消订单</span></span>
          <span v-else @click="pay(order.status)"><a-icon type="strikethrough" /><span style="margin-left: 8px">支付订单</span></span>
        </template>
      </a-card>
      <div v-html="content" ref="alipayWap"></div>
    </a-row>
    <a-row>
      <cancel-order ref="cancelOrder" @CancelBack="CancelBack"></cancel-order>
    </a-row>
  </div>
</template>

<script>
import {getLoginUserUnFinishedOrder, payOrder} from '../../api/order'
import {getCarParkByID} from '../../api/carPark'
import Timer from '../common/Timer'
import cancelOrder from './cancelOrder'
let that
export default {
  name: 'ordering',
  beforeCreate () {
    that = this
  },
  data () {
    return {
      order: {
        id: undefined,
        comptime: undefined,
        appointmentTime: undefined,
        dprice: undefined,
        carNumber: undefined,
        createTime: undefined,
        price: undefined,
        status: undefined
      },
      carPark: {
        region: undefined,
        locatuon: undefined,
        isRoom: undefined,
        price: undefined
      },
      status: [
        {key: '0', val: '待停', class: 'warning'}, {key: '1', val: '在停', class: 'processing'}, {key: '2', val: '待支付', class: 'error'}
      ],
      paying: false, // 是否正在支付
      content: undefined, // 支付宝沙箱页面
      hasOrder: false, // 控制是否开始计数
      websocket: undefined
    }
  },
  components: {
    Timer,
    cancelOrder
  },
  filters: {
    filterStatusVal: (key) => {
      const array = that.status.filter(item => item.key === key)
      return array.length > 0 ? array[0].val : null
    }
  },
  mounted () {
    // WebSocket
    if ('WebSocket' in window) {
      this.websocket = new WebSocket('ws://localhost:8080/api/websocket/' + sessionStorage.getItem(this.$store.state.userId))
      this.initWebSocket()
    } else {
      alert('当前浏览器 Not support websocket')
    }
  },
  beforeDestroy () {
    // 关闭websocket连接
    this.closeWebSocket()
  },
  methods: {
    async initData () {
      let flag = false
      await getLoginUserUnFinishedOrder('/order/getLoginUserUnFinishedOrder').then(res => {
        if (res.code === 0) {
          // console.log(res)
          if (res.result) {
            if (res.result && res.result.status === '3') {
              return false
            }
            flag = true
            // console.log(res.result)
            this.order.id = res.result.id
            this.order.dprice = res.result.dprice
            this.order.carNumber = res.result.carNumber
            this.order.appointmentTime = res.result.appointmentTime
            this.order.comptime = res.result.comptime
            this.order.createTime = res.result.createTime
            this.order.status = res.result.status
            // 设置时间 ==> 状态为在停时显示
            if (res.result && res.result.status === '1' && res.result.comptime) {
              this.showTimer(this.order.comptime)
            }
            if (res.result && res.result.status === '2' && res.result.settlementTime) {
              // console.log(res.result.settlementTime)
              this.showPay(this.order.comptime, res.result.settlementTime)
            }
            if (res.result && res.result.status === '0') {
              this.order.price = 0
              this.$refs.timer.NotimeCreated()
            }
            this.hasOrder = true
            // this.computePrice()
            getCarParkByID('/carPark/getCarParkByID', {id: res.result.carparkId}).then(res => {
              if (res.code === 0) {
                this.carPark = res.result
              }
            })
          }
        } else {
          this.$message.error(res.msg)
        }
      })
      return flag
    },
    computePrice () {
      const _this = this
      if (this.hasOrder) {
        setInterval(() => {
          // eslint-disable-next-line no-new-wrappers
          const a = new Number(_this.order.price)
          // eslint-disable-next-line no-new-wrappers
          const b = new Number(_this.order.dprice)
          const c = a + b
          _this.order.price = c.toString()
        }, 1000 * 3600)
      }
    },
    computeTime (time) {
      // direct_time格式为yyyy-mm-dd hh:mm:ss 指定时间
      let nowTime = Date.parse(new Date(time))// 当前时间的时间戳
      let endTime = Date.parse(new Date())// 指定时间的时间戳
      // 计算相差天数
      let timeDis = endTime - nowTime
      let days = Math.floor(timeDis / (24 * 3600 * 1000))
      // 计算出小时数
      let leave1 = timeDis % (24 * 3600 * 1000)// 计算天数后剩余的毫秒数
      let hours = Math.floor(leave1 / (3600 * 1000))
      // 计算相差分钟数
      let leave2 = leave1 % (3600 * 1000)// 计算小时数后剩余的毫秒数
      let minutes = Math.floor(leave2 / (60 * 1000))
      // 计算相差秒数
      let leave3 = leave2 % (60 * 1000)// 计算小时数后剩余的毫秒数
      let second = leave3 / 1000
      let date = new Date()
      date.setHours(hours)
      date.setMinutes(minutes)
      date.setSeconds(second)
      this.order.price = (days * 24 * this.order.dprice) + ((hours + 1) * this.order.dprice)
      return date
    },
    showTimer (time) {
      // console.log(time)
      setTimeout(() => {
        // direct_time格式为yyyy-mm-dd hh:mm:ss 指定时间
        let nowTime = Date.parse(new Date(time))// 当前时间的时间戳
        let endTime = Date.parse(new Date())// 指定时间的时间戳
        let timeDis = endTime - nowTime
        let days = Math.floor(timeDis / (24 * 3600 * 1000))
        const ctime = this.computeTime(time)
        this.$refs.timer.created(ctime, days)
      }, 2000)
    },
    showPay (comptime, settlementTime) {
      // direct_time格式为yyyy-mm-dd hh:mm:ss 指定时间
      // console.log(settlementTime)
      let nowTime = Date.parse(new Date(comptime))// 当前时间的时间戳
      let endTime = Date.parse(new Date(settlementTime))// 指定时间的时间戳
      let timeDis = endTime - nowTime
      let days = Math.floor(timeDis / (24 * 3600 * 1000))
      const ctime = this.PayTime(comptime, settlementTime)
      this.$refs.timer.payCreated(ctime, days)
    },
    PayTime (time, settlementTime) {
      // direct_time格式为yyyy-mm-dd hh:mm:ss 指定时间
      // console.log(settlementTime)
      let nowTime = Date.parse(new Date(time))// 当前时间的时间戳
      let endTime = Date.parse(new Date(settlementTime))// 指定时间的时间戳
      // 计算相差天数
      let timeDis = endTime - nowTime
      let days = Math.floor(timeDis / (24 * 3600 * 1000))
      // 计算出小时数
      let leave1 = timeDis % (24 * 3600 * 1000)// 计算天数后剩余的毫秒数
      let hours = Math.floor(leave1 / (3600 * 1000))
      // 计算相差分钟数
      let leave2 = leave1 % (3600 * 1000)// 计算小时数后剩余的毫秒数
      let minutes = Math.floor(leave2 / (60 * 1000))
      // 计算相差秒数
      let leave3 = leave2 % (60 * 1000)// 计算小时数后剩余的毫秒数
      let second = leave3 / 1000
      let date = new Date()
      date.setHours(hours)
      date.setMinutes(minutes)
      date.setSeconds(second)
      this.order.price = (days * 24 * this.order.dprice) + ((hours + 1) * this.order.dprice)
      return date
    },
    cancelOrder () {
      this.$refs.cancelOrder.showModal(this.order)
    },
    CancelBack () {
      this.$emit('CancelBack')
    },
    pay (status) {
      if (status !== '2') {
        this.$message.warning('请等待管理员结算')
        return
      }
      payOrder('/pay/payOrder', {id: this.order.id}).then(res => {
        this.paying = true
        this.content = res
        // console.log(this.content)
        this.$nextTick(() => {
          const div = document.createElement('div')
          // /* 此处form就是后台返回接收到的数据 */
          div.innerHTML = this.content
          document.body.appendChild(div)
          document.forms[0].acceptCharset = 'utf-8'
          document.forms[0].submit()
          // document.getElementById('alipay_submit').submit()
          // this.$refs.alipayWap.children[0].submit()
        })
      })
    },
    initWebSocket () {
      // 连接错误
      this.websocket.onerror = this.setErrorMessage

      // 连接成功
      this.websocket.onopen = this.setOnopenMessage

      // 收到消息的回调
      this.websocket.onmessage = this.setOnmessageMessage

      // 连接关闭的回调
      this.websocket.onclose = this.setOncloseMessage

      // 监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
      window.onbeforeunload = this.onbeforeunload
    },
    setErrorMessage () {
      console.log(this.websocket)
      console.log('WebSocket连接发生错误   状态码：' + this.websocket.readyState)
    },
    setOnopenMessage () {
      console.log('WebSocket连接成功    状态码：' + this.websocket.readyState)
    },
    setOnmessageMessage (event) {
      // 根据服务器推送的消息做自己的业务处理
      console.log('服务端返回：' + event.data)
      this.initData()
    },
    setOncloseMessage () {
      console.log('WebSocket连接关闭    状态码：' + this.websocket.readyState)
    },
    onbeforeunload () {
      this.closeWebSocket()
    },
    closeWebSocket () {
      this.websocket.close()
    }
  }
}
</script>

<style scoped>
.ant-card-body {
  min-height: 150px;
}
</style>
