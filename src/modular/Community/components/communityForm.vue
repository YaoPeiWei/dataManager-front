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
                <a-row :gutter="24">
                    <a-col :span="22" :offset="2">
                        <a-form-item label="小区名" :label-col="{ span: 5 }" :wrapper-col="{ span: 17 }" :colon="false">
                            <a-input v-decorator="['communityName',  {
                                    rules: [{ required: true, message: '请输入小区名' }]
                                }]" placeholder="请输入小区名" :allowClear="true">
                            </a-input>
                        </a-form-item>
                    </a-col>
                </a-row>
                <a-row :gutter="24">
                    <a-col :span="22" :offset="2">
                        <a-form-item label="经度"
                                     :label-col="{ span: 5 }"
                                     :wrapper-col="{ span: 17 }">
                            <a-input-number
                                    v-decorator="['longitude', {
                                      rules: [{ required: true, message: '请输入小区的经度' }]
                                    }]"
                                    :min="0"
                                    placeholder="请输入小区的经度"
                                    autocomplete="off"
                                    :step="0.1"
                                    style="width: 100%"
                            />
                        </a-form-item>
                    </a-col>
                    <a-col :span="22" :offset="2">
                        <a-form-item label="纬度"
                                     :label-col="{ span: 5 }"
                                     :wrapper-col="{ span: 17 }">
                            <a-input-number
                                    v-decorator="['latitude', {
                                      rules: [{ required: true, message: '请输入小区的纬度' }]
                                    }]"
                                    :min="0"
                                    :step="0.1"
                                    placeholder="请输入小区的纬度"
                                    style="width: 100%"
                            />
                        </a-form-item>
                    </a-col>
                    <a-col :span="22" :offset="2">
                        <a-form-item label="小区位置"
                                     :label-col="{ span: 5 }"
                                     :wrapper-col="{ span: 17 }">
                            <a-textarea
                                    v-decorator="['location', {
                                      rules: [{ required: true, message: '请输入小区的位置' }]
                                    }]"
                                    :rows="4"
                                    placeholder="请输入小区的位置"
                                    style="width: 100%"
                            />
                        </a-form-item>
                    </a-col>
                    <a-col :span="22" :offset="2">
                        <a-form-item label="车位区域"
                                     :label-col="{ span: 5 }"
                                     :wrapper-col="{ span: 17 }">
                            <template v-for="(tag) in tags">
                                <a-tooltip v-if="tag.length > 20" :key="tag" :title="tag">
                                    <a-tag :key="tag" :closable="true" :afterClose="() => handleClose(tag)">
                                        {{`${tag.slice(0, 20)}...`}}
                                    </a-tag>
                                </a-tooltip>
                                <a-tag v-else :key="tag" :closable="true" :afterClose="() => handleClose(tag)">
                                    {{tag}}
                                </a-tag>
                            </template>
                            <a-input
                                    v-if="inputVisible"
                                    ref="input"
                                    type="text"
                                    size="small"
                                    :style="{ width: '78px' }"
                                    :value="inputValue"
                                    @change="handleInputChange"
                                    @blur="handleInputConfirm"
                                    @keyup.enter="handleInputConfirm"
                                    :rows="4"
                                    style="width: 100%"
                            />
                            <a-tag v-else @click="showInput" style="background: #fff; borderStyle: dashed;">
                                <a-icon type="plus" /> 新增区域
                            </a-tag>
                        </a-form-item>
                    </a-col>
                </a-row>
            </a-form>
        </a-modal>
    </div>
</template>

<script>
import {setCommunity} from '../api/community'
export default {
  name: 'communityForm',
  data () {
    return {
      form: this.$form.createForm(this),
      confirmLoading: false,
      visible: false,
      title: '新增小区信息',
      id: undefined,
      inputVisible: false,
      inputValue: '',
      tags: []
    }
  },
  methods: {
    showModal (data) {
      // console.log(JSON.stringify(data))
      if (data) {
        this.title = '编辑小区信息'
        this.id = data.id
        setTimeout(() => {
          this.form.setFieldsValue({
            communityName: data.communityName,
            longitude: data.longitude,
            latitude: data.latitude,
            location: data.location
          })
          if (data.region) {
            const region = data.region.split(',')
            region.forEach(item => {
              this.tags.push(item)
            })
          }
        }, 0)
      }
      this.visible = true
    },
    handleOk () {
      this.form.validateFields((err, values) => {
        if (!err) {
          const param = Object.assign({}, values, {id: this.id})
          this.confirmLoading = true
          // console.log(JSON.stringify(param))
          let region = ''
          // console.log(this.tags)
          this.tags.forEach((item, index) => {
            if (index !== this.tags.length - 1) {
              region = region + item + ','
            } else {
              region = region + item
            }
          })
          // console.log(region)
          param.region = region
          setCommunity('/community/setCommunity', param).then(res => {
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
              this.$emit('communitySave')
            } else {
              this.$message.error(res.msg)
              this.$emit('finishSelect')
            }
          })
        }
      })
    },
    handleClose (removedTag) {
      const tags = this.tags.filter(tag => tag !== removedTag)
      // console.log(tags)
      this.tags = tags
    },
    handleCancel () {
      setTimeout(() => {
        this.form.setFieldsValue({
          location: undefined,
          communityName: undefined,
          longitude: undefined,
          latitude: undefined
        })
        this.id = undefined
        this.tags = []
      }, 0)
      this.confirmLoading = false
      this.visible = false
    },
    showInput () {
      this.inputVisible = true
      this.$nextTick(function () {
        this.$refs.input.focus()
      })
    },
    handleInputChange (e) {
      this.inputValue = e.target.value
    },
    handleInputConfirm () {
      const inputValue = this.inputValue
      let tags = this.tags
      if (inputValue && tags.indexOf(inputValue) === -1) {
        tags = [...tags, inputValue]
      }
      // console.log(tags)
      Object.assign(this, {
        tags,
        inputVisible: false,
        inputValue: ''
      })
    }
  }
}
</script>

<style scoped>

</style>
