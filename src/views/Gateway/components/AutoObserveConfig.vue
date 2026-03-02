<template>
  <div class="flex items-center grow gap-7">
    <!-- Mode selection -->
    <el-radio-group
      v-model="mode"
      @change="handleModeChange($event as AutoObserveMode)"
      class="shrink-0"
    >
      <el-radio value="disabled">{{ tl('aObserveModeDisabled') }}</el-radio>
      <el-radio value="all">{{ tl('aObserveModeAll') }}</el-radio>
      <el-radio value="custom">{{ tl('aObserveModeCustom') }}</el-radio>
    </el-radio-group>
    <el-input-tag
      v-if="mode === 'custom'"
      v-model="arrayValue"
      :placeholder="tl('aObservePathPlaceholder')"
      class="grow"
      @change="handleArrayChange($event as string[])"
    />
  </div>
</template>

<script lang="ts" setup>
enum AutoObserveMode {
  Disabled = 'disabled',
  All = 'all',
  Custom = 'custom',
}

type AutoObserveValue = boolean | string | string[]

const props = defineProps<{
  modelValue?: AutoObserveValue
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: AutoObserveValue): void
}>()

const { t } = useI18n()

// Mode: disabled, all (observe all objects), custom (specify custom paths)
const mode = ref<AutoObserveMode>(AutoObserveMode.All)
const arrayValue = ref<string[]>([])

const updateModelValue = (value: AutoObserveValue) => {
  emit('update:modelValue', value)
}

// Initialize: determine mode and initial value based on the input value
const initializeValue = (value?: AutoObserveValue) => {
  if (value === undefined || value === null) {
    mode.value = AutoObserveMode.All
    return
  }

  if (typeof value === 'boolean') {
    mode.value = value ? AutoObserveMode.All : AutoObserveMode.Disabled
  } else if (Array.isArray(value)) {
    mode.value = AutoObserveMode.Custom
    arrayValue.value = value.length > 0 ? value : []
  } else if (typeof value === 'string') {
    // Handle string type (API supports it but dashboard doesn't directly support input)
    if (value === 'on') {
      mode.value = AutoObserveMode.All
      updateModelValue(true)
    } else if (value === 'off') {
      mode.value = AutoObserveMode.Disabled
      updateModelValue(false)
    } else {
      // Comma-separated path list, convert to array
      const paths = value
        .split(',')
        .map((p) => p.trim())
        .filter((p) => p.length > 0)
      mode.value = AutoObserveMode.Custom
      arrayValue.value = paths.length > 0 ? paths : []
      updateModelValue(arrayValue.value)
    }
  }
}

// Watch props changes
watch(
  () => props.modelValue,
  (newValue) => {
    initializeValue(newValue)
  },
  { immediate: true },
)

const handleModeChange = (newMode: AutoObserveMode) => {
  if (newMode === AutoObserveMode.Disabled) {
    updateModelValue(false)
  } else if (newMode === AutoObserveMode.All) {
    updateModelValue(true)
  } else {
    arrayValue.value = []
    updateModelValue([])
  }
}

// Array value change
const handleArrayChange = (values: string[]) => {
  emit('update:modelValue', values)
}

const tl = (key: string, collection = 'Gateway') => t(collection + '.' + key)
</script>
