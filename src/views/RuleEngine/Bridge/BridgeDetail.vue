<template>
  <div :class="{ 'app-wrapper': !isFromRule }">
    <div class="bridge-detail">
      <detail-header
        v-if="!isFromRule"
        :item="{ name: bridgeInfo.name, routeName: 'data-bridge' }"
      />
      <div class="detail-main">
        <div v-if="!isFromRule" class="section-header">
          <div>
            <img :src="getBridgeIcon(bridgeInfo.type)" />
            <div class="title-n-status">
              <div class="info-tags">
                <BridgeItemStatus :bridge="bridgeInfo" is-tag />
                <el-tag type="info" class="section-status">
                  {{ getTypeStr(bridgeInfo) }}
                </el-tag>
              </div>
            </div>
          </div>
          <div>
            <el-button
              type="primary"
              :disabled="!bridgeInfo.enable"
              plain
              @click="createRuleWithBridge"
            >
              {{ tl('createRule') }}
            </el-button>
            <el-button @click="enableOrDisableBridge">
              {{ bridgeInfo.enable ? $t('Base.disable') : $t('Base.enable') }}
            </el-button>
            <el-button type="danger" @click="handleDelete" plain>
              {{ $t('Base.delete') }}
            </el-button>
          </div>
        </div>
        <el-tabs
          type="card"
          :class="['detail-tabs', { 'hide-tabs': isFromRule }]"
          v-model="activeTab"
        >
          <el-tab-pane :label="tl('overview')" :name="Tab.Overview">
            <div v-loading="infoLoading">
              <BridgeItemOverview
                :bridge-msg="bridgeInfo"
                @refresh="loadBridgeInfo"
                @reconnect="loadBridgeInfo"
                @reset="loadBridgeInfo"
              />
            </div>
          </el-tab-pane>
          <el-tab-pane :label="t('Base.setting')" :name="Tab.Setting">
            <el-card
              v-loading="infoLoading"
              class="app-card"
              :shadow="isFromRule ? 'never' : undefined"
            >
              <div class="setting-area" :style="{ width: isFromRule ? '100%' : '75%' }">
                <bridge-http-config
                  v-if="bridgeInfo.type === BridgeType.Webhook"
                  v-model:tls="bridgeInfo.ssl"
                  v-model="bridgeInfo"
                  ref="formCom"
                  :edit="true"
                />
                <bridge-mqtt-config
                  v-else-if="bridgeInfo.type === BridgeType.MQTT"
                  ref="formCom"
                  v-model="bridgeInfo"
                  :edit="true"
                  @init="resetRawBridgeInfoAfterComponentInit"
                />
              </div>
              <div v-if="!isFromRule" class="btn-area">
                <el-button
                  v-if="bridgeInfo.type"
                  type="primary"
                  plain
                  :loading="isTesting"
                  @click="testConnection"
                >
                  {{ tl('testTheConnection') }}
                </el-button>
                <el-button type="primary" plain @click="saveAsCopy">
                  {{ tl('saveAsCopy') }}
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
        </el-tabs>
      </div>
    </div>
    <CopySubmitDialog v-model="showNameInputDialog" :target="copyTarget" />
  </div>
  <DeleteBridgeSecondConfirm
    v-model="showSecondConfirm"
    :rule-list="usingBridgeRules"
    :id="currentDeleteBridgeId"
    @submitted="handleDeleteSuc"
  />
</template>

<script lang="ts" setup>
import {
  computed,
  onActivated,
  onMounted,
  ref,
  Ref,
  defineProps,
  defineExpose,
  watch,
  ComputedRef,
} from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getBridgeInfo, updateBridge, startStopBridge, testConnect } from '@/api/ruleengine'
import { BridgeItem } from '@/types/rule'
import BridgeHttpConfig from './Components/BridgeConfig/BridgeHttpConfig.vue'
import BridgeMqttConfig from './Components/BridgeConfig/BridgeMqttConfig.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useBridgeTypeOptions, useBridgeTypeIcon } from '@/hooks/Rule/bridge/useBridgeTypeValue'
import BridgeItemOverview from './Components/BridgeItemOverview.vue'
import BridgeItemStatus from './Components/BridgeItemStatus.vue'
import DetailHeader from '@/components/DetailHeader.vue'
import { BridgeType } from '@/types/enum'
import _ from 'lodash'
import { BRIDGE_TYPES_NOT_USE_SCHEMA } from '@/common/constants'
import useI18nTl from '@/hooks/useI18nTl'
import CopySubmitDialog from '../components/CopySubmitDialog.vue'
import DeleteBridgeSecondConfirm from './Components/DeleteBridgeSecondConfirm.vue'
import useDeleteBridge from '@/hooks/Rule/bridge/useDeleteBridge'
import useBridgeDataHandler from '@/hooks/Rule/bridge/useBridgeDataHandler'

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

const { getTypeStr } = useBridgeTypeOptions()
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

const { handleBridgeDataAfterLoaded, handleBridgeDataBeforeSubmit } = useBridgeDataHandler()

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
  const data = _.cloneDeep(bridgeInfo.value)
  return handleBridgeDataBeforeSubmit(data)
}

const showNameInputDialog = ref(false)
const bridgeData = ref({} as BridgeItem)
const copyTarget: ComputedRef<{ type: 'bridge'; obj: BridgeItem }> = computed(() => ({
  type: 'bridge',
  obj: bridgeData.value,
}))
const saveAsCopy = () => {
  bridgeData.value = getDataForSubmit()
  showNameInputDialog.value = true
}

const testConnection = async () => {
  try {
    await formCom.value.validate()
  } catch (error) {
    return
  }

  try {
    isTesting.value = true
    await testConnect(_.omit(getDataForSubmit(), 'id'))
    ElMessage.success(tl('connectionSuccessful'))
  } catch (error) {
    //
  } finally {
    isTesting.value = false
  }
}

const updateBridgeInfo = async () => {
  try {
    await formCom.value.validate()
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
    const res = await updateBridge(bridgeInfo.value.id, getDataForSubmit())
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

<style lang="scss" scoped>
.section-header img {
  height: 64px;
  vertical-align: top;
}
.title-n-status {
  vertical-align: top;
}
.section-title {
  margin-top: 0;
  margin-bottom: 0;
  font-size: 16px;
  font-weight: bold;
  line-height: 22px;
}
.info-tags {
  .el-tag,
  :deep(.node-status) {
    margin-right: 8px;
  }
}
.setting-area {
  width: 75%;
}
.btn-area {
  margin-top: 40px;
}
.hide-tabs {
  > :deep(.el-tabs__header) {
    display: none;
  }
}
</style>
