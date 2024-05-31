<template>
  <div class="webhook-detail">
    <div class="detail-top">
      <detail-header :item="{ name: fullName, routeName: 'webhook' }">
        <template #content>
          <div class="vertical-align-center">
            <p class="block-title">{{ fullName }}</p>
            <StatusDetailsOfEachNode :status-data="statusData" is-tag />
          </div>
        </template>
        <template #extra>
          <el-tooltip
            :content="webhookData?.enable ? $t('Base.disable') : $t('Base.enable')"
            placement="top"
          >
            <span>
              <el-switch
                v-if="webhookData"
                class="enable-btn"
                v-model="webhookData.enable"
                @change="toggleEnabled"
              />
            </span>
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
        </template>
      </detail-header>
    </div>
    <el-tabs class="detail-tabs" v-model="activeTab">
      <div class="app-wrapper">
        <el-tab-pane :label="tl('overview')" :name="DetailTab.Overview" lazy>
          <div class="overview-container" v-loading="infoLoading">
            <BridgeItemOverview
              v-if="!infoLoading && webhookData"
              :bridge-id="webhookData.action.id"
              :bridge-msg="webhookData.action"
              @reconnect="getWebhookData"
            />
          </div>
        </el-tab-pane>
        <el-tab-pane :label="t('Base.setting')" :name="DetailTab.Setting" lazy>
          <el-card class="detail-card webhook-create-card app-card" v-loading="infoLoading">
            <WebhookFormCom v-if="webhookData" ref="FormCom" v-model="webhookData" is-edit />
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
import { getActionDetail, putAction } from '@/api/action'
import { getConnectorDetail, putConnector } from '@/api/connector'
import { getRuleInfo, updateRules } from '@/api/ruleengine'
import { checkNOmitFromObj, getBridgeKey } from '@/common/tools'
import DetailHeader from '@/components/DetailHeader.vue'
import StatusDetailsOfEachNode from '@/components/StatusDetailsOfEachNode.vue'
import useRuleForm from '@/hooks/Rule/rule/useRuleForm'
import useRuleStatus from '@/hooks/Rule/rule/useRuleStatus'
import { useActionDataHandler, useConnectorDataHandler } from '@/hooks/Rule/useDataHandler'
import useWebhookForm from '@/hooks/Webhook/useWebhookForm'
import useWebhookItem from '@/hooks/Webhook/useWebhookItem'
import useWebhookUtils from '@/hooks/Webhook/useWebhookUtils'
import useI18nTl from '@/hooks/useI18nTl'
import { BridgeType, DetailTab } from '@/types/enum'
import { HTTPBridge } from '@/types/rule'
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

const fullName = computed(() => route.params.name.toString())
const actionId = computed(() => {
  const actionName = fullName.value
  return getBridgeKey({ type: BridgeType.Webhook, name: actionName })
})
const ruleId = computed(() => fullName.value)

const tab = computed(() => route.query.tab && Number(route.query.tab))
const activeTab = ref(tab.value || DetailTab.Overview)

const { getWebhookName } = useWebhookForm()
const infoLoading = ref(false)
const webhookData: Ref<WebhookItem | undefined> = ref(undefined)
const isSubmitting = ref(false)

const { getEnableStatus } = useWebhookUtils()

const getWebhookData = async () => {
  if (!fullName.value) {
    return
  }
  infoLoading.value = true
  try {
    const [connectorData, actionData, ruleData] = await Promise.all([
      getConnectorDetail(actionId.value),
      getActionDetail(actionId.value),
      getRuleInfo(ruleId.value),
    ])
    const action = actionData as HTTPBridge
    webhookData.value = {
      name: getWebhookName(fullName.value),
      rule: ruleData,
      action,
      connector: connectorData,
      enable: getEnableStatus(action, ruleData),
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
  statusLabel: getStatusLabel(webhookData.value?.enable),
  statusClass: getStatusClass(webhookData.value?.enable),
}))

const { toggleWebhookEnableStatus, deleteLoading, deleteWebhook } = useWebhookItem()
const toggleEnabled = async () => {
  if (!webhookData.value) {
    return
  }
  const sucMessage = webhookData.value?.enable ? 'Base.enableSuccess' : 'Base.disabledSuccess'
  try {
    await toggleWebhookEnableStatus(webhookData.value)
    ElMessage.success(t(sucMessage))
    getWebhookData()
  } catch (error) {
    webhookData.value.enable = !webhookData.value.enable
  }
}

const handleDeleteWebhook = async () => {
  if (!webhookData.value) {
    return
  }
  try {
    await deleteWebhook(webhookData.value)
    router.push({ name: 'webhook' })
  } catch (error) {
    ElMessage.error(t('Base.deleteFailed'))
  }
}

const { getRuleDataForUpdate } = useRuleForm()
const { handleConnectorDataBeforeUpdate } = useConnectorDataHandler()
const { handleActionDataBeforeUpdate } = useActionDataHandler()
const submit = async () => {
  if (!webhookData.value) {
    return
  }
  try {
    await FormCom.value.validate()
    const data: any = checkNOmitFromObj(webhookData.value)
    isSubmitting.value = true
    const [connectorData, actionData] = await Promise.all([
      handleConnectorDataBeforeUpdate(data.connector),
      handleActionDataBeforeUpdate(data.action),
    ])
    await putConnector(actionId.value, connectorData)
    await putAction(actionId.value, actionData)
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
