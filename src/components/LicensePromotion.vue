<template>
  <div v-if="show" class="license-chip">
    <span class="chip-label">{{ communityTag }}</span>
    <span v-if="showCommunityDivider" class="chip-divider">|</span>
    <span class="chip-text">
      {{ t('Base.promoApplyFor') }}
      <a :href="applyLicenseUrl" target="_blank" class="chip-link" rel="noopener noreferrer">
        {{ t('Base.promoLicenseText') }}
      </a>
      {{ t('Base.promoOrTry') }}
      <a :href="cloudServiceUrl" target="_blank" class="chip-link" rel="noopener noreferrer">
        {{ t('Base.promoManagedServiceText') }}
      </a>
    </span>
    <el-icon class="chip-close" @click="dismiss" aria-label="Dismiss promotion">
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
const communityTag = computed(() => {
  const label = t('Base.promoCommunityEdition')
  return label.split('|')[0].trim()
})
const showCommunityDivider = computed(() => t('Base.promoCommunityEdition').includes('|'))

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
.license-chip {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  height: 32px;
  padding: 0 16px;
  margin-right: 16px;
  border-radius: 999px;
  background: linear-gradient(135deg, var(--color-primary-card-bg) 0%, var(--color-bg-main) 100%);
  border: 1px solid var(--color-border-card);
  font-size: 14px;
  color: var(--color-text-secondary);
  cursor: default;
  transition: box-shadow 0.2s ease;

  &:hover {
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  }
}

.chip-text {
  white-space: nowrap;
  letter-spacing: 0.2px;
}

.chip-link {
  color: var(--color-primary);
  font-weight: 600;
  text-decoration: underline;
  text-underline-offset: 2px;
  transition:
    color 0.2s ease,
    text-decoration-color 0.2s ease;

  &:hover {
    color: var(--color-primary);
    text-decoration-color: var(--color-primary);
  }
}

.chip-divider {
  color: var(--color-border-primary);
  margin: 0 4px;
}

.chip-label {
  font-weight: 600;
  color: var(--color-primary);
  white-space: nowrap;
}

.chip-close {
  cursor: pointer;
  font-size: 16px;
  color: var(--color-text-secondary);
  margin-left: 2px;
  transition:
    color 0.2s ease,
    transform 0.2s ease;

  &:hover {
    color: var(--color-primary);
    transform: scale(1.08);
  }
}
</style>
