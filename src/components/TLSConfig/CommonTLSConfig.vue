<template>
  <div class="common-tls-config">
    <TLSBaseConfig v-model="record" />
    <el-collapse-transition>
      <template v-if="record.enable">
        <TLSEnableConfig v-model="record" :is-edit="isEdit" />
      </template>
    </el-collapse-transition>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'CommonTLSConfig',
})
</script>

<script setup lang="ts">
import { defineProps, defineEmits, computed, PropType, WritableComputedRef } from 'vue'
import TLSBaseConfig from './TLSBaseConfig.vue'
import TLSEnableConfig from './TLSEnableConfig.vue'
import { SSL } from '@/types/common'

const props = defineProps({
  modelValue: {
    type: Object as PropType<SSL>,
    default: () => ({}),
  },
  /**
   * influence the interaction of TLSEnableConfig
   */
  isEdit: {
    type: Boolean,
    default: false,
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
.TLS-enable-config {
  margin-bottom: 12px;
  .TLS-enable-config-title {
    margin-top: 0;
    margin-bottom: 8px;
    color: var(--color-title-primary);
    font-weight: bold;
    line-height: 20px;
  }
  .TLS-input {
    width: 60%;
  }
}
</style>
