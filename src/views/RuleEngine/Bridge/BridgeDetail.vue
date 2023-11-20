<template>
  <div class="bridge-detail">
    <div class="detail-top">
      <detail-header
        v-if="!isFromRule"
        :item="{ name: bridgeInfo.name, routeName: 'data-bridge' }"
      />
      <div v-if="!isFromRule" class="section-header">
        <div>
          <img :src="getBridgeIcon(bridgeInfo.type)" />
          <div class="title-n-status">
            <div class="info-tags">
              <TargetItemStatus :target="bridgeInfo" is-tag />
              <el-tag type="info" class="section-status">
                {{ getTypeStr(bridgeInfo) }}
              </el-tag>
            </div>
          </div>
        </div>
        <div>
          <el-tooltip
            :content="bridgeInfo.enable ? $t('Base.disable') : $t('Base.enable')"
            placement="top"
          >
            <el-switch
              class="enable-btn"
              v-model="bridgeInfo.enable"
              @change="enableOrDisableBridge"
            />
          </el-tooltip>
          <el-tooltip :content="tl('createRule')" placement="top">
            <el-button
              class="icon-button"
              type="primary"
              :icon="Share"
              :disabled="!bridgeInfo.enable"
              plain
              @click="createRuleWithBridge"
            >
            </el-button>
          </el-tooltip>
          <el-tooltip :content="$t('Base.delete')" placement="top">
            <el-button class="icon-button" type="danger" :icon="Delete" @click="handleDelete" plain>
            </el-button>
          </el-tooltip>
        </div>
      </div>
    </div>
    <el-tabs :class="['detail-tabs', { 'hide-tabs': isFromRule }]" v-model="activeTab">
      <div :class="{ 'app-wrapper': !isFromRule, 'detail-main': true }">
        <el-tab-pane :label="tl('overview')" :name="Tab.Overview">
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
            <div class="setting-area" :style="{ width: isFromRule ? '100%' : '75%' }">
              <bridge-http-config
                v-if="bridgeType === BridgeType.Webhook"
                v-model:tls="bridgeInfo.ssl"
                v-model="bridgeInfo"
                ref="formCom"
                :edit="true"
                @init="resetRawBridgeInfoAfterComponentInit"
              />
              <bridge-mqtt-config
                v-else-if="bridgeType === BridgeType.MQTT"
                ref="formCom"
                v-model="bridgeInfo"
                :edit="true"
                @init="resetRawBridgeInfoAfterComponentInit"
              />
            </div>
            <div v-if="!isFromRule" class="btn-area">
              <el-button @click="saveAsCopy">
                {{ tl('saveAsCopy') }}
              </el-button>
              <el-button
                v-if="bridgeInfo.type"
                type="primary"
                plain
                :loading="isTesting"
                @click="testConnection"
              >
                {{ tl('testTheConnection') }}
              </el-button>
              <el-button
                type="primary"
                v-if="bridgeInfo.type"
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
    <CopySubmitDialog v-model="showNameInputDialog" :target="copyTarget" />
    <DeleteBridgeSecondConfirm
      v-model="showSecondConfirm"
      :rule-list="usingBridgeRules"
      :id="currentDeleteBridgeId"
      @submitted="handleDeleteSuc"
    />
  </div>
</template>

<script lang="ts" setup>
import { getBridgeInfo, startStopBridge, testConnect, updateBridge } from '@/api/ruleengine'
import { BRIDGE_TYPES_NOT_USE_SCHEMA } from '@/common/constants'
import { customValidate } from '@/common/tools'
import DetailHeader from '@/components/DetailHeader.vue'
import { useBridgeDataHandler } from '@/hooks/Rule/useDataHandler'
import { useBridgeTypeIcon, useBridgeTypeOptions } from '@/hooks/Rule/bridge/useBridgeTypeValue'
import useCheckBeforeSaveAsCopy from '@/hooks/Rule/bridge/useCheckBeforeSaveAsCopy'
import useDeleteBridge from '@/hooks/Rule/bridge/useDeleteBridge'
import useI18nTl from '@/hooks/useI18nTl'
import { BridgeType } from '@/types/enum'
import { BridgeItem } from '@/types/rule'
import { Delete, Share } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import _ from 'lodash'
import {
  ComputedRef,
  Ref,
  computed,
  defineExpose,
  defineProps,
  onActivated,
  onMounted,
  ref,
  watch,
} from 'vue'
import { useRoute, useRouter } from 'vue-router'
import CopySubmitDialog from '../components/CopySubmitDialog.vue'
import BridgeHttpConfig from './Components/BridgeConfig/BridgeHttpConfig.vue'
import BridgeMqttConfig from './Components/BridgeConfig/BridgeMqttConfig.vue'
import BridgeItemOverview from './Components/BridgeItemOverview.vue'
import TargetItemStatus from '../components/TargetItemStatus.vue'
import DeleteBridgeSecondConfirm from './Components/DeleteBridgeSecondConfirm.vue'

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
const isTesting = ref(false)
const props = defineProps({
  bridgeId: {
    type: String,
    default: '',
  },
})
const formCom = ref()

const queryTab = computed(() => {
  return route.query.tab as Tab
})
if (queryTab.value) {
  activeTab.value = queryTab.value
}

const { getTypeStr, getBridgeType } = useBridgeTypeOptions()
const { getBridgeIcon } = useBridgeTypeIcon()

const { tl, t } = useI18nTl('RuleEngine')

const isFromRule = computed(() => ['iot-detail', 'iot-create'].includes(route.name as string))
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
  return getBridgeType(type)
})
const isSettingCardLoading = computed(
  () => infoLoading.value && BRIDGE_TYPES_NOT_USE_SCHEMA.includes(bridgeType.value),
)
const { handleBridgeDataAfterLoaded, handleBridgeDataBeforeSubmit, handleBridgeDataForSaveAsCopy } =
  useBridgeDataHandler()

const loadBridgeInfo = async () => {
  infoLoading.value = true
  try {
    const data = await getBridgeInfo(id.value)
    bridgeInfo.value = handleBridgeDataAfterLoaded(data)
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
  if (!BRIDGE_TYPES_NOT_USE_SCHEMA.includes(bridgeInfo.value.type)) {
    bridgeInfo.value = formCom.value.getFormRecord()
  }
}

const getDataForSubmit = () => {
  setBridgeInfoFromSchemaForm()
  return handleBridgeDataBeforeSubmit(_.cloneDeep(bridgeInfo.value))
}

const showNameInputDialog = ref(false)
/**
 * diff form bridge info, data for copy
 */
const bridgeData = ref({} as BridgeItem)
const copyTarget: ComputedRef<{ type: 'bridge'; obj: BridgeItem }> = computed(() => ({
  type: 'bridge',
  obj: bridgeData.value,
}))

const { pwdErrorWhenCoping, checkLikePwdField } = useCheckBeforeSaveAsCopy()
const saveAsCopy = async () => {
  try {
    await customValidate(formCom.value)
    const bridge = await getDataForSubmit()
    await checkLikePwdField(bridge)
    bridgeData.value = handleBridgeDataForSaveAsCopy(bridge)
    showNameInputDialog.value = true
  } catch (error) {
    //
  }
}

const testConnection = async () => {
  try {
    await customValidate(formCom.value)
    isTesting.value = true
    const data = await getDataForSubmit()
    await testConnect(_.omit(data, 'id'))
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

    await ElMessageBox.confirm(tl('updateBridgeTip'), {
      confirmButtonText: t('Base.confirm'),
      cancelButtonText: t('Base.cancel'),
      type: 'warning',
    })

    updateLoading.value = true
    const data = await getDataForSubmit()
    const res = await updateBridge(bridgeInfo.value.id, data)
    if (!isFromRule.value) {
      ElMessage.success(t('Base.updateSuccess'))
      router.push({ name: 'data-bridge' })
    }
    return Promise.resolve(res.id)
  } catch (error) {
    // ignore error
  } finally {
    updateLoading.value = false
  }
}

const enableOrDisableBridge = async () => {
  infoLoading.value = true
  bridgeInfo.value.enable = !bridgeInfo.value.enable
  const statusToSend = bridgeInfo.value.enable ? 'disable' : 'enable'
  const sucMessage = bridgeInfo.value.enable ? 'Base.disabledSuccess' : 'Base.enableSuccess'
  try {
    await startStopBridge(bridgeInfo.value.id, statusToSend)
    ElMessage.success(t(sucMessage))
    loadBridgeInfo()
  } catch (error) {
    console.error(error)
  } finally {
    infoLoading.value = false
  }
}

const createRuleWithBridge = () => {
  ElMessageBox.confirm(tl('useBridgeCreateRule'), {
    confirmButtonText: t('Base.confirm'),
    cancelButtonText: t('Base.cancel'),
    type: 'success',
  })
    .then(() => {
      router.push({ name: 'iot-create', query: { bridgeId: bridgeInfo.value.id } })
    })
    .catch(() => ({}))
}

const goBack = () => {
  router.push({ name: 'data-bridge' })
}
const {
  showSecondConfirm,
  usingBridgeRules,
  currentDeleteBridgeId,
  handleDeleteSuc,
  handleDeleteBridge,
} = useDeleteBridge(goBack)
const handleDelete = async () => {
  if (!id.value) {
    return
  }
  handleDeleteBridge(id.value)
}

const setActiveTab = () => {
  const { params } = route
  if (params.activeTab && params.activeTab === 'Setting') {
    activeTab.value = Tab.Setting
  }
}

onMounted(() => {
  loadBridgeInfo()
})

onActivated(() => {
  setActiveTab()
})

defineExpose({
  updateBridgeInfo,
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
  :deep(.el-card__body) {
    padding: 0px;
  }
}
</style>
