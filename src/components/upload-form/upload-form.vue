<script lang="ts">
import { computed, defineComponent, onMounted, ref, watch } from 'vue';
import type { UploadChangeParam } from 'ant-design-vue';

export default defineComponent({
  props: {
    supports: {
      type: Array<String>,
      default: ['*'],
    },
    showUploadList: {
      type: Boolean,
      default: true,
    },
  },
  // 声明组件将要触发的自定义事件
  emits: ['uploaded'],
  setup(props, { emit }) {
    const fileList = ref([]);

    const handleChange = (info: UploadChangeParam) => {
      const status = info.file.status;
      if (status !== 'uploading') {
        // console.log(info.file, info.fileList);
      }
      if (status === 'done') {
        const { isSuccess, datas, message } = info.file.response;
        if (isSuccess) {
          datas.file = { ...info.file };
          emit('uploaded', datas);
        }
      } else if (status === 'error') {
      }
    };

    function handleDrop(e: DragEvent) {
      console.log(e);
    }

    return { fileList, handleChange, handleDrop, props };
  },
});
</script>

<template>
  <a-upload-dragger
    v-model:fileList="fileList"
    name="file"
    :multiple="true"
    :show-upload-list="props.showUploadList"
    action="https://szhlinvma72.apac.bosch.com:53196/api/File/upload"
    @change="handleChange"
    @drop="handleDrop"
  >
    <p class="ant-upload-drag-icon">
      <inbox-outlined></inbox-outlined>
    </p>
    <i class="fa-solid fa-cloud-arrow-up upload-icon"></i>
    <!-- <p class="ant-upload-text">{{ $t('system.upload') }}</p> -->
    <p class="ant-upload-text">Upload File</p>
    <p class="ant-upload-hint"
      >Support Format:
      <span v-for="item in supports">.{{ item }}</span></p
    >
  </a-upload-dragger>
</template>

<style scoped>
.upload-icon {
  font-size: 60px;
  margin: 15px;
}
</style>
