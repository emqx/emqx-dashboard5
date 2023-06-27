<template>
  <div class="iot-detail">
    <div class="detail-top">
      <detail-header :item="{ name: ruleInfo.id, route: getBackRoute({ name: 'iot' }) }" />
      <div class="section-header">
        <div>
          <span class="title-n-status">
            <RuleItemStatus :rule="ruleInfo" is-tag />
          </span>
        </div>
        <div>
          <el-tooltip
            :content="ruleInfo.enable ? $t('Base.disable') : $t('Base.enable')"
            placement="top"
          >
            <el-switch class="enable-btn" v-model="ruleInfo.enable" @change="enableOrDisableRule" />
          </el-tooltip>
          <el-tooltip :content="$t('Base.delete')" placement="top">
            <el-button class="icon-button" type="danger" :icon="Delete" @click="deleteRule" plain>
            </el-button>
          </el-tooltip>
        </div>
      </div>
    </div>
    <el-tabs class="detail-tabs" v-model="activeTab">
      <div class="app-wrapper">
        <el-tab-pane :label="tl('overview')" :name="Tab.Overview">
          <div v-loading="infoLoading">
            <RuleItemOverview :rule-id="id" />
          </div>
        </el-tab-pane>
        <el-tab-pane :label="t('Base.setting')" :name="Tab.Setting" lazy>
          <el-card class="detail-card overview-visible" v-loading="infoLoading">
            <iotform
              ref="formCom"
              v-model="ruleInfo"
              is-edit
              :submit-loading="submitLoading"
              @save="submitUpdateRules"
              @save-as-copy="saveAsCopy"
            />
          </el-card>
        </el-tab-pane>
      </div>
    </el-tabs>
    <CopySubmitDialog :target="copyTarget" v-model="showNameInputDialog" />
  </div>
</template>

<script lang="ts" setup>
import { deleteRules, getRuleInfo, updateRules } from '@/api/ruleengine'
import DetailHeader from '@/components/DetailHeader.vue'
import useRuleForm from '@/hooks/Rule/rule/useRuleForm'
import useDataNotSaveConfirm from '@/hooks/useDataNotSaveConfirm'
import useI18nTl from '@/hooks/useI18nTl'
import { useReceiveParams } from '@/hooks/usePaginationRemember'
import { RuleItem } from '@/types/rule'
import { Delete } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { cloneDeep, isEqual } from 'lodash'
import { ComputedRef, Ref, computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import CopySubmitDialog from '../components/CopySubmitDialog.vue'
import iotform from '../components/IoTForm.vue'
import RuleItemOverview from './components/RuleItemOverview.vue'
import RuleItemStatus from './components/RuleItemStatus.vue'

enum Tab {
  Overview = 'overview',
  Setting = 'settings',
}

const ruleInfo: Ref<RuleItem> = ref({} as RuleItem)
let rawRuleInfo: undefined | RuleItem = undefined
const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const id = route.params.id as string
const iKey = ref(0)
const infoLoading = ref(false)
const submitLoading = ref(false)
const activeTab = ref(Tab.Overview)

const formCom = ref()

const queryTab = computed(() => {
  return route.query.tab as Tab
})
if (queryTab.value) {
  activeTab.value = queryTab.value
}

const { tl } = useI18nTl('RuleEngine')

const { getBackRoute } = useReceiveParams('iot')
const countIsRuleRecordChanged = () => !isEqual(rawRuleInfo, ruleInfo.value)
useDataNotSaveConfirm(countIsRuleRecordChanged)

const loadRuleDetail = async () => {
  infoLoading.value = true
  try {
    ruleInfo.value = await getRuleInfo(id)
    rawRuleInfo = cloneDeep(ruleInfo.value)
    ++iKey.value
  } catch (error) {
    console.error(error)
  } finally {
    infoLoading.value = false
  }
}

const enableOrDisableRule = async () => {
  infoLoading.value = true
  ruleInfo.value.enable = !ruleInfo.value.enable
  try {
    await updateRules(id, { enable: !ruleInfo.value.enable })
    ElMessage.success(t(ruleInfo.value.enable ? 'Base.disabledSuccess' : 'Base.enableSuccess'))
    ruleInfo.value.enable = !ruleInfo.value.enable
  } catch (error) {
    console.error(error)
  } finally {
    infoLoading.value = false
  }
}

const deleteRule = async () => {
  await ElMessageBox.confirm(t('Base.confirmDelete'), {
    confirmButtonText: t('Base.confirm'),
    cancelButtonText: t('Base.cancel'),
    confirmButtonClass: 'confirm-danger',
    type: 'warning',
  })
  await deleteRules(id)
  ElMessage.success(t('Base.deleteSuccess'))
  rawRuleInfo = ruleInfo.value
  router.push({ name: 'iot' })
}

const { getRuleDataForUpdate } = useRuleForm()
const submitUpdateRules = async () => {
  await formCom.value.validate()
  submitLoading.value = true
  try {
    await updateRules(id, getRuleDataForUpdate(ruleInfo.value))
    ElMessage.success(t('Base.updateSuccess'))
    rawRuleInfo = ruleInfo.value
    router.push({ name: 'iot' })
  } catch (error) {
    console.error(error)
  } finally {
    submitLoading.value = false
  }
}

const showNameInputDialog = ref(false)
const copyTarget: ComputedRef<{ type: 'rule'; obj: RuleItem }> = computed(() => ({
  type: 'rule',
  obj: ruleInfo.value,
}))
const saveAsCopy = async () => {
  await formCom.value.validate()
  showNameInputDialog.value = true
}

onMounted(() => {
  loadRuleDetail()
})
</script>

<style lang="scss">
.iot-detail {
  .el-card.detail-card {
    > .el-card__body {
      padding: 0px;
    }
  }
}
</style>
