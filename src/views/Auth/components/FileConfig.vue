<template>
  <div class="file-config config">
    <div class="create-form-title">File-ACL</div>
    <el-form class="create-form" label-position="top">
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item :label="$t('components.rules')">
            <div class="viewer-container" ref="monacoContainer">
              <monaco id="acl-file-editor" v-model="fileConfig.rules" lang="plaintext"></monaco>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, watch } from 'vue'
import Monaco from '@/components/Monaco.vue'

export default defineComponent({
  name: 'FileConfig',
  components: {
    Monaco,
  },
  props: {
    modelValue: {
      type: Object,
      required: true,
    },
  },
  setup(props, ctx) {
    const fileConfig = reactive(props.modelValue)
    watch(fileConfig, (value) => {
      ctx.emit('update:modelValue', value)
    })
    return {
      fileConfig,
    }
  },
})
</script>

<style lang="scss">
@import '../style/authConfig.scss';
.file-config {
  .viewer-container {
    border: 1px solid #ddd;
    margin-top: 30px;
    width: 100%;
    height: 280px;
  }
}
</style>
