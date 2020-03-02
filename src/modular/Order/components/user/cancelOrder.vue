<template>
    <a-modal
            :bodyStyle="{padding: '16px'}"
            title="待停"
            :width="500"
            :visible="visible"
            @ok="handleOk"
            @cancel="handleCancel"
            :destroyOnClose="true"
            :footer="null"
            :keyboard="true"
            :maskClosable="false"
    >
        <div>取消原因</div>
        <a-form :form="form" style="margin-top: 20px">
            <a-form-item label=""
                         :label-col="{ span: 4 }"
                         :wrapper-col="{ span: 20 }">
                <a-checkbox-group :options="failCheckBox" @change="onChange" />
            </a-form-item>
            <a-form-item v-show="other">
                <a-textarea
                        v-decorator="[
                          'failResource',
                        ]"
                        type="password"
                        placeholder="请输入取消原因"
                        :autosize="{ minRows: 4, maxRows: 6 }"
                >
                </a-textarea>
            </a-form-item>
            <a-form-item>
                <div style="float: right">
                    <a-button @click="handleCancel">取消</a-button>
                    <a-button type="primary" style="margin-left: 16px" @click="handleOk">确定</a-button>
                </div>
            </a-form-item>
        </a-form>
    </a-modal>
</template>

<script>
import {CancelOrder} from '../../api/order'
export default {
  name: 'cancleOrder',
  data () {
    return {
      form: this.$form.createForm(this),
      visible: false,
      confirmLoading: false,
      data: undefined,
      failCheckBox: ['临时不想停', '车位不满意', '其他原因'],
      other: false,
      result: undefined
    }
  },
  methods: {
    showModal (data) {
      this.visible = true
      this.data = data
    },
    handleOk () {
      const param = {
        id: this.data.id,
        failResource: this.form.getFieldValue('failResource') + '' + this.result
      }
      // console.log(param)
      CancelOrder('/order/CancelOrder', param).then(res => {
        if (res.code === 0) {
          this.$emit('CancelBack')
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    handleCancel () {
      this.result = undefined
      this.other = false
      this.visible = false
    },
    onChange (selectValue) {
      this.result = ''
      if (selectValue.filter(item => item === '其他原因').length > 0) {
        this.other = true
      } else {
        this.other = false
      }
      selectValue.forEach(item => {
        this.result += item + ' '
      })
    }
  }
}
</script>

<style scoped>

</style>
