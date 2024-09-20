<template>
  <el-dialog
    v-model="showDialog"
    class="create-rule-with-connector-dialog"
    :width="420"
    :title="title"
    :close-on-click-modal="false"
    @close="cancel"
  >
    <div class="vertical-align-center" v-if="confirmStep === 0">
      <el-icon :size="24"><SuccessFilled /></el-icon>
      <p>{{ tl('useConnectorCreateRule') }}</p>
    </div>
    <div v-else>
      <p>{{ t('RuleEngine.confirmDirectionWhenCreatingRule', { name: connector?.name }) }}</p>
    </div>
    <template #footer>
      <div v-if="confirmStep === 0">
        <el-button @click="cancel">
          {{ cancelText ?? t('Base.cancel') }}
        </el-button>
        <el-button type="primary" @click="confirm">
          {{ confirmText ?? t('Base.confirm') }}
        </el-button>
      </div>
      <div v-else>
        <el-button type="primary" @click="selectInput">
          {{ tl('dataInput') }}
        </el-button>
        <el-button type="primary" @click="selectOutput">
          {{ tl('actionOutputs') }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { CONNECTOR_TYPES_WITH_SOURCE } from '@/common/constants'
import { useConnectorDirection } from '@/hooks/Rule/bridge/useBridgeTypeValue'
import useI18nTl from '@/hooks/useI18nTl'
import { BridgeDirection } from '@/types/enum'
import { BridgeItem, Connector } from '@/types/rule'
import { SuccessFilled } from '@element-plus/icons-vue'
import { ElDialog } from 'element-plus'
import { isFunction } from 'lodash'
import { computed, defineEmits, defineProps, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps<{
  modelValue: boolean
  connector?: Connector | BridgeItem
  title?: string
  cancelText?: string
  confirmText?: string
  cancelCallback?: () => void
}>()
const emit = defineEmits<{
  (e: 'update:modelValue', v: boolean): void
}>()

const showDialog = computed({
  get: () => props.modelValue,
  set: (val: boolean) => {
    emit('update:modelValue', val)
  },
})

const { t, tl } = useI18nTl('RuleEngine')
const router = useRouter()

const confirmStep = ref(0)

const { judgeConnectorTypeDirection } = useConnectorDirection()

watch(showDialog, (val) => {
  if (!val) {
    confirmStep.value = 0
  } else {
    connectorDirection.value =
      (props.connector && judgeConnectorTypeDirection(props.connector.type)) ??
      BridgeDirection.Egress
  }
})

const connectorDirection = ref(BridgeDirection.Egress)

const confirm = () => {
  if (CONNECTOR_TYPES_WITH_SOURCE.includes(props.connector?.type)) {
    confirmStep.value += 1
  } else {
    createRule()
  }
}

const selectInput = () => {
  connectorDirection.value = BridgeDirection.Ingress
  createRule()
}

const selectOutput = () => {
  connectorDirection.value = BridgeDirection.Egress
  createRule()
}

const createRule = async () => {
  if (!props.connector) {
    return
  }
  const { name, type } = props.connector
  router.push({
    name: 'rule-create',
    query: { direction: connectorDirection.value, connName: name, connType: type },
  })
}

const cancel = () => {
  if (isFunction(props.cancelCallback)) {
    props.cancelCallback()
  }
  showDialog.value = false
}
</script>

<style lang="scss">
.create-rule-with-connector-dialog {
  padding: 0 12px 4px;
  p {
    margin: 0;
  }
  .el-dialog__header {
    padding: 15px 15px 10px;
  }
  .el-dialog__headerbtn {
    position: absolute;
    top: 15px;
    right: 15px;
    width: 16px;
    height: 24px;
    line-height: 24px;
  }
  .el-dialog__body {
    padding: 10px 15px;
  }
  .el-icon {
    margin-right: 12px;
    color: var(--el-color-success);
  }
  .el-dialog__footer {
    padding: 5px 15px 10px;
  }
}
</style>
