<template>
    <a-modal title="选择车位"
             :maskClosable="false"
             :width="900"
             :visible="visible"
             @ok="handleOk"
             :confirmLoading="confirmLoading"
             @cancel="handleCancel">
      <a-row>
        <a-form :form="form" @submit="handleSubmit">
          <a-form-item>
            <a-row>
              <a-col :span="9">
                <a-form-item label="区域" :label-col="{ span: 4 }" :wrapper-col="{ span: 15 }"   :colon="false">
                  <a-select v-decorator="['region']">
                    <a-icon slot="suffixIcon" type="smile" />
                    <a-select-option v-for="d in region" :key="d">{{ d}}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="5">
                <a-form-item label="宽度" :label-col="{ span: 7 }" :wrapper-col="{ span: 7 }"   :colon="false">
                  <a-input-number
                    v-decorator="['width']"
                    :max="5"
                    :min="0"
                    :step="0.5"
                    :formatter="value => `${value}M`"
                    :parser="value => value.replace(' M', '')"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="5">
                <a-form-item label="长度" :label-col="{ span: 7 }" :wrapper-col="{ span: 7 }"   :colon="false">
                  <a-input-number
                    v-decorator="['length']"
                    :max="7"
                    :min="0"
                    :step="0.5"
                    :formatter="value => `${value}M`"
                    :parser="value => value.replace(' M', '')"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="5">
                <a-form-item label="状态" :label-col="{ span: 7 }" :wrapper-col="{ span: 17 }"   :colon="false">
                  <a-col :span="12">
                    <a-switch v-decorator="['isParking']" checkedChildren="在停" unCheckedChildren="空闲" />
                  </a-col>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="9">
                <a-button type="primary">查询</a-button>
              </a-col>
              <a-col :span="15">
                <a-form-item label="车位具体位置" :label-col="{ span: 5 }" :wrapper-col="{ span: 17 }">
                  <div>{{ location }}</div>
                </a-form-item>
              </a-col>
            </a-row>
          </a-form-item>
        </a-form>
      </a-row>
      <a-row>
        <a-col :span="24">
          <a-table :columns="columns"
                   :rowKey="record => record.login.uuid"
                   :dataSource="data"
                   :pagination="pagination"
                   :loading="loading">
            <template slot="location" slot-scope="location">
              {{location}} {{location}}
            </template>
            <template slot="region" slot-scope="region">
              {{region}} {{region}}
            </template>
            <template slot="width" slot-scope="width">
              {{width}} {{width}}
            </template>
            <template slot="length" slot-scope="length">
              {{length}} {{length}}
            </template>
          </a-table>
        </a-col>
      </a-row>
    </a-modal>
</template>

<script>
const columns = [
  {
    title: 'location',
    dataIndex: 'location',
    sorter: true,
    width: '20%',
    scopedSlots: { customRender: 'location' }
  },
  {
    title: 'width',
    dataIndex: 'width',
    scopedSlots: { customRender: 'width' }
  },
  {
    title: 'length',
    dataIndex: 'length',
    scopedSlots: { customRender: 'length' }
  },
  {
    title: 'region',
    dataIndex: 'region',
    scopedSlots: { customRender: 'region' }
  },
  {
    title: 'isParking',
    dataIndex: 'gender',
    width: '20%'
  }
]
export default {
  name: 'carParking',
  data () {
    return {
      form: this.$form.createForm(this),
      visible: false,
      region: ['A', 'B', 'C', 'D', 'E'], // 区域
      loading: false,
      confirmLoading: false,
      columns,
      data: [],
      location: 'XXXXXXX',
      pagination: {
        current: 0
      }
    }
  },
  methods: {
    showModal () {
      this.visible = !this.visible
    },
    handleSubmit () {

    },
    handleOk () {
      this.confirmLoading = true
      setTimeout(() => {
        this.confirmLoading = false
        this.handleCancel()
      }, 2000)
    },
    handleCancel () {
      this.visible = false
      if (true) { // 没有选择
        this.$emit('finishSelect')
      } else {

      }
    }
  }
}
</script>

<style scoped>

</style>
