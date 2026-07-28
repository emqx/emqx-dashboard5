<!-- Mainly used for table -->
<template>
  <el-select
    v-model="namespace"
    class="namespace-select"
    :clearable="clearable"
    :disabled="disabled"
    :loading="loading"
    :placeholder="placeholder ?? t('BasicConfig.namespace')"
    @change="handleChange"
  >
    <el-option
      v-for="{ label, value } in namespaceOptions"
      :key="value"
      :label="label"
      :value="value"
    />
  </el-select>
</template>

<script setup lang="ts">
import { OptionList } from '@/types/common'

const props = withDefaults(
  defineProps<{
    modelValue?: string
    global?: {
      enable?: boolean
      value?: string
    }
    placeholder?: string
    clearable?: boolean
    disabled?: boolean
  }>(),
  {
    global: () => ({ enable: true, value: undefined }),
    clearable: true,
    disabled: false,
  },
)
const emit = defineEmits<{
  (e: 'update:modelValue', val: string | undefined): void
  (e: 'change', val: string | undefined): void
  (e: 'loaded'): void
}>()

const toModelValue = (val: string | undefined) =>
  val === GLOBAL_NAMESPACE ? props.global.value : val

const namespace = computed({
  get() {
    if (props.global.enable && props.modelValue === props.global.value) {
      return GLOBAL_NAMESPACE
    }
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', toModelValue(val))
  },
})

const { t } = useI18n()
const loading = ref(false)
const namespaceOptions = ref<OptionList<string>>([])
const { globalNamespaceOption, getNamespaceOptions: requestNamespaceOptions } =
  useManagedNamespaceOptions()

const loadNamespaceOptions = async () => {
  loading.value = true
  try {
    const res = await requestNamespaceOptions()
    namespaceOptions.value = [
      ...(props.global.enable ? [globalNamespaceOption] : []),
      ...res.map((item) => ({ label: item, value: item })),
    ]
  } catch (error) {
    namespaceOptions.value = props.global.enable ? [globalNamespaceOption] : []
  } finally {
    loading.value = false
    emit('loaded')
  }
}

const handleChange = (val: string | undefined) => {
  emit('change', toModelValue(val))
}

loadNamespaceOptions()
</script>
