<template>
  <div>
    <TLSBaseConfig v-model="record" />
    <el-collapse-transition>
      <TLSEnableConfig v-model="record" v-if="record.enable" />
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
