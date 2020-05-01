<template>
    <a-modal title="选择车位"
             :maskClosable="false"
             :width="900"
             :visible="visible"
             @ok="handleOk"
             :confirmLoading="confirmLoading"
             @cancel="handleCancel">
      <a-row>
        <a-form :form="form">
          <a-form-item>
            <a-row>
<!--              <a-col :span="12">-->
<!--                <a-form-item label="小区名" :label-col="{ span: 6 }" :wrapper-col="{ span: 15 }"   :colon="false">-->
<!--                  <a-select v-decorator="['communityId']" :allowClear="true" @select="selectCommunityId">-->
<!--                    <a-select-option v-for="d in community" :key="d.id">{{ d.communityName }}</a-select-option>-->
<!--                  </a-select>-->
<!--                </a-form-item>-->
<!--              </a-col>-->
<!--              <a-col :span="12">-->
<!--                <a-form-item label="区域" :label-col="{ span: 6 }" :wrapper-col="{ span: 15 }"   :colon="false">-->
<!--                  <a-select v-decorator="['region']" :allowClear="true">-->
<!--                    <a-icon slot="suffixIcon" type="car" />-->
<!--                    <a-select-option v-for="d in region" :key="d">{{ d}}</a-select-option>-->
<!--                  </a-select>-->
<!--                </a-form-item>-->
<!--              </a-col>-->
              <a-col :span="8">
                <a-form-item label="宽度(单位: m)" :label-col="{ span: 9 }" :wrapper-col="{ span: 14 }"   :colon="false">
                  <a-input-number
                    v-decorator="['width']"
                    :max="5"
                    :min="0"
                    :step="0.5"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="长度(单位: m)" :label-col="{ span: 9 }" :wrapper-col="{ span: 14 }"   :colon="false">
                  <a-input-number
                    v-decorator="['length']"
                    :max="7"
                    :min="0"
                    :step="0.5"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="状态" :label-col="{ span: 7 }" :wrapper-col="{ span: 17 }"   :colon="false">
                  <a-col :span="12">
                    <a-switch v-decorator="['isParking']" checkedChildren="在停" unCheckedChildren="空闲" />
                  </a-col>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="3" :offset="1">
                <a-button type="primary" @click="handleSubmit">查询</a-button>
              </a-col>
              <a-col :span="16">
                <a-form-item label="车位具体位置" :label-col="{ span: 5 }" :wrapper-col="{ span: 17 }">
                  <div>{{selectedData.communityName}} {{  selectedData.location }}</div>
                </a-form-item>
              </a-col>
            </a-row>
          </a-form-item>
        </a-form>
      </a-row>
      <a-row>
        <a-col :span="24">
          <a-table :columns="columns"
                   :rowSelection="rowRadioSelection"
                   :rowKey="record => record.id"
                   :dataSource="data"
                   :pagination="false"
                   :loading="loading">
            <template slot="location" slot-scope="location">
              {{location}}
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
          </a-table>
        </a-col>
      </a-row>
      <a-row>
        <a-pagination v-if="pagination.pages>0" simple v-model="pagination.current" :total="pagination.total" :pageSize="pagination.size" @change="pageSizeChange" style="float: right;margin-top: 10px"/>
      </a-row>
    </a-modal>
</template>

<script>
import {getCarPark} from '../../api/carPark'
import {getRegionByCommunityId, ListCommunity} from '../../../Community/api/community'
const columns = [
  {
    title: '车位位置',
    dataIndex: 'location',
    sorter: true,
    width: '25%',
    scopedSlots: { customRender: 'location' }
  },
  {
    title: '车位宽度',
    dataIndex: 'width',
    width: '15%',
    scopedSlots: { customRender: 'width' }
  },
  {
    title: '车位长度',
    dataIndex: 'length',
    width: '15%',
    scopedSlots: { customRender: 'length' }
  },
  {
    title: '费用(每小时)',
    dataIndex: 'price',
    width: '15%',
    scopedSlots: { customRender: 'price' }
  },
  {
    title: '室内车位',
    dataIndex: 'isRoom',
    width: '20%',
    scopedSlots: { customRender: 'isRoom' }
  },
  {
    title: '在停',
    dataIndex: 'isParking',
    width: '10%',
    scopedSlots: { customRender: 'isParking' }
  }
]
export default {
  name: 'carParking',
  data () {
    return {
      form: this.$form.createForm(this),
      visible: false,
      region: [], // 区域
      loading: false,
      confirmLoading: false,
      columns,
      data: [],
      location: 'XXXXXXX',
      pagination: {
        current: 0,
        size: 2,
        pages: 0,
        total: 0
      },
      rowRadioSelection: {
        type: 'radio',
        columnTitle: '',
        onSelect: (selectedRowKeys, selectedRows) => {
          this.selectedData = selectedRowKeys
        }
      },
      selectedData: {},
      community: []
    }
  },
  methods: {
    showModal () {
      this.visible = !this.visible
      this.initData()
      this.initCommunity()
    },
    initData () {
      const param = this.form.getFieldsValue(['region', 'width', 'length', 'isParking'])
      if (param.isParking === true) {
        param.isParking = '1'
      } else {
        param.isParking = '0'
      }
      param.current = this.pagination.current === 0 ? 1 : this.pagination.current
      param.size = this.pagination.size
      getCarPark('/carPark/getCarPark', param).then(res => {
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
    },
    pageSizeChange (page, pageSize) {
      this.pagination.current = page
      this.initData()
    },
    handleSubmit () {
      this.initData()
    },
    handleOk () {
      this.confirmLoading = true
      setTimeout(() => {
        this.confirmLoading = false
        this.$emit('finishSelect', this.selectedData)
        this.handleCancel()
      }, 2000)
    },
    handleCancel () {
      this.visible = false
      this.$emit('finishSelect')
    },
    selectCommunityId (data) {
      // console.log(data)
      if (data) {
        getRegionByCommunityId('/community/getRegionByCommunityId', {id: data}).then(res => {
          this.region = res.result
        })
      }
    },
    initCommunity () {
      ListCommunity('/community/ListCommunity').then(res => {
        this.community = res.result
      })
    }
  }
}
</script>

<style scoped>

</style>
