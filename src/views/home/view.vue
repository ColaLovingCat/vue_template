<script setup lang="ts">
fetch('/api/user/list').then((resp: any) => {
  console.log('Testing: ', resp)
})
</script>

<template>
  <div class="sections">
    <i class="bosch-ic bosch-ic-home"></i> Home
  </div>
</template>

<style scoped lang="scss"></style>
