<template>
  <el-drawer
    :title="!isEdit ? tl('addAction') : tl('editAction')"
    v-model="showDrawer"
    :lock-scroll="false"
    size="60%"
    destroy-on-close
  >
    <el-form label-position="top" :model="outputForm" :rules="outputFormRules" ref="formCom">
      <el-row :gutter="26">
        <el-col :span="12" v-loading="isLoading">
          <el-form-item :label="$tc('RuleEngine.action')" prop="type">
            <el-select v-model="outputForm.type">
              <el-option
                :value="RuleOutput.Republish"
                :disabled="isDisabledRepublish"
                :label="tl('republish')"
              />
              <el-option
                :value="RuleOutput.Console"
                :disabled="isDisabledConsole"
                :label="tl('consoleOutput')"
              />
              <el-option :value="RuleOutput.DataBridge" :label="tl('useDataBridge')" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="outputForm.type === RuleOutput.DataBridge">
          <el-form-item :label="$tc('RuleEngine.dataBridge')">
            <div class="form-item-content">
              <el-select v-model="bridgeForm.id">
                <el-option
                  v-for="bridge in egressBridgeList"
                  :key="bridge.id"
                  :value="bridge.id"
                  :label="bridge.id"
                  :disabled="isDisabledBridge(bridge)"
                />
              </el-select>
              <el-icon class="btn-handler" @click="addBridge"><plus /></el-icon>
            </div>
          </el-form-item>
        </el-col>
      </el-row>

      <div class="output-content" v-if="outputForm.type === RuleOutput.Republish">
        <el-row :gutter="26">
          <el-col :span="10">
            <el-form-item :label="$t('Base.topic')" required prop="args.topic">
              <el-input v-model="outputForm.args.topic" />
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="QoS">
              <el-select v-model="outputForm.args.qos">
                <el-option v-for="item in QoSOptions" :value="item" :key="item" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="Retain">
              <el-checkbox :label="'Retain'" border v-model="outputForm.args.retain" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="Payload">
              <template #label>
                <label>Payload</label>
                <InfoTooltip :content="tl('payloadExample')" />
                <p class="payload-desc">{{ tl('payloadDesc') }}</p>
              </template>
              <div class="monaco-container">
                <Monaco
                  :id="createRandomString()"
                  v-model="outputForm.args.payload"
                  lang="json"
                  json-without-validate
                />
              </div>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <div class="output-content" v-if="outputForm.type === RuleOutput.Console">
        {{ tl('console') }}
      </div>
      <BridgeDetail
        v-else-if="isOutputToBridge && bridgeForm.id"
        ref="BridgeDetailRef"
        class="output-content"
        :bridge-id="bridgeForm.id"
      />
    </el-form>
    <template #footer>
      <el-button @click="cancel()">
        {{ $t('Base.cancel') }}
      </el-button>
      <el-button type="primary" @click="submitOutput(isEdit)" :loading="submitLoading">
        {{ isEdit ? $t('Base.update') : $t('Base.add') }}
      </el-button>
    </template>
    <AddBridgeOnRule v-model="showAddBridgeDrawer" @added="handleAddedBridge" />
  </el-drawer>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import useI18nTl from '@/hooks/useI18nTl'

export default defineComponent({
  name: 'RuleOutputsDrawer',
})
</script>

<script setup lang="ts">
import {
  defineProps,
  computed,
  defineEmits,
  WritableComputedRef,
  watch,
  ref,
  Ref,
  onActivated,
  nextTick,
  PropType,
} from 'vue'
import { getBridgeList } from '@/api/ruleengine'
import { MQTTBridgeDirection, RuleOutput } from '@/types/enum'
import { BridgeItem, OutputItemObj } from '@/types/rule'
import { QoSOptions } from '@/common/constants'
import { useRoute } from 'vue-router'
import { Plus } from '@element-plus/icons-vue'
import BridgeDetail from '../Bridge/BridgeDetail.vue'
import useFormRules from '@/hooks/useFormRules'
import { createRandomString } from '@/common/tools'
import Monaco from '@/components/Monaco.vue'
import InfoTooltip from '@/components/InfoTooltip.vue'
import AddBridgeOnRule from './AddBridgeOnRule.vue'

type OutputForm = {
  type: string
  args?: Record<string, unknown>
}

const { tl, t } = useI18nTl('RuleEngine')
const BridgeDetailRef = ref()

const props = defineProps({
  modelValue: {
    type: Boolean,
  },
  output: {
    type: Object as PropType<OutputItemObj>,
    required: false,
  },
  outputDisableList: {
    type: Array as PropType<Array<string>>,
    required: true,
  },
  edit: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue', 'submit'])

const createRawOutputForm = (): OutputForm => ({
  type: '',
  args: {
    topic: '',
    qos: 0,
    payload: '',
    retain: false,
  },
})

const route = useRoute()
const formCom = ref()
const isLoading = ref(false)
const submitLoading = ref(false)
const bridgeList: Ref<Array<BridgeItem>> = ref([])
const egressBridgeList: Ref<Array<BridgeItem>> = ref([])
const outputForm = ref(createRawOutputForm())
const bridgeForm = ref<Record<string, any>>({})

const { createRequiredRule } = useFormRules()
const outputFormRules = {
  type: createRequiredRule(t('RuleEngine.action', 1).toLowerCase(), 'select'),
  args: {
    topic: createRequiredRule('Topic'),
  },
}

const showDrawer: WritableComputedRef<boolean> = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  },
})

const isEdit = computed(() => !!props.output && props.edit)

const isDisabledConsole = computed(() => {
  const isEditingConsole =
    typeof props.output === 'object' && RuleOutput.Console !== props.output?.function
  return props.outputDisableList.includes(RuleOutput.Console) && !isEditingConsole
})

const isDisabledRepublish = computed(() => {
  const isEditingRepublish =
    typeof props.output === 'object' && RuleOutput.Republish !== props.output?.function
  return props.outputDisableList.includes(RuleOutput.Republish) && !isEditingRepublish
})

const isOutputToBridge = computed(() => {
  return outputForm.value.type === RuleOutput.DataBridge && bridgeForm.value.id
})

const setFormDataWhenOpenDialog = async () => {
  const { output } = props
  if (output) {
    if (typeof output === 'string') {
      outputForm.value.type = RuleOutput.DataBridge
      bridgeForm.value.id = output
    } else if (typeof output === 'object') {
      outputForm.value.type = output.function || ''
      if (output.function === RuleOutput.Republish) {
        outputForm.value.args = output.args
      }
    }
  }
  await nextTick()
  formCom.value.clearValidate()
}

const loadEgressBridgeList = async () => {
  try {
    bridgeList.value = await getBridgeList()
    egressBridgeList.value = bridgeList.value.filter((v: BridgeItem) => {
      // without direction configurations
      if (!('ingress' in v) && !('egress' in v)) {
        return true
      }
      // or configured egress
      return 'egress' in v
    })
  } catch (error) {
    console.error(error)
  }
}

const isDisabledBridge = ({ id }: BridgeItem) => {
  return props.outputDisableList.includes(id) && id !== props.output
}

const showAddBridgeDrawer = ref(false)
const addBridge = () => {
  showAddBridgeDrawer.value = true
}

const handleAddedBridge = (bridgeId: string) => {
  showAddBridgeDrawer.value = false
  outputForm.value.type = RuleOutput.DataBridge
  bridgeForm.value.id = bridgeId
}

const submitOutput = async (edit = false) => {
  try {
    await formCom.value?.validate()
    submitLoading.value = true
    let opObj
    switch (outputForm.value.type) {
      case RuleOutput.Console:
        opObj = { function: outputForm.value.type }
        break
      case RuleOutput.Republish:
        opObj = {
          function: outputForm.value.type,
          args: { ...outputForm.value.args },
        }
        break
      case RuleOutput.DataBridge:
        opObj = bridgeForm.value.id
        break
      default:
        opObj = outputForm.value.type
    }
    if (outputForm.value.type === RuleOutput.DataBridge) {
      const res = await BridgeDetailRef.value?.updateBridgeInfo()
      if (!res) {
        return
      }
    }
    emit('submit', opObj, isEdit.value)
    showDrawer.value = false
  } catch (error) {
    console.error(error)
  } finally {
    submitLoading.value = false
  }
}

const cancel = () => {
  showDrawer.value = false
}

watch(showDrawer, (val) => {
  if (val) {
    loadEgressBridgeList()
    setFormDataWhenOpenDialog()
  } else {
    outputForm.value = createRawOutputForm()
    bridgeForm.value = {}
  }
})

onActivated(async () => {
  if (!props.modelValue) {
    return
  }
  const { params } = route
  if (params.bridgeId) {
    await loadEgressBridgeList()
    outputForm.value.type = params.bridgeId as string
  }
})
</script>

<style lang="scss" scoped>
.form-item-content {
  display: flex;
  width: 100%;
  .btn-handler {
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border: 1px solid var(--color-border-primary);
    border-radius: var(--el-border-radius-base);
    cursor: pointer;
    margin-left: 8px;
    &.is-disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
}

.output-content {
  margin-top: 16px;
  padding-top: 20px;
  border-top: 1px solid var(--color-border-menu);
}
.payload-desc {
  color: var(--color-text-secondary);
}
</style>
