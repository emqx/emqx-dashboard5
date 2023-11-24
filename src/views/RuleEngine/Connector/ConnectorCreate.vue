<template>
  <div class="connector-create" :class="[!isFromRule ? 'app-wrapper' : '', 'action-create']">
    <DetailHeader
      v-if="!isFromRule"
      :item="{ name: tl('createConnector'), routeName: 'connector' }"
    />
    <el-card class="app-card">
      <GuideBar
        :guide-list="[tl('connectorType'), tl('configuration')]"
        :active-guide-index-list="activeGuidesIndex"
        :desc-list="guideDescList"
      />
      <div class="type-select-container" v-if="step === 0">
        <TypeSelect v-model="selectedType" />
      </div>
      <div class="form-container bridge-config" v-else-if="step === 1">
        <component
          ref="FormCom"
          :is="formCom"
          v-model="formData"
          :type="selectedType"
          :copy="isCopy"
        />
      </div>
      <div class="form-ft">
        <template v-if="step === 0">
          <el-button @click="cancel">
            {{ $t('Base.cancel') }}
          </el-button>
          <el-button type="primary" :disabled="isSubmitting" @click="goNextStep">
            {{ $t('Base.nextStep') }}
          </el-button>
        </template>
        <template v-else-if="step === 1">
          <el-button :disabled="isSubmitting" @click="goPreStep">
            {{ $t('Base.backStep') }}
          </el-button>
          <el-button type="primary" plain :loading="isTesting" @click="handleTest">
            {{ tl('testTheConnection') }}
          </el-button>
          <el-button type="primary" :loading="isSubmitting" @click="submit">
            {{ $t('Base.create') }}
          </el-button>
        </template>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { countDuplicationName, customValidate } from '@/common/tools'
import DetailHeader from '@/components/DetailHeader.vue'
import GuideBar from '@/components/GuideBar.vue'
import { useBridgeTypeValue, useConnectorTypeValue } from '@/hooks/Rule/bridge/useBridgeTypeValue'
import useHandleConnectorItem from '@/hooks/Rule/connector/useHandleConnectorItem'
import useGuide from '@/hooks/useGuide'
import useI18nTl from '@/hooks/useI18nTl'
import { BridgeType } from '@/types/enum'
import { Connector } from '@/types/rule'
import { ElMessageBox } from 'element-plus'
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import TypeSelect from './components/TypeSelect.vue'
import useConnectorFormComponent from './components/useConnectorFormComponent'

const route = useRoute()
const router = useRouter()
const { t, tl } = useI18nTl('RuleEngine')

const isFromRule = computed(() => ['rule-detail', 'rule-create'].includes(route.name as string))

const { connectorTypeList } = useConnectorTypeValue()
const selectedType = ref<BridgeType>(connectorTypeList[0].value)

const FormCom = ref()

const formData = ref<Connector>({} as Connector)

const { formCom } = useConnectorFormComponent(selectedType)

const initConnectorData = () => {
  formData.value = {} as Connector
}

const { step, activeGuidesIndex, guideDescList, handleNext, handleBack } = useGuide()
const goPreStep = () => {
  // TODO:init connector data
  guideDescList.value.pop()
  handleBack()
}

const { getBridgeLabelByTypeValue, getBridgeGeneralType } = useBridgeTypeValue()
const goNextStep = () => {
  if (step.value === 0) {
    initConnectorData()
    guideDescList.value.push(getBridgeLabelByTypeValue(selectedType.value) || '')
  }
  handleNext()
}

const cancel = () => router.push({ name: 'connector' })

const isSubmitting = ref(false)
const { getConnectorDetail, addConnector, handleDataForCopy, isTesting, testConnectivity } =
  useHandleConnectorItem()

const submit = async () => {
  try {
    await customValidate(FormCom.value)
    isSubmitting.value = true
    await addConnector(formData.value)
    ElMessageBox.confirm(tl('useBridgeCreateRule'), t('Base.createSuccess'), {
      confirmButtonText: tl('createRule'),
      cancelButtonText: tl('backConnectorList'),
      type: 'success',
    })
      .then(() => {
        router.push({ name: 'rule-create' })
      })
      .catch(() => {
        router.push({ name: 'connector' })
      })
  } catch (error) {
    //
  } finally {
    isSubmitting.value = false
  }
}

const isCopy = computed(() => !!(route.query.action === 'copy' && route.query.target))
const targetLoading = ref(false)
const checkClipStatus = async () => {
  if (!isCopy.value) {
    return
  }
  try {
    const currentType =
      route.query.target?.slice(0, route.query.target?.indexOf(':'))?.toString() || ''
    selectedType.value = getBridgeGeneralType(currentType)
    step.value = 1
    targetLoading.value = true
    const connectorData = await getConnectorDetail<Connector>(route.query.target as string)
    if (connectorData) {
      formData.value = {
        ...handleDataForCopy(connectorData),
        name: countDuplicationName(connectorData.name),
      }
    }
  } catch (error) {
    //
  } finally {
    targetLoading.value = false
  }
}

checkClipStatus()

const handleTest = async () => {
  try {
    await customValidate(FormCom.value)
    testConnectivity(formData.value)
  } catch (error) {
    //
  }
}

/**
 * TODO:TODO:TODO:
 * `isBridgeTypeDisabled` bridge create
 */
</script>

<style lang="scss">
@import '~@/style/rule.scss';
.connector-create {
  .type-select-container,
  .form-container {
    width: 75%;
  }

  .form-ft {
    margin-top: 24px;
  }
}
</style>
