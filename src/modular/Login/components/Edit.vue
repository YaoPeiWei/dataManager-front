<template>
    <a-drawer
            title="编辑用户基本信息"
            :width="520"
            @close="onClose"
            :visible="visible"
            :wrapStyle="{height: 'calc(100% - 108px)',overflow: 'auto',paddingBottom: '108px'}"
    >
        <a-form :form="form" layout="vertical">
            <a-row :gutter="24">
                <a-col :span="24">
                    <a-form-item label="账号"
                                 :label-col="{ span: 4 }"
                                 :wrapper-col="{ span: 20 }">
                        <a-input
                                v-decorator="['uname', {
                  rules: [{ required: true, message: '请输入你的账号' }]
                }]"
                                placeholder="请输入你的账号"
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="24">
                    <a-form-item label="密码"
                                 :label-col="{ span: 4 }"
                                 :wrapper-col="{ span: 20 }">
                        <a-input-password v-decorator="['password',{
              rules: [{ required: true, message: '请输入密码' }] },
              ]"
                                          type="password"
                                          placeholder="请输入你的密码"
                                          autocomplete="off"
                        >
                            <a-icon slot="prefix" type="lock" style="color: rgba(0,0,0,.25)" />
                        </a-input-password>
                    </a-form-item>
                </a-col>
            </a-row>
            <a-row :gutter="24">
                <a-col :span="24">
                    <a-form-item label="用户名"
                                 :label-col="{ span: 4 }"
                                 :wrapper-col="{ span: 20 }">
                        <a-input
                                v-decorator="['username', {
                  rules: [{ required: true, message: '请输入你的用户名' }]
                }]"
                                placeholder="请输入你的用户名"
                                autocomplete="off"
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="24">
                    <a-form-item label="联系方式"
                                 :label-col="{ span: 4 }"
                                 :wrapper-col="{ span: 20 }">
                        <a-input
                                v-decorator="['phone', {
                  rules: [{ required: true, message: '请输入你的联系方式' }]
                }]"
                                placeholder="请输入你的联系方式"
                        />
                    </a-form-item>
                </a-col>
            </a-row>
            <a-row :gutter="24">
                <a-col :span="24">
                    <a-form-item label="电子邮箱"
                                 :label-col="{ span: 4 }"
                                 :wrapper-col="{ span: 20 }">
                        <a-input
                                v-decorator="['mail', {
                  rules: [{ required: true, message: '请输入你的邮箱' }]
                }]"
                                placeholder="请输入你的邮箱"
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="24">
                    <a-form-item label="出生日期"
                                 :label-col="{ span: 4 }"
                                 :wrapper-col="{ span: 20 }">
                        <a-date-picker
                                v-decorator="['birthdate',{
                  rules: [{ required: true, message: '请选择你的出生日期' }]
                }]"
                                style="width: 100%"
                                :getPopupContainer="trigger => trigger.parentNode"
                        />
                    </a-form-item>
                </a-col>
            </a-row>
            <a-row>
                <a-col :span="24">
                    <a-form-item label="车牌号码"
                                 :label-col="{ span: 4 }"
                                 :wrapper-col="{ span: 20 }">
                        <CarNumberUploadComp
                                v-decorator="[
                'carNumber',
                {
                  rules: [{ required: true, message: '请上传图片' }]
                }
              ]"
                                ref="CarNumberUploadComp"
                                @uploadBack="uploadBack"
                        ></CarNumberUploadComp>
                    </a-form-item>
                </a-col>
            </a-row>
        </a-form>
        <div
                :style="{
          position: 'absolute',
          left: 0,
          bottom: 0,
          width: '100%',
          borderTop: '1px solid #e9e9e9',
          padding: '10px 16px',
          background: '#fff',
          textAlign: 'right',
        }"
        >
            <a-button :style="{marginRight: '8px'}" @click="onClose">
                Cancel
            </a-button>
            <a-button @click="submit" type="primary" :loading="loading">Submit</a-button>
        </div>
    </a-drawer>
</template>

<script>
import moment from 'moment'
import CarNumberUploadComp from './CarNumberUploadComp'
import {getLoginUser, register} from '../api/login'
import {getUserById} from '../../User/api/user'
export default {
  name: 'Edit',
  components: {
    CarNumberUploadComp
  },
  data () {
    return {
      form: this.$form.createForm(this),
      visible: false,
      loading: false,
      user: undefined,
      dateFormat: 'YYYY/MM/DD',
      id: undefined
    }
  },
  methods: {
    async showDrawer () {
      this.visible = true
      const id = this.$store.state.userId
      getUserById('/user/getUserById', {id: id}).then(res => {
        const user = res.result
        setTimeout(() => {
          this.form.setFieldsValue({
            uname: user.uname,
            password: user.password,
            username: user.username,
            phone: user.phone,
            mail: user.mail,
            birthdate: moment(new Date(user.birthdate).toLocaleDateString(), this.dateFormat),
            carNumber: user.carNumber
          })
          this.id = user.id
          this.$refs.CarNumberUploadComp.setCarNumber(user.carNumber)
        }, 0)
      })
    },
    onClose () {
      setTimeout(() => {
        this.form.setFieldsValue({
          uname: undefined,
          password: undefined,
          username: undefined,
          phone: undefined,
          mail: undefined,
          birthdate: undefined,
          carNumber: undefined
        })
        this.user = undefined
        this.id = undefined
        this.$refs.CarNumberUploadComp.setCarNumber(undefined)
      }, 0)
      this.visible = false
    },
    uploadBack (carNumber) {
      setTimeout(() => {
        this.form.setFieldsValue({
          carNumber: carNumber
        })
      }, 0)
    },
    submit () {
      this.form.validateFields((err, values) => {
        if (!err) {
          this.loading = true
          values.id = this.id
          values.birthdate = this.format(values.birthdate, 'yyyy-MM-dd HH:mm:ss')
          register('/user/register', values).then(res => {
            this.loading = false
            if (res.code === 0) {
              getLoginUser('/user/ReturnLoginUser', null).then(res => {
                if (res.code === 0) {
                  this.$store.commit('setLoginUser', res.result)
                  this.$message.success('编辑用户信息成功')
                  this.onClose()
                } else {
                  this.$message.error(res.msg)
                }
              })
            } else {
              this.$message.error(res.msg)
            }
          })
        }
      })
    },
    // 转换时间格式为yyyy-MM-dd
    format (time, format) {
      var t = new Date(time)
      var tf = function (i) { return (i < 10 ? '0' : '') + i }
      return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function (a) {
        switch (a) {
          case 'yyyy':
            return tf(t.getFullYear())
            // eslint-disable-next-line no-unreachable
            break
          case 'MM':
            return tf(t.getMonth() + 1)
            // eslint-disable-next-line no-unreachable
            break
          case 'mm':
            return tf(t.getMinutes())
            // eslint-disable-next-line no-unreachable
            break
          case 'dd':
            return tf(t.getDate())
            // eslint-disable-next-line no-unreachable
            break
          case 'HH':
            return tf(t.getHours())
            // eslint-disable-next-line no-unreachable
            break
          case 'ss':
            return tf(t.getSeconds())
            // eslint-disable-next-line no-unreachable
            break
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
