<template>
  <div class="bridge-config">
    <el-form label-position="top" :disabled="disabled">
      <section>
        <div class="part-header">{{ tl('baseInfo') }}</div>
        <el-row :gutter="30">
          <el-col :span="14">
            <el-form-item :label="tl('name')">
              <el-input v-model="mqttBridgeVal.name" :disabled="edit" />
            </el-form-item>
          </el-col>
        </el-row>
      </section>
      <section>
        <div class="part-header">{{ tl('mappingInfo') }}</div>
        <template v-if="mqttBridgeVal.direction === 'ingress'">
          <p class="block-primary-desc">{{ tl('mqttSourceMappingDesc') }}</p>
          <el-row v-loading="connectorLoading" :gutter="30">
            <el-col :span="10">
              <el-form-item :label="tl('mqttConn')">
                <div class="connector-select-container">
                  <el-select v-model="mqttBridgeVal.connector">
                    <el-option
                      v-for="item in connectorList"
                      :key="item.id"
                      :value="item.id"
                      :label="item.name"
                    />
                  </el-select>
                  <div class="icon-connector-handler-container" v-if="!disabled">
                    <el-icon
                      :class="['icon-connector-handler', btnEditConnectorClass]"
                      :size="20"
                      @click="openConnectorDialog(true)"
                    >
                      <edit />
                    </el-icon>
                    <el-icon
                      class="icon-connector-handler"
                      :size="20"
                      @click="openConnectorDialog(false)"
                    >
                      <plus />
                    </el-icon>
                  </div>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="30">
            <el-col :span="10">
              <el-form-item>
                <template #label>
                  <label>{{ tl('remoteTopic') }}</label>
                  <InfoTooltip :content="tl('remoteTopicDesc')" />
                </template>
                <el-input
                  v-model="mqttBridgeVal.remote_topic"
                  :placeholder="tl('remoteTopicPlaceholder')"
                />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="QoS">
                <el-select v-model="mqttBridgeVal.remote_qos">
                  <el-option v-for="qos in QoSOptions" :key="qos" :value="qos" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <p class="block-primary-desc">{{ tl('mqttSourceTransDesc') }}</p>
          <p class="block-desc">{{ tl('mqttSourceTransDescDetail') }}</p>
          <el-row :gutter="30">
            <el-col :span="10">
              <el-form-item :label="tl('forwardToLocalTopic')">
                <el-select
                  v-model="isForwardToLocalTopic"
                  @change="handleIsForwardToLocalTopicChanged"
                >
                  <el-option :label="$t('Base.yes')" :value="true" />
                  <el-option :label="$t('Base.no')" :value="false" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="30" v-if="isForwardToLocalTopic">
            <el-col :span="10">
              <el-form-item :label="tl('localTopic')">
                <el-input
                  v-model="mqttBridgeVal.local_topic"
                  :placeholder="tl('localTopicPlaceholder')"
                />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="QoS">
                <el-select v-model="mqttBridgeVal.local_qos">
                  <el-option v-for="qos in QoSOptions" :key="qos" :value="qos" />
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="4">
              <el-form-item label="Retain">
                <el-checkbox :label="'Retain'" border v-model="mqttBridgeVal.retain" />
              </el-form-item>
            </el-col>
          </el-row>
        </template>
        <template v-else>
          <p class="block-primary-desc">{{ tl('bridgeDataInDesc') }}</p>
          <el-row :gutter="30">
            <el-col :span="10">
              <el-form-item :label="tl('localTopic')">
                <el-input
                  v-model="mqttBridgeVal.local_topic"
                  :placeholder="tl('localTopicPlaceholder')"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <p class="block-primary-desc">{{ tl('bridgeDataOutDesc') }}</p>
          <el-row v-loading="connectorLoading" :gutter="30">
            <el-col :span="10">
              <el-form-item :label="tl('mqttConn')">
                <div class="connector-select-container">
                  <el-select v-model="mqttBridgeVal.connector">
                    <el-option
                      v-for="item in connectorList"
                      :key="item.id"
                      :value="item.id"
                      :label="item.name"
                    />
                  </el-select>
                  <div class="icon-connector-handler-container" v-if="!disabled">
                    <el-icon
                      :class="['icon-connector-handler', btnEditConnectorClass]"
                      :size="20"
                      @click="openConnectorDialog(true)"
                    >
                      <edit />
                    </el-icon>
                    <el-icon
                      class="icon-connector-handler"
                      :size="20"
                      @click="openConnectorDialog(false)"
                    >
                      <plus />
                    </el-icon>
                  </div>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="30">
            <el-col :span="10">
              <el-form-item :label="tl('remoteTopic')">
                <template #label>
                  <label>{{ tl('remoteTopic') }}</label>
                  <InfoTooltip :content="tl('remoteTopicDesc')" />
                </template>
                <el-input
                  v-model="mqttBridgeVal.remote_topic"
                  :placeholder="tl('remoteTopicPlaceholder')"
                />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="QoS">
                <el-select v-model="mqttBridgeVal.remote_qos">
                  <el-option v-for="qos in QoSOptions" :key="qos" :value="qos" />
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="4">
              <el-form-item label="Retain">
                <el-checkbox :label="'Retain'" border v-model="mqttBridgeVal.retain" />
              </el-form-item>
            </el-col>
          </el-row>
        </template>
        <el-row v-if="isShowPayload">
          <el-col :span="24">
            <el-form-item>
              <template #label>
                <label>{{ tl('payload') }}</label>
                <i18n-t class="payload-desc" keypath="RuleEngine.payloadDesc" tag="p">
                  <a href="TODO:" target="_blank">{{ tl('payloadTempSyntax') }}</a>
                </i18n-t>
              </template>
              <div class="monaco-container">
                <Monaco
                  :id="createRandomString()"
                  v-model="mqttBridgeVal.payload"
                  lang="json"
                  json-without-validate
                />
              </div>
            </el-form-item>
          </el-col>
        </el-row>
      </section>
    </el-form>
    <connector-dialog
      v-model:open="isOpenDialog"
      :edit="isDialogForEdit"
      v-if="isOpenDialog"
      @finish="finishConnectorDialog"
      v-model="chosenConnectorData"
    />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'

export default defineComponent({
  name: 'BridgeMqttConfig',
})
</script>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import { defineProps, onMounted, ref, PropType, watch, defineEmits } from 'vue'
import { Edit, Plus } from '@element-plus/icons-vue'
import _ from 'lodash'
import { getConnectorList } from '@/api/ruleengine'
import { ConnectorItem } from '@/types/ruleengine'
import ConnectorDialog from '../components/ConnectorDialog.vue'
import { ConnectorMQTT } from '@/types/rule'
import { QoSOptions } from '@/common/constants'
import InfoTooltip from '@/components/InfoTooltip.vue'
import Monaco from '@/components/Monaco.vue'
import { createRandomString } from '@/common/tools'

const prop = defineProps({
  modelValue: {
    type: Object as PropType<ConnectorMQTT>,
    required: false,
    default: () => ({}),
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  edit: {
    type: Boolean,
    default: false,
  },
})
const emit = defineEmits(['update:modelValue'])

const { t } = useI18n()

const isOpenDialog = ref(false)
const isDialogForEdit = ref(false)
const mqttBridgeDefaultVal = {
  name: '',
  connector: '',
  direction: 'egress',
  retain: false,
  payload: '${payload}',
  local_topic: '',
  remote_topic: '',
  remote_qos: 1,
  local_qos: 1,
}

let modelValueCache = ''
const mqttBridgeVal = ref({
  ..._.cloneDeep(mqttBridgeDefaultVal),
  ..._.cloneDeep(prop.modelValue),
})
const connectorList = ref([])
const connectorLoading = ref(false)
const chosenConnectorData = ref({})
const isForwardToLocalTopic = ref(true)

const tl = (key: string, moduleName = 'RuleEngine') => t(`${moduleName}.${key}`)

const btnEditConnectorClass = computed(() =>
  mqttBridgeVal.value.connector === '_new' || !mqttBridgeVal.value.connector ? 'disabled' : '',
)

const isShowPayload = computed(
  () =>
    (mqttBridgeVal.value.direction === 'ingress' && isForwardToLocalTopic.value) ||
    mqttBridgeVal.value.direction !== 'ingress',
)

const initMqttBridgeVal = () => {
  mqttBridgeVal.value = {
    ..._.cloneDeep(mqttBridgeDefaultVal),
    ..._.cloneDeep(prop.modelValue),
  }
}

const loadConnectorList = async () => {
  connectorLoading.value = true
  try {
    connectorList.value = await getConnectorList()
  } catch (error) {
    console.error(error)
  } finally {
    connectorLoading.value = false
  }
}

const openConnectorDialog = (isEdit: boolean) => {
  if (isEdit && !mqttBridgeVal.value.connector) {
    return
  }
  isDialogForEdit.value = isEdit
  isOpenDialog.value = true
  chosenConnectorData.value =
    (isEdit &&
      connectorList.value.find((v: ConnectorItem) => v.id === mqttBridgeVal.value.connector)) ||
    {}
}

const finishConnectorDialog = async (success: boolean, data: Record<string, unknown>) => {
  if (success) {
    try {
      await loadConnectorList()
    } catch (error) {
      console.error(error)
    }
  }

  if (!isDialogForEdit.value) {
    if (!success) {
      mqttBridgeVal.value.connector = ''
    } else {
      mqttBridgeVal.value.connector = (data.id as string) || ''
    }
  } else {
    //todo
  }
}

const transformData = (val: Record<string, unknown>) => {
  let data = {
    ..._.cloneDeep(val),
  }
  if (val.direction === 'egress') {
    Reflect.deleteProperty(data, 'local_qos')
  }
  return data
}

const handleIsForwardToLocalTopicChanged = () => {
  if (!isForwardToLocalTopic.value) {
    const needDeleteFields = ['local_topic', 'local_qos', 'retain', 'payload']
    needDeleteFields.forEach((fieldName) => {
      Reflect.deleteProperty(mqttBridgeVal.value, fieldName)
    })
  } else {
    const { local_topic, local_qos, retain, payload } = mqttBridgeDefaultVal
    mqttBridgeVal.value = {
      ...mqttBridgeVal.value,
      local_topic,
      local_qos,
      retain,
      payload,
    }
  }
}

const updateModelValue = (val: ConnectorMQTT) => {
  const value = transformData(val)
  modelValueCache = JSON.stringify(value)
  emit('update:modelValue', value)
}

watch(() => _.cloneDeep(mqttBridgeVal.value), updateModelValue)

watch(
  () => prop.modelValue,
  (val) => {
    if (JSON.stringify(val) !== modelValueCache) {
      initMqttBridgeVal()
    }
  },
)

onMounted(() => {
  loadConnectorList()
  updateModelValue(mqttBridgeVal.value)
})
</script>

<style lang="scss" scoped>
@import '@/style/rule.scss';
.connector-select-container {
  display: flex;
  align-items: flex-start;
  .icon-connector-handler-container {
    margin-left: 16px;
    flex-shrink: 0;
  }
}
.icon-connector-handler {
  box-sizing: border-box;
  width: 40px;
  height: 40px;
  line-height: 40px;
  border: var(--el-border-base);
  border-radius: var(--el-border-radius-base);

  &:not(:last-child) {
    margin-right: 12px;
  }

  &:hover {
    border-color: var(--el-color-primary);
    cursor: pointer;
  }

  &.disabled,
  &.disabled:hover {
    border-color: var(--el-border-color-light);
    color: var(--el-border-color-light);
    cursor: default;
  }
}

.payload-desc {
  margin: 0 0 8px;
  color: var(--el-text-color-secondary);
}
</style>
