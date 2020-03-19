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
                  <a-select v-decorator="['status']" :allowClear="true">
                    <a-select-option v-for="d in status" :key="d.key">
                      <span>{{ d.val }}</span>
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
              {{billTime}} <span v-if="billTime">/h</span><div v-else>-</div>
            </template>
            <template slot="status" slot-scope="status">
              <a-badge :status="status | filterStatusClass" style="float: left"/>
              <div>{{status | filterStatusVal}}</div>
            </template>
            <template slot="action" slot-scope="record">
              <a-button-group>
                <a-button  v-if="record.status === '0'" type="primary" size="small" style="float: left" @click="ParkingOrder(record.id,'1')">
                  <a-icon type="lock"/>停车
                </a-button>
                <a-button  v-if="record.status === '1'" type="danger" size="small" style="float: left" @click="ParkingOrder(record.id, '0')">
                  <a-icon type="unlock"/>待停
                </a-button>
                <a-button v-if="record.status === '1'" type="danger" size="small" style="float: left" @click="NoParking(record)">
                  <a-icon type="strikethrough" />结算
                </a-button>
              </a-button-group>
            </template>
          </a-table>
        </a-col>
      </a-row>
      <a-row>
        <a-pagination v-if="pagination.pages>0" simple v-model="pagination.current" :total="pagination.total" :pageSize="pagination.size" @change="pageSizeChange" style="float: right;margin-top: 10px"/>
      </a-row>
      <div>
        <enterPasswork ref="enterPasswork" @parkOrderSuccess="initData"></enterPasswork>
      </div>
    </a-spin>
  </div>
</template>

<script>
import {getUnFinishedOrder, ChangOrderStatus} from '@/modular/Order/api/order'
import enterPasswork from './enterPasswork'
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
    dataIndex: 'status',
    width: '9%',
    scopedSlots: { customRender: 'status' }
  },
  {
    title: '操作',
    width: '21%',
    scopedSlots: { customRender: 'action' }
  }
]
// eslint-disable-next-line no-unused-vars
let that
export default {
  name: 'adminOrder',
  components: {
    enterPasswork
  },
  beforeCreate () {
    that = this
  },
  data () {
    return {
      form: this.$form.createForm(this),
      status: [
        {key: '0', val: '待停', class: 'warning'}, {key: '1', val: '在停', class: 'processing'}, {key: '2', val: '待支付', class: 'error'}
      ],
      loading: false,
      columns,
      data: [],
      pagination: {
        current: 0,
        size: 5,
        pages: 0,
        total: 0
      }
    }
  },
  mounted () {
    this.selectSubmit()
  },
  filters: {
    filterStatusVal: (key) => {
      // console.log(JSON.stringify(that.status))
      const array = that.status.filter(item => item.key === key)
      return array.length > 0 ? array[0].val : null
    },
    filterStatusClass: (key) => {
      const array = that.status.filter(item => item.key === key)
      return array.length > 0 ? array[0].class : null
    }
  },
  methods: {
    initData () {
      const param = this.form.getFieldsValue(['user', 'status'])
      param.current = this.pagination.current === 0 ? 1 : this.pagination.current
      param.size = this.pagination.size
      getUnFinishedOrder('/order/getUnFinishedOrder', param).then(res => {
        if (res.code === 0) {
          this.loading = false
          this.data = []
          res.result.records.forEach(item => {
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
    ParkingOrder (id, status) {
      const param = {id: id, status: status}
      ChangOrderStatus('/order/ChangOrderStatus', param).then(res => {
        if (res.code === 0) {
          if (status === '1') {
            this.$message.success('停车成功')
          } else {
            this.$message.success('待停成功')
          }
          this.initData()
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    NoParking (data) {
      this.$refs.enterPasswork.showModal(data)
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
