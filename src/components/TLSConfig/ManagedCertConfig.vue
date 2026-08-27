<template>
  <div class="managed-cert-config flex-1">
    <div class="grid" :class="gridColsClass">
      <el-form-item v-if="isMultiTenancyEnabled" :label="t('BasicConfig.namespace')">
        <el-select
          v-model="namespace"
          filterable
          :disabled="!userNamespace"
          @change="handleNamespaceChanged"
        >
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
          <el-select v-model="record.bundle_name" filterable>
            <el-option
              v-for="item in bundleOptions"
              :key="item.name"
              :label="item.name"
              :value="item.name"
              :disabled="item.disabled"
            />
          </el-select>
          <el-button @click="createNewCertBundle">
            {{ t('Base.createManagedCerts') }}
          </el-button>
        </div>
      </el-form-item>
    </div>
    <div class="mb-4 info-container" v-if="record.bundle_name">
      <el-form-item>
        <p class="mb-2">{{ t('Base.certsInfo') }}</p>
      </el-form-item>
      <el-form-item>
        <div class="info-card">
          <CertBundleInfo :name="record.bundle_name" :namespace="selectedNamespace" />
        </div>
      </el-form-item>
    </div>
    <div class="grid" :class="gridColsClass" v-if="sni">
      <el-form-item label="SNI" class="sni-form-item">
        <el-input v-model="(record as ManagedCertsServer).sni" />
      </el-form-item>
    </div>
    <CreateCertBundleDrawer
      v-model="isCreateDrawerVisible"
      :namespace="selectedNamespace"
      :global-only="globalOnly || !userNamespace || !isMultiTenancyEnabled"
      @submit="handleSubmit"
    />
  </div>
</template>

<script setup lang="ts">
import { GLOBAL_NAMESPACE_VALUE, type NamespaceSelection } from '@/common/constants'
import CertBundleInfo from '@/components/TLSConfig/CertBundleInfo.vue'
import useMultiTenancyEnabled from '@/hooks/Config/useMultiTenancyEnabled'
import { OptionList } from '@/types/common'
import { ManagedCerts, ManagedCertsServer } from '@/types/typeAlias'
import CreateCertBundleDrawer from './CertBundleDrawer.vue'

const props = withDefaults(
  defineProps<{
    modelValue?: ManagedCerts | ManagedCertsServer
    columns?: number
    sni?: boolean
    /**
     * If undefined, it is global
     */
    userNamespace?: string
    /**
     * not data integration
     */
    globalOnly?: boolean
    /**
     * Current index in the managed certs array
     */
    currentIndex?: number
    /**
     * All managed certs in the array
     */
    allManagedCerts?: (ManagedCerts | ManagedCertsServer)[]
  }>(),
  {
    columns: 2,
    globalOnly: true,
  },
)
const emit = defineEmits<{
  (e: 'update:modelValue', v: ManagedCerts): void
}>()

const { t } = useI18n()
const isMultiTenancyEnabled = useMultiTenancyEnabled()
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
    if (!record.value.namespace) {
      return GLOBAL_NAMESPACE_VALUE
    }
    return record.value.namespace
  },
  set(val) {
    if (val === GLOBAL_NAMESPACE_VALUE) {
      delete record.value.namespace
    } else {
      record.value.namespace = val
    }
  },
})
const selectedNamespace = computed(() => {
  if (!isMultiTenancyEnabled.value || namespace.value === GLOBAL_NAMESPACE_VALUE) {
    return undefined
  }
  return namespace.value
})

const { globalNamespaceOption, getNamespaceOptions: requestNamespaceOptions } =
  useManagedNamespaceOptions()
const namespaceOptions = ref<OptionList<NamespaceSelection>>([globalNamespaceOption])

const getNamespaceOptions = async () => {
  namespaceOptions.value = [globalNamespaceOption]
  if (isMultiTenancyEnabled.value && props.userNamespace && !props.globalOnly) {
    const res = await requestNamespaceOptions()
    if (res.includes(props.userNamespace)) {
      namespaceOptions.value.push({ label: props.userNamespace, value: props.userNamespace })
    }
  }
}
getNamespaceOptions()

const bundleOptions = ref<Array<{ name: string; disabled: boolean }>>([])
const { getCertBundleList: requestCertBundleList } = useCertBundle()
const setOptionsDisabled = () => {
  // Mark bundle names that are already used by other managed certs as disabled
  if (props.allManagedCerts && props.currentIndex !== undefined) {
    const usedBundleNames = new Set<string>()
    props.allManagedCerts.forEach((cert, index) => {
      // Exclude current index and only add bundle names in the same namespace
      if (index !== props.currentIndex && cert.bundle_name) {
        const certNamespace = cert.namespace || GLOBAL_NAMESPACE_VALUE
        const currentNamespace = namespace.value || GLOBAL_NAMESPACE_VALUE
        if (certNamespace === currentNamespace) {
          usedBundleNames.add(cert.bundle_name)
        }
      }
    })
    bundleOptions.value.forEach((item) => {
      item.disabled = usedBundleNames.has(item.name)
    })
  } else {
    bundleOptions.value.forEach((item) => {
      item.disabled = false
    })
  }
}
const getBundleOptions = async () => {
  const res = await requestCertBundleList(selectedNamespace.value)
  bundleOptions.value = res.reduce((arr: { name: string; disabled: boolean }[], { name }) => {
    if (name) {
      arr.push({ name, disabled: false })
    }
    return arr
  }, [])
  setOptionsDisabled()
}
getBundleOptions()

const handleNamespaceChanged = () => {
  if (record.value.bundle_name) {
    record.value.bundle_name = ''
  }
  getBundleOptions()
}

// Watch for changes in other managed certs to update available options
watch(
  () => props.allManagedCerts,
  () => {
    setOptionsDisabled()
  },
  { deep: true },
)

const isCreateDrawerVisible = ref(false)
const createNewCertBundle = () => {
  isCreateDrawerVisible.value = true
}
const handleSubmit = ({ namespace: ns, bundle_name: name }: ManagedCerts) => {
  const newNs = ns ?? GLOBAL_NAMESPACE_VALUE
  if (newNs !== namespace.value) {
    namespace.value = newNs
  }
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
    padding: 12px 24px 16px;
    border-radius: var(--border-radius-card);
    background-color: var(--color-bg-split);
    .el-card__body {
      padding-top: 12px;
      padding-bottom: 8px;
    }
  }
  .info-container {
    .el-form-item {
      padding: 0;
      margin: 0;
    }
    .info-card {
      flex-grow: 1;
    }
    .el-form-item__content {
      line-height: 1.5;
    }
  }
  .el-form-item {
    .el-input {
      width: 100%;
    }
  }
  .grid-cols-2 + .grid-cols-2 {
    margin-top: 18px;
  }
}
</style>
