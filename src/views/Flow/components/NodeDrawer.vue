<template>
  <el-drawer
    v-model="showDialog"
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
          <el-button
            :disabled="isSaveDisabled"
            :type="isSaveDisabled ? 'info' : 'primary'"
            @click="save"
          >
            {{ tl('done') }}
          </el-button>
        </div>
      </div>
      <el-button v-else type="primary" @click="edit">
        {{ tl('edit') }}
      </el-button>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import { EditedWay, FlowNodeType, SinkType, SourceType } from '@/hooks/Flow/useFlowNode'
import useNodeDrawer from '@/hooks/Flow/useNodeDrawer'
import useNodeForm from '@/hooks/Flow/useNodeForm'
import useI18nTl from '@/hooks/useI18nTl'
import { BridgeDirection, Role } from '@/types/enum'
import { Node } from '@vue-flow/core'
import { ElMessageBox } from 'element-plus'
import { cloneDeep, isEqual, isFunction, isObject, lowerCase } from 'lodash'
import { PropType, Ref, computed, defineEmits, defineProps, ref, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  node: {
    type: Object as PropType<Node>,
  },
  generateBridgeName: {
    type: Function,
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

const showDialog = computed({
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

const bridgeFormProps = { colSpan: 24, labelPosition: 'right' }

const formComponentPropsMap = computed(() => ({
  [SourceType.Message]: { existedTopics: existedTopics.value },
  [SourceType.Event]: { selectedEvents: selectedEvents.value },
  [SourceType.MQTTBroker]: { direction: BridgeDirection.Ingress },
  [SourceType.Kafka]: { ...bridgeFormProps, labelWidth: '180px', fixedRole: Role.Consumer },
  [SinkType.MQTTBroker]: { direction: BridgeDirection.Egress },
  [SinkType.HTTP]: { ...bridgeFormProps, labelWidth: '180px' },
  [SinkType.Kafka]: { ...bridgeFormProps, labelWidth: '180px', fixedRole: Role.Producer },
}))
const getFormComponentProps = (type: string) => formComponentPropsMap.value[type] || {}

const record: Ref<Record<string, any>> = ref({})

const { getFormDataByType, isBridgeType, checkFormIsEmpty } = useNodeForm()

const isSaveDisabled = computed(() => checkFormIsEmpty(type.value, record.value))

const toggleEditedWay = () => {
  record.value.editedWay = record.value.editedWay === EditedWay.SQL ? EditedWay.Form : EditedWay.SQL
}

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
    showDialog.value = false
  } catch (error) {
    //
  }
}

const save = async () => {
  try {
    if (FormCom.value.validate && isFunction(FormCom.value.validate)) {
      await FormCom.value.validate()
    }
    emit('save', record.value)
  } catch (error) {
    console.error(error)
  }
}

const edit = () => {
  emit('edit')
  // TODO:TODO:TODO:
}

watch(showDialog, (val) => {
  if (!val) {
    return
  }

  const { node, generateBridgeName } = props
  const { formData, specificType: type } = node?.data || {}
  const recordData = formData && isObject(formData) ? cloneDeep(formData) : getFormDataByType(type)
  if (!formData && isBridgeType(type) && isFunction(generateBridgeName)) {
    record.value = { ...recordData, name: generateBridgeName() }
  } else {
    record.value = recordData
  }
  rawRecord = cloneDeep(record.value)
})
</script>

<style lang="scss">
.node-drawer {
  .bridge-config {
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
  .message-form,
  .event-form {
    width: 80%;
  }
  .TLS-enable-config .TLS-input {
    width: 100%;
  }
}
</style>
