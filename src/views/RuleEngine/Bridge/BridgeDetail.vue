<template>
  <div class="bridge-detail">
    <div class="detail-top">
      <detail-header v-if="!isFromRule" :item="{ name: bridgeInfo.name, routeName: 'actions' }">
        <template #content>
          <div class="vertical-align-center">
            <img :src="getBridgeIcon(bridgeInfo.type)" />
            <p class="block-title">{{ bridgeInfo.name }}</p>
            <TargetItemStatus type="action" :target="bridgeInfo" is-tag />
            <el-tag type="info" class="section-status">
              {{ getGeneralTypeLabel(bridgeInfo.type) }}
            </el-tag>
          </div>
        </template>
        <template #extra>
          <el-tooltip
            :content="bridgeInfo.enable ? $t('Base.disable') : $t('Base.enable')"
            placement="top"
          >
            <el-switch
              class="enable-btn"
              v-model="bridgeInfo.enable"
              :disabled="!$hasPermission('put') || isWebhookAction"
              @change="enableOrDisableBridge"
            />
          </el-tooltip>
          <el-tooltip :content="tl('createRule')" placement="top">
            <el-button
              class="icon-button"
              type="primary"
              :icon="Share"
              :disabled="!$hasPermission('post') || isWebhookAction"
              plain
              @click="createRuleWithBridge"
            >
            </el-button>
          </el-tooltip>
          <el-tooltip :content="$t('Base.delete')" placement="top">
            <el-button
              class="icon-button"
              :disabled="!$hasPermission('delete') || isWebhookAction"
              type="danger"
              :icon="Delete"
              @click="handleDelete"
              plain
            >
            </el-button>
          </el-tooltip>
        </template>
      </detail-header>
    </div>
    <el-tabs :class="['detail-tabs', { 'hide-tabs': isFromRule }]" v-model="activeTab">
      <div :class="{ 'app-wrapper': !isFromRule, 'detail-main': true }">
        <el-tab-pane v-if="!isFromRule" :label="tl('overview')" :name="Tab.Overview" lazy>
          <div
            class="overview-container"
            :class="{ 'is-loading': infoLoading }"
            v-loading="infoLoading"
          >
            <BridgeItemOverview
              v-if="!infoLoading"
              :bridge-id="id"
              :bridge-msg="bridgeInfo"
              @reconnect="loadBridgeInfo"
            />
          </div>
        </el-tab-pane>
        <el-tab-pane :label="t('Base.setting')" :name="Tab.Setting">
          <el-alert v-if="pwdErrorWhenCoping" :title="pwdErrorWhenCoping" type="error" />
          <el-card
            v-loading="isSettingCardLoading"
            :class="['app-card', isFromRule && 'app-inline-card']"
            :shadow="isFromRule ? 'never' : undefined"
          >
            <el-alert
              v-if="isWebhookAction"
              class="webhook-tip-alert"
              show-icon
              type="info"
              :closable="false"
            >
              <i18n-t keypath="RuleEngine.handleWebhookAssociatedTip" tag="p">
                <template #target>
                  <span>{{ t('RuleEngine.action') }}</span>
                </template>
                <template #operation>
                  <span>{{ _.lowerCase(t('Base.edit')) }}</span>
                </template>
                <template #page>
                  <router-link :to="webhookRoute">Webhook {{ t('RuleEngine.page') }}</router-link>
                </template>
              </i18n-t>
            </el-alert>
            <div class="setting-area" :style="{ width: isFromRule ? '100%' : '75%' }">
              <bridge-influxdb-config
                v-if="[BridgeType.InfluxDB, BridgeType.Datalayers].includes(bridgeType)"
                v-model="bridgeInfo"
                ref="formCom"
                :edit="true"
                :type="bridgeType"
                :disabled="disabled"
                :hide-name="hideName"
                @init="resetRawBridgeInfoAfterComponentInit"
              />
              <using-schema-bridge-config
                v-else-if="bridgeType && !BRIDGE_TYPES_NOT_USE_SCHEMA.includes(bridgeType)"
                edit
                :type="bridgeType"
                v-model="bridgeInfo"
                ref="formCom"
                :disabled="disabled"
                :hide-name="hideName"
                :form-props="formProps"
              />
            </div>
            <div v-if="!isFromRule" class="btn-area">
              <el-button
                v-if="bridgeInfo.type"
                type="primary"
                :disabled="!$hasPermission('put')"
                plain
                :loading="isTesting"
                @click="testConnection"
              >
                {{ tl('testTheConnection') }}
              </el-button>
              <el-button
                type="primary"
                v-if="bridgeInfo.type"
                :disabled="!$hasPermission('put') || isWebhookAction"
                :loading="updateLoading"
                @click="updateBridgeInfo()"
              >
                {{ $t('Base.update') }}
              </el-button>
            </div>
          </el-card>
        </el-tab-pane>
      </div>
    </el-tabs>
    <DeleteBridgeSecondConfirm
      v-model="showSecondConfirm"
      :rule-list="usingBridgeRules"
      :id="currentDeleteBridgeId"
      @submitted="handleDeleteSuc"
    />
    <DeleteWebhookAssociatedTip
      v-model="showDeleteWebhookAssociatedTip"
      type="action"
      :name="currentDelName"
    />
  </div>
</template>

<script lang="ts" setup>
import { BRIDGE_TYPES_NOT_USE_SCHEMA } from '@/common/constants'
import { customValidate } from '@/common/tools'
import DetailHeader from '@/components/DetailHeader.vue'
import useHandleActionItem from '@/hooks/Rule/action/useHandleActionItem'
import { useBridgeTypeIcon, useBridgeTypeValue } from '@/hooks/Rule/bridge/useBridgeTypeValue'
import useCheckBeforeSaveAsCopy from '@/hooks/Rule/bridge/useCheckBeforeSaveAsCopy'
import useDeleteBridge from '@/hooks/Rule/bridge/useDeleteBridge'
import useWebhookUtils from '@/hooks/Webhook/useWebhookUtils'
import useI18nTl from '@/hooks/useI18nTl'
import { BridgeType, DetailTab } from '@/types/enum'
import { BridgeItem } from '@/types/rule'
import BridgeInfluxdbConfig from '@/views/RuleEngine/Bridge/Components/BridgeConfig/BridgeInfluxdbConfig.vue'
import { Delete, Share } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import _ from 'lodash'
import { Ref, computed, defineExpose, defineProps, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DeleteWebhookAssociatedTip from '../components/DeleteWebhookAssociatedTip.vue'
import TargetItemStatus from '../components/TargetItemStatus.vue'
import BridgeItemOverview from './Components/BridgeItemOverview.vue'
import DeleteBridgeSecondConfirm from './Components/DeleteBridgeSecondConfirm.vue'
import UsingSchemaBridgeConfig from './Components/UsingSchemaBridgeConfig.vue'

enum Tab {
  Overview = 'overview',
  Setting = 'settings',
}

const route = useRoute()
const router = useRouter()
// for compare when update
let rawBridgeInfo: undefined | BridgeItem = undefined
const bridgeInfo: Ref<BridgeItem> = ref({} as BridgeItem)
const infoLoading = ref(false)
const updateLoading = ref(false)
const activeTab = ref(Tab.Overview)
const props = defineProps({
  bridgeId: {
    type: String,
    default: '',
  },
  /**
   * for viewing data
   */
  disabled: {
    type: Boolean,
    default: false,
  },
  /**
   * for rule
   */
  hideName: {
    type: Boolean,
    default: false,
  },
})
const formCom = ref()

const queryTab = computed(() => {
  return route.query.tab as Tab
})
if (queryTab.value) {
  activeTab.value = queryTab.value
}

const { getBridgeGeneralType, getGeneralTypeLabel } = useBridgeTypeValue()
const { getBridgeIcon } = useBridgeTypeIcon()

const { tl, t } = useI18nTl('RuleEngine')

const isFromRule = computed(() => ['rule-detail', 'rule-create'].includes(route.name as string))
if (isFromRule.value && props.bridgeId) {
  activeTab.value = Tab.Setting
}

const id = computed(() => {
  if (isFromRule.value) {
    return props.bridgeId as string
  }
  return route.params.id as string
})

watch(id, (val) => {
  if (val && isFromRule.value) {
    loadBridgeInfo()
  }
})

/**
 * if type is influxDB v1 or v2, will be count to influxDB uniformly
 */
const bridgeType = computed(() => {
  const type = id.value.slice(0, id.value.indexOf(':'))
  return getBridgeGeneralType(type)
})
const isSettingCardLoading = computed(
  () => infoLoading.value && BRIDGE_TYPES_NOT_USE_SCHEMA.includes(bridgeType.value),
)
const { getDetail, updateAction, toggleActionEnable, isTesting, testConnectivity } =
  useHandleActionItem()

/* Webhook associated */
const { judgeIsWebhookAction } = useWebhookUtils()
const isWebhookAction = computed(() => judgeIsWebhookAction(bridgeInfo.value))
const formProps = computed(() => (isWebhookAction.value ? { disabled: true } : {}))
const webhookRoute = computed(() => ({
  name: 'webhook-detail',
  params: { name: bridgeInfo.value.name },
  query: { tab: DetailTab.Setting },
}))

const loadBridgeInfo = async () => {
  infoLoading.value = true
  try {
    bridgeInfo.value = await getDetail(id.value)
    rawBridgeInfo = _.cloneDeep(bridgeInfo.value)
  } catch (error) {
    console.error(error)
  } finally {
    infoLoading.value = false
  }
}

/**
 * because each component will fill empty value to the bridgeInfo, so we need to
 * reset the raw bridge info to prevent compare error
 */
const resetRawBridgeInfoAfterComponentInit = (bridgeInfo: BridgeItem) => {
  rawBridgeInfo = _.cloneDeep(bridgeInfo)
}

const setBridgeInfoFromSchemaForm = () => {
  if (!BRIDGE_TYPES_NOT_USE_SCHEMA.includes(bridgeType.value)) {
    bridgeInfo.value = formCom.value.getFormRecord()
  }
}

const getDataForSubmit = () => {
  setBridgeInfoFromSchemaForm()
  return bridgeInfo.value
}

const { pwdErrorWhenCoping } = useCheckBeforeSaveAsCopy()

const testConnection = async () => {
  try {
    await customValidate(formCom.value)
    isTesting.value = true
    const data = await getDataForSubmit()
    await testConnectivity(_.omit(data, 'id') as any)
    ElMessage.success(tl('connectionSuccessful'))
  } catch (error) {
    //
  } finally {
    isTesting.value = false
  }
}

const updateBridgeInfo = async () => {
  try {
    await customValidate(formCom.value)
    setBridgeInfoFromSchemaForm()

    // Check for changes before updating and do not request if there are no changes
    // TODO:check the schema form & MQTT
    if (isFromRule.value && _.isEqual(bridgeInfo.value, rawBridgeInfo)) {
      return Promise.resolve(bridgeInfo.value.id)
    }

    await ElMessageBox.confirm(tl('updateActionTip'), {
      confirmButtonText: t('Base.confirm'),
      cancelButtonText: t('Base.cancel'),
      type: 'warning',
    })

    updateLoading.value = true
    const data = await getDataForSubmit()
    const res = await updateAction(data as any)
    if (!isFromRule.value) {
      ElMessage.success(t('Base.updateSuccess'))
      router.push({ name: 'actions' })
    }
    updateLoading.value = false
    return Promise.resolve(res.id)
  } catch (error) {
    updateLoading.value = false
    return Promise.reject(error)
  }
}

const enableOrDisableBridge = async () => {
  infoLoading.value = true
  const { enable } = bridgeInfo.value
  const sucMessage = enable ? 'Base.enableSuccess' : 'Base.disabledSuccess'
  try {
    await toggleActionEnable(bridgeInfo.value.id, enable)
    ElMessage.success(t(sucMessage))
    loadBridgeInfo()
  } catch (error) {
    console.error(error)
  } finally {
    infoLoading.value = false
  }
}

const createRuleWithBridge = () => {
  ElMessageBox.confirm(tl('useActionCreateRule'), {
    confirmButtonText: t('Base.confirm'),
    cancelButtonText: t('Base.cancel'),
    type: 'success',
  })
    .then(() => {
      router.push({ name: 'rule-create', query: { actionId: bridgeInfo.value.id } })
    })
    .catch(() => ({}))
}

const goBack = () => {
  router.push({ name: 'actions' })
}
const {
  showSecondConfirm,
  usingBridgeRules,
  currentDeleteBridgeId,
  showDeleteWebhookAssociatedTip,
  currentDelName,
  handleDeleteSuc,
  handleDeleteBridge,
} = useDeleteBridge(goBack)
const handleDelete = async () => {
  if (!id.value) {
    return
  }
  handleDeleteBridge(bridgeInfo.value)
}

onMounted(() => {
  loadBridgeInfo()
})

defineExpose({
  updateBridgeInfo,
  testConnection,
})
</script>

<style lang="scss">
@import '~@/style/rule.scss';
</style>

<style lang="scss" scoped>
.setting-area {
  width: 75%;
  min-height: 400px;
}
.btn-area {
  margin-top: 24px;
  .el-button {
    margin-left: 0;
    margin-right: 12px;
  }
}
.hide-tabs {
  > :deep(.el-tabs__header) {
    display: none;
  }
}
.overview-container.is-loading {
  height: 600px;
}
.app-inline-card {
  min-height: 300px;
  overflow: visible;
  :deep(> .el-card__body) {
    padding: 0px;
  }
}
</style>
