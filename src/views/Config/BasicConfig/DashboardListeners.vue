<template>
  <div class="dashboard-listeners app-wrapper with-padding-top">
    <el-card class="app-card allow-overflow">
      <el-skeleton v-if="configLoading" :rows="8" animated />
      <template v-else>
        <el-alert class="mb-4" type="info" :closable="false" show-icon>
          <template #title>{{ tl('editTip') }}</template>
        </el-alert>
        <el-alert class="mb-6" type="info" :closable="false" show-icon>
          <template #title>
            <i18n-t keypath="DashboardListener.acmeTip" tag="span">
              <template #link>
                <a :href="docMap.acmePlugin" target="_blank" rel="noopener noreferrer">
                  {{ tl('acmePlugin') }}
                </a>
              </template>
            </i18n-t>
          </template>
        </el-alert>

        <el-form
          ref="formRef"
          class="configuration-form"
          label-position="top"
          :model="formData"
          :rules="rules"
        >
          <el-row :gutter="24">
            <el-col :xs="24" :sm="24" :md="12">
              <el-card class="listener-card" shadow="never">
                <template #header>
                  <div class="listener-card-header">
                    <span>{{ tl('http') }}</span>
                    <el-tag v-if="isCurrentProtocol('http')" type="info" effect="plain">
                      {{ tl('currentConnection') }}
                    </el-tag>
                  </div>
                </template>

                <el-form-item :label="tl('enable')" prop="http.enable">
                  <el-switch
                    v-model="formData.http.enable"
                    :disabled="isCurrentProtocol('http')"
                    :before-change="() => beforeListenerToggle('http')"
                  />
                </el-form-item>
                <el-form-item :label="tl('bind')" prop="http.bind">
                  <el-input
                    v-model.trim="formData.http.bind"
                    :disabled="isCurrentProtocol('http') || !formData.http.enable"
                    :placeholder="tl('bindPlaceholder')"
                  />
                </el-form-item>
              </el-card>
            </el-col>

            <el-col :xs="24" :sm="24" :md="12">
              <el-card class="listener-card" shadow="never">
                <template #header>
                  <div class="listener-card-header">
                    <span>{{ tl('https') }}</span>
                    <el-tag v-if="isCurrentProtocol('https')" type="info" effect="plain">
                      {{ tl('currentConnection') }}
                    </el-tag>
                  </div>
                </template>

                <el-form-item :label="tl('enable')" prop="https.enable">
                  <el-switch
                    v-model="formData.https.enable"
                    :disabled="isCurrentProtocol('https')"
                    :before-change="() => beforeListenerToggle('https')"
                  />
                </el-form-item>
                <el-form-item :label="tl('bind')" prop="https.bind">
                  <el-input
                    v-model.trim="formData.https.bind"
                    :disabled="isCurrentProtocol('https') || !formData.https.enable"
                    :placeholder="tl('bindPlaceholder')"
                  />
                </el-form-item>
                <el-form-item :label="tl('certificateBundle')" prop="https.bundleName">
                  <el-select
                    v-model="formData.https.bundleName"
                    filterable
                    :loading="bundleLoading"
                    :disabled="isCurrentProtocol('https') || !formData.https.enable"
                    :placeholder="tl('certificateBundlePlaceholder')"
                  >
                    <el-option
                      v-for="bundle in bundleOptions"
                      :key="bundle"
                      :label="bundle"
                      :value="bundle"
                    />
                  </el-select>
                </el-form-item>
              </el-card>
            </el-col>
          </el-row>

          <div class="form-actions">
            <el-button
              type="primary"
              :loading="saveLoading"
              :disabled="!hasChanges || !$hasPermission('put')"
              @click="saveChanges"
            >
              {{ t('Base.saveChanges') }}
            </el-button>
          </div>
        </el-form>
      </template>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { getDashboardConfigs, updateDashboardConfigs } from '@/api/config'
import type { Dashboard, DashboardManagedCerts } from '@/types/config'
import type { FormInstance, FormItemRule, FormRules } from 'element-plus'

type DashboardProtocol = 'http' | 'https'

interface ListenerForm {
  enable: boolean
  bind: string
}

interface DashboardListenersForm {
  http: ListenerForm
  https: ListenerForm & {
    bundleName: string
  }
}

const createDefaultForm = (): DashboardListenersForm => ({
  http: {
    enable: true,
    bind: '18083',
  },
  https: {
    enable: false,
    bind: '18084',
    bundleName: '',
  },
})

const { t, tl } = useI18nTl('DashboardListener')
const { docMap } = useDocLink()
const { getCertBundleList } = useCertBundle()

const currentProtocol: DashboardProtocol = window.location.protocol === 'https:' ? 'https' : 'http'
const editableProtocol: DashboardProtocol = currentProtocol === 'https' ? 'http' : 'https'

const formRef = ref<FormInstance>()
const formData = ref<DashboardListenersForm>(createDefaultForm())
const rawData = ref<DashboardListenersForm>()
const configLoading = ref(true)
const bundleLoading = ref(false)
const saveLoading = ref(false)
const bundleOptions = ref<string[]>([])

const isCurrentProtocol = (protocol: DashboardProtocol) => protocol === currentProtocol
const otherProtocol = (protocol: DashboardProtocol): DashboardProtocol =>
  protocol === 'http' ? 'https' : 'http'

const getManagedCertBundleName = (
  managedCerts?: DashboardManagedCerts | DashboardManagedCerts[],
): string => {
  if (Array.isArray(managedCerts)) {
    return managedCerts[0]?.bundle_name ?? ''
  }
  return managedCerts?.bundle_name ?? ''
}

const normalizeConfig = (config: Dashboard): DashboardListenersForm => ({
  http: {
    enable: config.listeners?.http?.enable ?? false,
    bind: String(config.listeners?.http?.bind ?? '18083'),
  },
  https: {
    enable: config.listeners?.https?.enable ?? false,
    bind: String(config.listeners?.https?.bind ?? '18084'),
    bundleName: getManagedCertBundleName(config.listeners?.https?.ssl_options?.managed_certs),
  },
})

const normalizeBindForPayload = (bind: string): string | number => {
  const value = bind.trim()
  return /^\d+$/.test(value) ? Number(value) : value
}

const hasChanges = computed(() => (rawData.value ? !isEqual(formData.value, rawData.value) : false))
useDataNotSaveConfirm(() => hasChanges.value)

const createListenerFieldRule = (protocol: DashboardProtocol, label: string): FormItemRule => ({
  validator: (_rule, value: string, callback) => {
    if (protocol !== editableProtocol) {
      callback()
      return
    }
    if (formData.value[protocol].enable && !value?.trim()) {
      callback(new Error(tl('fieldRequired', { field: label })))
      return
    }
    callback()
  },
  trigger: ['blur', 'change'],
})

const rules: FormRules = {
  'http.bind': [createListenerFieldRule('http', tl('bind'))],
  'https.bind': [createListenerFieldRule('https', tl('bind'))],
  'https.bundleName': [createListenerFieldRule('https', tl('certificateBundle'))],
}

const beforeListenerToggle = (protocol: DashboardProtocol) => {
  const listener = formData.value[protocol]
  const peerListener = formData.value[otherProtocol(protocol)]
  if (listener.enable && !peerListener.enable) {
    ElMessage.warning(tl('atLeastOneListener'))
    return false
  }
  return true
}

const loadBundleOptions = async () => {
  try {
    bundleLoading.value = true
    const bundles = await getCertBundleList()
    bundleOptions.value = bundles.flatMap(({ name }) => (name ? [name] : []))
  } catch (error) {
    // The HTTP listener can still be configured if certificate loading fails.
  } finally {
    bundleLoading.value = false
  }
}

const loadConfig = async () => {
  try {
    configLoading.value = true
    const config = await getDashboardConfigs()
    formData.value = normalizeConfig(config)
    rawData.value = cloneDeep(formData.value)
  } catch (error) {
    // HTTP errors are handled globally.
  } finally {
    configLoading.value = false
  }
}

const createPayload = (): Dashboard => {
  const listener = formData.value[editableProtocol]
  if (!listener.enable) {
    return {
      listeners: {
        [editableProtocol]: { enable: false },
      },
    }
  }

  if (editableProtocol === 'http') {
    return {
      listeners: {
        http: {
          enable: true,
          bind: normalizeBindForPayload(listener.bind),
        },
      },
    }
  }

  return {
    listeners: {
      https: {
        enable: true,
        bind: normalizeBindForPayload(listener.bind),
        ssl_options: {
          managed_certs: {
            bundle_name: formData.value.https.bundleName,
          },
        },
      },
    },
  }
}

const saveChanges = async () => {
  if (!formData.value.http.enable && !formData.value.https.enable) {
    ElMessage.warning(tl('atLeastOneListener'))
    return
  }

  try {
    await formRef.value?.validate()
    saveLoading.value = true
    await updateDashboardConfigs(createPayload())
    ElMessage.success(t('Base.updateSuccess'))
    await loadConfig()
  } catch (error) {
    // HTTP and validation errors are handled globally or by the form.
  } finally {
    saveLoading.value = false
  }
}

loadConfig()
loadBundleOptions()
</script>

<style lang="scss">
.dashboard-listeners {
  .listener-card {
    height: 100%;
  }

  .listener-card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-weight: 600;
  }

  .el-select {
    width: 100%;
  }

  .form-actions {
    margin-top: 24px;
  }
}
</style>
