<template>
  <div class="index">
    <sidebar></sidebar>
    <contents></contents>
  </div>
</template>

<script>
import sidebar from './sidebar'
import contents from './content'
export default {
  name: 'Index',
  components: {
    sidebar,
    contents
  }
}
</script>

<style scoped>
</style>
