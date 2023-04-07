<template>
  <div class="one-of" v-if="oneOfInfo.valueDisabled !== undefined && oneOfInfo.propEnabled">
    <div class="switch-container">
      <el-switch v-model="switchProxy" :inactive-value="(oneOfInfo.valueDisabled as string)" />
      <span class="tip" v-if="valueProxy === oneOfInfo.valueDisabled">{{ valueProxy }}</span>
    </div>
    <div class="oneof-item" v-if="valueProxy !== oneOfInfo.valueDisabled">
      <el-input
        v-model="valueProxy"
        v-if="oneOfInfo.propEnabled.type === 'string'"
        :disabled="disabled"
        clearable
      />
      <el-input-number
        v-else-if="oneOfInfo.propEnabled.type === 'number'"
        v-model="valueProxy"
        controls-position="right"
        :min="0"
        :disabled="disabled"
        clearable
      />
      <el-select
        v-model="valueProxy"
        v-else-if="oneOfInfo.propEnabled.type === 'enum'"
        :disabled="disabled"
        clearable
      >
        <el-option
          v-for="opt in oneOfInfo.propEnabled.symbols"
          :value="opt"
          :label="opt"
          :key="opt"
        />
      </el-select>
      <time-input-with-unit-select
        v-model="valueProxy"
        v-else-if="oneOfInfo.propEnabled.type === 'duration'"
        :disabled="disabled"
      />
      <input-with-unit
        v-else-if="oneOfInfo.propEnabled.type === 'byteSize'"
        v-model="valueProxy"
        :disabled="disabled"
        :units="['MB', 'GB', 'KB']"
      />
      <el-input
        v-model="valueProxy"
        v-else-if="oneOfInfo.propEnabled.type === 'ip_port'"
        :disabled="disabled"
        clearable
      />
      <el-input
        v-else-if="oneOfInfo.propEnabled.type === 'object'"
        type="textarea"
        v-model="valueProxy"
        :disabled="disabled"
        clearable
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Properties, Property } from '@/types/schemaForm'
import { defineProps, PropType, computed, defineEmits, WritableComputedRef } from 'vue'
import TimeInputWithUnitSelect from './TimeInputWithUnitSelect.vue'
import InputWithUnit from './InputWithUnit.vue'

const props = defineProps({
  modelValue: {
    type: [String, Number, Object] as PropType<string | number | Record<string, any> | undefined>,
    required: true,
  },
  items: {
    type: Array as PropType<Properties[string][]>,
    required: true,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue'])

const oneOfInfo = computed(() => {
  if (!Array.isArray(props.items) || props.items.length !== 2) {
    return { propEnabled: undefined, valueDisabled: undefined }
  }
  let valueDisabled: unknown
  let propEnabled: undefined | Property
  props.items.forEach((item) => {
    if (item.type === 'enum' && item.symbols?.length === 1) {
      valueDisabled = item.symbols[0] as string
    } else {
      propEnabled = item
    }
  })
  return valueDisabled && propEnabled
    ? { valueDisabled, propEnabled }
    : { propEnabled: undefined, valueDisabled: undefined }
})

const switchProxy: WritableComputedRef<string | boolean> = computed({
  get() {
    return valueProxy.value === oneOfInfo.value.valueDisabled
      ? (oneOfInfo.value.valueDisabled as string)
      : true
  },
  set(val: string | boolean) {
    valueProxy.value =
      val === oneOfInfo.value.valueDisabled ? oneOfInfo.value.valueDisabled : undefined
  },
})

const valueProxy: WritableComputedRef<any> = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    const { valueDisabled, propEnabled } = oneOfInfo.value
    if (valueDisabled !== undefined) {
      const value = val === valueDisabled ? valueDisabled : val ?? propEnabled?.default
      emit('update:modelValue', value)
    } else {
      emit('update:modelValue', val)
    }
  },
})
</script>

<style lang="scss">
.one-of {
  .oneof-item {
    margin-top: 12px;
  }
  .tip {
    margin-left: 12px;
    color: var(--color-text-secondary);
    opacity: 0.5;
  }
}
</style>
