<template>
  <div class="license app-wrapper">
    <el-card class="license-card">
      <el-descriptions :title="tl('basicInfo')" :column="1">
        <el-descriptions-item :label="tl('numberOfConnectionLines')">
          <el-progress
            :stroke-width="20"
            :percentage="licensePercentage"
            :format="() => `${currentConnections}/${licenseData.max_connections}`"
          />
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
            {{ licenseData.max_connections
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
      <el-button type="primary" @click="showUpdateDialog = true">
        {{ startCase(tl('updateLicense')) }}
      </el-button>
    </el-card>
    <LicenseUpdateDialog v-model="showUpdateDialog" @updated="loadLicenseData" />
  </div>
</template>

<script setup lang="ts">
import { loadCurrentMetrics, loadLicenseInfo } from '@/api/common'
import useI18nTl from '@/hooks/useI18nTl'
import { ref, ComputedRef, computed } from 'vue'
import useDocLink from '@/hooks/useDocLink'
import LicenseUpdateDialog from './components/LicenseUpdateDialog.vue'
import EMQXVersion from '@/components/EMQXVersion.vue'
import { useStore } from 'vuex'
import { startCase } from 'lodash'
import { LicenseType } from '@/types/enum'

interface LicenseData {
  customer: string
  customer_type: number
  deployment: string
  email: string
  expiry: boolean
  expiry_at: string
  max_connections: number
  start_at: string
  type: string
}

const { tl } = useI18nTl('Dashboard')
const currentConnections = ref(0)
const store = useStore()
const { docMap } = useDocLink()

const showUpdateDialog = ref(false)

const licenseData: ComputedRef<LicenseData> = computed(() => store.state.licenseData)
const isEvaluationLicense = computed(() => store.getters.isEvaluationLicense)

const licensePercentage = computed(() => {
  const connection = currentConnections.value
  const { max_connections } = licenseData.value
  const value = connection ? Math.floor((connection / max_connections) * 100) : 0
  return value
})

const loadLicenseData = async () => {
  try {
    const state = await loadCurrentMetrics()
    currentConnections.value = state.connections
    const data = await loadLicenseInfo()
    store.commit('SET_LICENSE_DATA', data)
  } catch (error) {
    //
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
  .license-card {
    .el-card__body {
      width: 75%;
    }
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
    .el-button {
      margin-top: 16px;
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
}
</style>
