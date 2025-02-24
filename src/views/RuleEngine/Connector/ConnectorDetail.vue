<template>
  <div class="connector-detail bridge-detail">
    <div class="detail-top">
      <detail-header v-if="!isFromRule" :item="{ name: connectorName, routeName: 'connector' }">
        <template #content>
          <div class="vertical-align-center">
            <img :src="getBridgeIcon(connectorData.type)" />
            <div class="block-title">
              <CommonOverflowTooltip :content="connectorName" />
            </div>
            <TargetItemStatus type="connector" :target="connectorData" is-tag />
            <el-tag type="info" class="section-status">
              {{ getTypeStr(connectorData.type) }}
            </el-tag>
          </div>
        </template>
        <template #extra>
          <el-tooltip
            :content="connectorData.enable ? $t('Base.disable') : $t('Base.enable')"
            placement="top"
          >
            <el-switch
              class="enable-btn"
              :model-value="connectorData.enable"
              :disabled="isWebhookConnector"
              @update:modelValue="enableOrDisableConnector"
            />
          </el-tooltip>
          <el-tooltip :content="$t('Base.delete')" placement="top">
            <el-button
              class="icon-button"
              type="danger"
              :icon="Delete"
              :disabled="isWebhookConnector"
              @click="
                handleDeleteConnector(connectorData, () => {
                  $router.push({ name: 'connector' })
                })
              "
              plain
            >
            </el-button>
          </el-tooltip>
        </template>
      </detail-header>
      <div>
        <el-alert v-if="pwdErrorWhenCoping" :title="pwdErrorWhenCoping" type="error" />
        <el-card
          v-loading="isLoading"
          :class="['app-card', isFromRule && 'app-inline-card']"
          :shadow="isFromRule ? 'never' : undefined"
        >
          <el-alert
            v-if="isWebhookConnector"
            class="webhook-tip-alert"
            show-icon
            type="info"
            :closable="false"
          >
            <i18n-t keypath="RuleEngine.handleWebhookAssociatedTip" tag="p" scope="global">
              <template #target>
                <span>{{ t('components.connector') }}</span>
              </template>
              <template #operation>
                <span>{{ lowerCase(t('Base.edit')) }}</span>
              </template>
              <template #page>
                <router-link :to="webhookRoute">Webhook {{ t('RuleEngine.page') }}</router-link>
              </template>
            </i18n-t>
          </el-alert>
          <div class="form-container">
            <component
              ref="FormCom"
              class="bridge-config"
              :is="formCom"
              v-model="connectorData"
              :type="generalType"
              :is-loading="isLoading"
              :disabled="isWebhookConnector"
              edit
              v-bind="fromComProps"
            />
          </div>
          <div class="btn-area">
            <el-button @click="saveAsCopy" :disabled="isWebhookConnector">
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
              :disabled="isWebhookConnector"
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
  <DelConnectorTip v-model="showDelTip" :connector="connectorData" />
  <DisableConnectorConfirm
    v-model="showDisableConfirm"
    :connector="currentConnector as Connector"
    @submitted="toggleEnableValue"
  />
</template>

<script setup lang="ts">
import useBridgeTypeValue, {
  useBridgeTypeIcon,
  useConnectorTypeValue,
} from '@/hooks/Rule/bridge/useBridgeTypeValue'
import { BridgeType, DetailTab } from '@/types/enum'
import { Connector } from '@/types/rule'
import { Delete } from '@element-plus/icons-vue'
import CopySubmitDialog from '../components/CopySubmitDialog.vue'
import TargetItemStatus from '../components/TargetItemStatus.vue'
import DelConnectorTip from './components/DelConnectorTip.vue'
import useConnectorFormComponent from './components/useConnectorFormComponent'
import DisableConnectorConfirm from './components/DisableConnectorConfirm.vue'

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

const {
  getConnectorDetail,
  updateConnector,
  showDisableConfirm,
  currentConnector,
  handleToggleConnectorEnable,
  isTesting,
  testConnectivity,
  handleDeleteConnector,
  showDelTip,
} = useHandleConnectorItem()

/* Webhook associated */
const { judgeIsWebhookConnector } = useWebhookUtils()
const isWebhookConnector = computed(() => judgeIsWebhookConnector(connectorData.value))
const fromComProps = computed(() => {
  return isWebhookConnector.value ? { formProps: { disabled: true } } : {}
})
const webhookRoute = computed(() => ({
  name: 'webhook-detail',
  params: { name: connectorName.value },
  query: { tab: DetailTab.Setting },
}))

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

const { operationWarning } = useOperationConfirm()

const handleTest = async () => {
  try {
    await customValidate(FormCom.value)
    await testConnectivity(connectorData.value)
    ElMessage.success(tl('connectionSuccessful'))
  } catch (error) {
    //
  }
}

const enableOrDisableConnector = () => {
  handleToggleConnectorEnable(connectorData.value, toggleEnableValue)
}

const toggleEnableValue = () => {
  connectorData.value.enable = !connectorData.value.enable
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
@use '@/style/rule.scss';
.connector-detail {
  .form-container {
    width: 75%;
  }
  .block-title {
    max-width: 200px;
  }
  .el-page-header__content {
    max-width: 700px;
  }
}
</style>
