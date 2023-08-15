<template>
  <el-drawer
    v-model="showDrawer"
    custom-class="node-drawer drawer-with-divider"
    :size="width"
    :title="title"
    :z-index="1999"
    :before-close="cancel"
    :destroy-on-close="true"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <template v-if="getFormComponent(type)">
      <component
        ref="FormCom"
        :is="getFormComponent(type)"
        v-model="record"
        v-bind="getFormComponentProps(type)"
        :readonly="readonly"
        :edit="isEdit"
        @save="save"
      />
    </template>
    <template #footer>
      <div class="space-between" v-if="!readonly">
        <div>
          <el-button
            v-if="node?.type === FlowNodeType.Default && record.editedWay !== undefined"
            link
            type="primary"
            @click="toggleEditedWay"
          >
            {{ t(`Flow.${record.editedWay === EditedWay.Form ? 'switchToSql' : 'switchToForm'}`) }}
          </el-button>
        </div>
        <div>
          <el-button @click="cancel">{{ tl('cancel') }}</el-button>
          <el-button v-if="isBridgeSelected" type="primary" plain @click="saveAsNew">
            <!-- TODO:TODO:TODO:zh -->
            Save as a new sink
          </el-button>
          <el-button
            :disabled="isSaveDisabled"
            :type="isSaveDisabled ? 'info' : 'primary'"
            @click="save"
          >
            {{ tl('save') }}
          </el-button>
        </div>
      </div>
      <el-button v-else type="primary" @click="edit">
        {{ tl('edit') }}
      </el-button>
    </template>
  </el-drawer>
  <NameInputForCopyBridgeDialog v-model="showNameInputDialog" @save="handleNameSave" />
</template>

<script setup lang="ts">
import { customValidate } from '@/common/tools'
import useFlowNode, {
  EditedWay,
  FlowNodeType,
  SinkType,
  SourceType,
} from '@/hooks/Flow/useFlowNode'
import useNodeDrawer from '@/hooks/Flow/useNodeDrawer'
import useNodeForm from '@/hooks/Flow/useNodeForm'
import useI18nTl from '@/hooks/useI18nTl'
import { BridgeDirection, Role } from '@/types/enum'
import { Node } from '@vue-flow/core'
import { ElMessageBox } from 'element-plus'
import { cloneDeep, isEqual, isFunction, isObject, lowerCase } from 'lodash'
import { PropType, Ref, computed, defineEmits, defineProps, ref, watch } from 'vue'
import NameInputForCopyBridgeDialog from './NameInputForCopyBridgeDialog.vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  node: {
    type: Object as PropType<Node>,
  },
  nodes: {
    type: Array as PropType<Array<Node>>,
  },
  readonly: {
    type: Boolean,
    default: false,
  },
})
const emit = defineEmits(['update:modelValue', 'save', 'cancel', 'close', 'edit'])

const showDrawer = computed({
  get: () => props.modelValue,
  set: (val: boolean) => {
    emit('update:modelValue', val)
  },
})

const { t, tl } = useI18nTl('Base')

/**
 * is specific type, no general type
 * eg. SourceType.Message etc.
 */
const type = computed(() => props.node?.data?.specificType)
const isEdit = computed(() => props.node?.data?.isCreated)

const FormCom = ref()

const { getDrawerTitle, drawerDefaultWidth, getDrawerWidth, getFormComponent } = useNodeDrawer()
const title = computed(() => (type.value ? getDrawerTitle(type.value) : ''))
const width = computed(() => (type.value ? getDrawerWidth(type.value) : drawerDefaultWidth))

const selectedEvents = computed(() => {
  if (!props.nodes?.length) {
    return []
  }
  return props.nodes.reduce((arr: Array<string>, node) => {
    if (node.data.specificType === SourceType.Event && node.data.formData?.event) {
      arr.push(node.data.formData.event)
    }
    return arr
  }, [])
})

const existedTopics = computed(() => {
  if (!props.nodes?.length) {
    return []
  }
  return props.nodes.reduce((arr: Array<string>, node) => {
    if (node.data.specificType === SourceType.Message && node.data.formData?.topic) {
      arr.push(node.data.formData.topic)
    }
    return arr
  }, [])
})

const { isBridgerNode ,removeDirectionFromSpecificType} = useFlowNode()
const { getFormDataByType, isUsingSchemaBridgeType, checkFormIsEmpty } = useNodeForm()

const bridgeFormProps = { colSpan: 24, labelPosition: 'right', requireAsteriskPosition: 'left' }
const schemaProps = {
  formProps: {
    labelWidth: '180px',
    labelPosition: 'right',
    requireAsteriskPosition: 'left',
  },
}

const getSchemaBridgeProps = (type: string) => ({
  ...bridgeFormProps,
  ...schemaProps,
  labelWidth: '180px',
  hiddenFields: ['role'],
  type: removeDirectionFromSpecificType(type),
})

const formComponentPropsMap = computed(() => ({
  [SourceType.Message]: { existedTopics: existedTopics.value },
  [SourceType.Event]: { selectedEvents: selectedEvents.value },
  [SourceType.MQTTBroker]: { direction: BridgeDirection.Ingress },
  [SourceType.Kafka]: { ...bridgeFormProps, labelWidth: '180px', fixedRole: Role.Consumer },
  [SinkType.MQTTBroker]: { direction: BridgeDirection.Egress },
  [SinkType.HTTP]: { ...bridgeFormProps, labelWidth: '180px' },
  [SinkType.Kafka]: { ...bridgeFormProps, labelWidth: '180px', fixedRole: Role.Producer },
  [SinkType.InfluxDB]: { ...bridgeFormProps, labelWidth: '180px' },
  [SinkType.Pulsar]: { ...bridgeFormProps, labelWidth: '180px', isRoleHidden: true },
}))
const getFormComponentProps = (type: string) => {
  const ret = formComponentPropsMap.value[type]
  if (!ret && isUsingSchemaBridgeType(type)) {
    return getSchemaBridgeProps(type)
  }
  return ret || {}
}

const record: Ref<Record<string, any>> = ref({})

const isSaveDisabled = computed(() => checkFormIsEmpty(type.value, record.value))

const toggleEditedWay = () => {
  record.value.editedWay = record.value.editedWay === EditedWay.SQL ? EditedWay.Form : EditedWay.SQL
}

const isBridgeSelected = computed(() => {
  if (!props.node) {
    return false
  }
  return isBridgerNode(props.node) && !!record.value.id
})
const showNameInputDialog = ref(false)

/**
 * When clicking the cancel / close button, it's used to compare the
 * current record's value to determine whether to pop up a window or not.
 */
let rawRecord: Record<string, any> = {}

const recordHasNotChanged = () => {
  const ret = isEqual(record.value, rawRecord)
  return ret
}

const cancel = async () => {
  try {
    if (!recordHasNotChanged() && !props.readonly) {
      await ElMessageBox.confirm(
        t('Flow.nodeDrawerCancelTip', {
          type: lowerCase(props.node?.data?.formData ? tl('edit') : tl('create')),
        }),
        {
          confirmButtonText: tl('confirm'),
          cancelButtonText: tl('cancel'),
          type: 'warning',
        },
      )
    }
    emit('cancel')
    showDrawer.value = false
  } catch (error) {
    //
  }
}

const save = async () => {
  try {
    if (FormCom.value.validate && isFunction(FormCom.value.validate)) {
      await customValidate(FormCom.value)
    }
    emit('save', record.value)
  } catch (error) {
    console.error(error)
  }
}

const saveAsNew = async () => {
  try {
    if (FormCom.value.validate && isFunction(FormCom.value.validate)) {
      await customValidate(FormCom.value)
    }
    showNameInputDialog.value = true
  } catch (error) {
    console.error(error)
  }
}

const handleNameSave = (name: string) => {
  record.value.name = name
  Reflect.deleteProperty(record.value, 'id')
  emit('save', record.value)
}

const edit = () => {
  emit('edit')
  // TODO:TODO:TODO:
}

watch(showDrawer, (val) => {
  if (!val) {
    return
  }

  const { node } = props
  const { formData, specificType: type } = node?.data || {}
  record.value = formData && isObject(formData) ? cloneDeep(formData) : getFormDataByType(type)
  rawRecord = cloneDeep(record.value)
})
</script>

<style lang="scss">
.node-drawer {
  .bridge-config {
    .el-form-item {
      margin-top: 0;
      margin-bottom: 24px;
    }
    .el-divider--horizontal {
      margin-top: 0;
    }
    .el-form-item__label {
      height: 32px;
      align-items: center;
      text-align: right;
      line-height: 1.2;
    }
    $input-append-width: 120px;
    .el-form-item__content,
    .oneof-item {
      > .el-input:not(.el-input-group--append),
      > .el-select {
        width: calc(100% - #{$input-append-width});
      }
    }
    .one-of {
      width: 100%;
    }
    .monaco-container {
      width: calc(100% - #{$input-append-width} / 2);
    }
  }
  .mqtt-bridge-trans-configuration {
    .monaco-container {
      margin-top: 0;
    }
  }
  .message-form,
  .event-form {
    width: 80%;
  }
  .TLS-enable-config .TLS-input {
    width: 100%;
  }
}
</style>
