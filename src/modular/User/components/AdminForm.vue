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
                        <a-form-item label="账号" :label-col="{ span: 5 }" :wrapper-col="{ span: 17 }" :colon="false">
                            <a-input v-decorator="['uname',  {
                                    rules: [{ required: true, message: '请输入账号' }]
                                }]" placeholder="请输入账号" :allowClear="true">
                            </a-input>
                        </a-form-item>
                    </a-col>
                </a-row>
                <a-row :gutter="24" v-if="user.role === '2'">
                    <a-col :span="22" :offset="2">
                        <a-form-item label="所属小区" :label-col="{ span: 5 }" :wrapper-col="{ span: 17 }" :colon="false">
                            <a-select v-decorator="['communityId',  {
                                    rules: [{ required: true, message: '请选择车位所属小区' }]
                                }]" placeholder="请选择车位所属小区" :allowClear="true" :get-popup-container="triggerNode => triggerNode.parentNode"
                                :dropdown-style="{
                                  overflow: 'auto',
                                  zIndex: '2'
                                }"
                            >
                                <a-select-option v-for="d in community" :key="d.id">{{ d.communityName}}</a-select-option>
                            </a-select>
                        </a-form-item>
                    </a-col>
                </a-row>
                <a-row :gutter="24">
                    <a-col :span="22" :offset="2">
                        <a-form-item label="密码" :label-col="{ span: 5 }" :wrapper-col="{ span: 17 }" :colon="false">
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
                    </a-col>
                </a-row>
                <a-row :gutter="24">
                    <a-col :span="22" :offset="2">
                        <a-form-item label="用户名"
                                     :label-col="{ span: 5 }"
                                     :wrapper-col="{ span: 17 }">
                            <a-input
                                    v-decorator="['username', {
                                      rules: [{ required: true, message: '请输入用户名' }]
                                    }]"
                                    :min="0"
                                    placeholder="请输入用户名"
                                    autocomplete="off"
                                    :step="0.1"
                                    style="width: 100%"
                            />
                        </a-form-item>
                    </a-col>
                    <a-col :span="22" :offset="2">
                        <a-form-item label="联系方式"
                                     :label-col="{ span: 5 }"
                                     :wrapper-col="{ span: 17 }">
                            <a-input
                                    v-decorator="['phone', {
                                      rules: [{ required: true, message: '请输入联系方式' }]
                                    }]"
                                    :min="0"
                                    :step="0.1"
                                    placeholder="请输入联系方式"
                                    style="width: 100%"
                            />
                        </a-form-item>
                    </a-col>
                    <a-col :span="22" :offset="2">
                        <a-form-item label="电子邮箱"
                                     :label-col="{ span: 5 }"
                                     :wrapper-col="{ span: 17 }">
                            <a-input
                                    v-decorator="['mail', {
                                      rules: [{ required: true, message: '请输入电子邮箱' }]
                                    }]"
                                    :rows="4"
                                    placeholder="请输入电子邮箱"
                                    style="width: 100%"
                            />
                        </a-form-item>
                    </a-col>
                </a-row>
            </a-form>
        </a-modal>
    </div>
</template>

<script>
import {registerAdmin} from '../api/user'
import {ListCommunity} from '../../Community/api/community'
export default {
  name: 'AdminForm',
  data () {
    return {
      form: this.$form.createForm(this),
      confirmLoading: false,
      visible: false,
      title: '新增管理员账号',
      id: undefined,
      inputVisible: false,
      inputValue: '',
      tags: [],
      community: [],
      user: {
        role: undefined
      }
    }
  },
  methods: {
    async showModal (data) {
      // console.log(JSON.stringify(data))
      this.user = this.$store.getters.getLoginUser
      await this.initCommunity()
      if (data) {
        this.title = '编辑管理员账户'
        this.id = data.id
        setTimeout(() => {
          this.form.setFieldsValue({
            uname: data.uname,
            password: data.password,
            username: data.username,
            phone: data.phone,
            mail: data.mail,
            communityId: data.communityId
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
          param.role = '1'
          registerAdmin('/user/registerAdmin', param).then(res => {
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
          uname: undefined,
          password: undefined,
          username: undefined,
          phone: undefined,
          mail: undefined,
          communityId: undefined
        })
        this.id = undefined
        this.tags = []
      }, 0)
      this.confirmLoading = false
      this.visible = false
    },
    initCommunity () {
      ListCommunity('/community/ListCommunity').then(res => {
        this.community = res.result
        // console.log(this.community)
      })
    }
  }
}
</script>

<style scoped>

</style>
