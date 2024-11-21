<template>
  <el-drawer
    v-model="showDrawer"
    size="520"
    class="open-telemetry-sample-drawer"
    :title="tl('traceAdvancedConfig')"
    :z-index="1999"
    :before-close="handleClose"
    :destroy-on-close="true"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <el-radio-group v-model="selectedBlock">
      <el-radio-button :label="ConfigBlock.Trace">{{ tl('traceConf') }}</el-radio-button>
      <el-radio-button :label="ConfigBlock.ClientIdWhiteList">
        {{ t('Base.clientid') + t('Base.wordBdy') + tl('whiteList') }}
      </el-radio-button>
      <el-radio-button :label="ConfigBlock.TopicWhiteList">
        {{ t('Base.topic') + t('Base.wordBdy') + tl('whiteList') }}
      </el-radio-button>
    </el-radio-group>
    <el-form :model="traceConf" v-if="selectedBlock === ConfigBlock.Trace" :label-width="210">
      <el-form-item :label="tl('traceConnect')">
        <el-switch v-model="traceConf.client_connect_disconnect" />
      </el-form-item>
      <el-form-item :label="tl('traceSubscription')">
        <el-switch v-model="traceConf.client_subscribe_unsubscribe" />
      </el-form-item>
      <el-form-item :label="tl('traceMessage')">
        <el-switch v-model="traceConf.client_publish" />
      </el-form-item>
      <el-form-item :label="tl('traceSamplingRatio')" prop="sample_ratio">
        <InputWithUnit v-if="!notEnabledAllTrace" v-model="traceConf.sample_ratio" :units="['%']" />
        <template v-else>
          <el-tooltip effect="dark" :content="tl('notEnabledAllTraceTip')">
            <InputWithUnit v-model="traceConf.sample_ratio" :units="['%']" disabled />
          </el-tooltip>
        </template>
      </el-form-item>
      <el-divider />
      <el-form-item :label="tl('messageTraceDetailLevel')">
        <el-select v-model="traceConf.msg_trace_level">
          <el-option
            v-for="{ label, value, desc } in traceEventLevelOpts"
            :key="value"
            :value="value"
            :label="label"
          >
            <span>{{ label }}</span>
            <InfoTooltip>
              <template #content>
                <MarkdownContent :content="desc" in-tooltip />
              </template>
            </InfoTooltip>
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div v-else-if="selectedBlock === ConfigBlock.ClientIdWhiteList">
      <div class="type-hd">
        <el-button type="primary" @click="addWhiteListItem">
          {{ t('Base.add') }}
        </el-button>
      </div>
      <el-table :data="clientIdWhiteList" :row-key="getRowKey">
        <el-table-column :label="t('Base.clientid')">
          <template #default="{ row }">
            {{ row }}
          </template>
        </el-table-column>
        <el-table-column :label="$t('Base.operation')" width="160">
          <template #default="{ $index }">
            <el-button
              size="small"
              :disabled="!$hasPermission('put')"
              @click="editWhiteListItem($index)"
            >
              {{ $t('Base.edit') }}
            </el-button>
            <el-popconfirm :title="t('Base.confirmDelete')" @confirm="deleteWhiteListItem($index)">
              <template #reference>
                <el-button plain size="small" :disabled="!$hasPermission('delete')">
                  {{ $t('Base.delete') }}
                </el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div v-else>
      <div class="type-hd">
        <el-button type="primary" @click="addWhiteListItem">
          {{ t('Base.add') }}
        </el-button>
      </div>
      <el-table :data="topicWhiteList" :row-key="getRowKey">
        <el-table-column :label="t('Base.topic')">
          <template #default="{ row }">
            {{ row }}
          </template>
        </el-table-column>
        <el-table-column :label="$t('Base.operation')" width="160">
          <template #default="{ $index }">
            <el-button
              size="small"
              :disabled="!$hasPermission('put')"
              @click="editWhiteListItem($index)"
            >
              {{ $t('Base.edit') }}
            </el-button>
            <el-popconfirm :title="t('Base.confirmDelete')" @confirm="deleteWhiteListItem($index)">
              <template #reference>
                <el-button plain size="small" :disabled="!$hasPermission('delete')">
                  {{ $t('Base.delete') }}
                </el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <template #footer>
      <el-button class="btn-cancel" @click="cancel">
        {{ t('Base.cancel') }}
      </el-button>
      <el-button type="primary" @click="submit" :loading="isSubmitting">
        {{ t('Base.confirm') }}
      </el-button>
    </template>
  </el-drawer>
  <OpenTelemetryWhiteListItemDialog
    v-model="isDialogShow"
    :value="operatingItem"
    :type="operatingType"
    :existing-list="currentList"
    @confirm="confirmWhiteListItem"
  />
</template>

<script setup lang="ts">
import {
  queryOpenTelemetrySampleWhiteList,
  setOpenTelemetry,
  updateOpenTelemetrySampleWhiteList,
} from '@/api/common'
import { checkNOmitFromObj } from '@/common/tools'
import InfoTooltip from '@/components/InfoTooltip.vue'
import InputWithUnit from '@/components/InputWithUnit.vue'
import MarkdownContent from '@/components/MarkdownContent.vue'
import useI18nTl from '@/hooks/useI18nTl'
import { OpenTelemetry } from '@/types/dashboard'
import { OpenTelemetryWhiteListType } from '@/types/enum'
import { OpenTelemetryE2EConfigs } from '@/types/typeAlias'
import { ElMessage, ElMessageBox } from 'element-plus'
import { cloneDeep, isEqual, set } from 'lodash'
import { computed, defineEmits, defineExpose, defineProps, ref, watch } from 'vue'
import OpenTelemetryWhiteListItemDialog from './OpenTelemetryWhiteListItemDialog.vue'

const props = defineProps<{
  modelValue: boolean
  configs: OpenTelemetry
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', val: boolean): void
  (e: 'update', val: OpenTelemetry): void
}>()
const showDrawer = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  },
})
watch(showDrawer, (val) => {
  if (val) {
    traceConf.value = cloneDeep(props.configs.traces?.filter?.e2e_tracing_options || {})
    getWhiteList()
  }
})

const { t, tl } = useI18nTl('MonitoringIntegration')

const enum ConfigBlock {
  Trace,
  ClientIdWhiteList,
  TopicWhiteList,
}

const selectedBlock = ref(ConfigBlock.Trace)
const operatingType = computed<undefined | OpenTelemetryWhiteListType>(() => {
  if (selectedBlock.value === ConfigBlock.Trace) {
    return
  }
  return selectedBlock.value === ConfigBlock.ClientIdWhiteList
    ? OpenTelemetryWhiteListType.ClientID
    : OpenTelemetryWhiteListType.Topic
})
const currentList = computed({
  get() {
    return operatingType.value === OpenTelemetryWhiteListType.ClientID
      ? clientIdWhiteList.value
      : topicWhiteList.value
  },
  set(val) {
    if (operatingType.value === OpenTelemetryWhiteListType.ClientID) {
      clientIdWhiteList.value = val
    } else {
      topicWhiteList.value = val
    }
  },
})

const traceConf = ref<OpenTelemetryE2EConfigs>({})

const notEnabledAllTrace = computed(
  () =>
    !traceConf.value.client_connect_disconnect &&
    !traceConf.value.client_subscribe_unsubscribe &&
    !traceConf.value.client_publish,
)

const basicEvent = ['broker.publish', 'message.route', 'message.forward', 'message.handle_forward']
const QoS1Ack = ['broker.puback', 'client.puback']
const QoS2Ack = [
  'broker.pubrec',
  'broker.pubrel',
  'broker.pubcomp',
  'client.pubrec',
  'client.pubrel',
  'client.pubcomp',
]
const traceEventLevelOpts = [
  {
    label: tl('basicEvents'),
    value: 0,
    desc: basicEvent.join('<br />'),
  },
  {
    label: `${tl('basicEvents')} + QoS1 Ack`,
    value: 1,
    desc: [...basicEvent, ...QoS1Ack].join('<br />'),
  },
  {
    label: `${tl('basicEvents')} + QoS1 Ack + QoS2 Ack`,
    value: 2,
    desc: [...basicEvent, ...QoS1Ack, ...QoS2Ack].join('<br />'),
  },
]

const clientIdWhiteList = ref<Array<string>>([])
const topicWhiteList = ref<Array<string>>([])

let rawClientIdWhiteList: Array<string> = []
let rawTopicWhiteList: Array<string> = []

const getRowKey = (item: string) => item

const isLoading = ref(false)
const getClientIdWhiteList = async () => {
  try {
    clientIdWhiteList.value = await queryOpenTelemetrySampleWhiteList(
      OpenTelemetryWhiteListType.ClientID,
    )
    rawClientIdWhiteList = cloneDeep(clientIdWhiteList.value)
    return Promise.resolve()
  } catch (error) {
    return Promise.reject(error)
  }
}
const getTopicWhiteList = async () => {
  try {
    topicWhiteList.value = await queryOpenTelemetrySampleWhiteList(OpenTelemetryWhiteListType.Topic)
    rawTopicWhiteList = cloneDeep(topicWhiteList.value)
    return Promise.resolve()
  } catch (error) {
    return Promise.reject(error)
  }
}
const getWhiteList = async () => {
  try {
    isLoading.value = true
    await Promise.allSettled([getClientIdWhiteList(), getTopicWhiteList()])
  } catch (error) {
    //
  } finally {
    isLoading.value = false
  }
}

const isDialogShow = ref(false)
const operatingIndex = ref(-1)
const operatingItem = computed(() => {
  if (operatingIndex.value === -1) {
    return undefined
  }
  return currentList.value[operatingIndex.value]
})

const addWhiteListItem = () => {
  operatingIndex.value = -1
  isDialogShow.value = true
}
const editWhiteListItem = (index: number) => {
  operatingIndex.value = index
  isDialogShow.value = true
}
const confirmWhiteListItem = (val: string) => {
  if (operatingIndex.value === -1) {
    currentList.value.push(val)
  } else {
    currentList.value.splice(operatingIndex.value, 1, val)
  }
}
const deleteWhiteListItem = (index: number) => {
  currentList.value.splice(index, 1)
}

const isConfigChanged = () =>
  !isEqual(props.configs.traces?.filter?.e2e_tracing_options, traceConf.value)
const isClientIdWhiteListChanged = () => !isEqual(rawClientIdWhiteList, clientIdWhiteList.value)
const isTopicWhiteListChanged = () => !isEqual(rawTopicWhiteList, topicWhiteList.value)
const isDataChanged = () =>
  isConfigChanged() || isClientIdWhiteListChanged() || isTopicWhiteListChanged()

const closeConfirm = async () => {
  try {
    if (isDataChanged()) {
      await ElMessageBox({
        type: 'info',
        title: tl('closeTraceAdvancedConfig'),
        message: t('Base.unloadTip'),
        showCancelButton: true,
        confirmButtonText: t('APIKey.close'),
        showClose: false,
        closeOnClickModal: false,
        closeOnPressEscape: false,
        closeOnHashChange: false,
      })
    }
    return Promise.resolve()
  } catch (error) {
    return Promise.reject()
  }
}

const handleClose = async (done: (cancel?: boolean) => void) => {
  try {
    await closeConfirm()
    done(false)
  } catch (error) {
    done(true)
  }
}
const cancel = async () => {
  try {
    await closeConfirm()
    showDrawer.value = false
  } catch (error) {
    //
  }
}

const isSubmitting = ref(false)
const submit = async () => {
  try {
    isSubmitting.value = true
    if (isConfigChanged()) {
      const data = cloneDeep(props.configs)
      set(data, 'traces.filter.e2e_tracing_options', traceConf.value)
      const res = await setOpenTelemetry(checkNOmitFromObj(data))
      emit('update', res)
    }
    if (isClientIdWhiteListChanged()) {
      await updateOpenTelemetrySampleWhiteList(
        OpenTelemetryWhiteListType.ClientID,
        clientIdWhiteList.value,
      )
    }
    if (isTopicWhiteListChanged()) {
      await updateOpenTelemetrySampleWhiteList(
        OpenTelemetryWhiteListType.Topic,
        topicWhiteList.value,
      )
    }
    ElMessage.success(t('Base.updateSuccess'))
    showDrawer.value = false
  } catch (error) {
    //
  } finally {
    isSubmitting.value = false
  }
}

defineExpose({ isDataChanged })
</script>

<style lang="scss">
.open-telemetry-sample-drawer {
  .el-radio-group {
    margin-bottom: 28px;
  }
  .type-hd {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 20px;
  }
}
</style>
