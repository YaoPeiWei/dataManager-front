<template>
    <div></div>
</template>

<script>
import {DeleteUser} from '../../User/api/user'
import {DeleteCarPark} from '../../CarPark/api/carPark'
import {DeleteCommunity} from '../../Community/api/community'

export default {
  name: 'DeleteModel',
  methods: {
    showDeleteConfirm (data, method) {
      const _this = this
      this.$confirm({
        title: 'Are you sure delete this record?',
        content: 'It cannot be restored after deletion',
        okText: 'Yes',
        okType: 'danger',
        cancelText: 'No',
        onOk () {
          // console.log(method)
          // console.log(data)
          let m, path
          if (method === 'DeleteUser') {
            m = DeleteUser
            path = '/user/' + method
          } else if (method === 'DeleteCarPark') {
            m = DeleteCarPark
            path = '/carPark/' + method
          } else if (method === 'DeleteCommunity') {
            m = DeleteCommunity
            path = '/community/' + method
          }
          m(path, {id: data.id}).then(res => {
            if (res.code === 0) {
              _this.$message.success('删除成功')
              _this.$emit('DeleteSuccess')
            } else {
              _this.$message.error('删除失败')
            }
          })
        },
        onCancel () {
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
