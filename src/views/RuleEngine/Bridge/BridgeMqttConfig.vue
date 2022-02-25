<template>
  <div class="bridge-config">
    <el-form label-position="top">
      <section>
        <div class="part-header">{{ tl('baseInfo') }}</div>
        <el-row :gutter="30">
          <el-col :span="14">
            <el-form-item :label="tl('name')">
              <el-input v-model="mqttBridgeVal.name" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-loading="connectorLoading" :gutter="30">
          <el-col :span="14">
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
                <div class="icon-connector-handler-container">
                  <el-icon
                    :class="[
                      'icon-connector-handler',
                      mqttBridgeVal.connector === '_new' || !mqttBridgeVal.connector
                        ? 'disabled'
                        : '',
                    ]"
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
      </section>
      <section>
        <div class="part-header">{{ tl('mappingInfo') }}</div>
        <p class="block-desc">{{ tl('mappingDesc') }}</p>
        <template v-if="mqttBridgeVal.direction === 'ingress'">
          <el-row :gutter="30">
            <el-col :span="10">
              <el-form-item>
                <template #label>
                  <label>{{ tl('remoteTopic') }}</label>
                  <el-tooltip
                    effect="dark"
                    popper-class="form-item-desc-popper"
                    :content="tl('remoteTopicDesc')"
                    placement="top-start"
                  >
                    <el-icon class="form-item-desc"><question-filled /></el-icon>
                  </el-tooltip>
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
          <el-row :gutter="30">
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
              <el-checkbox :label="'Retain'" border v-model="mqttBridgeVal.retain" />
            </el-col>
          </el-row>
        </template>
        <template v-else>
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
          <el-row :gutter="30">
            <el-col :span="10">
              <el-form-item :label="tl('remoteTopic')">
                <template #label>
                  <label>{{ tl('remoteTopic') }}</label>
                  <el-tooltip
                    effect="dark"
                    popper-class="form-item-desc-popper"
                    :content="tl('remoteTopicDesc')"
                    placement="top-start"
                  >
                    <el-icon class="form-item-desc"><question-filled /></el-icon>
                  </el-tooltip>
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
              <el-checkbox :label="'Retain'" border v-model="mqttBridgeVal.retain" />
            </el-col>
          </el-row>
        </template>
        <el-row>
          <el-col :span="24">
            <el-form-item>
              <template #label>
                <label>{{ tl('payload') }}</label>
                <i18n-t class="payload-desc" keypath="RuleEngine.payloadDesc" tag="p">
                  <a href="TODO:" target="_blank">{{ tl('payloadTempSyntax') }}</a>
                </i18n-t>
              </template>
              <el-input type="textarea" rows="10" v-model="mqttBridgeVal.payload" />
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
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'BridgeMqttConfig',
})
</script>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import { defineProps, onMounted, reactive, ref, PropType, watch, defineEmits } from 'vue'
import { Edit, Plus, QuestionFilled } from '@element-plus/icons-vue'
import _ from 'lodash'
import { getConnectorList } from '@/api/ruleengine'
import { ConnectorItem } from '@/types/ruleengine'
import ConnectorDialog from '../components/ConnectorDialog.vue'
import { ConnectorMQTT } from '@/types/rule'
import { QoSOptions } from '@/common/constants'

const prop = defineProps({
  modelValue: {
    type: Object as PropType<ConnectorMQTT>,
    required: false,
    default: () => ({}),
  },
  edit: {
    type: Boolean,
    required: false,
    default: () => false,
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

const mqttBridgeVal = reactive({
  ..._.cloneDeep(mqttBridgeDefaultVal),
  ..._.cloneDeep(prop.modelValue),
})
const connectorList = ref([])
const connectorLoading = ref(false)
const chosenConnectorData = ref({})

const tl = (key: string, moduleName = 'RuleEngine') => t(`${moduleName}.${key}`)

const loadConnectorList = async () => {
  connectorLoading.value = true
  const res = await getConnectorList().catch(() => {})
  if (res) {
    connectorList.value = res
  } else {
    //todo
  }
  connectorLoading.value = false
}

const openConnectorDialog = (isEdit: boolean) => {
  if (isEdit && !mqttBridgeVal.connector) {
    return
  }
  isDialogForEdit.value = isEdit
  isOpenDialog.value = true
  chosenConnectorData.value =
    (isEdit && connectorList.value.find((v: ConnectorItem) => v.id === mqttBridgeVal.connector)) ||
    {}
}

const finishConnectorDialog = async (success: boolean, data: Record<string, unknown>) => {
  if (success) {
    await loadConnectorList().catch(() => {})
  }

  if (!isDialogForEdit.value) {
    if (!success) {
      mqttBridgeVal.connector = ''
    } else {
      mqttBridgeVal.connector = (data.id as string) || ''
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

watch(
  () => _.cloneDeep(mqttBridgeVal),
  (val) => {
    emit('update:modelValue', transformData(val))
  },
)

onMounted(() => {
  loadConnectorList()
  emit('update:modelValue', transformData(mqttBridgeVal))
})
</script>

<style lang="scss" scoped>
@import '@/style/rule.scss';
.el-checkbox {
  margin-top: 40px;
}
.connector-select-container {
  display: flex;
  align-items: flex-start;
  .el-select {
    margin-right: 16px;
  }
  .icon-connector-handler-container {
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
