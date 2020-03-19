<template>
    <div>
        <a-spin tip="Loading..." :spinning="loading">
            <a-row>
                <a-form :form="form">
                    <a-form-item>
                        <a-row>
                            <a-col :span="8">
                                <a-form-item label="用户名" :label-col="{ span: 5 }" :wrapper-col="{ span: 15 }"   :colon="false">
                                    <a-input v-decorator="['username']" :allowClear="true"></a-input>
                                </a-form-item>
                            </a-col>
                            <a-col :span="8">
                                <a-form-item label="状态" :label-col="{ span: 5 }" :wrapper-col="{ span: 15 }"   :colon="false">
                                    <a-select v-decorator="['locked']" :allowClear="true">
                                        <a-select-option :key="1">冻结</a-select-option>
                                        <a-select-option :key="0">正常</a-select-option>
                                    </a-select>
                                </a-form-item>
                            </a-col>
                            <a-col :span="5" :offset="0">
                                <a-button type="primary" @click="selectData">查询</a-button>
                            </a-col>
                        </a-row>
                    </a-form-item>
                </a-form>
            </a-row>
            <a-row>
                <a-col :span="5" :offset="0">
                    <a-button type="primary" @click="add">
                        <a-icon type="plus"/>新增管理员账号
                    </a-button>
                </a-col>
            </a-row>
            <a-row style="margin-top: 16px">
                <a-col :span="24">
                    <a-table :columns="columns"
                             :rowKey="record => record.id"
                             :dataSource="data"
                             :pagination="false">
                        <template slot="uname" slot-scope="record">
                            <div v-if="record.role === '1'"><a @click="Edit(record)">{{record.uname}}</a></div>
                            <div v-else> {{record.uname}}</div>
                        </template>
                        <template slot="username" slot-scope="username">
                            {{username}}
                        </template>
                        <template slot="mail" slot-scope="mail">
                            {{mail}}
                        </template>
                        <template slot="phone" slot-scope="phone">
                            {{phone}}
                        </template>
                        <template slot="birthdate" slot-scope="birthdate">
                            {{birthdate}}
                        </template>
                        <template slot="locked" slot-scope="locked">
                            <a-badge :status="locked === true?'error':'success'" style="float: left"/>
                            <div v-html="locked === true?'冻结':'正常'"></div>
                        </template>
                        <template slot="action" slot-scope="record">
                            <a-button-group>
                                <a-button :type="record.locked === true?'primary':null"  style="float: left" @click="LockedUser(record)">
                                    <div v-html="record.locked === true?'解除冻结':'冻结账户'"></div>
                                </a-button>
                                <a-button type="danger"  style="float: left" @click="deleteData(record)" icon="delete">
                                </a-button>
                            </a-button-group>
                        </template>
                    </a-table>
                </a-col>
            </a-row>
            <a-row>
                <a-pagination v-if="pagination.pages>0" simple v-model="pagination.current" :total="pagination.total" :pageSize="pagination.size" @change="pageSizeChange" style="float: right;margin-top: 10px"/>
            </a-row>
            <a-row>
                <AdminForm ref="AdminForm" @communitySave="initData"></AdminForm>
            </a-row>
            <a-row>
                <DeleteModel ref="DeleteModel" @DeleteSuccess="initData"></DeleteModel>
            </a-row>
        </a-spin>
    </div>
</template>

<script>
import {getUserByAdmin, LockedUser} from '../api/user'
import DeleteModel from '../../Index/components/DeleteModel'
import AdminForm from './AdminForm'
const columns = [
  {
    title: '用户账号',
    width: '20%',
    scopedSlots: { customRender: 'uname' }
  },
  {
    title: '用户名',
    dataIndex: 'username',
    sorter: true,
    width: '14%',
    scopedSlots: { customRender: 'username' }
  },
  {
    title: '邮箱',
    dataIndex: 'mail',
    width: '10%',
    scopedSlots: { customRender: 'mail' }
  },
  {
    title: '联系方式',
    dataIndex: 'phone',
    width: '10%',
    scopedSlots: { customRender: 'phone' }
  },
  {
    title: '出生日期',
    dataIndex: 'birthdate',
    width: '20%',
    scopedSlots: { customRender: 'birthdate' }
  },
  {
    title: '状态',
    dataIndex: 'locked',
    width: '10%',
    scopedSlots: { customRender: 'locked' }
  },
  {
    title: '操作',
    width: '16%',
    scopedSlots: { customRender: 'action' }
  }
]
export default {
  name: 'AdminUserAccount',
  components: {
    AdminForm,
    DeleteModel
  },
  data () {
    return {
      form: this.$form.createForm(this),
      region: ['A', 'B', 'C', 'D', 'E'], // 区域
      loading: false,
      columns,
      data: [],
      pagination: {
        current: 0,
        size: 5,
        pages: 0,
        total: 0
      }
    }
  },
  mounted () {
    this.initData()
  },
  methods: {
    selectData () {
      this.pagination.current = 1
      this.initData()
    },
    initData () {
      const param = this.form.getFieldsValue(['username', 'locked'])
      param.current = this.pagination.current === 0 ? 1 : this.pagination.current
      param.size = this.pagination.size
      this.loading = true
      setTimeout(() => {
        getUserByAdmin('/user/getUserByAdmin', param).then(res => {
          this.loading = false
          if (res.code === 0) {
            this.data = res.result.records
            this.pagination.current = res.result.current
            this.pagination.total = res.result.total
            this.pagination.pages = res.result.pages
          } else {
            this.$message.error(res.msg)
          }
        })
      }, 2000)
    },
    pageSizeChange (page, pageSize) {
      this.pagination.current = page
      this.initData()
    },
    LockedUser (data) {
      LockedUser('/user/LockedUser', {id: data.id, locked: !data.locked}).then(res => {
        if (res.code === 0) {
          this.$message.success(data.locked ? '解除冻结成功' : '冻结账户成功')
          this.initData()
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    add () {
      this.$refs.AdminForm.showModal()
    },
    Edit (data) {
      this.$refs.AdminForm.showModal(data)
    },
    deleteData (data) {
      this.$refs.DeleteModel.showDeleteConfirm(data, 'DeleteUser')
    }
  }
}
</script>

<style scoped>

</style>
