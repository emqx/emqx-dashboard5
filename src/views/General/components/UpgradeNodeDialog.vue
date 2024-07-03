<template>
  <el-dialog
    :title="tl('upgradePackageUpload')"
    v-model="showDialog"
    class="upgrade-dialog"
    destroy-on-close
  >
    <GuideBar :guide-list="stepList" :active-guide-index-list="activeGuideIndexList" />
    <div v-if="currentStep === 0">
      <p>{{ tl('selectPackageTip') }}</p>

      <el-table
        :data="packages"
        v-loading.lock="isLoading"
        highlight-current-row
        @current-change="selectPackageIndex"
      >
        <el-table-column>
          <template #default="{ $index }">
            <el-radio
              :label="$index"
              :model-value="selectedPackageIndex"
              @update:modelValue="selectPackageIndex({ index: $index })"
            >
            </el-radio>
          </template>
        </el-table-column>
        <el-table-column prop="XDXDXDXDXDXD" :label="t('Base.name')" />
        <el-table-column prop="XDXDXDXDXDXD" :label="tl('version')" />
        <el-table-column prop="XDXDXDXDXDXD" :label="tl('buildDate')" />
        <el-table-column prop="XDXDXDXDXDXD" :label="tl('fileSize')" />
      </el-table>
    </div>
    <div v-if="currentStep === 1">
      <p>{{ tl('packageConfirm') }}</p>
      <div>
        <p class="part-header">{{ t('Dashboard.basic') }}</p>
        <ul class="info-list">
          <li v-for="{ label, key } in infoMap" :key="key">
            <label>{{ label }}</label>
            <span>{{ selectPackage[key] }}</span>
          </li>
        </ul>
      </div>
      <div>
        <p class="part-header">{{ tl('updateLog') }}</p>
        <div></div>
      </div>
    </div>
    <div v-if="currentStep === 2">
      <MarkdownContent :content="tl('upgradeWarning')" />
      <el-checkbox v-model="isConfirm">
        {{ tl('upgradeConfirm') }}
      </el-checkbox>
    </div>
    <template #footer>
      <div class="dialog-align-footer">
        <el-button v-if="currentStep === 0" @click="showDialog = false">
          {{ t('Base.cancel') }}
        </el-button>
        <el-button @click="goPreStep" v-if="currentStep > 0" :disabled="isSubmitting">
          {{ $t('Base.backStep') }}
        </el-button>
        <el-button v-if="currentStep < 2" type="primary" @click="goNextStep">
          {{ t('Base.nextStep') }}
        </el-button>
        <el-button
          v-if="currentStep === 2"
          type="primary"
          :loading="isSubmitting"
          :disabled="!$hasPermission('post')"
          @click="submit"
        >
          {{ tl('startUpgrade') }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import GuideBar from '@/components/GuideBar.vue'
import MarkdownContent from '@/components/MarkdownContent.vue'
import useI18nTl from '@/hooks/useI18nTl'
import { ElDialog, ElMessage } from 'element-plus'
import { computed, defineEmits, defineProps, ref, watch } from 'vue'

type Package = any

const props = defineProps<{ modelValue: boolean; node?: string }>()
const emit = defineEmits<{
  (e: 'submitted'): void
}>()

const isSubmitting = ref(false)

const showDialog = computed({
  get: () => props.modelValue,
  set: (val: boolean) => {
    emit('update:modelValue', val)
  },
})

const { t, tl } = useI18nTl('General')

const stepList = [tl('selectUpgradePackage'), tl('upgradePackageInfo'), tl('startUpgrade')]
const currentStep = ref(0)
const activeGuideIndexList = computed(() =>
  Array.from({ length: currentStep.value + 1 }, (_, index) => index),
)

const goPreStep = () => {
  currentStep.value -= 1
}
const goNextStep = () => {
  if (currentStep.value == 0 && selectedPackageIndex.value == -1) {
    ElMessage.warning(tl('selectPackageRequired'))
    return
  }
  currentStep.value += 1
}

const isLoading = ref(false)
const packages = ref<Array<Package>>([])

const getNodePackages = async () => {
  try {
    packages.value = [{ index: 0 }, { index: 1 }]
  } catch (error) {
    //
  }
}

const selectedPackageIndex = ref(-1)
const selectPackage = computed(() => packages.value[selectedPackageIndex.value])
const selectPackageIndex = ({ index }: { index: number }) => {
  selectedPackageIndex.value = index
}

const infoMap = [
  { label: t('Base.name'), key: 'TODO:' },
  { label: tl('version'), key: 'TODO:' },
  { label: tl('availableVersions'), key: 'TODO:' },
  { label: tl('buildDate'), key: 'TODO:' },
  { label: tl('fileSize'), key: 'TODO:' },
  { label: tl('packageCheckCode'), key: 'TODO:' },
]

const isConfirm = ref(false)

const submit = async () => {
  try {
    if (!isConfirm.value) {
      ElMessage.warning(tl('confirmUpgradeRequired'))
      return
    }
    isSubmitting.value = true
    emit('submitted')
  } catch (error) {
    //
  } finally {
    isSubmitting.value = false
  }
}

watch(showDialog, (val) => {
  if (val) {
    getNodePackages()
  } else {
    currentStep.value = 0
    selectedPackageIndex.value = -1
    isConfirm.value = false
  }
})
</script>

<style lang="scss">
.upgrade-dialog {
  .el-radio {
    .el-radio__label {
      display: none;
    }
  }
  .info-list {
    list-style: none;
  }
  .markdown-content {
    ol {
      padding-left: 20px;
    }
  }
}
</style>
