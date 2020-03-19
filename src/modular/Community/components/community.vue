<template>
  <div>
    <a-spin tip="Loading..." :spinning="loading">
      <a-row>
        <a-form :form="form">
          <a-form-item>
            <a-row>
              <a-col :span="8">
                <a-form-item label="小区名" :label-col="{ span: 5 }" :wrapper-col="{ span: 15 }"   :colon="false">
                  <a-input v-decorator="['communityName']" :allowClear="true">
                  </a-input>
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
            <a-icon type="plus"/>新增小区信息
          </a-button>
        </a-col>
      </a-row>
      <a-row style="margin-top: 16px">
        <a-col :span="24">
          <a-table :columns="columns"
                   :rowKey="record => record.id"
                   :dataSource="data"
                   :pagination="false">
            <template slot="location" slot-scope="communityName">
              {{communityName}}
            </template>
            <template slot="location" slot-scope="location">
              {{location}}
            </template>
            <template slot="region" slot-scope="region">
              {{region?region:'-'}}
            </template>
            <template slot="longitude" slot-scope="longitude">
              {{longitude}}
            </template>
            <template slot="latitude" slot-scope="latitude">
              {{latitude}}
            </template>
            <template slot="action" slot-scope="record">
              <a-button-group>
                <a-button type="primary"  style="float: left" @click="Edit(record)">
                  <a-icon type="edit"/>编辑小区信息
                </a-button>
                <a-button type="danger"  style="float: left" @click="deleteData(record)" icon="delete">
                </a-button>
              </a-button-group>
            </template>
          </a-table>
        </a-col>
      </a-row>
      <a-row>
        <a-pagination v-if="pagination.pages>0" simple v-model="pagination.current" :total="pagination.total" :pageSize="pagination.size" @change="pageSizeChange" style="float: right;margin-top: 10px"/>
      </a-row>
      <a-row>
        <communityForm ref="communityForm" @communitySave="selectData"></communityForm>
      </a-row>
      <a-row>
        <DeleteModel ref="DeleteModel" @DeleteSuccess="selectData"></DeleteModel>
      </a-row>
    </a-spin>
  </div>
</template>

<script>
import {getCommunity} from '../api/community'
import communityForm from './communityForm'
import DeleteModel from '../../Index/components/DeleteModel'
const columns = [
  {
    title: '小区名',
    dataIndex: 'communityName',
    sorter: true,
    width: '20%',
    scopedSlots: { customRender: 'communityName' }
  },
  {
    title: '小区位置',
    dataIndex: 'location',
    width: '20%',
    scopedSlots: { customRender: 'location' }
  },
  {
    title: '小区车位区域',
    dataIndex: 'region',
    width: '15%',
    scopedSlots: { customRender: 'region' }
  },
  {
    title: '经度',
    dataIndex: 'longitude',
    width: '10%',
    scopedSlots: { customRender: 'longitude' }
  },
  {
    title: '纬度',
    dataIndex: 'latitude',
    width: '10%',
    scopedSlots: { customRender: 'latitude' }
  },
  {
    title: '操作',
    width: '20%',
    scopedSlots: { customRender: 'action' }
  }
]
export default {
  name: 'carParking',
  components: {
    communityForm,
    DeleteModel
  },
  data () {
    return {
      form: this.$form.createForm(this),
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
  methods: {
    selectData () {
      this.pagination.current = 1
      this.initData()
    },
    initData () {
      const param = this.form.getFieldsValue(['communityName'])
      param.current = this.pagination.current === 0 ? 1 : this.pagination.current
      param.size = this.pagination.size
      this.loading = true
      setTimeout(() => {
        getCommunity('/community/getCommunity', param).then(res => {
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
      this.$refs.communityForm.showModal()
    },
    Edit (data) {
      this.$refs.communityForm.showModal(data)
    },
    deleteData (data) {
      this.$refs.DeleteModel.showDeleteConfirm(data, 'DeleteCommunity')
    }
  }
}
</script>

<style scoped>
</style>
