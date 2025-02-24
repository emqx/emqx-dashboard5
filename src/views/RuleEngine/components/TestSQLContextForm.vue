<template>
  <div class="test-sql-context-form">
    <el-form label-position="top">
      <el-row v-if="Object.keys(record).length > 0" :gutter="26">
        <el-col v-for="key in Object.keys(record)" :key="key" :span="key !== 'payload' ? 12 : 24">
          <el-form-item
            :class="{ 'code-sql': key === 'payload', payload: key === 'payload' }"
            v-bind="{ label: $t(`Clients.${key}`), prop: `${key}` }"
          >
            <el-input v-if="key !== 'payload'" v-model="record[key]" />
            <template v-else>
              <div class="monaco-container" :style="{ height: `${payloadEditorHeight}px` }">
                <Monaco
                  :id="createRandomString()"
                  v-model="record.payload"
                  class="payload"
                  :lang="payloadType"
                />
              </div>
              <div class="payload-type">
                <el-radio-group v-model="payloadType">
                  <el-radio :value="PayloadType.JSON">JSON</el-radio>
                  <el-radio :value="PayloadType.Plaintext">Plaintext</el-radio>
                </el-radio-group>
              </div>
              <StretchHeight v-model="payloadEditorHeight" class="payload" />
            </template>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script lang="ts">
export default defineComponent({
  name: 'TestSQLContextForm',
})
</script>

<script setup lang="ts">
import { isJSONString, stringifyObjSafely } from '@emqx/shared-ui-utils'
import StretchHeight from './StretchHeight.vue'
import { createRandomString } from '@/common/tools'

enum PayloadType {
  JSON = 'json',
  Plaintext = 'plaintext',
}

const props = defineProps({
  modelValue: {
    type: Object as PropType<Record<string, string>>,
    required: true,
  },
})

const emit = defineEmits(['update:modelValue'])

const payloadType = ref(PayloadType.JSON)
const payloadEditorHeight = ref(200)

const record = ref<{ [key: string]: string }>(props.modelValue)

let previousModelValue: Record<string, string> | undefined = undefined
watch(
  () => props.modelValue,
  (val) => {
    if (isEqual(previousModelValue, val)) {
      return
    }
    if (val) {
      record.value = Object.entries(val).reduce((acc: Record<string, string>, [key, value]) => {
        acc[key] = typeof value === 'object' ? stringifyObjSafely(value) : value
        return acc
      }, {})
    }
  },
)

watch(
  record,
  (val) => {
    const data = { ...val }
    if (data.details && isJSONString(data.details)) {
      data.details = JSON.parse(data.details)
    }
    previousModelValue = { ...data }
    emit('update:modelValue', data)
  },
  { deep: true },
)
</script>

<style lang="scss" scoped>
.el-form-item {
  margin-top: 12px;
}
.payload-type {
  box-sizing: border-box;
  width: 100%;
  padding: 2px 12px;
  background: var(--color-bg-content);
  border: 1px solid var(--color-border-primary);
  border-top: none;
  text-align: right;
  line-height: 1;
  .el-radio__label {
    font-size: 13px;
  }
}
</style>
