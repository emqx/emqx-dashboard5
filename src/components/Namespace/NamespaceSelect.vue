<!-- Mainly used for table -->
<template>
  <el-select
    v-if="isMultiTenancyEnabled"
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
import { GLOBAL_NAMESPACE_VALUE, type NamespaceSelection } from '@/common/constants'
import useMultiTenancyEnabled from '@/hooks/Config/useMultiTenancyEnabled'
import { OptionList } from '@/types/common'

const props = withDefaults(
  defineProps<{
    modelValue?: NamespaceSelection
    global?: {
      enable?: boolean
      value?: NamespaceSelection
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
  (e: 'update:modelValue', val: NamespaceSelection | undefined): void
  (e: 'change', val: NamespaceSelection | undefined): void
  (e: 'loaded'): void
}>()

const toModelValue = (val: NamespaceSelection | undefined) =>
  val === GLOBAL_NAMESPACE_VALUE ? props.global.value : val

const namespace = computed({
  get() {
    if (props.global.enable && props.modelValue === props.global.value) {
      return GLOBAL_NAMESPACE_VALUE
    }
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', toModelValue(val))
  },
})

const { t } = useI18n()
const loading = ref(false)
const namespaceOptions = ref<OptionList<NamespaceSelection>>([])
const isMultiTenancyEnabled = useMultiTenancyEnabled()
const { globalNamespaceOption, getNamespaceOptions: requestNamespaceOptions } =
  useManagedNamespaceOptions()

const loadNamespaceOptions = async () => {
  if (!isMultiTenancyEnabled.value) {
    emit('loaded')
    return
  }
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

const handleChange = (val: NamespaceSelection | undefined) => {
  emit('change', toModelValue(val))
}

loadNamespaceOptions()
</script>
