<template>
  <div class="adminOrder">
    <a-spin tip="Loading..." :spinning="loading">
      <a-row>
        <div class="AdminOrderSelectForm">
          <a-form :form="form">
            <a-row>
              <a-col :span="8">
                <a-form-item label="用户名" :label-col="{ span: 4,offset:1 }" :wrapper-col="{ span: 15 }"   :colon="false">
                  <a-input
                    v-decorator="['user']"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="订单状态" :label-col="{ span: 4,offset:1 }" :wrapper-col="{ span: 15 }"   :colon="false">
                  <a-select v-decorator="['state']" :allowClear="true">
                    <a-select-option v-for="d in state" :key="d">
                      <span v-if="d === '0'">待停</span>
                      <span v-if="d === '1'">在停</span>
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="4">
                <a-form-item label="" :label-col="{ span: 4 }" :wrapper-col="{ span: 15 }"   :colon="false">
                  <a-button type="primary" @click="selectSubmit">查询</a-button>
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </div>
      </a-row>
      <a-row>
        <a-col :span="24">
          <a-table :columns="columns"
                   :rowKey="record => record.id"
                   :dataSource="data"
                   :pagination="false">
            <template slot="user" slot-scope="user">
              {{user}}
            </template>
            <template slot="carNumber" slot-scope="carNumber">
              {{carNumber}}
            </template>
            <template slot="carParkLocation" slot-scope="carParkLocation">
              {{carParkLocation}}
            </template>
            <template slot="appointmentTime" slot-scope="appointmentTime">
              {{appointmentTime}}
            </template>
            <template slot="dprice" slot-scope="dprice">
              {{dprice}} $/h
            </template>
            <template slot="billTime" slot-scope="billTime">
              {{billTime}} /h
            </template>
            <template slot="state" slot-scope="state">
              <a-badge :status="state === '0'?'warning':'processing'" style="float: left"/>
              <div v-html="state === '0'?'待停':'在停'"></div>
            </template>
            <template slot="action" slot-scope="record">
              <a-button-group>
                <a-button type="primary" size="small" style="float: left" @click="ParkingOrder(record.id)">
                  <a-icon type="lock"/>停车
                </a-button>
                <a-button type="danger" size="small" style="float: left">
                  <a-icon type="unlock"/>待停
                </a-button>
              </a-button-group>
            </template>
          </a-table>
        </a-col>
      </a-row>
      <a-row>
        <a-pagination v-if="pagination.pages>0" simple v-model="pagination.current" :total="pagination.total" :pageSize="pagination.size" @change="pageSizeChange" style="float: right;margin-top: 10px"/>
      </a-row>
    </a-spin>
  </div>
</template>

<script>
import {getUnFinishedOrder, ParkingOrder} from '@/modular/Order/api/order'
const columns = [
  {
    title: '预约用户',
    dataIndex: 'user',
    width: '10%',
    scopedSlots: { customRender: 'user' }
  },
  {
    title: '用户车牌号',
    dataIndex: 'carNumber',
    width: '10%',
    scopedSlots: { customRender: 'carNumber' }
  },
  {
    title: '预约车位',
    dataIndex: 'carParkLocation',
    width: '15%',
    scopedSlots: { customRender: 'carParkLocation' }
  },
  {
    title: '预约时间',
    dataIndex: 'appointmentTime',
    width: '20%',
    scopedSlots: { customRender: 'appointmentTime' }
  },
  {
    title: '费用',
    dataIndex: 'dprice',
    width: '10%',
    scopedSlots: { customRender: 'dprice' }
  },
  {
    title: '计费时长',
    dataIndex: 'billTime',
    width: '10%',
    scopedSlots: { customRender: 'billTime' }
  },
  {
    title: '停车状态',
    dataIndex: 'state',
    width: '9%',
    scopedSlots: { customRender: 'state' }
  },
  {
    title: '操作',
    width: '21%',
    scopedSlots: { customRender: 'action' }
  }
]
export default {
  name: 'adminOrder',
  data () {
    return {
      form: this.$form.createForm(this),
      state: ['0', '1'],
      loading: false,
      columns,
      data: [],
      pagination: {
        current: 0,
        size: 10,
        pages: 0,
        total: 0
      }
    }
  },
  mounted () {
    this.selectSubmit()
  },
  methods: {
    initData () {
      const param = this.form.getFieldsValue(['user', 'state'])
      param.current = this.pagination.current === 0 ? 1 : this.pagination.current
      param.size = this.pagination.size
      getUnFinishedOrder('/order/getUnFinishedOrder', param).then(res => {
        if (res.code === 0) {
          this.loading = false
          this.data = []
          res.result.records.forEach(item => {
            item.state = item.comptime ? '1' : '0'
            if (item.comptime) {
              let nowTime = Date.parse(new Date(item.comptime))// 当前时间的时间戳
              let endTime = Date.parse(new Date())// 指定时间的时间戳
              let timeDis = endTime - nowTime
              let days = Math.floor(timeDis / (24 * 3600 * 1000))
              item.billTime = this.computeTime(item.comptime).getHours() + days * 24
            }
            this.data.push(item)
          })
          this.pagination.current = res.result.current
          this.pagination.total = res.result.total
          this.pagination.pages = res.result.pages
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    pageSizeChange (page, pageSize) {
      this.pagination.current = page
      this.initData()
    },
    selectSubmit () {
      this.loading = true
      setTimeout(() => {
        this.initData()
      }, 2000)
    },
    computeTime (time) {
      // direct_time格式为yyyy-mm-dd hh:mm:ss 指定时间
      let nowTime = Date.parse(new Date(time))// 当前时间的时间戳
      let endTime = Date.parse(new Date())// 指定时间的时间戳
      // 计算相差天数
      let timeDis = endTime - nowTime
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
      return date
    },
    ParkingOrder (id) {
      const param = {id: id, park: '1'}
      ParkingOrder('/order/ParkingOrder', param).then(res => {
        if (res.code === 0) {
          this.$message.success('停车成功')
          this.initData()
        } else {
          this.$message.error(res.msg)
        }
      })
    }
  }
}
</script>

<style scoped>
  .adminOrder{
    /*min-height: 600px;*/
  }
  .AdminOrderSelectForm{
    margin-top: 16px;
  }
</style>
