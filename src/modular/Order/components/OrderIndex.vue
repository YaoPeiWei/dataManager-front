<template>
  <div :style="{ padding: '24px', background: '#fff', textAlign: 'center' }">
    <div class="business">
      <business></business>
    </div>
    <div class="order">
      <order></order>
    </div>
  </div>
</template>

<script>
import business from './business'
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
