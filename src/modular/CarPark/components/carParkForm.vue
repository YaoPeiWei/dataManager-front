<template>
    <div>
        <a-modal :title="title"
                 :maskClosable="false"
                 :width="500"
                 :visible="visible"
                 @ok="handleOk"
                 :confirmLoading="confirmLoading"
                 @cancel="handleCancel">
            <a-form :form="form" layout="vertical">
                <a-row :gutter="24" v-if="user.role === '2'">
                    <a-col :span="22" :offset="2">
                        <a-form-item label="所属小区" :label-col="{ span: 5 }" :wrapper-col="{ span: 17 }" :colon="false">
                            <a-select v-decorator="['communityId',  {
                                    rules: [{ required: true, message: '请选择车位所属小区' }]
                                }]" placeholder="请选择车位所属小区" :allowClear="true" @change="selectCommunityId" :get-popup-container="triggerNode => triggerNode.parentNode"
                                    :dropdown-style="{
                                      overflow: 'auto',
                                      zIndex: '2'
                                    }">
                                <a-select-option v-for="d in community" :key="d.id">{{ d.communityName}}</a-select-option>
                            </a-select>
                        </a-form-item>
                    </a-col>
                </a-row>
                <a-row :gutter="24">
                    <a-col :span="22" :offset="2">
                        <a-form-item label="区域" :label-col="{ span: 5 }" :wrapper-col="{ span: 17 }" :colon="false">
                            <a-select v-decorator="['region',  {
                                    rules: [{ required: true, message: '请选择车位的区域' }]
                                }]" placeholder="请选择车位的区域" :allowClear="true" :get-popup-container="triggerNode => triggerNode.parentNode"
                                    :dropdown-style="{
                                      overflow: 'auto',
                                      zIndex: '2'
                                    }">
                                <a-select-option v-for="d in region" :key="d">{{ d}}</a-select-option>
                            </a-select>
                        </a-form-item>
                    </a-col>
                </a-row>
                <a-row :gutter="24">
                    <a-col :span="22" :offset="2">
                        <a-form-item label="宽度"
                                     :label-col="{ span: 5 }"
                                     :wrapper-col="{ span: 17 }">
                            <a-input-number
                                    v-decorator="['width', {
                                      rules: [{ required: true, message: '请输入车位的宽度' }]
                                    }]"
                                    :min="0"
                                    placeholder="请输入车位的宽度"
                                    autocomplete="off"
                                    :step="0.5"
                                    style="width: 100%"
                            />
                        </a-form-item>
                    </a-col>
                    <a-col :span="22" :offset="2">
                        <a-form-item label="长度"
                                     :label-col="{ span: 5 }"
                                     :wrapper-col="{ span: 17 }">
                            <a-input-number
                                    v-decorator="['length', {
                                      rules: [{ required: true, message: '请输入车位的长度' }]
                                    }]"
                                    :min="0"
                                    :step="0.5"
                                    placeholder="请输入车位的长度"
                                    style="width: 100%"
                            />
                        </a-form-item>
                    </a-col>
                    <a-col :span="22" :offset="2">
                        <a-form-item label="单价"
                                     :label-col="{ span: 5 }"
                                     :wrapper-col="{ span: 17 }">
                            <a-input-number
                                    v-decorator="['price', {
                                      rules: [{ required: true, message: '请输入车位的单价' }]
                                    }]"
                                    :min="0"
                                    :step="0.5"
                                    placeholder="请输入车位的每小时单价"
                                    style="width: 100%"
                            />
                        </a-form-item>
                    </a-col>
                    <a-col :span="22" :offset="2">
                        <a-form-item label="车位环境"
                                     :label-col="{ span: 5 }"
                                     :wrapper-col="{ span: 17 }">
                            <a-radio-group v-decorator="['isRoom', {
                                      rules: [{ required: true, message: '请选择车位环境' }]
                                    }]">
                                <a-radio value="0">室外</a-radio>
                                <a-radio value="1">室内</a-radio>
                            </a-radio-group>
                        </a-form-item>
                    </a-col>
                    <a-col :span="22" :offset="2">
                        <a-form-item label="车位位置"
                                     :label-col="{ span: 5 }"
                                     :wrapper-col="{ span: 17 }">
                            <a-input
                                    v-decorator="['location', {
                                      rules: [{ required: true, message: '请输入车位的位置' }]
                                    }]"
                                    placeholder="请输入车位的位置"
                            />
                        </a-form-item>
                    </a-col>
                </a-row>
            </a-form>
        </a-modal>
    </div>
</template>

<script>
import {saveOrUpdate} from '../api/carPark'
import {ListCommunity, getRegionByCommunityId} from '../../Community/api/community'
export default {
  name: 'carParkForm',
  data () {
    return {
      form: this.$form.createForm(this),
      region: [], // 区域
      confirmLoading: false,
      visible: false,
      title: '新增车位',
      id: undefined,
      user: {
        role: undefined
      },
      community: []
    }
  },
  methods: {
    initCommunity () {
      ListCommunity('/community/ListCommunity').then(res => {
        this.community = res.result
        // console.log(this.community)
      })
    },
    async showModal (data) {
      // console.log(JSON.stringify(data))
      this.user = await this.$store.getters.getLoginUser
      if (this.user.role !== '2') {
        this.selectCommunityId(this.user.communityId)
      } else {
        this.initCommunity()
        if (data) {
          setTimeout(() => {
            this.form.setFieldsValue({communityId: data.communityId})
            this.selectCommunityId(data.communityId)
          }, 200)
        }
      }
      if (data) {
        this.title = '编辑车位'
        this.id = data.id
        setTimeout(() => {
          this.form.setFieldsValue({
            location: data.location,
            width: data.width,
            length: data.length,
            region: data.region,
            price: data.price,
            isRoom: data.isRoom
          })
        }, 0)
      }
      this.visible = true
    },
    handleOk () {
      this.form.validateFields((err, values) => {
        // console.log(JSON.stringify(values))
        if (!err) {
          const param = Object.assign({}, values, {id: this.id})
          this.confirmLoading = true
          if (this.user.role !== '2') {
            param.communityId = this.user.communityId
          }
          // console.log(JSON.stringify(param))
          saveOrUpdate('/carPark/saveOrUpdate', param).then(res => {
            // console.log(JSON.stringify(res))
            this.confirmLoading = false
            this.loading = false
            if (res.code === 0) {
              if (this.id) {
                this.$message.success('编辑成功')
              } else {
                this.$message.success('新增成功')
              }
              this.handleCancel()
              this.$emit('carParkSave')
            } else {
              this.$message.error(res.msg)
              this.$emit('finishSelect')
            }
          })
        }
      })
    },
    handleCancel () {
      if (this.user.role === '2') {
        this.form.setFieldsValue({communityId: undefined})
      }
      setTimeout(() => {
        this.form.setFieldsValue({
          location: undefined,
          width: undefined,
          length: undefined,
          phone: undefined,
          region: undefined,
          price: undefined,
          isRoom: undefined
        })
        this.id = undefined
      }, 0)
      this.confirmLoading = false
      this.visible = false
    },
    selectCommunityId (data) {
      // console.log(data)
      if (data) {
        getRegionByCommunityId('/community/getRegionByCommunityId', {id: data}).then(res => {
          this.region = res.result
        })
      } else {
        this.region = []
      }
    }
  }
}
</script>

<style scoped>

</style>
