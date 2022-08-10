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
            <el-button type="danger" @click="deleteBridge" plain>
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
          <el-tab-pane :label="tl('settings')" :name="Tab.Setting">
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
                  v-model="bridgeInfo"
                  ref="formCom"
                  :edit="true"
                />
                <bridge-influxdb-v1-config
                  v-if="bridgeInfo.type === BridgeType.InfluxDBV1"
                  v-model="bridgeInfo"
                  ref="formCom"
                />
              </div>
              <div v-if="!isFromRule" class="btn-area">
                <el-button
                  v-if="bridgeInfo.type && canTest"
                  type="primary"
                  plain
                  :loading="isTesting"
                  @click="testTheConnection"
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
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onActivated, onMounted, ref, Ref, defineProps, defineExpose, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  getBridgeInfo,
  updateBridge,
  startStopBridge,
  deleteBridge as requestDeleteBridge,
} from '@/api/ruleengine'
import { BridgeItem } from '@/types/rule'
import { useI18n } from 'vue-i18n'
import BridgeHttpConfig from './BridgeHttpConfig.vue'
import BridgeMqttConfig from './BridgeMqttConfig.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useBridgeTypeOptions, useBridgeTypeIcon } from '@/hooks/Rule/bridge/useBridgeTypeValue'
import BridgeItemOverview from './Components/BridgeItemOverview.vue'
import BridgeItemStatus from './Components/BridgeItemStatus.vue'
import DetailHeader from '@/components/DetailHeader.vue'
import useSSL from '@/hooks/useSSL'
import { BridgeType } from '@/types/enum'
import useTestConnection from '@/hooks/Rule/bridge/useTestConnection'
import _ from 'lodash'
import { BRIDGE_TYPES_NOT_USE_SCHEMA } from '@/common/constants'
import BridgeInfluxdbV1Config from './Components/BridgeInfluxdbV1Config.vue'

enum Tab {
  Overview = 'overview',
  Setting = 'settings',
}

const route = useRoute()
const router = useRouter()
const bridgeInfo: Ref<BridgeItem> = ref({} as BridgeItem)
const { t } = useI18n()
const infoLoading = ref(false)
const updateLoading = ref(false)
const activeTab = ref(Tab.Overview)
const { isTesting, canTest, testTheConnection } = useTestConnection(bridgeInfo)
const props = defineProps({
  bridgeId: {
    type: String,
    defalut: '',
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
const { handleSSLDataBeforeSubmit } = useSSL()
const { getBridgeIcon } = useBridgeTypeIcon()

const tl = (key: string, moduleName = 'RuleEngine') => t(`${moduleName}.${key}`)

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

const loadBridgeInfo = async () => {
  infoLoading.value = true
  try {
    bridgeInfo.value = await getBridgeInfo(id.value)
  } catch (error) {
    console.error(error)
  } finally {
    infoLoading.value = false
  }
}

const updateBridgeInfo = async () => {
  await formCom.value.validate()
  updateLoading.value = true
  try {
    if (!BRIDGE_TYPES_NOT_USE_SCHEMA.includes(bridgeInfo.value.type)) {
      bridgeInfo.value = formCom.value.getFormRecord()
    }
    const data = _.cloneDeep(bridgeInfo.value)
    if ('ssl' in data) {
      data.ssl = handleSSLDataBeforeSubmit(data.ssl)
    }
    if ('connector' in data && data.connector.ssl) {
      data.connector.ssl = handleSSLDataBeforeSubmit(data.connector.ssl)
    }
    if (data.type === BridgeType.MQTT) {
      Reflect.deleteProperty(data.connector, 'type')
    }
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

const deleteBridge = async () => {
  await ElMessageBox.confirm(t('Base.confirmDelete'), {
    confirmButtonText: t('Base.confirm'),
    cancelButtonText: t('Base.cancel'),
    type: 'warning',
  })
  try {
    await requestDeleteBridge(id.value)
    ElMessage.success(t('Base.deleteSuccess'))
    router.push({ name: 'data-bridge' })
  } catch (error) {
    console.error(error)
  }
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
  width: 64px;
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
