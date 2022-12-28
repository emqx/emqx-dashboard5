<template>
  <div class="TLS-base-config">
    <div>
      <el-form-item :label="$t('Base.enableTLS')">
        <el-switch v-model="record.enable" />
      </el-form-item>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'TLSBaseConfig',
})
</script>

<script setup lang="ts">
import { defineProps, defineEmits, computed, PropType, WritableComputedRef } from 'vue'
import { SSL } from '@/types/common'

const props = defineProps({
  modelValue: {
    type: Object as PropType<SSL>,
    default: () => ({}),
  },
})

const emit = defineEmits(['update:modelValue'])

const record: WritableComputedRef<SSL> = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  },
})
</script>

<style lang="scss">
.TLS-base-config {
  margin-bottom: 20px;
  .TLS-base-config-title {
    margin-top: 0px;
    color: var(--color-title-primary);
    font-weight: bold;
    line-height: 20px;
  }
}
</style>
