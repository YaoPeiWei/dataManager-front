<template>
  <a-spin :spinning="loading">
    <a-row>
      <a-col :span="8" :offset="8">
        <a-form
          :form="form"
          id="components-form-demo-normal-login"
          class="login-form"
          style="margin-top: 150px"
        >
          <a-form-item>
            <a-input
              v-decorator="[
          'uname',
          { rules: [{ required: true, message: 'Please input your Account!' }] },
        ]"
              placeholder="账号"
            >
              <a-icon slot="prefix" type="user" style="color: rgba(0,0,0,.25)" />
            </a-input>
          </a-form-item>
          <a-form-item>
            <a-input
              v-decorator="[
          'password',
          { rules: [{ required: true, message: 'Please input your Password!' }] },
        ]"
              type="password"
              placeholder="密码"
            >
              <a-icon slot="prefix" type="lock" style="color: rgba(0,0,0,.25)" />
            </a-input>
          </a-form-item>
          <a-form-item>
            <a-checkbox
              v-decorator="[
          'rememberMe',
          {
            valuePropName: 'checked',
            initialValue: true,
          },
        ]"
              class="login-form-rememberMe"
            >
              Remember me
            </a-checkbox>
            <a class="login-form-forgot" href="">
              Forgot password
            </a>
            <a-button type="primary" html-type="submit" class="login-form-button" @click="handleSubmit">
              Login
            </a-button>
            <div class="login-form-register">
              Or
              <a href="">
                register now!
              </a>
            </div>
          </a-form-item>
        </a-form>
      </a-col>
    </a-row>
  </a-spin>
</template>

<script>
import {dologin, getLoginUser} from '../api/login'

export default {
  name: 'Login',
  beforeCreate () {
    this.form = this.$form.createForm(this)
  },
  data () {
    return {
      loading: false
    }
  },
  mounted () {
    this.setUser()
  },
  methods: {
    setUser () {
      if (this.$store.getters.getRememberUser) {
        const user = this.$store.getters.getRememberUser
        setTimeout(() => {
          this.form.setFieldsValue({
            uname: user.uname,
            password: user.password
          })
        }, 0)
      }
    },
    async handleSubmit (e) {
      // e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          // console.log('Received values of form: ', values)
          this.loading = true
          setTimeout(() => {
            dologin('/user/login/security/doLogin', values).then(res => {
              this.loading = false
              if (res.code === 103) {
                getLoginUser('/user/ReturnLoginUser', null).then(res => {
                  if (res.code === 0) {
                    this.$store.commit('setLoginUser', res.result)
                    // 记住我功能处理
                    if (values.rememberMe) {
                      this.$store.commit('setRememberUser', res.result)
                    } else {
                      this.$store.commit('clearRememberUser')
                    }
                  }
                })
                this.$message.success('登陆成功')
                const flag = false
                if (flag) {
                  this.$router.push({
                    path: '/index'
                  })
                } else if (!flag) {
                  this.$router.push({
                    path: '/index/adminOrderIndex'
                  })
                } else {
                  // 用户权限问题
                }
              } else {
                this.$message.error(res.msg)
              }
            })
          }, 2000)
        }
      })
    }
  }
}
</script>

<style scoped>
  #components-form-demo-normal-login .login-form {
    max-width: 300px;
  }
  #components-form-demo-normal-login .login-form-rememberMe{
    float: left;
  }
  #components-form-demo-normal-login .login-form-forgot {
    float: right;
  }
  #components-form-demo-normal-login .login-form-register {
    float: left;
  }
  #components-form-demo-normal-login .login-form-button {
    width: 100%;
  }
</style>
