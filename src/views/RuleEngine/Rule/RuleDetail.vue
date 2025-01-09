<template>
  <div class="rule-detail">
    <div class="detail-top">
      <detail-header :item="{ name: ruleInfo.id, route: getBackRoute({ name: 'rule' }) }">
        <template #content>
          <div class="vertical-align-center">
            <p class="block-title">{{ ruleInfo.id }}</p>
            <RuleItemStatus :rule="ruleInfo" is-tag />
          </div>
        </template>
        <template #extra>
          <el-tooltip
            :content="ruleInfo.enable ? $t('Base.disable') : $t('Base.enable')"
            placement="top"
          >
            <el-switch
              class="enable-btn"
              :disabled="!$hasPermission('put') || isWebhookRule"
              v-model="ruleInfo.enable"
              @change="enableOrDisableRule"
            />
          </el-tooltip>
          <el-tooltip :content="$t('Base.delete')" placement="top">
            <el-button
              class="icon-button"
              :disabled="!$hasPermission('delete') || isWebhookRule"
              type="danger"
              :icon="Delete"
              @click="deleteRule"
              plain
            >
            </el-button>
          </el-tooltip>
        </template>
      </detail-header>
    </div>
    <el-tabs class="detail-tabs" v-model="activeTab">
      <div class="app-wrapper">
        <el-tab-pane :label="tl('overview')" :name="Tab.Overview" lazy>
          <div v-loading="infoLoading">
            <RuleItemOverview :rule-id="id" />
          </div>
        </el-tab-pane>
        <el-tab-pane :label="t('Base.setting')" :name="Tab.Setting" lazy>
          <el-alert
            v-if="isWebhookRule"
            class="webhook-tip-alert"
            show-icon
            type="info"
            :closable="false"
          >
            <i18n-t keypath="RuleEngine.handleWebhookAssociatedTip" tag="p">
              <template #target>
                <span>{{ tl('rule') }}</span>
              </template>
              <template #operation>
                <span>{{ lowerCase(t('Base.edit')) }}</span>
              </template>
              <template #page>
                <router-link :to="webhookRoute">Webhook {{ tl('page') }}</router-link>
              </template>
            </i18n-t>
          </el-alert>
          <el-card class="detail-card overview-visible app-card" v-loading="infoLoading">
            <rule-form
              ref="formCom"
              v-model="ruleInfo"
              is-edit
              :submit-loading="submitLoading"
              :disabled="isWebhookRule"
              @save="submitUpdateRules"
              @save-as-copy="saveAsCopy"
            />
          </el-card>
        </el-tab-pane>
      </div>
    </el-tabs>
    <CopySubmitDialog :target="copyTarget" v-model="showNameInputDialog" />
  </div>
  <DeleteRuleConfirm v-model="showDeleteConfirm" :rule="currentRule" @submitted="handleDeleteSuc" />
</template>

<script lang="ts" setup>
import { getRuleInfo, updateRules } from '@/api/ruleengine'
import DetailHeader from '@/components/DetailHeader.vue'
import { useStatusController } from '@/hooks/Rule/rule/useDebugRule'
import useRuleForm from '@/hooks/Rule/rule/useRuleForm'
import useWebhookUtils from '@/hooks/Webhook/useWebhookUtils'
import useDataNotSaveConfirm from '@/hooks/useDataNotSaveConfirm'
import useI18nTl from '@/hooks/useI18nTl'
import { useReceiveParams } from '@/hooks/usePaginationRemember'
import { DetailTab } from '@/types/enum'
import { RuleItem } from '@/types/rule'
import { Delete } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { cloneDeep, isEqual, lowerCase } from 'lodash'
import type { ComputedRef, Ref } from 'vue'
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import CopySubmitDialog from '../components/CopySubmitDialog.vue'
import RuleForm from '../components/RuleForm.vue'
import DeleteRuleConfirm from './components/DeleteRuleConfirm.vue'
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

const { isTesting, updateSavedData } = useStatusController(ruleInfo)

const formCom = ref()

const queryTab = computed(() => {
  return route.query.tab as Tab
})
if (queryTab.value) {
  activeTab.value = queryTab.value
}

const { tl } = useI18nTl('RuleEngine')

const { getBackRoute } = useReceiveParams('rule')
const countIsRuleRecordChanged = () => !isEqual(rawRuleInfo, ruleInfo.value)
useDataNotSaveConfirm(countIsRuleRecordChanged)

const loadRuleDetail = async () => {
  infoLoading.value = true
  try {
    ruleInfo.value = await getRuleInfo(id)
    rawRuleInfo = cloneDeep(ruleInfo.value)
    updateSavedData(rawRuleInfo)
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

const { judgeIsWebhookRule } = useWebhookUtils()

/* Webhook associated */
const isWebhookRule = computed(() => judgeIsWebhookRule(ruleInfo.value))
const webhookRoute = computed(() => ({
  name: 'webhook-detail',
  params: { name: id },
  query: { tab: DetailTab.Setting },
}))

const showDeleteConfirm = ref(false)
const currentRule = ref<undefined | RuleItem>(undefined)
const deleteRule = async () => {
  if (isWebhookRule.value) {
    return
  }
  currentRule.value = ruleInfo.value
  showDeleteConfirm.value = true
}

const handleDeleteSuc = () => router.push({ name: 'rule' })

const { getRuleDataForUpdate } = useRuleForm()
const submitUpdateRules = async () => {
  await formCom.value.validate()
  submitLoading.value = true
  try {
    await updateRules(id, getRuleDataForUpdate(ruleInfo.value))
    ElMessage.success(t('Base.updateSuccess'))
    rawRuleInfo = ruleInfo.value
    if (!isTesting.value) {
      router.push({ name: 'rule' })
    } else {
      updateSavedData(ruleInfo.value)
    }
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
@import '~@/style/rule.scss';

.rule-detail {
  .el-card.detail-card {
    > .el-card__body {
      padding: 0px;
    }
  }
}
</style>
