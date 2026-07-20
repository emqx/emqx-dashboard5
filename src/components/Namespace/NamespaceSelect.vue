<!-- Mainly used for table -->
<template>
  <el-select
    v-if="isMultiTenancyEnabled"
    v-model="namespace"
    clearable
    class="namespace-select"
    :placeholder="placeholder ?? t('BasicConfig.namespace')"
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
import useMultiTenancyEnabled from '@/hooks/Config/useMultiTenancyEnabled'
import { OptionList } from '@/types/common'

const props = withDefaults(
  defineProps<{
    modelValue?: string
    global?: {
      enable?: boolean
      value?: string
    }
    placeholder?: string
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
const isMultiTenancyEnabled = useMultiTenancyEnabled()
const { globalNamespaceOption, getNamespaceOptions: requestNamespaceOptions } =
  useManagedNamespaceOptions()

const store = useStore()
const isNamespaceUser = computed(() => store.getters.isNamespaceUser)
const currentUserNamespace = computed(() => store.getters.userNamespace)
const getNamespaceOptions = async () => {
  if (!isMultiTenancyEnabled.value) {
    return
  }
  try {
    const res = await requestNamespaceOptions()
    if (!isNamespaceUser.value) {
      namespaceOptions.value = [
        ...(props.global.enable ? [globalNamespaceOption] : []),
        ...res.map((i) => ({ label: i, value: i })),
      ]
    } else {
      namespaceOptions.value = res.reduce(
        (arr, item) => {
          if (item === currentUserNamespace.value) {
            arr.push({ label: item, value: item })
          }
          return arr
        },
        props.global.enable ? [globalNamespaceOption] : [],
      )
    }
  } catch (error) {
    //
  }
}

getNamespaceOptions()
</script>
