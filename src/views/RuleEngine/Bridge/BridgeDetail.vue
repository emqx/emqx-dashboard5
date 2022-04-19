<template>
  <div class="app-wrapper">
    <div class="bridge-detail">
      <detail-header :item="{ name: bridgeInfo.name, routeName: backRoute.name }" />
      <div class="detail-main" v-loading="infoLoading">
        <div class="section-header">
          <div>
            <img :src="bridgeInfo.type && require(`@/assets/img/${bridgeInfo.type}.png`)" />
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
            <el-button @click="goDoc">
              {{ tl('readMore') }}
            </el-button>
            <el-button @click="enableOrDisableBridge">
              {{ bridgeInfo.enable ? $t('Base.disable') : $t('Base.enable') }}
            </el-button>
            <el-button type="danger" @click="deleteBridge">
              {{ $t('Base.delete') }}
            </el-button>
          </div>
        </div>
        <el-tabs v-model="activeTab">
          <el-tab-pane :label="tl('overview')" :name="Tab.Overview">
            <BridgeItemOverview
              :bridge-msg="bridgeInfo"
              @reconnect="loadBridgeInfo"
              @reset="loadBridgeInfo"
            />
          </el-tab-pane>
          <el-tab-pane :label="tl('settings')" :name="Tab.Setting">
            <el-card class="app-card">
              <div class="setting-area">
                <bridge-http-config
                  v-if="bridgeInfo.type === 'http'"
                  v-model:tls="bridgeInfo.ssl"
                  v-model="bridgeInfo"
                  ref="formCom"
                  :edit="true"
                />
                <bridge-mqtt-config
                  v-if="bridgeInfo.type === 'mqtt'"
                  v-model="bridgeInfo"
                  ref="formCom"
                  :edit="true"
                />
              </div>
              <div class="btn-area">
                <el-button
                  type="primary"
                  v-if="bridgeInfo.type"
                  :loading="infoLoading"
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
import { computed, onActivated, onMounted, ref, Ref } from 'vue'
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
import { useBridgeTypeOptions } from '@/hooks/Rule/bridge/useBridgeTypeValue'
import BridgeItemOverview from './Components/BridgeItemOverview.vue'
import BridgeItemStatus from './Components/BridgeItemStatus.vue'
import DetailHeader from '@/components/DetailHeader.vue'

enum Tab {
  Overview = '0',
  Setting = '1',
}

const route = useRoute()
const router = useRouter()
const id = route.params.id as string
const bridgeInfo: Ref<BridgeItem> = ref({} as BridgeItem)
const { t } = useI18n()
const infoLoading = ref(false)
const activeTab = ref(Tab.Overview)

const formCom = ref()

const { getTypeStr } = useBridgeTypeOptions()

const tl = (key: string, moduleName = 'RuleEngine') => t(`${moduleName}.${key}`)

const isFromRule = computed(() =>
  ['edit-bridge-for-create-iot', 'edit-bridge-for-edit-iot'].includes(route.name as string),
)

const backRoute = computed(() => {
  let name = 'data-bridge'
  if (isFromRule.value) {
    name = route.params.from.indexOf('detail') > -1 ? 'iot-detail' : 'iot-create'
  }
  return { name }
})

const loadBridgeInfo = async () => {
  infoLoading.value = true
  try {
    bridgeInfo.value = await getBridgeInfo(id)
  } catch (error) {
    console.error(error)
  } finally {
    infoLoading.value = false
  }
}

const goDoc = () => {
  // TODO:
  window.open('https://www.emqx.io/', '_blank')
}

const updateBridgeInfo = async () => {
  await formCom.value.validate()
  infoLoading.value = true
  try {
    const res = await updateBridge(bridgeInfo.value.id, bridgeInfo.value)
    if (!isFromRule.value) {
      ElMessage.success(t('Base.updateSuccess'))
    } else {
      router.push({ name: route.params.from as string, params: { bridgeId: res.id } })
    }
  } catch (error) {
    console.error(error)
  } finally {
    infoLoading.value = false
  }
}

const enableOrDisableBridge = async () => {
  infoLoading.value = true
  const statusToSend = bridgeInfo.value.status === 'connected' ? 'disable' : 'enable'
  const sucMessage =
    bridgeInfo.value.status === 'connected' ? 'Base.disabledSuccess' : 'Base.enableSuccess'
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

const deleteBridge = async () => {
  await ElMessageBox.confirm(t('Base.confirmDelete'), {
    confirmButtonText: t('Base.confirm'),
    cancelButtonText: t('Base.cancel'),
    type: 'warning',
  })
  try {
    await requestDeleteBridge(id)
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

:deep(.el-tabs.el-tabs--top:not(.el-tabs--card) .el-tabs__item.is-top) {
  padding-left: 0;
  padding-right: 0;
  &::before,
  &::after {
    content: '';
    display: inline-block;
    visibility: hidden;
  }
  &::before {
    width: 20px;
  }
  &::after {
    width: 20px;
  }
}
.setting-area {
  width: 75%;
}
.btn-area {
  margin-top: 40px;
}
</style>
