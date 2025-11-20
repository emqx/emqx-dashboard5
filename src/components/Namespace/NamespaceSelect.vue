<!-- Mainly used for table -->
<template>
  <el-select
    v-model="namespace"
    clearable
    class="namespace-select"
    :placeholder="t('BasicConfig.namespace')"
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
  }>(),
  {
    global: () => ({ enable: true, value: undefined }),
  },
)
const emit = defineEmits<{
  (e: 'update:modelValue', val: string | undefined): void
  (e: 'loaded'): void
}>()

const namespace = computed({
  get() {
    if (props.global.enable && props.modelValue === props.global.value) {
      return GLOBAL_NAMESPACE
    }
    return props.modelValue
  },
  set(val) {
    if (val === GLOBAL_NAMESPACE) {
      emit('update:modelValue', props.global.value)
    } else {
      emit('update:modelValue', val)
    }
  },
})

const { t } = useI18n()

const namespaceOptions = ref<OptionList<string>>([])
const { globalNamespaceOption, getNamespaceOptions: requestNamespaceOptions } =
  useManagedNamespaceOptions()

const getNamespaceOptions = async () => {
  try {
    const res = await requestNamespaceOptions()
    namespaceOptions.value = [
      ...(props.global.enable ? [globalNamespaceOption] : []),
      ...res.map((i) => ({ label: i, value: i })),
    ]
  } catch (error) {
    //
  }
}

getNamespaceOptions()
</script>
