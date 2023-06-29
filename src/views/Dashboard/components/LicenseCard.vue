<template>
  <el-card class="license-card block">
    <div class="license-card-title">{{ tl('license') }}</div>
    <div class="license-card-bd">
      <div class="info-item" v-if="!isEvaluationLicense">
        <label class="info-item-label">{{ tl('customer') }}:</label>
        <span class="info-item-value">{{ licenseData.customer }}</span>
      </div>

      <div class="progress-container">
        <p class="progress-label">{{ tl('numberOfConnectionLines') }}:</p>
        <el-progress :stroke-width="24" :percentage="licensePercentage" :show-text="false" />
        <p class="progress-desc">{{ currentConnections }}/{{ licenseData.max_connections }}</p>
      </div>

      <template v-if="!isEvaluationLicense">
        <div class="info-item">
          <label class="info-item-label">{{ tl('issuanceOfEmail') }}:</label>
          <span class="info-item-value">{{ licenseData.email }}</span>
        </div>
        <div class="info-item">
          <label class="info-item-label">{{ tl('issuedAt') }}:</label>
          <span class="info-item-value">{{ licenseData.start_at }}</span>
        </div>
        <div class="info-item">
          <label class="info-item-label">{{ tl('expireAt') }}:</label>
          <span class="info-item-value">{{ licenseData.expiry_at }}</span>
        </div>
      </template>
    </div>
    <div class="license-card-ft">
      <!-- EVALUATION -->
      <i18n-t
        v-if="isEvaluationLicense"
        class="tip"
        keypath="Dashboard.licenseEvaluationTip"
        tag="p"
        scope="global"
      >
        {{ licenseData.max_connections
        }}<a :href="docMap.applyLicense" target="_blank">{{ tl('upgradeLicense') }}</a>
      </i18n-t>
      <!-- EXPIRED -->
      <i18n-t
        v-else-if="licenseData.expiry"
        class="tip"
        keypath="Dashboard.licenseExpiryTip"
        tag="p"
        scope="global"
      >
        <a :href="docMap.applyLicense" target="_blank">{{ tl('updateLicense') }}</a>
      </i18n-t>
      <!-- NOT EVALUATION (OFFICIAL OR TRIAL) -->
      <p v-else class="tip">{{ tl('beforeTheCertificateExpires') }}</p>
      <!-- TRIAL -->
      <div
        v-if="
          licenseData.type === LicenseType.Trial &&
          !isEvaluationLicense &&
          licenseData.expiry === false
        "
        class="tag-container"
      >
        <el-tooltip
          effect="dark"
          :content="tl('forTrialEdition')"
          placement="top"
          :visible-arrow="false"
        >
          <el-tag type="warning">{{ tl('trialEdition') }}</el-tag>
        </el-tooltip>
      </div>
      <el-button type="primary" @click="showUpdateDialog = true">
        {{ startCase(tl('updateLicense')) }}
      </el-button>
    </div>
  </el-card>
  <LicenseUpdateDialog v-model="showUpdateDialog" @updated="refreshLicenseData" />
</template>

<script setup lang="ts">
import { loadLicenseInfo } from '@/api/common'
import useI18nTl from '@/hooks/useI18nTl'
import { ref, ComputedRef, defineProps, computed } from 'vue'
import useDocLink from '@/hooks/useDocLink'
import LicenseUpdateDialog from './LicenseUpdateDialog.vue'
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

const props = defineProps({
  currentConnections: {
    type: Number,
  },
})

const { tl } = useI18nTl('Dashboard')
const store = useStore()
const { docMap } = useDocLink()

const showUpdateDialog = ref(false)

const licenseData: ComputedRef<LicenseData> = computed(() => store.state.licenseData)
const isEvaluationLicense = computed(() => store.getters.isEvaluationLicense)

const licensePercentage = computed(() => {
  const connection = props.currentConnections
  const { max_connections } = licenseData.value
  const value = connection ? Math.floor((connection / max_connections) * 100) : 2
  return value <= 2 ? 2 : value
})

const refreshLicenseData = async () => {
  try {
    const data = await loadLicenseInfo()
    store.commit('SET_LICENSE_DATA', data)
  } catch (error) {
    //
  }
}
</script>

<style lang="scss">
.license-card {
  .license-card-title {
    font-size: 16px;
    color: var(--color-title-primary);
    margin-bottom: 16px;
  }
  .progress-label {
    margin: 0 0 12px;
  }
  .progress-desc {
    margin: 4px 0 16px;
    font-size: 13px;
  }
  .license-card-bd {
    margin-bottom: 16px;
  }
  .tip,
  .tag-container,
  .info-item {
    margin-bottom: 16px;
  }
  .progress-label {
    width: 200px;
  }
  .info-item-label {
    display: inline-block;
    width: 100px;
    color: var(--color-text-secondary);
  }
}
</style>
