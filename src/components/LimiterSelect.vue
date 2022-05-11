<template>
  <el-tree-select v-model="selected" :data="data" multiple @current-change="handleChange">
    <template #default="{ data: { label } }">
      {{ splitLabel(label) }}
    </template>
  </el-tree-select>
</template>

<script lang="ts">
import { defineComponent, PropType, watch } from 'vue'

export default defineComponent({
  name: 'LimiterSelect',
})
</script>

<script setup lang="ts">
import { ref, defineProps, defineEmits } from 'vue'
import { getLimiters } from '@/api/config'

interface DataItem {
  label: string
  value: string
  children?: DataItem[]
}

const props = defineProps({
  modelValue: {
    type: Object as PropType<Record<string, any>>,
  },
})

const emit = defineEmits(['update:modelValue'])

const selected = ref<string[]>([])
const currClickNode = ref({
  id: '',
  value: '',
})

watch(selected, (vals) => {
  // Only one of the same type can be selected
  vals.forEach((val) => {
    const [id, value] = val.split('/')
    if (currClickNode.value.id === id) {
      if (value !== currClickNode.value.value) {
        selected.value = selected.value.filter((select) => select !== `${id}/${value}`)
      }
    }
  })
  const limiter: Record<string, any> = {}
  selected.value.forEach((val) => {
    const [id, value] = val.split('/')
    limiter[id] = value
  })
  emit('update:modelValue', limiter)
})

const stopWatch = watch(
  () => props.modelValue,
  (val) => {
    if (val && Object.keys(val).length) {
      selected.value = Object.keys(val).map((key) => `${key}/${val[key]}`)
      stopWatch()
    }
  },
)

const splitLabel = (label: string) => {
  const labels = label.split('/')
  if (label.split('/').length === 1) {
    return label
  }
  return labels[1]
}

const data = ref<DataItem[]>([])

const factoryData = (data: Record<string, any>, parentKey?: string): DataItem[] => {
  const _data: DataItem[] = []
  Object.entries(data).forEach(([key, value]) => {
    const item: DataItem = {
      label: parentKey ? `${parentKey}/${key}` : key,
      value: parentKey ? `${parentKey}/${key}` : key,
    }
    if (value.bucket) {
      item.children = factoryData(value.bucket, key)
    }
    _data.push(item)
  })
  return _data
}

const getOpts = async () => {
  const res = await getLimiters()
  // Batch used in Retainer only
  delete res.batch
  data.value = factoryData(res)
}
getOpts()

const handleChange = (node: Record<string, any>) => {
  const [id, value] = node.value.split('/')
  if (value) {
    currClickNode.value = {
      id,
      value,
    }
  }
}
</script>
