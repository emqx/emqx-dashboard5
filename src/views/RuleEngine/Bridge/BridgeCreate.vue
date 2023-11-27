<template>
  <div :class="[!isFromRule ? 'app-wrapper' : '', 'action-create']">
    <detail-header v-if="!isFromRule" :item="{ name: tl('createAction'), routeName: 'actions' }" />
    <div v-if="!isFromRule" class="data-bridge-create">
      <el-card class="app-card">
        <el-row>
          <el-col :span="12">
            <guide-bar
              :guide-list="[tl('actionType'), tl('configuration')]"
              :active-guide-index-list="activeGuidesIndex"
              :desc-list="guideDescList"
            ></guide-bar>
          </el-col>
        </el-row>
        <el-row v-if="step === 0">
          <el-col :span="8">
            <el-input v-model="searchQuery" :placeholder="tl('typeSearch')" clearable></el-input>
          </el-col>
        </el-row>
        <el-row class="config-body">
          <template v-if="step === 0">
            <el-radio-group class="target-type-select" v-model="chosenBridgeType">
              <el-row :gutter="28">
                <el-col v-for="item in getFilterBridgeOptions()" :key="item.label" :span="8">
                  <el-radio class="target-type-item" :label="item.value" border>
                    <img
                      class="target-type-item-img"
                      height="64"
                      width="64"
                      :src="getBridgeIcon(item.value)"
                      :alt="item.label"
                    />
                    <div class="target-type-item-bd">
                      <div class="title">{{ item.label }}</div>
                      <span class="target-type-desc">{{ item.desc }}</span>
                    </div>
                  </el-radio>
                </el-col>
              </el-row>
            </el-radio-group>
          </template>
          <template v-if="step === 1">
            <div v-loading="targetLoading">
              <bridge-http-config
                v-if="chosenBridgeType === BridgeType.Webhook"
                v-model="bridgeData"
                ref="formCom"
                :copy="isCopy"
              />
              <bridge-mqtt-config
                v-else-if="chosenBridgeType === BridgeType.MQTT"
                v-model="bridgeData"
                ref="formCom"
                :copy="isCopy"
              />
              <bridge-kafka-producer-config
                v-else-if="chosenBridgeType === BridgeType.KafkaProducer"
                v-model="bridgeData"
                ref="formCom"
                :copy="isCopy"
              />
              <bridge-kafka-consumer-config
                v-else-if="chosenBridgeType === BridgeType.KafkaConsumer"
                v-model="bridgeData"
                ref="formCom"
                :copy="isCopy"
              />
              <bridge-influxdb-config
                v-else-if="chosenBridgeType === BridgeType.InfluxDB"
                v-model="bridgeData"
                ref="formCom"
                :copy="isCopy"
              />
              <bridge-pulsar-config
                v-else-if="chosenBridgeType === BridgeType.Pulsar"
                v-model="bridgeData"
                ref="formCom"
                :copy="isCopy"
              />
              <using-schema-bridge-config
                v-else-if="
                  chosenBridgeType && !BRIDGE_TYPES_NOT_USE_SCHEMA.includes(chosenBridgeType)
                "
                v-model="bridgeData"
                :type="chosenBridgeType"
                ref="formCom"
                :copy="isCopy"
              />
            </div>
          </template>
        </el-row>
        <el-row class="config-btn">
          <el-button v-if="step === 0" @click="cancel">
            {{ $t('Base.cancel') }}
          </el-button>
          <el-button @click="goPreStep" v-if="step > 0" :disabled="submitLoading">
            {{ $t('Base.backStep') }}
          </el-button>
          <el-button
            type="primary"
            @click="goNextStep"
            v-if="step < 1"
            :disabled="submitLoading || getFilterBridgeOptions().length === 0"
          >
            {{ $t('Base.nextStep') }}
          </el-button>
          <el-button
            v-if="step === 1"
            type="primary"
            plain
            :disabled="!$hasPermission('post')"
            :loading="isTesting"
            @click="testConnection"
          >
            {{ tl('testTheConnection') }}
          </el-button>
          <el-button
            type="primary"
            v-if="step === 1"
            :disabled="!$hasPermission('post')"
            :loading="submitLoading"
            @click="submitCreateBridge"
          >
            {{ $t('Base.create') }}
          </el-button>
        </el-row>
        <div></div>
      </el-card>
    </div>
    <!-- In the Create/Settings Rule page -->
    <div v-else>
      <bridge-http-config
        v-if="chosenBridgeType === BridgeType.Webhook"
        v-model="bridgeData"
        ref="formCom"
      />
      <bridge-mqtt-config
        v-else-if="chosenBridgeType === BridgeType.MQTT"
        v-model="bridgeData"
        ref="formCom"
      />
      <bridge-influxdb-config
        v-else-if="chosenBridgeType === BridgeType.InfluxDB"
        v-model="bridgeData"
        ref="formCom"
      />
      <bridge-kafka-producer-config
        v-else-if="chosenBridgeType === BridgeType.KafkaProducer"
        v-model="bridgeData"
        ref="formCom"
        :copy="isCopy"
      />
      <bridge-kafka-consumer-config
        v-else-if="chosenBridgeType === BridgeType.KafkaConsumer"
        v-model="bridgeData"
        ref="formCom"
        :copy="isCopy"
      />
      <bridge-pulsar-config
        v-else-if="chosenBridgeType === BridgeType.Pulsar"
        v-model="bridgeData"
        ref="formCom"
      />
      <using-schema-bridge-config
        v-else-if="chosenBridgeType && !BRIDGE_TYPES_NOT_USE_SCHEMA.includes(chosenBridgeType)"
        :type="chosenBridgeType"
        v-model="bridgeData"
        ref="formCom"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { BRIDGE_TYPES_NOT_USE_SCHEMA } from '@/common/constants'
import { countDuplicationName, jumpToErrorFormItem } from '@/common/tools'
import DetailHeader from '@/components/DetailHeader.vue'
import GuideBar from '@/components/GuideBar.vue'
import useHandleActionItem from '@/hooks/Rule/action/useHandleActionItem'
import {
  useBridgeTypeIcon,
  useBridgeTypeOptions,
  useBridgeTypeValue,
} from '@/hooks/Rule/bridge/useBridgeTypeValue'
import { useBridgeDataHandler } from '@/hooks/Rule/useDataHandler'
import useGuide from '@/hooks/useGuide'
import useI18nTl from '@/hooks/useI18nTl'
import { BridgeType } from '@/types/enum'
import BridgeInfluxdbConfig from '@/views/RuleEngine/Bridge/Components/BridgeConfig/BridgeInfluxdbConfig.vue'
import BridgeKafkaConsumerConfig from '@/views/RuleEngine/Bridge/Components/BridgeConfig/BridgeKafkaConsumerConfig.vue'
import BridgeKafkaProducerConfig from '@/views/RuleEngine/Bridge/Components/BridgeConfig/BridgeKafkaProducerConfig.vue'
import BridgePulsarConfig from '@/views/RuleEngine/Bridge/Components/BridgeConfig/BridgePulsarConfig.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import _ from 'lodash'
import { Ref, computed, defineProps, ref, defineExpose } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import BridgeHttpConfig from './Components/BridgeConfig/BridgeHttpConfig.vue'
import BridgeMqttConfig from './Components/BridgeConfig/BridgeMqttConfig.vue'
import UsingSchemaBridgeConfig from './Components/UsingSchemaBridgeConfig.vue'

/**
 * props and emit is for use this component in drawer
 */
const props = defineProps<{
  type?: string
}>()

const { tl } = useI18nTl('RuleEngine')
const createBridgeData = () => ({})
const router = useRouter()
const route = useRoute()
const { t } = useI18n()
const { bridgeTypeOptions, searchQuery, getFilterBridgeOptions } = useBridgeTypeOptions()
const { getBridgeGeneralType, getBridgeLabelByTypeValue } = useBridgeTypeValue()

const submitLoading = ref(false)
const bridgeData: Ref<any> = ref(createBridgeData())
const { getBridgeIcon } = useBridgeTypeIcon()

const formCom = ref()

const isFromRule = computed(() => ['rule-detail', 'rule-create'].includes(route.name as string))

const isCopy = computed(() => !!(route.query.action === 'copy' && route.query.target))

const chosenBridgeType: Ref<BridgeType> = ref(
  isFromRule.value ? (props.type as BridgeType) : bridgeTypeOptions[0].value,
)

const { step, activeGuidesIndex, guideDescList, handleNext, handleBack } = useGuide()

const { handleBridgeDataBeforeSubmit, handleBridgeDataForCopy } = useBridgeDataHandler()

const handleTypeSelected = () => {
  bridgeData.value = createBridgeData()
}

const goPreStep = () => {
  bridgeData.value = createBridgeData()
  guideDescList.value.pop()
  handleBack()
}

const goNextStep = () => {
  if (step.value === 0) {
    handleTypeSelected()
    guideDescList.value.push(getBridgeLabelByTypeValue(chosenBridgeType.value) || '')
  }
  handleNext()
}

const cancel = () => router.push({ name: 'actions' })

const { getDetail, addAction, isTesting, testConnectivity } = useHandleActionItem()

const targetLoading = ref(false)
const checkBridgeClipStatus = async () => {
  if (!isCopy.value) {
    return
  }
  try {
    const currentType = route.query.target?.slice(0, route.query.target?.indexOf(':'))
    if (currentType && getBridgeGeneralType(currentType as BridgeType)) {
      chosenBridgeType.value = getBridgeGeneralType(currentType as BridgeType)
    }
    step.value = 1
    targetLoading.value = true
    const bridgeInfo = await getDetail(route.query.target as string)
    if (bridgeInfo) {
      bridgeData.value = {
        ...handleBridgeDataForCopy(bridgeInfo),
        name: countDuplicationName(bridgeInfo.name),
      }
      chosenBridgeType.value = getBridgeGeneralType(bridgeInfo.type)
    }
  } catch (error) {
    //
  } finally {
    targetLoading.value = false
  }
}

const getDataForSubmit = () => {
  let dataToSubmit = {}
  if (!BRIDGE_TYPES_NOT_USE_SCHEMA.includes(chosenBridgeType.value)) {
    dataToSubmit = _.cloneDeep(formCom.value.getFormRecord())
  } else {
    dataToSubmit = {
      type: chosenBridgeType.value,
      ..._.cloneDeep(bridgeData.value),
    }
  }
  return handleBridgeDataBeforeSubmit(dataToSubmit)
}

const testConnection = async () => {
  try {
    await formCom.value.validate()
  } catch (error) {
    jumpToErrorFormItem()
    return Promise.reject(error)
  }

  try {
    isTesting.value = true
    const data = await getDataForSubmit()
    await testConnectivity(data)
    ElMessage.success(tl('connectionSuccessful'))
    isTesting.value = false
    return Promise.resolve()
  } catch (error) {
    isTesting.value = false
    return Promise.reject()
  }
}

const submitCreateBridge = async () => {
  try {
    await formCom.value.validate()
  } catch (error) {
    jumpToErrorFormItem()
    return
  }
  submitLoading.value = true
  let res = undefined

  try {
    const data = await getDataForSubmit()
    res = await addAction(data)

    const bridgeId = res?.id
    if (!isFromRule.value) {
      ElMessageBox.confirm(tl('useBridgeCreateRule'), t('Base.createSuccess'), {
        confirmButtonText: tl('createRule'),
        cancelButtonText: tl('backBridgeList'),
        type: 'success',
      })
        .then(() => {
          router.push({ name: 'rule-create', query: { bridgeId } })
        })
        .catch(() => {
          router.push({ name: 'actions' })
        })
    } else {
      return Promise.resolve(bridgeId)
    }
  } catch (error) {
    console.error(error)
  } finally {
    submitLoading.value = false
  }
}

defineExpose({ testConnection, submitCreateBridge })

checkBridgeClipStatus()
</script>

<style lang="scss">
@import '~@/style/rule.scss';
</style>

<style lang="scss" scoped>
.el-col {
  margin-bottom: 16px;
}
.bridge-select {
  margin-top: 12px;
  :deep(.el-input) {
    &::before {
      background-image: url(~@/assets/img/mqtt.png);
      background-size: contain;
    }
  }
}
.option-content {
  display: flex;
  align-items: center;
  img {
    margin-right: 12px;
  }
}
.config-btn {
  margin-top: 24px;
}

.config-body {
  flex-direction: column;
  width: 75%;
}
</style>
