<template>
  <div>
    <el-dialog
      :title="edit ? tl('editConn') : tl('newConn')"
      v-model="visible"
      @close="$emit('finish', false)"
    >
      <p class="desc-create">{{ tl('descForCreateConnector') }}</p>
      <el-form :model="connectorData" ref="formCom" label-position="top" :rules="formRules">
        <div class="form-sub-block">
          <div class="part-header">{{ tl('baseInfo') }}</div>
          <el-row :gutter="30">
            <el-col :span="12">
              <el-form-item :label="tl('type')" required prop="type">
                <el-select
                  class="type-select"
                  :class="typeSelectClass"
                  v-model="connectorData.type"
                  :disabled="edit"
                >
                  <el-option
                    v-for="{ value, label } in connectorTypeOptions"
                    :key="value"
                    :value="value"
                    :label="label"
                  >
                    <div class="option-content">
                      <img :src="require(`@/assets/img/${value}.png`)" width="20" />
                      <span>{{ label }}</span>
                    </div>
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item :label="tl('connName')" prop="name" required>
                <el-input
                  v-model="connectorData.name"
                  :placeholder="connectorData.name"
                  :disabled="edit"
                />
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
        <el-button @click="closeDialog()">
          {{ $t('Base.cancel') }}
        </el-button>
        <el-button type="primary" :loading="isTesting" @click="testTheConnection(edit)">
          {{ tl('testTheConnection') }}
        </el-button>
        <el-button type="primary" :loading="submitLoading" @click="submitConnector(edit)">
          {{ edit ? $t('Base.update') : $t('Base.add') }}
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
import { computed, ref, watch, defineProps, defineEmits, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import ConnectorMqttConfig from '../Connector/ConnectorMqttConfig.vue'
import { createConnector, updateConnector, testConnector } from '@/api/ruleengine'
import { cloneDeep, omit } from 'lodash'
import { ElMessage } from 'element-plus'
import useConnectorTypeValue from '@/hooks/Rule/bridge/useConnectorTypeValue'
import { createRawSSLParams } from '@/common/tools.ts'
import { ConnectorType } from '@/types/enum'
import useFormRules from '@/hooks/useFormRules'
import useI18nTl from '@/hooks/useI18nTl'
import { commonTimeUnits } from '@/common/tools'

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
const { tl } = useI18nTl('RuleEngine')
const { connectorTypeOptions } = useConnectorTypeValue()
const connectorData = ref({})
const connectorTLS = ref(createRawSSLParams())
const submitLoading = ref(false)
const isTesting = ref(false)

const { createRequiredRule } = useFormRules()
const formCom = ref()
const formRules = {
  type: createRequiredRule(tl('type'), 'select'),
  name: createRequiredRule(tl('connName')),
}

const visible = computed({
  get() {
    return props.open
  },
  set(value) {
    emit('update:open', value)
  },
})

const typeSelectClass = computed(() => {
  if (!connectorData.value.type) {
    return ''
  }
  return `has-icon is-${connectorData.value.type}`
})

const initConnectorAndSSLData = () => {
  connectorData.value = props.edit
    ? {
        ...cloneDeep(props.modelValue),
        // name: props.modelValue.id?.split(':')[1],
      }
    : {
        type: ConnectorType.MQTT,
      }
  connectorTLS.value =
    props.edit && props.modelValue.ssl ? cloneDeep(props.modelValue.ssl) : createRawSSLParams()
}

const updateConnectorData = (newConnectorData) => {
  connectorData.value = { ...connectorData.value, ...newConnectorData }
}

const getConnectorData = () => {
  let ret = { ...connectorData.value, ssl: { ...connectorTLS.value }, type: props.connType }

  const fields = ['reconnect_interval', 'retry_interval']
  const reg = new RegExp(`^(${commonTimeUnits.join('|')})$`)
  fields.forEach((key) => {
    if (reg.test(ret[key])) {
      ret = omit(ret, key)
    }
  })

  return ret
}

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
  await formCom.value.validate()
  let res
  submitLoading.value = true
  const data = getConnectorData()

  try {
    if (isEdit) {
      const { id } = connectorData.value
      // Reflect.deleteProperty(data, "name");
      Reflect.deleteProperty(data, 'id')
      Reflect.deleteProperty(data, 'type')
      Reflect.deleteProperty(data, 'num_of_bridges')
      res = await updateConnector(id, data)
    } else {
      res = await createConnector(data)
    }
    visible.value = false
    emit('finish', true, res)
    ElMessage.success(t(!isEdit ? 'Base.createSuccess' : 'Base.updateSuccess'))
  } catch (error) {
    console.error(error)
  } finally {
    submitLoading.value = false
  }
}

const closeDialog = () => {
  visible.value = false
  emit('finish', false)
}

initConnectorAndSSLData()

watch(visible, async (val) => {
  if (val) {
    initConnectorAndSSLData()
    await nextTick()
    formCom.value.clearValidate()
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

.type-select {
  $icon-size: 24px;
  $icon-left: 8px;
  &.has-icon {
    :deep(.el-input) {
      &::before {
        position: absolute;
        top: 50%;
        left: 8px;
        transform: translateY(-50%);
        z-index: 3;
        content: '';
        display: block;
        width: $icon-size;
        height: $icon-size;
      }
    }
    :deep(.el-input__inner) {
      padding-left: $icon-size + $icon-left + 8px;
    }
  }

  &.is-mqtt {
    :deep(.el-input) {
      &::before {
        background-image: url(~@/assets/img/mqtt.png);
        background-size: contain;
      }
    }
  }
}
// :deep(.el-select-dropdown__item) {
//   padding: 0 12px;
// }
.el-select-dropdown__item {
  padding: 0 12px;
}

.option-content {
  display: flex;
  align-items: center;
  img {
    margin-right: 4px;
  }
}
</style>
