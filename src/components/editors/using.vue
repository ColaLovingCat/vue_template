<script lang="ts" setup>
import editorView from "./view.vue";

// name
defineOptions({
  name: "custom-name",
});
</script>

<template>
  <div class="sections">
    <editorView></editorView>
  </div>
</template>

<style scoped lang="scss">
.sections {
  margin: 0 auto;
  padding: 20px;
  width: 1200px;
}
</style>
