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
                :disabled="!$hasPermission('put')"
                @change="toggleEnabled"
              />
            </span>
          </el-tooltip>
          <DeleteButton :loading="deleteLoading" @click="handleDeleteWebhook" />
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
              <el-button
                :loading="isSubmitting"
                :disabled="!$hasPermission('put')"
                type="primary"
                @click="submit"
              >
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
import { BridgeType, DetailTab } from '@/types/enum'
import { WebhookItem } from '@/types/webhook'
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
const namespace = computed(() => route.query.ns as string | undefined)
const ruleId = computed(() => fullName.value)

const tab = computed(() => route.query.tab && Number(route.query.tab))
const activeTab = ref(tab.value || DetailTab.Overview)

const { getWebhookName, syncHeaders } = useWebhookForm()
const infoLoading = ref(false)
const webhookData: Ref<WebhookItem | undefined> = ref(undefined)
const isSubmitting = ref(false)

const { getEnableStatus } = useWebhookUtils()

const { getConnectorDetail, requestPutConnector } = useHandleConnectorItem()
const { getActionDetail } = useHandleActionItem()
const { getRuleDetail } = useRuleItem()
const getWebhookData = async () => {
  if (!fullName.value) {
    return
  }
  infoLoading.value = true
  try {
    const [connectorData, actionData, ruleData] = await Promise.all([
      getConnectorDetail(actionId.value, namespace.value),
      getActionDetail(actionId.value, namespace.value),
      getRuleDetail(ruleId.value, namespace.value),
    ])
    const action = actionData
    webhookData.value = {
      name: getWebhookName(fullName.value),
      rule: ruleData,
      action,
      connector: connectorData,
      enable: getEnableStatus(action as any, ruleData),
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
    //
  }
}

const { getRuleDataForUpdate } = useRuleForm()
const { handleConnectorDataBeforeUpdate } = useConnectorDataHandler()
const { updateAction } = useHandleActionItem()
const { updateRule } = useRuleItem()
const submit = async () => {
  if (!webhookData.value) {
    return
  }
  try {
    await FormCom.value.validate()
    const data: any = checkNOmitFromObj(webhookData.value)
    isSubmitting.value = true
    syncHeaders(data)
    const connectorData = await handleConnectorDataBeforeUpdate(data.connector)
    await requestPutConnector(actionId.value, connectorData)
    await updateAction(data.action)
    await updateRule(ruleId.value, getRuleDataForUpdate(data.rule))
    ElMessage.success(tl('updateSuccess'))
    router.push({ name: 'webhook' })
  } catch (error) {
    console.error(error)
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
