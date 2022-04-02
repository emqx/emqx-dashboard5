<template>
  <div class="file-config config">
    <div class="create-form-title">ACL File</div>
    <el-form
      class="create-form"
      ref="formCom"
      :rules="rules"
      :model="fileConfig"
      label-position="top"
    >
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item>
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
import { defineComponent, reactive, watch, ref } from 'vue'
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

    const fromCom = ref()
    const rules = {}
    const validate = () => Promise.resolve(true)

    watch(fileConfig, (value) => {
      ctx.emit('update:modelValue', value)
    })

    return {
      fileConfig,
      fromCom,
      rules,
      validate,
    }
  },
})
</script>

<style lang="scss">
@import '../style/authConfig.scss';
</style>
