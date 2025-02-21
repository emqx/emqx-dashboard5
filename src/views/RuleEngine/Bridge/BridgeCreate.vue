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
        <el-row class="config-body">
          <template v-if="step === 0">
            <el-radio-group class="target-type-select" v-model="chosenBridgeType">
              <el-row :gutter="28">
                <el-col v-for="item in bridgeTypeOptions" :key="item.label" :span="8">
                  <el-radio class="target-type-item" :value="item.value" border>
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
              <using-schema-bridge-config
                :type="chosenBridgeType"
                v-model="bridgeData"
                ref="formCom"
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
          <el-button type="primary" @click="goNextStep" v-if="step < 1" :disabled="submitLoading">
            {{ $t('Base.nextStep') }}
          </el-button>
          <el-button
            v-if="step === 1"
            type="primary"
            plain
            :loading="isTesting"
            @click="testConnection"
          >
            {{ tl('testTheConnection') }}
          </el-button>
          <el-button
            type="primary"
            v-if="step === 1"
            :loading="submitLoading"
            @click="submitCreateBridge"
          >
            {{ $t('Base.create') }}
          </el-button>
        </el-row>
        <div></div>
      </el-card>
    </div>
    <div v-else>
      <using-schema-bridge-config :type="chosenBridgeType" v-model="bridgeData" ref="formCom" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { BRIDGE_TYPES_NOT_USE_SCHEMA } from '@/common/constants'
import { countDuplicationName, jumpToErrorFormItem } from '@/common/tools'
import DetailHeader from '@/components/DetailHeader.vue'
import GuideBar from '@/components/GuideBar.vue'
import {
  useBridgeTypeIcon,
  useBridgeTypeOptions,
  useBridgeTypeValue,
} from '@/hooks/Rule/bridge/useBridgeTypeValue'
import { BridgeType } from '@/types/enum'
import UsingSchemaBridgeConfig from './Components/UsingSchemaBridgeConfig.vue'

/**
 * props and emit is for use this component in drawer
 */
const props = defineProps<{
  type?: string
}>()

const { t, tl } = useI18nTl('RuleEngine')
const createBridgeData = () => ({})
const router = useRouter()
const route = useRoute()
const { bridgeTypeOptions } = useBridgeTypeOptions()
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

const { handleBridgeDataForCopy } = useBridgeDataHandler()
const { handleActionDataBeforeSubmit } = useActionDataHandler()

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
  if (!/action/i.test(route.name?.toString() || '') || !isCopy.value) {
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
      chosenBridgeType.value = bridgeInfo.type
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
  return handleActionDataBeforeSubmit(dataToSubmit)
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
    return Promise.reject(error)
  }
  submitLoading.value = true
  let res = undefined

  try {
    const data = await getDataForSubmit()
    res = await addAction(data)

    const id = res?.id
    if (!isFromRule.value) {
      ElMessageBox.confirm(tl('useConnectorCreateRule'), t('Base.createSuccess'), {
        confirmButtonText: tl('createRule'),
        cancelButtonText: tl('backBridgeList'),
        type: 'success',
      })
        .then(() => {
          router.push({ name: 'rule-create', query: { actionId: id } })
        })
        .catch(() => {
          router.push({ name: 'actions' })
        })
    }
    submitLoading.value = false
    return Promise.resolve(id)
  } catch (error) {
    console.error(error)
    submitLoading.value = false
    return Promise.reject(error)
  }
}

defineExpose({ testConnection, submitCreateBridge, bridgeData })

checkBridgeClipStatus()
</script>

<style lang="scss">
@use '@/style/rule.scss';
</style>

<style lang="scss" scoped>
.el-col {
  margin-bottom: 16px;
}
.bridge-select {
  margin-top: 12px;
  :deep(.el-input) {
    &::before {
      background-image: url(@/assets/img/mqtt.png);
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
