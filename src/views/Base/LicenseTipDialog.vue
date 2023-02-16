<template>
  <el-dialog
    v-model="licenseTipVisible"
    align-center
    class="license-dialog"
    :width="`${licenseTipWidth}px`"
  >
    <div class="tip-content">
      <i18n-t
        v-if="!isLicenseExpiry"
        class="tip"
        keypath="Dashboard.licenseEvaluationTip"
        tag="p"
        scope="global"
      >
        <span>{{ maxConnection }}</span>
        <a :href="docMap.applyLicense" target="_blank">{{ tl('upgradeLicense') }}</a>
      </i18n-t>
      <i18n-t v-else class="tip" keypath="Dashboard.licenseExpiryTip" tag="p" scope="global">
        <a :href="docMap.applyLicense" target="_blank">{{ tl('updateLicense') }}</a>
      </i18n-t>
    </div>
    <div v-if="!isLicenseExpiry" class="tip-checkbox">
      <el-checkbox v-model="noPromptAnyMore" @change="liceEvaTipShowChange">
        {{ tl('notPromptAgain') }}
      </el-checkbox>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="licenseTipVisible = false">
          {{ tl('know') }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import useDocLink from '@/hooks/useDocLink'
import useI18nTl from '@/hooks/useI18nTl'
import { ElDialog } from 'element-plus'
import { computed, defineEmits, defineProps, ref } from 'vue'
import { useStore } from 'vuex'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  maxConnection: {
    type: Number,
  },
})
const emit = defineEmits(['update:modelValue'])
const store = useStore()
const { tl } = useI18nTl('Dashboard')
const { docMap } = useDocLink()

const noPromptAnyMore = ref(false)

const licenseTipVisible = computed({
  get: () => props.modelValue,
  set: (val: boolean) => {
    emit('update:modelValue', val)
  },
})

const license = computed(() => store.state.licenseData)
const isLicenseExpiry = computed(() => license.value.expiry)
const licenseTipWidth = computed(() => (isLicenseExpiry.value ? 600 : 520))

const liceEvaTipShowChange = (val: boolean) => {
  if (val) {
    localStorage.setItem('licenseTipVisible', false.toString())
  }
}
</script>

<style lang="scss">
.license-dialog {
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

  .tip-content {
    font-size: 16px;
    p {
      word-break: break-word;
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
