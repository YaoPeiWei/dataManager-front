<template>
  <div>
    <a-card title="预约停车车位">
      <a href="#" slot="extra" @click="close">close</a>
      <div @click="showCarParking">
        <a-progress type="circle" :percent="percent" :format="() => tip"/>
      </div>
      <a-form :form="form" style="margin-top: 20px">
        <a-form-item v-bind="formItemLayout" label="车牌号" :colon="false">
          <a-input v-decorator="['carNumber']" v-show="false"></a-input>
          <div v-if="carPark.carNumber">{{ carPark.carNumber }}</div>
        </a-form-item>
        <a-form-item v-bind="formItemLayout" label="车位位置" :colon="false" v-if="selected">
          <a-input v-decorator="['location']" v-show="false"></a-input>
          <div v-if="carPark.location">{{ d.communityName}} {{ carPark.location}}</div>
        </a-form-item>
        <a-form-item v-bind="formItemLayout" label="每小时费用" :colon="false" v-if="selected">
          <a-input v-decorator="['price']" v-show="false"></a-input>
          <div v-if="carPark.price">{{ carPark.price}} $</div>
        </a-form-item>
        <a-form-item v-bind="formItemLayout" label="停车时间" :colon="false">
          <a-date-picker
            v-decorator="['parkTime', config]"
            show-time
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
import {inserOrder} from '../../api/order'

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
        id: undefined,
        carNumber: undefined,
        price: undefined,
        location: undefined
      },
      d: undefined,
      dateFormat: 'yyyy-MM-dd HH:mm:ss'
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
        this.d = data
        setTimeout(() => {
          this.carPark.id = data.id
          this.carPark.price = data.price
          this.carPark.location = data.location
          // console.log(data.communityName)
          this.form.setFieldsValue({
            price: data.price,
            location: data.communityName + ' ' + data.location
          })
        }, 0)
      }
    },
    handleSubmit () {
      this.form.validateFields((err, values) => {
        if (!err) {
          // console.log(values)
          const param = {
            carparkId: this.carPark.id,
            dprice: values.price,
            carNumber: values.carNumber,
            appointmentTime: this.format(values.parkTime, 'yyyy-MM-dd HH:mm:ss')
          }
          inserOrder('/order/insert/addOrder', param).then(res => {
            if (res.code === 0) {
              this.$message.success(res.msg)
              this.$emit('insertOrder', true)
            } else {
              this.$message.error(res.msg)
              this.$emit('finishSelect')
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
