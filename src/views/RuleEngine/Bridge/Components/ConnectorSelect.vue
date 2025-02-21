<template>
  <div class="connector-select">
    <el-select v-model="selected">
      <el-option
        v-for="connector in connectorOpts"
        :label="connector.name"
        :value="connector.name"
        :key="connector.name"
        :disabled="isConnectorDisabled(connector)"
      />
    </el-select>
    <el-tooltip :content="tl('createConnector')" placement="top">
      <el-button class="btn-add" :icon="Plus" @click="addConnector"></el-button>
    </el-tooltip>
    <ConnectorCreateDrawer
      v-model="showDrawer"
      :type="type"
      @submitted="handleConnectorSubmitted"
    />
  </div>
</template>

<script lang="ts" setup>
import { getConnectors } from '@/api/connector'
import { BridgeType } from '@/types/enum'
import { Connector } from '@/types/rule'
import { Plus } from '@element-plus/icons-vue'
import ConnectorCreateDrawer from '../../Connector/components/ConnectorCreateDrawer.vue'

const props = withDefaults(
  defineProps<{
    modelValue?: string
    type: BridgeType
    /**
     * Connectors related to webhook are not
     * allowed to be used elsewhere by default.
     */
    webhookConnectorDisabled?: boolean
  }>(),
  {
    webhookConnectorDisabled: true,
  },
)
const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const selected = computed({
  get() {
    return props.modelValue || ''
  },
  set(val) {
    emit('update:modelValue', val)
  },
})

const totalConnectorList = ref<Array<Connector>>([])
const getTotalList = async () => {
  try {
    totalConnectorList.value = await getConnectors()
  } catch (error) {
    //
  }
}
getTotalList()

const connectorOpts = computed(() => {
  if (!props.type) {
    return []
  }
  return totalConnectorList.value.filter((item) => item.type === props.type)
})

const { judgeIsWebhookConnector } = useWebhookUtils()
const isConnectorDisabled = (connector: Connector) => {
  if (!props.webhookConnectorDisabled) {
    return false
  }
  return judgeIsWebhookConnector(connector)
}

const { tl } = useI18nTl('RuleEngine')
const showDrawer = ref<boolean>(false)

const addConnector = () => (showDrawer.value = true)

const handleConnectorSubmitted = (name: string) => {
  selected.value = name
  getTotalList()
}
</script>

<style lang="scss">
.connector-select {
  display: flex;
  width: 100%;
  .el-select {
    flex-grow: 1;
  }
  .btn-add {
    flex-grow: 0;
    padding-left: 10px;
    padding-right: 10px;
    margin-left: 12px;
  }
}
</style>
