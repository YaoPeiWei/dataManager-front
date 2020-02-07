<template>
  <div style="background: white; padding: 30px;text-align: left">
    <a-row :gutter="16">
      <a-card title="进行中的订单" style="width:100%">
        <div>
          <a-col :span="12">
            <a-card>
              <a-statistic title="费用" :value="order.price" style="margin-right: 50px;margin-bottom: 30px" :valueStyle="{color: '#3f8600'}">
                <template v-slot:suffix>
                  $
                </template>
                <template v-slot:prefix>
                  <a-icon type="pay-circle" />
                  <a-icon type="arrow-up" />
                </template>
              </a-statistic>
            </a-card>
          </a-col>
          <a-col :span="12">
            <a-card>
              <div style="margin-bottom: 30px">
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
            <span style="font-weight: bolder;font-size: 20px"><a-icon type="dashboard" />  预约时间 :</span>
            <span style="margin-left: 20px;font-size: 14px">{{order.comptime}}</span>
          </a-col>
        </div>
        <template class="ant-card-actions" slot="actions">
          <a-icon type="setting" />
          <a-icon type="edit" />
          <a-icon type="ellipsis" />
        </template>
      </a-card>
    </a-row>
  </div>
</template>

<script>
import {getLoginUserUnFinishedOrder} from '../api/order'
import {getCarParkByID} from '../api/carPark'
import Timer from './Timer'
export default {
  name: 'ordering',
  data () {
    return {
      order: {
        comptime: undefined,
        appointmentTime: undefined,
        dprice: undefined,
        carNumber: undefined,
        createTime: undefined,
        price: undefined
      },
      carPark: {
        region: undefined,
        locatuon: undefined,
        isRoom: undefined,
        price: undefined
      },
      hasOrder: false // 控制是否开始计数
    }
  },
  components: {
    Timer
  },
  methods: {
    async initData () {
      let flag = false
      await getLoginUserUnFinishedOrder('/order/getLoginUserUnFinishedOrder').then(res => {
        if (res.code === 0) {
          flag = true
          // console.log(res.result)
          this.order.dprice = res.result.dprice
          this.order.carNumber = res.result.carNumber
          this.order.appointmentTime = res.result.appointmentTime
          this.order.comptime = res.result.comptime
          this.order.createTime = res.result.createTime
          // 设置时间
          this.showTimer(this.order.comptime)
          // 设置费用
          this.hasOrder = true
          this.computePrice()
          getCarParkByID('/carPark/getCarParkByID', {id: res.result.carparkId}).then(res => {
            if (res.code === 0) {
              this.carPark = res.result
            }
          })
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
      this.order.price = (days * 24 * this.order.dprice) + (hours * this.order.dprice)
      return date
    },
    showTimer (time) {
      // direct_time格式为yyyy-mm-dd hh:mm:ss 指定时间
      let nowTime = Date.parse(new Date(time))// 当前时间的时间戳
      let endTime = Date.parse(new Date())// 指定时间的时间戳
      let timeDis = endTime - nowTime
      let days = Math.floor(timeDis / (24 * 3600 * 1000))
      const ctime = this.computeTime(time)
      this.$refs.timer.created(ctime, days)
    }
  }
}
</script>

<style scoped>

</style>
