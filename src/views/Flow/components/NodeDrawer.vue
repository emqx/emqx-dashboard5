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
        @save="save"
      />
    </template>
    <template #footer>
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
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import { SinkType, SourceType } from '@/hooks/Flow/useFlowNode'
import useNodeDrawer from '@/hooks/Flow/useNodeDrawer'
import useNodeForm from '@/hooks/Flow/useNodeForm'
import useI18nTl from '@/hooks/useI18nTl'
import { BridgeDirection } from '@/types/enum'
import { Node } from '@vue-flow/core'
import { ElMessageBox } from 'element-plus'
import { cloneDeep, isFunction, isObject, isEqual, lowerCase } from 'lodash'
import { PropType, Ref, computed, defineEmits, defineProps, ref, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  type: {
    type: String,
    default: '',
  },
  formData: {
    type: Object,
  },
  generateBridgeName: {
    type: Function,
  },
  nodes: {
    type: Array as PropType<Array<Node>>,
  },
})
const emit = defineEmits(['update:modelValue', 'save', 'cancel', 'close'])

const showDialog = computed({
  get: () => props.modelValue,
  set: (val: boolean) => {
    emit('update:modelValue', val)
  },
})

const { t, tl } = useI18nTl('Base')

const FormCom = ref()

const { getDrawerTitle, drawerDefaultWidth, getDrawerWidth, getFormComponent } = useNodeDrawer()
const title = computed(() => (props.type ? getDrawerTitle(props.type) : ''))
const width = computed(() => (props.type ? getDrawerWidth(props.type) : drawerDefaultWidth))

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

const formComponentPropsMap = computed(() => ({
  [SourceType.Message]: { existedTopics: existedTopics.value },
  [SourceType.Event]: { selectedEvents: selectedEvents.value },
  [SourceType.MQTTBroker]: { direction: BridgeDirection.Ingress },
  [SinkType.MQTTBroker]: { direction: BridgeDirection.Egress },
  [SinkType.HTTP]: { colSpan: 24 },
}))
const getFormComponentProps = (type: string) => formComponentPropsMap.value[type] || {}

const record: Ref<Record<string, any>> = ref({})

const { getFormDataByType, isBridgeType, checkFormIsEmpty } = useNodeForm()

const isSaveDisabled = computed(() => checkFormIsEmpty(props.type, record.value))

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
    if (!recordHasNotChanged()) {
      await ElMessageBox.confirm(
        t('Flow.nodeDrawerCancelTip', {
          type: lowerCase(props.formData ? tl('edit') : tl('create')),
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
    //
  }
}

watch(showDialog, (val) => {
  if (!val) {
    return
  }

  const { formData, type, generateBridgeName } = props
  record.value = formData && isObject(formData) ? cloneDeep(formData) : getFormDataByType(type)
  if (!formData && isBridgeType(type) && isFunction(generateBridgeName)) {
    record.value.name = generateBridgeName()
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
}
</style>
