<template>
  <div class="webhook-detail">
    <div class="detail-top">
      <detail-header :item="{ name: webhookName, routeName: 'webhook' }" />
      <div class="section-header">
        <div>
          <span class="title-n-status">
            <StatusDetailsOfEachNode :status-data="statusData" is-tag />
          </span>
        </div>
        <div>
          <el-tooltip
            :content="webhookData.enable ? $t('Base.disable') : $t('Base.enable')"
            placement="top"
          >
            <el-switch class="enable-btn" v-model="webhookData.enable" @change="toggleEnabled" />
          </el-tooltip>
          <el-tooltip :content="$t('Base.delete')" placement="top">
            <el-button
              class="icon-button"
              type="danger"
              :icon="Delete"
              @click="handleDeleteWebhook"
              :loading="deleteLoading"
              plain
            >
            </el-button>
          </el-tooltip>
        </div>
      </div>
    </div>
    <el-tabs class="detail-tabs" v-model="activeTab">
      <div class="app-wrapper">
        <el-tab-pane :label="tl('overview')" :name="DetailTab.Overview">
          <div class="overview-container" v-loading="infoLoading">
            <BridgeItemOverview
              v-if="!infoLoading"
              :bridge-id="webhookData.bridge.id"
              :bridge-msg="webhookData.bridge"
              @reconnect="getWebhookData"
            />
          </div>
        </el-tab-pane>
        <el-tab-pane :label="t('Base.setting')" :name="DetailTab.Setting" lazy>
          <el-card class="detail-card webhook-create-card app-card" v-loading="infoLoading">
            <WebhookFormCom ref="FormCom" v-model="webhookData" is-edit />
            <div class="card-ft">
              <el-button :loading="isSubmitting" type="primary" @click="submit">
                {{ tl('save') }}
              </el-button>
            </div>
          </el-card>
        </el-tab-pane>
      </div>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { getBridgeInfo, getRuleInfo, updateBridge, updateRules } from '@/api/ruleengine'
import { checkNOmitFromObj, getBridgeKey } from '@/common/tools'
import DetailHeader from '@/components/DetailHeader.vue'
import StatusDetailsOfEachNode from '@/components/StatusDetailsOfEachNode.vue'
import useRuleForm from '@/hooks/Rule/rule/useRuleForm'
import useRuleStatus from '@/hooks/Rule/rule/useRuleStatus'
import useWebhookForm from '@/hooks/Webhook/useWebhookForm'
import useWebhookItem from '@/hooks/Webhook/useWebhookItem'
import useWebhookUtils from '@/hooks/Webhook/useWebhookUtils'
import useI18nTl from '@/hooks/useI18nTl'
import { BridgeType, DetailTab } from '@/types/enum'
import { WebhookItem } from '@/types/webhook'
import { Delete } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { Ref, computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BridgeItemOverview from '../RuleEngine/Bridge/Components/BridgeItemOverview.vue'
import WebhookFormCom from './components/WebhookForm.vue'

const route = useRoute()
const router = useRouter()

const { t, tl } = useI18nTl('Base')

const FormCom = ref()

const webhookName = computed(() => route.params.name.toString())
const bridgeId = computed(() => {
  const bridgeName = getBridgeNameByName(webhookName.value)
  return getBridgeKey({ type: BridgeType.Webhook, name: bridgeName })
})
const ruleId = computed(() => getRuleIdByName(webhookName.value))

const tab = computed(() => route.query.tab && Number(route.query.tab))
const activeTab = ref(tab.value || DetailTab.Overview)

const { createRawWebhookForm, getRuleIdByName, getBridgeNameByName } = useWebhookForm()
const infoLoading = ref(false)
const webhookData: Ref<WebhookItem> = ref({ ...createRawWebhookForm(), enable: false })
const isSubmitting = ref(false)

const { getEnableStatus } = useWebhookUtils()

const getWebhookData = async () => {
  if (!webhookName.value) {
    return
  }
  infoLoading.value = true
  try {
    const [bridgeData, ruleData] = await Promise.all([
      getBridgeInfo(bridgeId.value),
      getRuleInfo(ruleId.value),
    ])
    webhookData.value = {
      name: webhookName.value,
      rule: ruleData,
      bridge: bridgeData,
      enable: getEnableStatus(bridgeData, ruleData),
    }
  } catch (error) {
    //
  } finally {
    infoLoading.value = false
  }
}

const { getStatusLabel, getStatusClass } = useRuleStatus()
const statusData = computed(() => ({
  details: [],
  statusLabel: getStatusLabel(webhookData.value.enable),
  statusClass: getStatusClass(webhookData.value.enable),
}))

const { toggleWebhookEnableStatus, deleteLoading, deleteWebhook } = useWebhookItem()
const toggleEnabled = async () => {
  const sucMessage = webhookData.value.enable ? 'Base.enableSuccess' : 'Base.disabledSuccess'
  try {
    await toggleWebhookEnableStatus(webhookData.value)
    ElMessage.success(t(sucMessage))
    getWebhookData()
  } catch (error) {
    webhookData.value.enable = !webhookData.value.enable
  }
}

const handleDeleteWebhook = async () => {
  try {
    await deleteWebhook(webhookData.value)
    router.push({ name: 'webhook' })
  } catch (error) {
    ElMessage.error(t('Base.deleteFailed'))
  }
}

const { getRuleDataForUpdate } = useRuleForm()
const submit = async () => {
  try {
    await FormCom.value.validate()
    const data: any = checkNOmitFromObj(webhookData.value)
    isSubmitting.value = true
    // Because it is easier to report errors when creating bridge, put it in the front..
    await updateBridge(bridgeId.value, data.bridge)
    await updateRules(ruleId.value, getRuleDataForUpdate(data.rule))
    ElMessage.success(tl('updateSuccess'))
    router.push({ name: 'webhook' })
  } catch (error) {
    //
  } finally {
    isSubmitting.value = false
  }
}

getWebhookData()
</script>

<style lang="scss">
.webhook-detail {
  .card-ft {
    padding-top: 36px;
  }
  .overview-container {
    min-height: 400px;
  }
}
</style>
