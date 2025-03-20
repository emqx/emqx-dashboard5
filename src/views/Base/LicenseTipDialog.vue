<template>
  <el-dialog
    v-model="licenseTipVisible"
    align-center
    class="license-dialog"
    :width="`${licenseTipWidth}px`"
  >
    <div class="tip-content">
      <template v-if="!isLicenseExpiry">
        <p class="tip" v-if="isCommunityLicense">{{ tl('communityLicenseTip') }}</p>
        <MarkdownContent
          class="tip"
          v-if="!isCommunityLicense"
          :content="tl('licenseEvaluationTip', { n: `<strong> ${maxSessions} </strong>` })"
        />
        <MarkdownContent
          class="tip"
          :content="tl('applyLicenseContent', { link: appleLicenseLink })"
        />
      </template>
      <i18n-t v-else class="tip" keypath="Dashboard.licenseExpiryTip" tag="p" scope="global">
        <a :href="docMap.applyLicense" target="_blank">{{ tl('updateLicense') }}</a>
      </i18n-t>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button link type="primary" @click="goLicense">
          {{ tl('manageLicense') }}
        </el-button>
        <el-button type="primary" @click="licenseTipVisible = false">
          {{ tl('know') }}
        </el-button>
      </span>
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

const licenseTipVisible = computed({
  get: () => props.modelValue,
  set: (val: boolean) => {
    emit('update:modelValue', val)
  },
})

const license = computed(() => store.state.licenseData)
const isLicenseExpiry = computed(() => license.value.expiry)
const licenseTipWidth = computed(() => (isLicenseExpiry.value ? 600 : 580))
const isCommunityLicense = computed(() => store.getters.isCommunityLicense)

const appleLicenseLink = `<a href="${docMap.applyLicense}" target="_blank">${tl('licenseApply')}</a>`

const router = useRouter()
const goLicense = () => {
  router.push({ name: 'license' })
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

  .tip-checkbox {
    margin-top: 10px;
    .el-checkbox {
      color: #aaa;
    }
  }

  .tip-button {
    text-align: right;
  }
}
</style>
