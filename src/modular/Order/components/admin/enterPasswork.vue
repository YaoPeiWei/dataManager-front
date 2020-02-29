<template>
  <a-modal
    :bodyStyle="{padding: '16px'}"
    title="待停"
    :width="400"
    :visible="visible"
    @ok="handleOk"
    @cancel="handleCancel"
    :destroyOnClose="true"
    :footer="null"
    :keyboard="true"
    :maskClosable="false"
  >
    <div class="title">使用管理员密码登陆</div>
    <div class="text">请输入{{user.uname}}的登陆密码，既可以暂停计时,使订单更新为待停状态！</div>
    <a-form :form="form" style="margin-top: 20px">
      <a-form-item>
        <a-input-password
          v-decorator="[
          'password',
          { rules: [{ required: true, message: '请输入密码!' }] },
        ]"
          type="password"
          placeholder="密码"
        >
          <a-icon slot="prefix" type="lock" style="color: rgba(0,0,0,.25)" />
        </a-input-password>
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
import { ChangOrderStatus} from '@/modular/Order/api/order'
export default {
  name: 'enterPasswork',
  data () {
    return {
      user: {
        uname: undefined,
        password: undefined
      },
      form: this.$form.createForm(this),
      visible: false,
      confirmLoading: false,
      data: undefined
    }
  },
  methods: {
    showModal (data) {
      if (this.$store.getters.getLoginUser) {
        this.user = this.$store.getters.getLoginUser
      }
      this.visible = true
      this.data = data
    },
    handleOk () {
      this.form.validateFields((err, values) => {
        if (!err) {
          const pw = this.form.getFieldValue('password')
          if (this.user.password === pw) {
            const param = {id: this.data.id, status: '2'}
            ChangOrderStatus('/order/ChangOrderStatus', param).then(res => {
              if (res.code === 0) {
                this.$message.success('订单等待支付中')
                this.$emit('parkOrderSuccess', true)
                this.visible = false
              } else {
                this.$message.error(res.msg)
              }
            })
          } else {
            this.form.setFields({
              password: {
                errors: [new Error('密码错误')]
              }
            })
            // this.$message.error('密码错误')
          }
        }
      })
    },
    handleCancel () {
      this.visible = false
    }
  }
}
</script>

<style scoped>
.title{
  text-align: center;
  font-size: 16px;
  font-weight: bold;
}
  .text{
    margin-top: 4px;
    font-size: 16px;
    text-align: center;
  }
</style>
