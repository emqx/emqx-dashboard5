<template>
  <div class="dashboard-listeners app-wrapper with-padding-top">
    <el-card class="app-card allow-overflow">
      <el-skeleton v-if="configLoading" :rows="8" animated />
      <template v-else>
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
                <el-alert
                  v-if="isCurrentProtocol('http')"
                  class="current-connection-tip"
                  type="info"
                  :closable="false"
                  show-icon
                >
                  <template #title>{{ tl('editTip') }}</template>
                </el-alert>
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
                <el-form-item v-if="formData.https.enable" prop="https.ssl_options">
                  <div class="dashboard-tls-config" :inert="isCurrentProtocol('https')">
                    <TLSEnableConfig
                      v-model="formData.https.ssl_options"
                      is-edit
                      is-server
                      managed-certs-arr
                      no-session-resumption
                      hide-verify
                      :show-sni="false"
                      :show-middlebox-comp-mode="false"
                      :readonly="isCurrentProtocol('https')"
                      :managed-cert-conf-columns="1"
                      :managed-certs-bundle-empty-value="null"
                      base-path="https.ssl_options"
                    >
                      <template #before-certificate-source>
                        <el-alert class="acme-tip" type="info" :closable="false" show-icon>
                          <template #title>
                            <i18n-t keypath="DashboardListener.acmeTip" tag="span">
                              <template #link>
                                <a
                                  :href="docMap.acmePlugin"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  {{ tl('acmePlugin') }}
                                </a>
                              </template>
                            </i18n-t>
                          </template>
                        </el-alert>
                      </template>
                    </TLSEnableConfig>
                  </div>
                </el-form-item>
                <el-alert
                  v-if="isCurrentProtocol('https')"
                  class="current-connection-tip"
                  type="info"
                  :closable="false"
                  show-icon
                >
                  <template #title>{{ tl('editTip') }}</template>
                </el-alert>
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
import type { SSL } from '@/types/common'
import type { Dashboard, DashboardHttpListener } from '@/types/config'
import TLSEnableConfig from '@/components/TLSConfig/TLSEnableConfig.vue'
import type { FormInstance, FormItemRule, FormRules } from 'element-plus'

type DashboardProtocol = 'http' | 'https'

interface ListenerForm {
  enable: boolean
  bind: string
}

interface DashboardListenersForm {
  http: ListenerForm
  https: ListenerForm & {
    ssl_options: SSL
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
    ssl_options: { enable: true, verify: 'verify_none' },
  },
})

const { t, tl } = useI18nTl('DashboardListener')
const { docMap } = useDocLink()

const currentProtocol: DashboardProtocol = window.location.protocol === 'https:' ? 'https' : 'http'
const editableProtocol: DashboardProtocol = currentProtocol === 'https' ? 'http' : 'https'

const formRef = ref<FormInstance>()
const formData = ref<DashboardListenersForm>(createDefaultForm())
const rawData = ref<DashboardListenersForm>()
const configLoading = ref(true)
const saveLoading = ref(false)

const isCurrentProtocol = (protocol: DashboardProtocol) => protocol === currentProtocol
const otherProtocol = (protocol: DashboardProtocol): DashboardProtocol =>
  protocol === 'http' ? 'https' : 'http'

const isListenerEnabled = (listener?: DashboardHttpListener): boolean =>
  listener?.bind !== undefined && String(listener.bind).trim() !== '0'

const normalizeListener = (
  listener: DashboardHttpListener | undefined,
  defaultBind: string,
): ListenerForm => {
  const enable = isListenerEnabled(listener)
  return {
    enable,
    bind: enable ? String(listener?.bind) : defaultBind,
  }
}

const normalizeConfig = (config: Dashboard): DashboardListenersForm => ({
  http: normalizeListener(config.listeners?.http, '18083'),
  https: {
    ...normalizeListener(config.listeners?.https, '18084'),
    ssl_options: {
      enable: true,
      verify: 'verify_none',
      ...cloneDeep(config.listeners?.https?.ssl_options),
    },
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
    if (!formData.value[protocol].enable) {
      callback()
      return
    }
    if (!value?.trim()) {
      callback(new Error(tl('fieldRequired', { field: label })))
      return
    }
    const port = value.trim().split(':').pop()
    if (port && /^\d+$/.test(port) && Number(port) === 0) {
      callback(new Error(tl('bindCannotBeZero')))
      return
    }
    callback()
  },
  trigger: ['blur', 'change'],
})

const rules: FormRules = {
  'http.bind': [createListenerFieldRule('http', tl('bind'))],
  'https.bind': [createListenerFieldRule('https', tl('bind'))],
  'https.ssl_options': [
    {
      validator: (_rule, value: SSL, callback) => {
        if (editableProtocol !== 'https' || !formData.value.https.enable) {
          callback()
          return
        }
        const managedCerts = value.managed_certs
        if (managedCerts) {
          const bundles = Array.isArray(managedCerts) ? managedCerts : [managedCerts]
          if (!bundles.length || bundles.some(({ bundle_name }) => !bundle_name?.trim())) {
            callback(new Error(tl('fieldRequired', { field: tl('certificateBundle') })))
            return
          }
        } else {
          const missingField = !value.certfile?.trim()
            ? 'TLS Cert'
            : !value.keyfile?.trim()
              ? 'TLS Key'
              : value.verify === 'verify_peer' && !value.cacertfile?.trim()
                ? 'CA Cert'
                : undefined
          if (missingField) {
            callback(new Error(tl('fieldRequired', { field: missingField })))
            return
          }
        }
        callback()
      },
    },
  ],
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
        [editableProtocol]: { bind: 0 },
      },
    }
  }

  if (editableProtocol === 'http') {
    return {
      listeners: {
        http: {
          bind: normalizeBindForPayload(listener.bind),
        },
      },
    }
  }

  return {
    listeners: {
      https: {
        bind: normalizeBindForPayload(listener.bind),
        ssl_options: omit(cloneDeep(formData.value.https.ssl_options), 'enable'),
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
</script>

<style lang="scss">
.dashboard-listeners {
  .listener-card {
    height: 100%;
  }

  .current-connection-tip {
    margin-top: 16px;
  }

  .listener-card-header {
    display: flex;
    min-height: 24px;
    align-items: center;
    justify-content: space-between;
    font-weight: 600;
  }

  .dashboard-tls-config {
    width: 100%;

    .acme-tip {
      margin: 16px 0;
    }

    .TLS-input {
      width: 100%;
    }
  }

  .el-select {
    width: 100%;
  }

  .form-actions {
    margin-top: 24px;
  }
}
</style>
