<template>
  <div>
    <a-card title="CarParking Order">
      <a href="#" slot="extra" @click="close">close</a>
      <div @click="showCarParking">
        <a-progress type="circle" :percent="percent" :format="() => tip"/>
      </div>
      <a-form :form="form" style="margin-top: 20px">
        <a-form-item v-bind="formItemLayout" label="车牌号" :colon="false">
          <a-input v-decorator="['carNumber']" v-show="false"></a-input>
          <p v-if="carPark.carNumber">{{ carPark.carNumber }}</p>
        </a-form-item>
        <a-form-item v-bind="formItemLayout" label="车位位置" :colon="false" v-if="selected">
          <a-input v-decorator="['location']" v-show="false"></a-input>
          <p v-if="carPark.location">{{ carPark.location}}</p>
        </a-form-item>
        <a-form-item v-bind="formItemLayout" label="每小时费用" :colon="false" v-if="selected">
          <a-input v-decorator="['price']" v-show="false"></a-input>
          <p v-if="carPark.price">{{ carPark.price}} $</p>
        </a-form-item>
        <a-form-item v-bind="formItemLayout" label="停车时间" :colon="false">
          <a-date-picker
            v-decorator="['parkTime', config]"
            show-time
            format="YYYY-MM-DD HH:mm:ss"
          />
        </a-form-item>
        <a-form-item
          :wrapper-col="{
        xs: { span: 3, offset: 21 },
        sm: { span: 3, offset: 21 },
      }"
        >
          <a-button type="primary" @click="handleSubmit">
            Submit
          </a-button>
        </a-form-item>
      </a-form>
      <a-row>
        <carParking ref="carParking" @finishSelect="finishSelect"></carParking>
      </a-row>
    </a-card>
  </div>
</template>

<script>
import carParking from './carParking'
export default {
  name: 'orderForm',
  beforeCreate () {
    this.form = this.$form.createForm(this)
  },
  mounted () {
    this.initOrderForm()
  },
  components: {
    carParking
  },
  data () {
    return {
      formItemLayout: {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 8 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 }
        }
      },
      config: {
        rules: [{ type: 'object', required: true, message: '请选择停车时间!' }]
      },
      percent: 0,
      selected: false,
      tip: '选择车位',
      carPark: {
        carNumber: undefined,
        price: undefined,
        location: undefined
      }
    }
  },
  methods: {
    initOrderForm () {
      const user = this.$store.getters.getLoginUser
      if (user) {
        this.carPark.carNumber = user.carNumber
        setTimeout(() => {
          this.form.setFieldsValue({
            carNumber: user.carNumber
          })
        }, 0)
      }
    },
    close () {
      this.$emit('close')
    },
    showCarParking () {
      const _this = this
      if (this.percent === 100) {
        this.finishSelect()
      } else {
        this.tip = '车位准备中'
        const timer = setInterval(() => {
          _this.percent++
          if (_this.percent === 100) {
            _this.$refs.carParking.showModal()
            clearInterval(timer)
            this.tip = '选择车位'
          }
        }, 5)
      }
    },
    finishSelect (data) {
      this.percent = 0
      if (data) {
        this.selected = true
        setTimeout(() => {
          this.carPark.price = data.price
          this.carPark.location = data.location
          this.form.setFieldsValue({
            price: data.price,
            location: data.location
          })
        }, 0)
      }
    },
    handleSubmit () {
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log(values)
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
