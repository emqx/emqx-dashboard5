<template>
  <div class="app-wrapper">
    <div class="bridge-detail">
      <router-link class="back-button" :to="backRoute">
        {{ backBtnText }}
      </router-link>
      <div class="detail-main" v-loading="infoLoading">
        <div class="section-header">
          <div>
            <img :src="bridgeInfo.type && require(`@/assets/img/${bridgeInfo.type}.png`)" />
            <div class="title-n-status">
              <p class="section-title">{{ bridgeInfo.name }}</p>
              <div class="info-tags">
                <el-tag type="info" class="section-status">
                  <span>
                    <i
                      :class="['status', bridgeInfo.status !== BridgeStatus.Connected && 'stopped']"
                    />
                    <span class="text-status" :class="statusTextClass">
                      {{ getLabelByStatusValue(bridgeInfo.status) }}
                    </span>
                  </span>
                </el-tag>
                <el-tag type="info" class="section-status">
                  {{ getBridgeLabelByTypeValue(bridgeInfo.type) }}
                </el-tag>
              </div>
            </div>
          </div>
          <div>
            <el-button type="danger" size="small">
              {{ $t('Base.delete') }}
            </el-button>
            <el-button size="small" @click="enableOrDisableBridge">
              {{ bridgeInfo.status === 'connected' ? $t('Base.disable') : $t('Base.enable') }}
            </el-button>
          </div>
        </div>
        <el-tabs v-model="activeTab">
          <el-tab-pane :label="tl('overview')" :name="Tab.Overview">
            <BridgeItemOverview :bridge-msg="bridgeInfo" />
          </el-tab-pane>
          <el-tab-pane :label="tl('settings')" :name="Tab.Setting">
            <el-card shadow="never" class="app-card">
              <div class="setting-area">
                <bridge-http-config
                  v-if="bridgeInfo.type === 'http'"
                  v-model:tls="bridgeInfo.ssl"
                  v-model="bridgeInfo"
                  :edit="true"
                />
                <bridge-mqtt-config v-if="bridgeInfo.type === 'mqtt'" v-model="bridgeInfo" />
              </div>
              <div class="btn-area">
                <el-button
                  type="primary"
                  size="small"
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
import { getBridgeInfo, updateBridge, startStopBridge } from '@/api/ruleengine'
import { BridgeItem } from '@/types/rule'
import _ from 'lodash'
import { useI18n } from 'vue-i18n'
import BridgeHttpConfig from './BridgeHttpConfig.vue'
import BridgeMqttConfig from './BridgeMqttConfig.vue'
import { ElMessage } from 'element-plus'
import useBridgeTypeValue, {
  useBridgeStatusLabelValue,
} from '@/hooks/Rule/topology/bridge/useBridgeTypeValue'
import { BridgeStatus } from '@/types/enum'
import BridgeItemOverview from './Components/BridgeItemOverview.vue'

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

const statusTextClass = computed(() => {
  return bridgeInfo.value.status === BridgeStatus.Connected ? 'success' : 'danger'
})

const { getBridgeLabelByTypeValue } = useBridgeTypeValue()
const { getLabelByStatusValue } = useBridgeStatusLabelValue()

const tl = (key: string, moduleName = 'RuleEngine') => t(`${moduleName}.${key}`)

const isFromRule = computed(
  () => route.name === 'edit-bridge-for-create-iot' || route.name === 'edit-bridge-for-edit-iot',
)

const backBtnText = computed(() => {
  let key = 'backBridgeList'
  if (isFromRule.value) {
    key = route.params.from.indexOf('detail') > -1 ? 'backRuleEdit' : 'backToRuleCreation'
  }
  return tl(key)
})

const backRoute = computed(() => {
  let name = 'data-bridge'
  if (isFromRule.value) {
    name = route.params.from.indexOf('detail') > -1 ? 'iot-detail' : 'iot-create'
  }
  return { name }
})

const loadBridgeInfo = async () => {
  infoLoading.value = true
  const res = await getBridgeInfo(id).catch(() => {})
  if (res) {
    bridgeInfo.value = res
  }
  infoLoading.value = false
}

const updateBridgeInfo = async () => {
  infoLoading.value = true

  const res = await updateBridge(bridgeInfo.value.id, bridgeInfo.value).catch(() => {})
  if (res) {
    if (!isFromRule.value) {
      ElMessage({ type: 'success', message: t('Base.updateSuccess') })
    } else {
      router.push({ name: route.params.from as string, params: { bridgeId: res.id } })
    }
  }
  infoLoading.value = false
}

// watch(
//   () => [_.cloneDeep(bridgeInfo.value)],
//   (val) => {
//     console.log(val);
//   }
// );

const enableOrDisableBridge = async () => {
  infoLoading.value = true
  const statusToSend = bridgeInfo.value.status === 'connected' ? 'stop' : 'start'
  const sucMessage =
    bridgeInfo.value.status === 'connected' ? 'Base.disabledSuccess' : 'Base.enableSuccess'
  let res = await startStopBridge(bridgeInfo.value.id, statusToSend).catch(() => {})
  if (res) {
    ElMessage({
      type: 'success',
      message: t(sucMessage),
    })
    loadBridgeInfo()
  }
  infoLoading.value = false
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
  width: 50px;
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
  .el-tag {
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
