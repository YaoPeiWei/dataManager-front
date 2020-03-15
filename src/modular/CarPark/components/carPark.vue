<template>
  <div>
    <a-spin tip="Loading..." :spinning="loading">
      <a-row>
        <a-form :form="form">
          <a-form-item>
            <a-row>
              <a-col :span="8">
                <a-form-item label="小区名" :label-col="{ span: 5 }" :wrapper-col="{ span: 15 }"   :colon="false">
                  <a-select v-decorator="['communityId']" :allowClear="true">
                    <a-select-option v-for="d in community" :key="d.id">{{ d.communityName }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="区域" :label-col="{ span: 5 }" :wrapper-col="{ span: 15 }"   :colon="false">
                  <a-select v-decorator="['region']" :allowClear="true">
                    <a-select-option v-for="d in region" :key="d">{{ d}}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="车位环境" :label-col="{ span: 5 }" :wrapper-col="{ span: 15 }"   :colon="false">
                  <a-select v-decorator="['isRoom']" :allowClear="true">
                    <a-select-option :key="0">室外</a-select-option>
                    <a-select-option :key="1">室内</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="状态" :label-col="{ span: 5 }" :wrapper-col="{ span: 15 }"   :colon="false">
                  <a-select v-decorator="['isParking']" :allowClear="true">
                    <a-select-option :key="0">待停</a-select-option>
                    <a-select-option :key="1">在停</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="5" :offset="0">
                <a-button type="primary" @click="selectData">查询</a-button>
              </a-col>
            </a-row>
          </a-form-item>
        </a-form>
      </a-row>
      <a-row>
        <a-col :span="5" :offset="0">
          <a-button type="primary" @click="add">
            <a-icon type="plus"/>新增车位
          </a-button>
        </a-col>
      </a-row>
      <a-row style="margin-top: 16px">
        <a-col :span="24">
          <a-table :columns="columns"
                   :rowKey="record => record.id"
                   :dataSource="data"
                   :pagination="false">
            <template slot="location" slot-scope="location">
              {{location}}
            </template>
            <template slot="region" slot-scope="region">
              {{region}}
            </template>
            <template slot="width" slot-scope="width">
              {{width}} m
            </template>
            <template slot="length" slot-scope="length">
              {{length}} m
            </template>
            <template slot="price" slot-scope="price">
              {{price}} $
            </template>
            <template slot="isRoom" slot-scope="isRoom">
              <a-badge :status="isRoom === '0'?'warning':'processing'" style="float: left"/>
              <div v-html="isRoom === '0'?'室外':'室内'"></div>
            </template>
            <template slot="isParking" slot-scope="isParking">
              <a-badge :status="isParking === '0'?'processing':'error'" style="float: left"/>
              <div v-html="isParking === '0'?'空闲':'在停'"></div>
            </template>
            <template slot="action" slot-scope="record">
              <a-button type="primary"  style="float: left" @click="Edit(record)">
                <a-icon type="edit"/>编辑车位
              </a-button>
            </template>
          </a-table>
        </a-col>
      </a-row>
      <a-row>
        <a-pagination v-if="pagination.pages>0" simple v-model="pagination.current" :total="pagination.total" :pageSize="pagination.size" @change="pageSizeChange" style="float: right;margin-top: 10px"/>
      </a-row>
      <a-row>
        <carParkForm ref="carParkForm" @carParkSave="selectData"></carParkForm>
      </a-row>
    </a-spin>
  </div>
</template>

<script>
import {SelectCarPark} from '../api/carPark'
import {ListCommunity} from '../../Community/api/community'
import carParkForm from './carParkForm'
const columns = [
  {
    title: '车位位置',
    dataIndex: 'location',
    sorter: true,
    width: '20%',
    scopedSlots: { customRender: 'location' }
  },
  {
    title: '区域',
    dataIndex: 'region',
    width: '10%'
  },
  {
    title: '宽度',
    dataIndex: 'width',
    width: '12.5%',
    scopedSlots: { customRender: 'width' }
  },
  {
    title: '长度',
    dataIndex: 'length',
    width: '12.5%',
    scopedSlots: { customRender: 'length' }
  },
  {
    title: '单价',
    dataIndex: 'price',
    width: '10%',
    scopedSlots: { customRender: 'price' }
  },
  {
    title: '室内车位',
    dataIndex: 'isRoom',
    width: '10%',
    scopedSlots: { customRender: 'isRoom' }
  },
  {
    title: '状态',
    dataIndex: 'isParking',
    width: '10%',
    scopedSlots: { customRender: 'isParking' }
  },
  {
    title: '操作',
    width: '15%',
    scopedSlots: { customRender: 'action' }
  }
]
export default {
  name: 'carParking',
  components: {
    carParkForm
  },
  data () {
    return {
      form: this.$form.createForm(this),
      community: [], // 小区
      region: [], // 区域
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
    this.initCommunity()
  },
  methods: {
    initCommunity () {
      ListCommunity('/community/ListCommunity').then(res => {
        this.community = res.result
      })
    },
    selectData () {
      this.pagination.current = 1
      this.initData()
    },
    initData () {
      const param = this.form.getFieldsValue(['region', 'isRoom', 'isParking', 'communityId'])
      param.current = this.pagination.current === 0 ? 1 : this.pagination.current
      param.size = this.pagination.size
      this.loading = true
      setTimeout(() => {
        SelectCarPark('/carPark/SelectCarPark', param).then(res => {
          this.loading = false
          if (res.code === 0) {
            this.data = res.result.records
            this.pagination.current = res.result.current
            this.pagination.total = res.result.total
            this.pagination.pages = res.result.pages
          } else {
            this.$message.error(res.msg)
            this.$emit('finishSelect')
          }
        })
      }, 2000)
    },
    pageSizeChange (page, pageSize) {
      this.pagination.current = page
      this.initData()
    },
    add () {
      this.$refs.carParkForm.showModal()
    },
    Edit (data) {
      this.$refs.carParkForm.showModal(data)
    }
  }
}
</script>

<style scoped>
</style>
