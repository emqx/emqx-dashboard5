<template>
  <div class="connector-detail bridge-detail">
    <div class="detail-top">
      <detail-header v-if="!isFromRule" :item="{ name: connectorName, routeName: 'connector' }" />
      <div v-if="!isFromRule" class="section-header">
        <div>
          <img :src="getBridgeIcon(connectorData.type)" />
          <div class="title-n-status">
            <div class="info-tags">
              <TargetItemStatus :target="connectorData" is-tag />
              <el-tag type="info" class="section-status">
                {{ getTypeStr(connectorData.type) }}
              </el-tag>
            </div>
          </div>
        </div>
        <div>
          <el-tooltip :content="$t('Base.delete')" placement="top">
            <el-button class="icon-button" type="danger" :icon="Delete" @click="handleDelete" plain>
            </el-button>
          </el-tooltip>
        </div>
      </div>
      <div>
        <el-alert v-if="pwdErrorWhenCoping" :title="pwdErrorWhenCoping" type="error" />
        <el-card
          v-loading="isLoading"
          :class="['app-card', isFromRule && 'app-inline-card']"
          :shadow="isFromRule ? 'never' : undefined"
        >
          <div class="form-container">
            <component
              ref="FormCom"
              class="bridge-config"
              :is="formCom"
              v-model="connectorData"
              :type="generalType"
              :is-loading="isLoading"
              edit
            />
          </div>
          <div class="btn-area">
            <el-button @click="saveAsCopy">
              {{ tl('saveAsCopy') }}
            </el-button>
            <el-button
              v-if="connectorData.type"
              type="primary"
              plain
              :loading="isTesting"
              @click="handleTest"
            >
              {{ tl('testTheConnection') }}
            </el-button>
            <el-button
              type="primary"
              v-if="connectorData.type"
              :loading="isSubmitting"
              @click="submit"
            >
              {{ $t('Base.update') }}
            </el-button>
          </div>
        </el-card>
      </div>
    </div>
  </div>
  <CopySubmitDialog v-model="showNameInputDialog" :target="copyTarget" />
</template>

<script setup lang="ts">
import { customValidate } from '@/common/tools'
import DetailHeader from '@/components/DetailHeader.vue'
import useBridgeTypeValue, {
  useBridgeTypeIcon,
  useConnectorTypeValue,
} from '@/hooks/Rule/bridge/useBridgeTypeValue'
import useCheckBeforeSaveAsCopy from '@/hooks/Rule/bridge/useCheckBeforeSaveAsCopy'
import useHandleConnectorItem from '@/hooks/Rule/connector/useHandleConnectorItem'
import { useConnectorDataHandler } from '@/hooks/Rule/useDataHandler'
import useI18nTl from '@/hooks/useI18nTl'
import useOperationConfirm from '@/hooks/useOperationConfirm'
import { BridgeType } from '@/types/enum'
import { Connector } from '@/types/rule'
import { Delete } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { computed, defineProps, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import CopySubmitDialog from '../components/CopySubmitDialog.vue'
import TargetItemStatus from '../components/TargetItemStatus.vue'
import useConnectorFormComponent from './components/useConnectorFormComponent'

const props = defineProps<{
  /**
   * for action & rule page
   */
  connectorId?: string
}>()

const route = useRoute()
const router = useRouter()
const isFromRule = computed(() => ['rule-detail', 'rule-create'].includes(route.name as string))

const { t, tl } = useI18nTl('RuleEngine')

const id = computed(() => {
  if (isFromRule.value) {
    return props.connectorId as string
  }
  return route.params.id as string
})

const { getBridgeGeneralType } = useBridgeTypeValue()
const generalType = computed(() => {
  const rawType = id.value.slice(0, id.value.indexOf(':'))
  return getBridgeGeneralType(rawType) as BridgeType
})

const FormCom = ref()

const { formCom } = useConnectorFormComponent(generalType)

const connectorData = ref<Connector>({} as Connector)

const showNameInputDialog = ref(false)
const duplication = ref<Connector>({} as Connector)
const copyTarget = computed<{ type: 'connector'; obj: Connector }>(() => ({
  type: 'connector',
  obj: duplication.value,
}))

const connectorName = computed(() => connectorData.value.name)
const { getBridgeIcon } = useBridgeTypeIcon()
const { getTypeStr } = useConnectorTypeValue()

const { getConnectorDetail, updateConnector, deleteConnector, isTesting, testConnectivity } =
  useHandleConnectorItem()

const isLoading = ref(false)
const getDetail = async () => {
  try {
    isLoading.value = true
    connectorData.value = await getConnectorDetail(id.value)
  } catch (error) {
    //
  } finally {
    isLoading.value = false
  }
}
getDetail()

const { operationWarning, confirmDel } = useOperationConfirm()
const handleDelete = async () => {
  try {
    await confirmDel(() => deleteConnector(connectorData.value.id))
    router.push({ name: 'connector' })
  } catch (error) {
    //
  }
}

const handleTest = async () => {
  try {
    await customValidate(FormCom.value)
    testConnectivity(connectorData.value)
  } catch (error) {
    //
  }
}

const { handleConnectorDataForSaveAsCopy } = useConnectorDataHandler()
const { pwdErrorWhenCoping, checkLikePwdField } = useCheckBeforeSaveAsCopy()
const saveAsCopy = async () => {
  try {
    await customValidate(FormCom.value)
    await checkLikePwdField(connectorData.value)
    duplication.value = handleConnectorDataForSaveAsCopy(connectorData.value)
    showNameInputDialog.value = true
  } catch (error) {
    //
  }
}

const isSubmitting = ref(false)
const submit = async () => {
  try {
    await customValidate(FormCom.value)
    // TODO: some confirm when submit in bridge/rule page
    await operationWarning(tl('updateConnectorTip'))
    isSubmitting.value = true
    const res = await updateConnector(connectorData.value)
    if (!isFromRule.value) {
      ElMessage.success(t('Base.updateSuccess'))
      router.push({ name: 'connector' })
    }
    return Promise.resolve(res.id)
  } catch (error) {
    //
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style lang="scss">
@import '~@/style/rule.scss';
.connector-detail {
  .form-container {
    width: 75%;
  }
}
</style>
