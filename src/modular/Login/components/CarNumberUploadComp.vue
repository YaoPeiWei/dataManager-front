<template>
  <div>
    <a-upload
      v-if="!showCarNumber"
      accept=".jpg,.png,.jpeg"
      :show-upload-list="false"
      :before-upload="beforeUpload"
      :custom-request="upload"
      :multiple="false"
      :disabled="disabled"
      @change="handleChange"
    >
      <a-button :loading="loading">  上传车牌号图片 <a-icon type="upload"/> </a-button>
    </a-upload>
    <div v-if="showCarNumber">
      <a-tag :color="color" closable @close="colsetag">{{carNumber}}</a-tag>
    </div>
  </div>
</template>

<script>
import { uploadCarNumber } from '../api/login'
export default {
  name: 'ImageComponents',
  data () {
    return {
      tip: '上传图片',
      tips: '尺寸为556x278px,大小在1MB以内',
      color: undefined,
      carNumber: undefined,
      showCarNumber: false,
      disabled: false,
      loading: false
    }
  },
  methods: {
    beforeUpload (file) {
      const isJPG =
        file.type === 'image/jpeg' ||
        file.type === 'image/jpg' ||
        file.type === 'image/png'
      if (!isJPG) {
        this.$message.error('请上传格式为：jpeg,jpg,png的图片!')
      }
      const isLt2M = file.size / 1024 / 1024 < 1
      if (!isLt2M) {
        this.$message.error('请上传1MB以内的文件')
      }
      return isJPG && isLt2M
    },
    /**
     * 文件状态改变
     */
    handleChange (file) {
      if (file.file.status === 'uploading') {

      }
      if (file.file.status === 'done') {

      }
    },
    /**
     * 文件选择
     */
    upload (file) {
      const params = new FormData()
      params.append('file', file.file)
      this.disabled = true
      this.loading = true
      uploadCarNumber(params).then(res => {
        // console.log(JSON.stringify(res.data))
        this.disabled = false
        this.loading = false
        if (res.data.code === 0) {
          this.showCarNumber = true
          this.carNumber = res.data.result.number
          this.color = res.data.result.color
          this.uploadBack(res.data.result.number)
        } else {
          this.showCarNumber = false
          this.$message.error('上传图片失败')
        }
      })
    },
    colsetag () {
      this.uploadBack(undefined)
      this.carNumber = undefined
      this.color = undefined
      this.showCarNumber = false
    },
    uploadBack (number) {
      this.$emit('uploadBack', number)
    },
    setCarNumber (val) {
      if (val) {
        this.showCarNumber = true
        this.carNumber = val
      } else {
        this.showCarNumber = false
        this.carNumber = undefined
      }
    }
  }
}
</script>

<style scoped>
.avatar-uploader > .ant-upload {
  width: 128px;
  height: 128px;
}
.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
</style>
