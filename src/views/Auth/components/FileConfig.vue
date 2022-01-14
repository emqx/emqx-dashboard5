<template>
  <div class="built-in-config config">
    <div class="create-form-title">File-ACL</div>
    <el-form class="create-form" label-position="top">
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item :label="$t('components.rules')">
            <el-input v-model="fileConfig.rules" type="textarea" :rows="6"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { defineComponent, reactive, watch } from 'vue'

export default defineComponent({
  name: 'FileConfig',

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
</style>
