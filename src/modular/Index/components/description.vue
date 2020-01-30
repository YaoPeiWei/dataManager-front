<template>
  <div class="desc">
    <p class="title">
      {{ title }}
    </p>
    {{ content }}
  </div>
</template>

<script>
export default {
  name: 'description',
  props: {
    title: {
      type: String
    },
    content: {
      type: String
    }
  }
}
</script>

<style scoped>
.desc {
  font-size: 14px;
  line-height: 22px;
  margin-bottom: 7px;
  color: rgba(0, 0, 0, 0.65);
}
.title{
  margin-right: 8px;
  display: inline-block;
  color: rgba(0, 0, 0, 0.85);
}
</style>
