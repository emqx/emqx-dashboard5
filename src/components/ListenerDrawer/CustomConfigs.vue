<template>
  <el-form-item class="custom-configs" :label="tl('customConfig')">
    <p class="desc-tips">{{ tl('customConfigDescription') }}</p>
    <el-input
      type="textarea"
      v-model="rawListener"
      :rows="12"
      :placeholder="defaultPlaceHolder"
      @blur="resetRawData"
    />
  </el-form-item>
</template>

<script lang="ts" setup>
import { PropType, defineEmits, defineProps, ref, watch } from 'vue'
import useI18nTl from '@/hooks/useI18nTl'
import { Listener } from '@/types/listener'
import { unexposedConfigs } from '@/common/constants'
import { ElMessage } from 'element-plus'

const { tl } = useI18nTl('Gateway')

const props = defineProps({
  modelValue: {
    type: Object as PropType<Listener>,
    required: true,
  },
  type: {
    type: String as PropType<'ssl' | 'tcp' | 'ws' | 'wss'>,
    required: true,
  },
})

const emits = defineEmits(['update:modelValue'])

const rawListener = ref(objectToString(props.modelValue))

watch(
  () => props.type,
  (val) => {
    setDefaultPlaceHolder(val)
  },
)

watch(
  () => props.modelValue,
  (val) => {
    rawListener.value = objectToString(val)
  },
)

const defaultPlaceHolder = ref('')

/**
 * Converts an object to a string representation.
 *
 * @param {Record<string, any>} obj - The object to convert.
 * @param {string} [parentKey=''] - The parent key for nested objects.
 * @returns {string} The string representation of the object.
 */
function objectToString(obj: Record<string, any>, parentKey = '') {
  let str = ''
  Object.keys(obj).forEach((key) => {
    const value = obj[key]
    const newKey = parentKey ? `${parentKey}.${key}` : key
    if (typeof value === 'object' && !Array.isArray(value)) {
      str += objectToString(value, newKey)
    } else {
      if (Array.isArray(value)) {
        str += `${newKey}: ${value.join(', ')}\n`
      } else {
        str += `${newKey}: ${value}\n`
      }
    }
  })
  return str
}

type NestedObject = {
  [key: string]: string | number | boolean | NestedObject | string[]
}
function parseValue(value: string): string | number | boolean | string[] {
  if (value === 'true') return true
  if (value === 'false') return false
  if (!isNaN(Number(value))) return Number(value)
  if (value.includes(', ')) return value.split(', ').map((v) => v.trim())
  return value
}
/**
 * Converts a string to a nested object based on a specific format.
 * Each line in the string should follow the format 'key: value'.
 * Nested keys can be specified using dot notation.
 *
 * @param {string} str - The string to convert to a nested object.
 * @returns {NestedObject} - The resulting nested object.
 * @throws {Error} - If the string has an invalid format or nesting conflicts occur.
 */
function stringToObject(str: string): NestedObject {
  const result: NestedObject = {}
  const lines = str.split('\n').filter((line) => line.trim() !== '')
  lines.forEach((line) => {
    const parts = line.split(/:(.+)/).map((part) => part.trim())
    if (parts.length < 2 || !parts[0] || !parts[1]) {
      throw new Error(`Invalid format for line: "${line}". Expected 'key: value'.`)
    }
    const [rawKey, value] = parts
    const keys = rawKey.split('.')
    let current: Record<string, NestedObject | string | number | boolean | string[]> = result
    keys.forEach((key, index) => {
      if (index === keys.length - 1) {
        current[key] = parseValue(value)
      } else {
        if (!(key in current)) {
          current[key] = {}
        }
        if (typeof current[key] !== 'object' || Array.isArray(current[key])) {
          throw new Error(`Path conflict or invalid nesting for key: "${rawKey}".`)
        }
        current = current[key] as NestedObject
      }
    })
  })
  return result
}

function setDefaultPlaceHolder(type: 'ssl' | 'tcp' | 'ws' | 'wss') {
  defaultPlaceHolder.value = objectToString(unexposedConfigs[type])
}
setDefaultPlaceHolder(props.type)

function resetRawData() {
  try {
    const parsed = stringToObject(rawListener.value)
    emits('update:modelValue', parsed)
  } catch (error) {
    const err = error as Error
    ElMessage.error(err.toString())
  }
}
</script>

<style lang="scss">
.custom-configs {
  p.desc-tips {
    margin-top: 0;
  }
}
</style>
