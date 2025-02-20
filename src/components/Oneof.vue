<!-- ❗️If the form currently using the oneof component contains form validation 
  and the current field is a required field, please directly place the oneof 
  component in the form item component or bind to the formItem property. 

  Different from src/components/OneofRefs.vue, this components handles simple oneof
  - item of oneof is not an object
  - there are only two options for oneof
-->
<template>
  <div
    class="one-of"
    :class="{ 'in-row': inRow }"
    v-if="oneOfInfo.valueDisabled !== undefined && oneOfInfo.propEnabled"
  >
    <div class="switch-container">
      <el-switch
        v-model="switchProxy"
        :inactive-value="oneOfInfo.valueDisabled as string"
        :disabled="disabled"
      />
      <span class="tip" v-if="valueProxy === oneOfInfo.valueDisabled">
        {{ disabledLabel || valueProxy }}
      </span>
    </div>
    <div class="oneof-item" v-if="valueProxy !== oneOfInfo.valueDisabled">
      <el-input
        v-model="valueProxy"
        v-if="oneOfInfo.propEnabled.type === 'string'"
        :disabled="disabled"
        clearable
      />
      <CustomInputNumber
        v-else-if="oneOfInfo.propEnabled.type === 'number'"
        v-model="valueProxy"
        :disabled="disabled"
        clearable
        :min="oneOfInfo.propEnabled.minimum ?? Number.NEGATIVE_INFINITY"
        :max="oneOfInfo.propEnabled.maximum ?? Number.POSITIVE_INFINITY"
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
        default-unit="s"
        v-bind="inputProps"
      />
      <input-with-unit
        v-else-if="oneOfInfo.propEnabled.type === 'byteSize'"
        v-model="valueProxy"
        :disabled="disabled"
        :units="['MB', 'GB', 'KB', 'B']"
      />
      <input-with-unit
        v-else-if="oneOfInfo.propEnabled.type === 'rate'"
        v-model="valueProxy"
        :disabled="disabled"
        :units="oneOfInfo.propEnabled.units ?? [{ label: `/${$t('Base.second')}`, value: '/s' }]"
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
import { ElFormItem } from 'element-plus'
import CustomInputNumber from './CustomInputNumber.vue'
import InputWithUnit from './InputWithUnit.vue'
import TimeInputWithUnitSelect from './TimeInputWithUnitSelect.vue'

const props = defineProps({
  modelValue: {
    type: [String, Number, Object, Boolean] as PropType<
      string | number | Record<string, any> | undefined | boolean
    >,
  },
  items: {
    type: Array as PropType<Properties[string][] | Array<{ [key: string]: any }>>,
    required: true,
    default: () => [],
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  disabledLabel: {
    type: String,
  },
  formItem: {
    type: Object as PropType<typeof ElFormItem>,
  },
  inRow: {
    type: Boolean,
  },
  /**
   * When enable, the props of the form input component
   */
  inputProps: {
    type: Object,
    default: () => ({}),
  },
})

const emit = defineEmits(['update:modelValue'])

const oneOfInfo: ComputedRef<{ valueDisabled: any; propEnabled: any }> = computed(() => {
  if (!Array.isArray(props.items) || props.items.length !== 2) {
    return { propEnabled: undefined, valueDisabled: undefined }
  }
  let valueDisabled: unknown = undefined
  let propEnabled: undefined | Property = undefined
  props.items.forEach((item) => {
    if (item.type === 'enum' && item.symbols?.length === 1) {
      valueDisabled = item.symbols[0] as string
    } else {
      propEnabled = item as Properties[string]
    }
  })
  return valueDisabled !== undefined && propEnabled !== undefined
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
    const { propEnabled } = oneOfInfo.value
    if (val === oneOfInfo.value.valueDisabled) {
      valueProxy.value = oneOfInfo.value.valueDisabled
    } else {
      valueProxy.value = propEnabled?.type === 'number' ? undefined : ''
    }
  },
})

const valueProxy: WritableComputedRef<any> = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    const { valueDisabled, propEnabled } = oneOfInfo.value
    if (valueDisabled !== undefined) {
      const value = val === valueDisabled ? valueDisabled : (val ?? propEnabled?.default)
      emit('update:modelValue', value)
    } else {
      emit('update:modelValue', val)
    }
  },
})

const isDisabled = computed(() => {
  const { valueDisabled } = oneOfInfo.value
  return valueDisabled !== undefined && valueProxy.value === valueDisabled
})
const currentIns = getCurrentInstance()
/**
 * Hack for prevent the input from turning red due to triggering
 * form validation after setting modelValue to null following enable.
 */
watch(isDisabled, async (val) => {
  const formItem = props.formItem || currentIns?.parent?.exposed
  if (isFunction(formItem?.clearValidate)) {
    await nextTick()
    if (!val) {
      // Waiting for the form input box to render
      // field expired interval in session conf
      await nextTick()
    }
    formItem?.clearValidate()
  }
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

  &.in-one-row {
    display: flex;
    width: 100%;

    .switch-container {
      flex-shrink: 0;
      margin-right: 12px;
    }

    .oneof-item {
      flex-grow: 1;
      margin-top: 0;
    }
  }
  &.in-row {
    display: flex;
    width: 100%;

    .switch-container {
      flex-shrink: 0;
      margin-right: 12px;
    }

    .oneof-item {
      flex-grow: 1;
      margin-top: 0;
    }
  }
}
</style>
