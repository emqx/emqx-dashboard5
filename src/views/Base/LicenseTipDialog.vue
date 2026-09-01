<template>
  <el-dialog
    v-model="licenseTipVisible"
    align-center
    class="license-dialog"
    :width="`${licenseTipWidth}px`"
  >
    <div class="tip-content">
      <template v-if="!isLicenseExpiry">
        <MarkdownContent
          class="tip"
          v-if="isCommunityLicense"
          :content="
            tl('communityLicenseTip', {
              applyLicenseLink: docMap.applyLicense,
              faqLinkPlaceholder: docMap.licenseFaq,
            })
          "
        />
        <template v-if="!isCommunityLicense">
          <MarkdownContent
            class="tip"
            :content="tl('licenseEvaluationTip', { n: `<strong> ${maxSessions} </strong>` })"
          />
          <MarkdownContent
            class="tip"
            :content="tl('applyLicenseContent', { link: appleLicenseLink })"
          />
        </template>
      </template>
      <i18n-t v-else class="tip" keypath="Dashboard.licenseExpiryTip" tag="p" scope="global">
        <a :href="docMap.applyLicense" target="_blank" rel="noopener noreferrer">
          {{ tl('updateLicense') }}
        </a>
      </i18n-t>
    </div>
    <template #footer>
      <div class="dialog-footer-wrapper">
        <el-checkbox v-model="doNotShowAgain" :label="tl('doNotShowAgain')" class="tip-checkbox" />
        <span class="dialog-footer">
          <el-button link type="primary" @click="goLicense">
            {{ tl('manageLicense') }}
          </el-button>
          <el-button type="primary" @click="handleConfirm">
            {{ tl('know') }}
          </el-button>
        </span>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  maxSessions: {
    type: Number,
  },
})
const emit = defineEmits(['update:modelValue'])
const store = useStore()
const { tl } = useI18nTl('Dashboard')
const { docMap } = useDocLink()

const doNotShowAgain = ref(false)

const getDoNotShowAgainPreference = () => {
  return localStorage.getItem(LS_KEY_DO_NOT_SHOW_LICENSE_TIP) === 'true'
}

const licenseTipVisible = computed({
  get: () => {
    if (getDoNotShowAgainPreference()) {
      return false
    }
    return props.modelValue
  },
  set: (val: boolean) => {
    emit('update:modelValue', val)
  },
})

watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue && getDoNotShowAgainPreference()) {
      emit('update:modelValue', false)
    }
  },
  { immediate: true },
)

const license = computed(() => store.state.licenseData)
const isLicenseExpiry = computed(() => license.value.expiry)
const licenseTipWidth = computed(() => (isLicenseExpiry.value ? 600 : 580))
const isCommunityLicense = computed(() => store.getters.isCommunityLicense)

const appleLicenseLink = `<a href="${docMap.applyLicense}" target="_blank" rel="noopener noreferrer">${tl('licenseApply')}</a>`

const router = useRouter()
const goLicense = () => {
  router.push({ name: 'license' })
  licenseTipVisible.value = false
}

const handleConfirm = () => {
  if (doNotShowAgain.value) {
    localStorage.setItem(LS_KEY_DO_NOT_SHOW_LICENSE_TIP, 'true')
  }
  licenseTipVisible.value = false
}
</script>

<style lang="scss">
.license-dialog {
  padding-top: 28px;
  padding-left: 24px;
  padding-right: 24px;
  .el-dialog__header {
    display: none;
  }
  .el-dialog__body {
    padding-bottom: 20px;
  }

  .tip-title {
    font-size: 18px;
    .el-icon-warning {
      color: #e6a23c;
    }
    span {
      display: inline-block;
      margin-left: 10px;
    }
  }
  .tip:not(:last-child) {
    margin-bottom: 4px;
  }
  .markdown-content.tip {
    .markdown-body {
      color: var(--color-text-secondary);
    }
    a {
      color: var(--color-primary);
    }
    p {
      margin-bottom: 4px;
    }
    ul {
      padding-left: 1em;
    }
  }

  .tip-content {
    font-size: 16px;
    p {
      word-break: break-word;
      line-height: 1.5;
    }
  }

  .dialog-footer-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
  }

  .tip-button {
    text-align: right;
  }
}
</style>
