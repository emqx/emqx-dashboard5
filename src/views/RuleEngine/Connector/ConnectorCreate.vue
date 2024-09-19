<template>
  <div class="connector-create" :class="[isInSinglePage ? 'app-wrapper' : '', 'action-create']">
    <DetailHeader
      v-if="isInSinglePage"
      :item="{ name: tl('createConnector'), routeName: 'connector' }"
    />
    <el-card class="app-card">
      <GuideBar
        v-if="isInSinglePage"
        :guide-list="[tl('connectorType'), tl('configuration')]"
        :active-guide-index-list="activeGuidesIndex"
        :desc-list="guideDescList"
      />
      <div class="type-select-container" v-if="step === 0">
        <TypeSelect v-model="selectedType" />
      </div>
      <div class="form-container bridge-config" v-else-if="step === 1">
        <el-alert
          v-if="isSysKeeperProxy"
          show-icon
          type="info"
          :closable="false"
          :title="tl('sysKeeperProxyDesc')"
        />
        <component
          ref="FormCom"
          :is="formCom"
          v-model="formData"
          :type="selectedType"
          :copy="isCopy"
        />
      </div>
      <div class="form-ft">
        <el-button v-if="(isInSinglePage && step === 0) || !isInSinglePage" @click="cancel">
          {{ $t('Base.cancel') }}
        </el-button>
        <el-button v-if="step === 0" type="primary" :disabled="isSubmitting" @click="goNextStep">
          {{ $t('Base.nextStep') }}
        </el-button>
        <template v-else-if="step === 1">
          <el-button v-if="isInSinglePage" :disabled="isSubmitting" @click="goPreStep">
            {{ $t('Base.backStep') }}
          </el-button>
          <el-button
            type="primary"
            plain
            :loading="isTesting"
            :disabled="!$hasPermission('post')"
            @click="handleTest"
          >
            {{ tl('testTheConnection') }}
          </el-button>
          <el-button
            type="primary"
            :loading="isSubmitting"
            :disabled="!$hasPermission('post')"
            @click="submit"
          >
            {{ $t('Base.create') }}
          </el-button>
        </template>
      </div>
    </el-card>
  </div>
  <CreateRuleWithConnector
    v-model="showCreateRuleDialog"
    :connector="createdConnector"
    :title="t('Base.createSuccess')"
    :confirm-text="tl('createRule')"
    :cancel-text="tl('backConnectorList')"
    :cancel-callback="() => router.push({ name: 'connector' })"
  />
</template>

<script setup lang="ts">
import { countDuplicationName, customValidate, scrollToTop } from '@/common/tools'
import DetailHeader from '@/components/DetailHeader.vue'
import GuideBar from '@/components/GuideBar.vue'
import { useConnectorTypeValue } from '@/hooks/Rule/bridge/useBridgeTypeValue'
import useHandleConnectorItem from '@/hooks/Rule/connector/useHandleConnectorItem'
import useGuide from '@/hooks/useGuide'
import useI18nTl from '@/hooks/useI18nTl'
import { BridgeType } from '@/types/enum'
import { Connector } from '@/types/rule'
import { ElMessage } from 'element-plus'
import { computed, defineEmits, defineProps, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import CreateRuleWithConnector from './components/CreateRuleWithConnector.vue'
import TypeSelect from './components/TypeSelect.vue'
import useConnectorFormComponent from './components/useConnectorFormComponent'

/**
 * props and emit is for use this component in drawer
 */
const props = defineProps<{
  type?: string
}>()
const emit = defineEmits<{
  (e: 'submitted', name: string): void
  (e: 'cancel'): void
}>()

const route = useRoute()
const router = useRouter()
const { t, tl } = useI18nTl('RuleEngine')

/**
 * diff from in component
 */
const isInSinglePage = computed(() => route.name === 'connector-create')

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
  guideDescList.value.pop()
  handleBack()
  scrollToTop()
}

const { getTypeStr } = useConnectorTypeValue()
const goNextStep = () => {
  if (step.value === 0) {
    initConnectorData()
    guideDescList.value.push(getTypeStr(selectedType.value) || '')
    scrollToTop()
  }
  handleNext()
}

const isSysKeeperProxy = computed(() => selectedType.value === BridgeType.SysKeeperProxy)

const cancel = () => {
  if (isInSinglePage.value) {
    router.push({ name: 'connector' })
  } else {
    emit('cancel')
  }
}

const isSubmitting = ref(false)
const { getConnectorDetail, addConnector, handleDataForCopy, isTesting, testConnectivity } =
  useHandleConnectorItem()

const showCreateRuleDialog = ref(false)
const createdConnector = ref<undefined | Connector>(undefined)
const submit = async () => {
  try {
    await customValidate(FormCom.value)
    isSubmitting.value = true
    const ret = await addConnector(formData.value)
    if (isInSinglePage.value) {
      if (isSysKeeperProxy.value) {
        router.push({ name: 'connector' })
        return
      }
      createdConnector.value = ret
      showCreateRuleDialog.value = true
    } else {
      emit('submitted', ret.name)
    }
  } catch (error) {
    //
  } finally {
    isSubmitting.value = false
  }
}

const handleTest = async () => {
  try {
    await customValidate(FormCom.value)
    await testConnectivity(formData.value)
    ElMessage.success(tl('connectionSuccessful'))
  } catch (error) {
    //
  }
}

const setTypeAndGoStepConf = (type: BridgeType) => {
  selectedType.value = type
  step.value = 1
}

const isCopy = computed(() => !!(route.query.action === 'copy' && route.query.target))
const targetLoading = ref(false)
const checkClipStatus = async () => {
  if (!isCopy.value || !isInSinglePage.value) {
    return
  }
  try {
    const currentType =
      route.query.target?.slice(0, route.query.target?.indexOf(':'))?.toString() || ''
    if (!currentType) {
      return
    }
    setTypeAndGoStepConf(currentType as BridgeType)
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

const checkProps = () => {
  if (!isInSinglePage.value && props.type) {
    setTypeAndGoStepConf(props.type as BridgeType)
  }
}
checkProps()
</script>

<style lang="scss">
@import '@/style/rule.scss';
.connector-create {
  .type-select-container,
  .form-container {
    width: 75%;
  }

  .el-alert {
    margin-bottom: 24px;
    --color-bg-info: var(--color-bg-split);
  }

  .form-ft {
    margin-top: 24px;
  }
}
</style>
