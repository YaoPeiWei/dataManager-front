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
                  <a-select v-decorator="['isFail']" :allowClear="true">
                    <a-select-option v-for="d in status" :key="d.key">
                      <span>{{ d.val }}</span>
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="4">
                <a-form-item label="" :label-col="{ span: 4 }" :wrapper-col="{ span: 15 }"   :colon="false">
                  <a-button type="primary" @click="selct">查询</a-button>
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
            <template slot="price" slot-scope="price">
               <span v-if="price">{{price}} $</span><div v-else>-</div>
            </template>
            <template slot="isFail" slot-scope="isFail">
              <a-badge :status="isFail | filterStatusClass" style="float: left"/>
              <div>{{isFail | filterStatusVal}}</div>
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
import {AdminGetHistoryOrder} from '@/modular/Order/api/order'
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
    width: '20%',
    scopedSlots: { customRender: 'carParkLocation' }
  },
  {
    title: '开始时间',
    dataIndex: 'createTime',
    width: '20%',
    scopedSlots: { customRender: 'createTime' }
  },
  {
    title: '结束时间',
    dataIndex: 'finishTime',
    width: '20%',
    scopedSlots: { customRender: 'finishTime' }
  },
  {
    title: '费用',
    dataIndex: 'price',
    width: '10%',
    scopedSlots: { customRender: 'price' }
  },
  {
    title: '状态',
    dataIndex: 'isFail',
    width: '10%',
    scopedSlots: { customRender: 'isFail' }
  }
]
// eslint-disable-next-line no-unused-vars
let that
export default {
  name: 'adminHistoryOrder',
  beforeCreate () {
    that = this
  },
  data () {
    return {
      form: this.$form.createForm(this),
      status: [
        {key: '0', val: '失败', class: 'warning'}, {key: '1', val: '成功', class: 'processing'}
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
    this.initData()
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
      const param = this.form.getFieldsValue(['user', 'isFail'])
      param.current = this.pagination.current === 0 ? 1 : this.pagination.current
      param.size = this.pagination.size
      this.loading = true
      AdminGetHistoryOrder('/order/AdminGetHistoryOrder', param).then(res => {
        this.loading = false
        if (res.code === 0) {
          this.loading = false
          this.data = res.result.records
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
    selct () {
      this.pagination.current = 1
      this.initData()
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
