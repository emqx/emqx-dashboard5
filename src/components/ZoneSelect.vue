<template>
  <el-select v-model="selected">
    <el-option v-for="item in opts" :key="item" :label="item" :value="item" />
  </el-select>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ZoneSelect',
})
</script>

<script setup lang="ts">
import { ref, defineProps, defineEmits, WritableComputedRef, computed } from 'vue'
import { getZoneConfigs } from '@/api/config'
import { DEFAULT_ZONE } from '@/common/constants'

const props = defineProps({
  modelValue: {
    type: String,
  },
})
const emit = defineEmits(['update:modelValue'])

const selected: WritableComputedRef<string> = computed({
  get() {
    return props.modelValue || ''
  },
  set(val) {
    emit('update:modelValue', val)
  },
})

const opts = ref([DEFAULT_ZONE])

const getOpts = async () => {
  const data = await getZoneConfigs()
  const customZones = Object.keys(data)
  opts.value = opts.value.concat(customZones)
}

getOpts()
</script>
