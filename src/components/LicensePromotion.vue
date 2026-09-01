<template>
  <div v-if="show" class="license-actions-header">
    <span class="promo-text">
      {{ t('Base.promoCommunityEdition') }}
      {{ t('Base.promoApplyFor') }}
      <a
        :href="applyLicenseUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="header-action-link"
      >
        {{ t('Base.promoLicenseText') }}
      </a>
      {{ t('Base.promoOrTry') }}
      <a
        :href="cloudServiceUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="header-action-link"
      >
        {{ t('Base.promoManagedServiceText') }}
      </a>
    </span>
    <el-icon class="close-promo-icon" @click="dismiss">
      <Close />
    </el-icon>
  </div>
</template>

<script lang="ts" setup>
import { Close } from '@element-plus/icons-vue'

const { t } = useI18n()
const store = useStore()
const { docMap } = useDocLink()

const isCommunityLicense = computed(() => store.getters.isCommunityLicense)
const applyLicenseUrl = computed(() => docMap.applyLicense)
const cloudServiceUrl = computed(() => docMap.cloud)

const communityPromoDismissed = ref(
  localStorage.getItem(LS_KEY_COMMUNITY_PROMO_DISMISSED) === 'true',
)

const show = computed(() => {
  return isCommunityLicense.value && !communityPromoDismissed.value
})

const dismiss = () => {
  localStorage.setItem(LS_KEY_COMMUNITY_PROMO_DISMISSED, 'true')
  communityPromoDismissed.value = true
}
</script>

<style lang="scss" scoped>
.license-actions-header {
  display: inline-flex;
  align-items: center;
  height: 32px;
  margin-right: 16px;
  padding: 0 12px;
  background: linear-gradient(135deg, #363b58 0%, #404673 100%);
  border-radius: 6px;
  font-size: 14px;
  color: #fff;
  position: relative;
  transition: all 0.2s ease;
  box-shadow: 0 1px 8px rgba(0, 0, 0, 0.15);

  &:hover {
    background: linear-gradient(135deg, #3c4164 0%, #474e83 100%);
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  }

  .promo-text {
    margin-right: 10px;
    white-space: nowrap;
    letter-spacing: 0.2px;
  }

  .header-action-link {
    color: #9babff;
    text-decoration: none;
    font-weight: 500;
    margin: 0 2px;
    padding: 0 1px;
    transition: all 0.2s ease;

    &:hover {
      color: #b6c4ff;
      text-decoration: none;
      text-shadow: 0 0 8px #96aaff80;
    }
  }

  .close-promo-icon {
    cursor: pointer;
    font-size: 16px;
    color: #ffffffb3;
    transition: all 0.2s;
    margin-left: 2px;

    &:hover {
      color: #fff;
      transform: scale(1.1);
    }
  }
}
</style>
