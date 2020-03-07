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
                        <a-form-item label="区域" :label-col="{ span: 5 }" :wrapper-col="{ span: 17 }" :colon="false">
                            <a-select v-decorator="['region',  {
                                    rules: [{ required: true, message: '请选择车位的区域' }]
                                }]" placeholder="请选择车位的区域" :allowClear="true">
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
export default {
  name: 'carParkForm',
  data () {
    return {
      form: this.$form.createForm(this),
      region: ['A', 'B', 'C', 'D', 'E'], // 区域
      confirmLoading: false,
      visible: false,
      title: '新增车位',
      id: undefined
    }
  },
  methods: {
    showModal (data) {
      // console.log(JSON.stringify(data))
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
        if (!err) {
          const param = Object.assign({}, values, {id: this.id})
          this.confirmLoading = true
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
    }
  }
}
</script>

<style scoped>

</style>
