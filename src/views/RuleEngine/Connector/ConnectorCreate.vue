<template>
  <div class="connector-create" :class="[!isFromRule ? 'app-wrapper' : '', 'bridge-create']">
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
      <div class="form-container" v-else-if="step === 1">
        <component :is="formCom" />
      </div>
      <div class="btn-container">
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
import DetailHeader from '@/components/DetailHeader.vue'
import GuideBar from '@/components/GuideBar.vue'
import { useBridgeTypeValue, useConnectorTypeValue } from '@/hooks/Rule/bridge/useBridgeTypeValue'
import useTestConnector from '@/hooks/Rule/connector/useTestConnector'
import useGuide from '@/hooks/useGuide'
import useI18nTl from '@/hooks/useI18nTl'
import { BridgeType } from '@/types/enum'
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import TypeSelect from './components/TypeSelect.vue'
import useConnectorFormComponent from './components/useConnectorFormComponent'

const route = useRoute()
const router = useRouter()
const { tl } = useI18nTl('RuleEngine')

const isFromRule = computed(() => ['iot-detail', 'iot-create'].includes(route.name as string))

const { connectorTypeList } = useConnectorTypeValue()
const selectedType = ref<BridgeType>(connectorTypeList[0].value)

const formData = ref({})

const { formCom } = useConnectorFormComponent(selectedType)

const initConnectorData = () => {
  formData.value = {}
}

const { step, activeGuidesIndex, guideDescList, handleNext, handleBack } = useGuide()
const goPreStep = () => {
  // TODO:init connector data
  guideDescList.value.pop()
  handleBack()
}

const { getBridgeLabelByTypeValue } = useBridgeTypeValue()
const goNextStep = () => {
  if (step.value === 0) {
    initConnectorData()
    guideDescList.value.push(getBridgeLabelByTypeValue(selectedType.value) || '')
  }
  handleNext()
}

const cancel = () => router.push({ name: 'connector' })

const isSubmitting = ref(false)
const submit = async () => {
  // TODO:
}

const { isTesting, testConnectivity } = useTestConnector()
const handleTest = async () => {}
</script>

<style lang="scss">
.connector-create {
  .type-select-container {
    width: 75%;
  }
  .btn-container {
    margin-top: 24px;
  }
}
</style>
