<template>
  <div :style="{ padding: '24px', background: '#fff', textAlign: 'center',minHeight: '600px' }">
    <div class="business">
      <business></business>
    </div>
    <div class="order">
      <order></order>
    </div>
  </div>
</template>

<script>
import business from '../common/business'
import order from './order'
export default {
  name: 'OrderIndex',
  components: {
    business,
    order
  }
}
</script>

<style scoped>
  .order{
    margin-top: 20px;
  }
</style>
