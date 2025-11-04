<template>
  <div class="managed-cert-config flex-1">
    <div class="grid" :class="gridColsClass">
      <el-form-item :label="t('BasicConfig.namespace')">
        <el-select v-model="namespace" @change="handleNamespaceChanged">
          <el-option
            v-for="{ value, label } in namespaceOptions"
            :key="label"
            :label="label"
            :value="value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="t('Base.managedCertBundleName')">
        <div class="flex items-center gap-2 flex-1">
          <el-select v-model="record.bundle_name">
            <el-option v-for="item in bundleOptions" :key="item" :label="item" :value="item" />
          </el-select>
          <el-button @click="createNewCertBundle">
            {{ t('Base.createManagedCerts') }}
          </el-button>
        </div>
      </el-form-item>
    </div>
    <div class="mb-4 info-container" v-if="record.bundle_name">
      <p class="mb-2">{{ t('Base.certsInfo') }}</p>
      <div class="info-card">
        <CertBundleInfo :name="record.bundle_name" :namespace="selectedNamespace" />
      </div>
    </div>
    <div class="grid" :class="gridColsClass" v-if="sni">
      <el-form-item label="SNI" class="sni-form-item">
        <el-input v-model="(record as ManagedCertsServer).sni" />
      </el-form-item>
    </div>
    <CreateCertBundleDrawer
      v-model="isCreateDrawerVisible"
      :namespace="selectedNamespace"
      :require-namespace="requireNamespace"
      @submit="handleSubmit"
    />
  </div>
</template>

<script setup lang="ts">
import CertBundleInfo from '@/components/TLSConfig/CertBundleInfo.vue'
import { OptionList } from '@/types/common'
import { ManagedCerts, ManagedCertsServer } from '@/types/typeAlias'
import CreateCertBundleDrawer from './CertBundleDrawer.vue'

const props = withDefaults(
  defineProps<{
    modelValue?: ManagedCerts | ManagedCertsServer
    requireNamespace?: boolean
    columns?: number
    sni?: boolean
  }>(),
  {
    columns: 2,
  },
)
const emit = defineEmits<{
  (e: 'update:modelValue', v: ManagedCerts): void
}>()

const { t } = useI18n()
const { createEmptyManagedCertConf } = useManagedCertConf()
const record = computed<ManagedCerts>({
  get() {
    return props.modelValue ?? createEmptyManagedCertConf()
  },
  set(val) {
    emit('update:modelValue', val)
  },
})

const namespace = computed({
  get() {
    if (!record.value.namespace && !props.requireNamespace) {
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

const { globalNamespaceOption, getNamespaceOptions: requestNamespaceOptions } =
  useManagedNamespaceOptions()
const namespaceOptions = ref<OptionList<string>>([globalNamespaceOption])

const getNamespaceOptions = async () => {
  const res = await requestNamespaceOptions()
  namespaceOptions.value = [
    ...(props.requireNamespace ? [] : [globalNamespaceOption]),
    ...res.map((i) => ({ label: i, value: i })),
  ]
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

const gridColsClass = computed(() => {
  const classMap: Record<number, string> = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
  }
  const gridClass = classMap[props.columns] || 'grid-cols-2'
  const gapClass = props.columns > 1 ? 'gap-5' : ''
  return `${gridClass} ${gapClass}`
})
</script>

<style lang="scss">
.managed-cert-config {
  .info-card {
    padding: 12px 24px 8px;
    border-radius: var(--border-radius-card);
    background-color: var(--color-bg-split);
    .el-card__body {
      padding-top: 12px;
      padding-bottom: 8px;
    }
  }
  .el-form-item {
    .el-input {
      width: 100%;
    }
  }
  .grid-cols-2 {
    .el-form-item:nth-child(n + 3) {
      margin-top: 18px;
    }
  }
}
</style>
