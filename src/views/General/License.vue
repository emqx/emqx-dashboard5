<template>
  <div class="license app-wrapper with-padding-top">
    <el-card class="license-card">
      <div class="license-info">
        <el-descriptions :title="tl('basic')" :column="1">
          <el-descriptions-item :label="tl('numberOfConnectionLines')">
            <el-progress
              :stroke-width="20"
              :percentage="licensePercentage"
              :status="isWarningUsage ? 'warning' : ''"
              :format="() => `${currentConnections}/${licenseData.max_sessions}`"
              @mouseover="showTooltip = true"
              @mouseout="showTooltip = false"
            >
              {{ `${currentConnections}/${licenseData.max_sessions}` }}
            </el-progress>
            <el-tooltip
              :visible="showTooltip"
              effect="dark"
              popper-class="info-tooltip"
              placement="top"
              :content="tl('usageWarning', { percentage: licenseConfig.connection_high_watermark })"
            >
              <div v-show="showTooltip" class="marked" :style="{ left: markedLeftPosition }"></div>
            </el-tooltip>
          </el-descriptions-item>
          <el-descriptions-item :label="tl('EMQXVersion')">
            <EMQXVersion />
          </el-descriptions-item>
          <template v-if="!isEvaluationLicense">
            <el-descriptions-item :label="tl('customer')">
              <span>
                {{ licenseData.customer }}
                <!-- TRIAL -->
                <el-tooltip
                  v-if="
                    licenseData.type === LicenseType.Trial &&
                    !isEvaluationLicense &&
                    licenseData.expiry === false
                  "
                  effect="dark"
                  :content="tl('forTrialEdition')"
                  placement="top"
                  :visible-arrow="false"
                >
                  <el-tag type="warning">{{ tl('trialEdition') }}</el-tag>
                </el-tooltip>
              </span>
            </el-descriptions-item>
            <el-descriptions-item :label="tl('issuanceOfEmail')">
              {{ licenseData.email }}
            </el-descriptions-item>
            <el-descriptions-item :label="tl('issuedAt')">
              {{ licenseData.start_at }}
            </el-descriptions-item>
            <el-descriptions-item :label="tl('expireAt')">
              {{ licenseData.expiry_at }}
            </el-descriptions-item>
          </template>
        </el-descriptions>
        <!-- EVALUATION -->
        <el-alert v-if="isEvaluationLicense" show-icon :closable="false" type="info">
          <template #title>
            <i18n-t keypath="Dashboard.licenseEvaluationTip" scope="global">
              {{ licenseData.max_sessions
              }}<a :href="docMap.applyLicense" target="_blank">{{ tl('upgradeLicense') }}</a>
            </i18n-t>
          </template>
        </el-alert>

        <!-- EXPIRED -->
        <el-alert v-else-if="licenseData.expiry" show-icon :closable="false" type="info">
          <template #title>
            <i18n-t keypath="Dashboard.licenseExpiryTip" scope="global">
              <a :href="docMap.applyLicense" target="_blank">{{ tl('updateLicense') }}</a>
            </i18n-t>
          </template>
        </el-alert>
        <!-- NOT EVALUATION (OFFICIAL OR TRIAL) -->
        <el-alert
          v-else
          :title="tl('beforeTheCertificateExpires')"
          show-icon
          :closable="false"
          type="info"
        />
        <el-button
          type="primary"
          :disabled="!$hasPermission('put')"
          @click="showUpdateDialog = true"
        >
          {{ startCase(tl('updateLicense')) }}
        </el-button>
        <el-button
          v-if="licenseData.deployment !== 'default'"
          type="primary"
          plain
          :disabled="!$hasPermission('post')"
          @click="showResetDialog = true"
        >
          {{ tl('resetLicense') }}
        </el-button>
      </div>
      <!-- Config -->
      <div class="license-config">
        <h3>{{ tl('licenseSettings') }}</h3>
        <el-form
          ref="licenseConfigForm"
          :model="licenseConfig"
          label-position="right"
          :label-width="store.state.lang === 'zh' ? 216 : 245"
          :rules="rules"
          hide-required-asterisk
        >
          <el-form-item prop="connection_high_watermark">
            <template #label>
              <FormItemLabel
                :label="tl('connection_high_watermark')"
                :desc="tl('connection_high_watermark_desc')"
              />
            </template>
            <InputWithUnit v-model="licenseConfig.connection_high_watermark" :units="['%']" />
          </el-form-item>
          <el-form-item prop="connection_low_watermark">
            <template #label>
              <FormItemLabel
                :label="tl('connection_low_watermark')"
                :desc="tl('connection_low_watermark_desc')"
              />
            </template>
            <InputWithUnit v-model="licenseConfig.connection_low_watermark" :units="['%']" />
          </el-form-item>
          <el-button
            type="primary"
            :disabled="!$hasPermission('put')"
            :loading="saveLoading"
            @click="handleUpdate()"
          >
            {{ $t('Base.saveChanges') }}
          </el-button>
        </el-form>
      </div>
    </el-card>
    <LicenseUpdateDialog v-model="showUpdateDialog" @updated="loadLicenseData" />
    <LicenseResetDialog v-model="showResetDialog" @updated="loadLicenseData" />
  </div>
</template>

<script setup lang="ts">
import {
  loadCurrentMetrics,
  loadLicenseInfo,
  loadLicenseConfig,
  updateLicenseConfig,
} from '@/api/common'
import useI18nTl from '@/hooks/useI18nTl'

import useDocLink from '@/hooks/useDocLink'
import LicenseUpdateDialog from './components/LicenseUpdateDialog.vue'
import LicenseResetDialog from './components/LicenseResetDialog.vue'
import EMQXVersion from '@/components/EMQXVersion.vue'
import FormItemLabel from '@/components/FormItemLabel.vue'
import InputWithUnit from '@/components/InputWithUnit.vue'
import { useStore } from 'vuex'

import { LicenseType } from '@/types/enum'
import { LicenseConfig, LicenseData } from '@/types/dashboard'

type ValidatorFn = (
  rule: Record<string, unknown>,
  value: string,
  callback: (error?: Error) => void,
) => void

const { t, tl } = useI18nTl('Dashboard')
const currentConnections = ref(0)
const store = useStore()
const { docMap } = useDocLink()

const progressBarOuterWidth = ref(0)

const showUpdateDialog = ref(false)
const showResetDialog = ref(false)
const saveLoading = ref(false)
const showTooltip = ref(false)

const licenseConfig = ref<LicenseConfig>({
  connection_high_watermark: '0%',
  connection_low_watermark: '0%',
})
const licenseData: ComputedRef<LicenseData> = computed(() => store.state.licenseData)
const isEvaluationLicense = computed(() => store.getters.isEvaluationLicense)
const licenseConfigForm = ref<HTMLFormElement | null>(null)

const licensePercentage = computed(() => {
  const connection = currentConnections.value
  const { max_sessions } = licenseData.value
  const value = connection ? Math.floor((connection / max_sessions) * 100) : 0
  return value
})

const isWarningUsage = computed(() => {
  const { connection_high_watermark } = licenseConfig.value
  const highWatermark = parseInt(connection_high_watermark.replace('%', ''))
  return licensePercentage.value >= highWatermark
})

const getProgressBarWidth = () => {
  const progressBarDOM = document.querySelector('.el-progress-bar') as HTMLElement
  if (progressBarDOM) {
    return progressBarDOM.clientWidth
  }
  return 0
}

const loadLicenseData = async () => {
  try {
    licenseConfigForm.value?.resetFields()
    const [state, data, config] = await Promise.all([
      loadCurrentMetrics(),
      loadLicenseInfo(),
      loadLicenseConfig(),
    ])
    currentConnections.value = state.connections
    store.commit('SET_LICENSE_DATA', data)
    licenseConfig.value = config
    progressBarOuterWidth.value = getProgressBarWidth()
  } catch (error) {
    // handle error
  }
}

const handleWindowResize = () => {
  progressBarOuterWidth.value = getProgressBarWidth()
}

onMounted(() => {
  window.addEventListener('resize', handleWindowResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleWindowResize)
})

const watermarkValidator = (comparison: () => string, isHigher: boolean): ValidatorFn => {
  return (rule, value, callback) => {
    const targetValue = parseInt(value.replace('%', ''))
    const comparisonValue = parseInt(comparison().replace('%', ''))
    if (isHigher && targetValue <= comparisonValue) {
      callback(new Error(tl('highWatermarkGreaterThanLow')))
    } else if (!isHigher && targetValue >= comparisonValue) {
      callback(new Error(tl('lowWatermarkLessThanHigh')))
    } else {
      callback()
    }
  }
}

const rules: any = {
  connection_high_watermark: [
    { required: true, message: tl('highWatermarkRequired') },
    {
      validator: watermarkValidator(() => licenseConfig.value.connection_low_watermark, true),
    },
  ],
  connection_low_watermark: [
    { required: true, message: tl('lowWatermarkRequired') },
    {
      validator: watermarkValidator(() => licenseConfig.value.connection_high_watermark, false),
    },
  ],
}

const markedLeftPosition = computed(() => {
  const percentage =
    parseFloat(licenseConfig.value.connection_high_watermark.replace('%', '')) / 100
  return progressBarOuterWidth.value * percentage - 1 + 'px'
})

const handleUpdate = async () => {
  saveLoading.value = true
  try {
    const valid = await licenseConfigForm.value?.validate()
    if (!valid) return
    await updateLicenseConfig(licenseConfig.value)
    ElMessage.success(t('Base.updateSuccess'))
  } catch (error) {
    // handle error
  } finally {
    saveLoading.value = false
  }
}

loadLicenseData()
</script>

<style lang="scss">
html[lang='en'] .license .el-descriptions .el-descriptions__label {
  width: 95px;
}
html[lang='zh'] .license .el-descriptions .el-descriptions__label {
  width: 123px;
}
.license {
  .el-card__body {
    width: 75%;
  }
  .el-progress {
    cursor: pointer;
  }
  .el-descriptions__content {
    position: relative;
  }
  .marked {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 2px;
    background-color: #f19710;
  }
  .license-info {
    margin-bottom: 48px;
    .el-descriptions
      .el-descriptions__body
      .el-descriptions__table:not(.is-bordered)
      .el-descriptions__cell {
      display: flex;
      align-items: center;
    }
    .el-descriptions .el-descriptions__label {
      text-align: right;
    }
    .el-descriptions__content:not(.is-bordered-label) {
      flex-grow: 1;
    }
    .el-alert {
      padding: 12px 14px;
    }
    .el-tag.el-tag--warning {
      margin-left: 12px;
      .el-tag__content {
        &::before {
          content: '';
          display: inline-block;
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: currentColor;
          margin-right: 8px;
          vertical-align: middle;
        }
      }
    }
  }
  .license-config {
    width: 50%;
    .el-form-item {
      margin-bottom: 24px;
    }
  }
  .el-button {
    margin-top: 16px;
  }
}
</style>
