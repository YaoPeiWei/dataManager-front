<template>
  <div class="scroller">
    <a-timeline>
      <a-timeline-item color="green">
        <a-popover placement="leftTop">
          <template slot="content">
            <p>Content</p>
          </template>
          <template slot="title">
            <span>第一单 site 2015-09-01</span>
          </template>
          第一单 site 2015-09-01
        </a-popover>
      </a-timeline-item>
      <a-timeline-item color="green">第一单 site 2015-09-01</a-timeline-item>
      <a-timeline-item color="green">第一单 site 2015-09-01</a-timeline-item>
      <a-timeline-item color="green">第一单 site 2015-09-01</a-timeline-item>
      <a-timeline-item color="green">第一单 site 2015-09-01</a-timeline-item>
      <a-timeline-item color="green">第一单 site 2015-09-01</a-timeline-item>
      <a-timeline-item color="green">第一单 site 2015-09-01</a-timeline-item>
      <a-timeline-item color="green">第一单 site 2015-09-01</a-timeline-item>
      <a-timeline-item color="green">第一单 site 2015-09-01</a-timeline-item>
      <a-timeline-item color="green">第一单 site 2015-09-01</a-timeline-item>
      <a-timeline-item color="green">第一单 site 2015-09-01</a-timeline-item>
      <a-timeline-item color="green">第一单 site 2015-09-01</a-timeline-item>
      <a-timeline-item color="green">
        <a-popover placement="leftBottom">
          <template slot="content">
            <p><a @click="showDrawer">Content</a></p>
          </template>
          <template slot="title">
            <span>第一单 site 2015-09-01</span>
          </template>
          第一单 site 2015-09-01
        </a-popover>
      </a-timeline-item>
      <a-timeline-item color="red">
        <p>失败订单  site 2015-09-01</p>
      </a-timeline-item>
      <a-timeline-item>
        <p>进行中订单 3 2015-09-01</p>
      </a-timeline-item>
    </a-timeline>
    <a-drawer width="350" placement="right" :closable="false" :visible="visible" title="订单详情" @close="onClose">
      <p class="pStyle">User Profile</p>
      <p class="pStyle">Personal</p>
      <a-row>
        <a-col :span="12">
          <description title="Full Name" content="Lily" />
        </a-col>
        <a-col :span="12">
          <description title="Account" content="AntDesign@example.com" />
        </a-col>
      </a-row>
    </a-drawer>
  </div>
</template>

<script>
import description from '../../Index/components/description'
export default {
  name: 'orderHistory',
  components: {
    description
  },
  data () {
    return {
      visible: false
    }
  },
  methods: {
    showDrawer () {
      this.visible = true
    },
    onClose () {
      this.visible = false
    }
  }
}
</script>

<style scoped>
.scroller {
  overflow-y: auto;
  height: 500px;
}
.pStyle {
  fontSize: '16px';
  color: rgba(0,0,0,0.85);
  lineHeight: '24px';
  display: block;
  marginBottom: '16px';
  marginBottom: '24px';
}
</style>
