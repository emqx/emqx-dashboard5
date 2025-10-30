<template>
  <div class="managed-cert-config">
    <div class="grid gap-5 mb-4" :class="`grid-cols-${columns}`">
      <div>
        <el-select
          v-model="namespace"
          :placeholder="t('BasicConfig.namespace')"
          @change="handleNamespaceChanged"
        >
          <el-option
            v-for="{ value, label } in namespaceOptions"
            :key="label"
            :label="label"
            :value="value"
          />
        </el-select>
      </div>
      <div class="flex items-center gap-2">
        <el-select v-model="record.bundle_name">
          <el-option v-for="item in bundleOptions" :key="item" :label="item" :value="item" />
        </el-select>
        <el-button @click="createNewCertBundle">
          {{ t('Base.createManagedCerts') }}
        </el-button>
      </div>
    </div>
    <CertBundleInfo
      v-if="record.bundle_name"
      :name="record.bundle_name"
      :namespace="selectedNamespace"
    />
    <CreateCertBundleDrawer
      v-model="isCreateDrawerVisible"
      :namespace="selectedNamespace"
      @submit="handleSubmit"
    />
  </div>
</template>

<script setup lang="ts">
import CertBundleInfo from '@/components/TLSConfig/CertBundleInfo.vue'
import { OptionList } from '@/types/common'
import { ManagedCerts } from '@/types/typeAlias'
import CreateCertBundleDrawer from './CreateCertBundleDrawer.vue'

const props = withDefaults(
  defineProps<{
    modelValue?: ManagedCerts
    columns?: number
  }>(),
  {
    columns: 2,
  },
)
const emit = defineEmits<{
  (e: 'update:modelValue', v: ManagedCerts): void
}>()

const { t } = useI18n()

const record = computed<ManagedCerts>({
  get() {
    return props.modelValue ?? { bundle_name: '' }
  },
  set(val) {
    emit('update:modelValue', val)
  },
})

const namespace = computed({
  get() {
    if (!record.value.namespace) {
      return GLOBAL_NAMESPACE
    }
    return record.value.namespace
  },
  set(val) {
    if (val === GLOBAL_NAMESPACE) {
      record.value = { bundle_name: record.value.bundle_name }
    } else {
      record.value.namespace = val
    }
  },
})
const selectedNamespace = computed(() =>
  namespace.value === GLOBAL_NAMESPACE ? undefined : namespace.value,
)
const namespaceOptions = ref<OptionList<string>>([])

const { globalNamespaceOption, getNamespaceOptions: requestNamespaceOptions } =
  useManagedNamespaceOptions()
const getNamespaceOptions = async () => {
  const res = await requestNamespaceOptions()
  namespaceOptions.value = [globalNamespaceOption, ...res.map((i) => ({ label: i, value: i }))]
}
getNamespaceOptions()

const bundleOptions = ref<string[]>([])
const { getCertBundleList: requestCertBundleList } = useCertBundle()
const getBundleOptions = async () => {
  const res = await requestCertBundleList(selectedNamespace.value)
  bundleOptions.value = res.reduce((arr: string[], { name }) => {
    if (name) {
      arr.push(name)
    }
    return arr
  }, [])
}
getBundleOptions()

const handleNamespaceChanged = () => {
  if (record.value.bundle_name) {
    record.value.bundle_name = ''
  }
  getBundleOptions()
}

const isCreateDrawerVisible = ref(false)
const createNewCertBundle = () => {
  isCreateDrawerVisible.value = true
}
const handleSubmit = ({ namespace: ns, bundle_name: name }: ManagedCerts) => {
  namespace.value = ns ?? GLOBAL_NAMESPACE
  record.value.bundle_name = name
  getBundleOptions()
}
</script>
