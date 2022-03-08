<template>
  <div>
    <el-dialog
      :title="edit ? tl('editConn') : tl('newConn')"
      v-model="visible"
      @close="$emit('finish', false)"
    >
      <p class="desc-create">{{ tl('descForCreateConnector') }}</p>
      <el-form label-position="top">
        <div class="form-sub-block">
          <div class="part-header">{{ tl('baseInfo') }}</div>
          <el-row :gutter="30">
            <el-col :span="12">
              <el-form-item :label="tl('type')">
                <el-select v-model="connectorData.type" :disabled="edit">
                  <el-option
                    v-for="{ value, label } in connectorTypeOptions"
                    :key="value"
                    :value="value"
                    :label="label"
                  />
                </el-select>
              </el-form-item>
              <el-form-item :label="tl('connName')">
                <el-input v-model="connectorData.name" :placeholder="connectorData.name" />
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <connector-mqtt-config
          :model-value="connectorData"
          @update:model-value="updateConnectorData"
          v-model:tls="connectorTLS"
          :edit="edit"
        />
      </el-form>
      <div class="tip-edit" v-if="edit">
        <span>{{ tl('tip') }}</span>
        <p>{{ tl('tipForEditConnector') }}</p>
      </div>
      <template #footer>
        <el-button
          type="primary"
          size="small"
          :loading="isTesting"
          @click="testTheConnection(edit)"
        >
          {{ tl('testTheConnection') }}
        </el-button>
        <el-button
          type="primary"
          size="small"
          :loading="submitLoading"
          @click="submitConnector(edit)"
        >
          {{ edit ? $t('Base.update') : $t('Base.add') }}
        </el-button>
        <el-button size="small" @click="closeDialog()">
          {{ $t('Base.cancel') }}
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ConnectorDialog',
})
</script>

<script setup>
import { computed, ref, watch, defineProps, defineEmits } from 'vue'
import { useI18n } from 'vue-i18n'
import ConnectorMqttConfig from '../Connector/ConnectorMqttConfig.vue'
import { createConnector, updateConnector, testConnector } from '@/api/ruleengine'
import { cloneDeep } from 'lodash'
import { ElMessage } from 'element-plus'
import useConnectorTypeValue from '@/hooks/Rule/bridge/useConnectorTypeValue'
import { createRawSSLParams } from '@/common/tools.ts'

const props = defineProps({
  edit: {
    type: Boolean,
    required: false,
    default: () => false,
  },
  open: {
    type: Boolean,
    required: false,
    default: () => false,
  },
  modelValue: {
    type: Object,
    required: false,
    default: () => ({}),
  },
  connType: {
    type: String,
    required: false,
    default: () => 'mqtt',
  },
})
const emit = defineEmits(['update:open', 'finish'])

const { t } = useI18n()
const { connectorTypeOptions } = useConnectorTypeValue()
const connectorData = ref({})
const connectorTLS = ref(createRawSSLParams())
const submitLoading = ref(false)
const isTesting = ref(false)

const visible = computed({
  get() {
    return props.open
  },
  set(value) {
    emit('update:open', value)
  },
})

const initConnectorAndSSLData = () => {
  connectorData.value = props.edit
    ? {
        ...cloneDeep(props.modelValue),
        // name: props.modelValue.id?.split(':')[1],
      }
    : {}
  connectorTLS.value =
    props.edit && props.modelValue.ssl ? cloneDeep(props.modelValue.ssl) : createRawSSLParams()
}

const tl = (key, moduleName = 'RuleEngine') => t(`${moduleName}.${key}`)

const updateConnectorData = (newConnectorData) => {
  connectorData.value = { ...connectorData.value, ...newConnectorData }
}

const getConnectorData = () => ({
  ...connectorData.value,
  ssl: { ...connectorTLS.value },
  type: props.connType,
})

const testTheConnection = async () => {
  try {
    isTesting.value = true
    await testConnector(getConnectorData())
    ElMessage.success(tl('connectionSuccessful'))
  } catch (error) {
    console.error(error)
  } finally {
    isTesting.value = false
  }
}

const submitConnector = async (isEdit) => {
  let res
  submitLoading.value = true
  const data = getConnectorData()
  if (isEdit) {
    const { id } = connectorData.value
    // Reflect.deleteProperty(data, "name");
    Reflect.deleteProperty(data, 'id')
    Reflect.deleteProperty(data, 'type')
    Reflect.deleteProperty(data, 'num_of_bridges')
    res = await updateConnector(id, data).catch(() => {})
  } else {
    res = await createConnector(data).catch(() => {})
  }
  if (res) {
    visible.value = false
    emit('finish', true, res)
    if (!isEdit) {
      ElMessage({ type: 'success', message: t('Base.createSuccess') })
    } else {
      ElMessage({ type: 'success', message: t('Base.updateSuccess') })
    }
  }
  submitLoading.value = false
}

const closeDialog = () => {
  visible.value = false
  emit('finish', false)
}

initConnectorAndSSLData()

watch(visible, (val) => {
  if (val) {
    initConnectorAndSSLData()
  }
})

// watch(
//   () => [cloneDeep(connectorData.value), cloneDeep(connectorTLS.value)],
//   (val) => {
//     if (props.edit) {
//       emit("update:modelValue", {
//         ...val[0],
//         tls: { ...val[1] },
//       });
//     }
//   }
// );
</script>
<style lang="scss" scoped>
:deep(.el-dialog__body) {
  padding-top: 0;
}
.desc-create {
  margin-bottom: 32px;
  font-size: 14px;
  color: var(--el-text-color-secondary);
  line-height: 1;
}
:deep(.form-sub-block) {
  margin-bottom: 16px;
}
:deep(.el-form-item) {
  margin-bottom: 12px;
}
.tip-edit {
  margin-top: 28px;
  p {
    margin: 4px 0;
  }
}
</style>
