<template>
  <el-dialog
    :title="!isEdit ? tl('addOutput') : tl('editOutput')"
    v-model="showDialog"
    :lock-scroll="false"
  >
    <!-- FIXME: scroll bug-->
    <el-form label-position="top" :model="outputForm" :rules="outputFormRules" ref="formCom">
      <el-row>
        <el-col :span="14" v-loading="isLoading">
          <el-form-item :label="tl('output')" prop="type">
            <div class="form-item-content">
              <el-select v-model="outputForm.type">
                <el-option
                  v-for="bridge in egressBridgeList"
                  :key="bridge"
                  :value="bridge.id"
                  :label="bridge.id"
                  :disabled="isDisabledBridge(bridge)"
                />
                <el-option
                  :value="RuleOutput.Console"
                  :disabled="isDisabledConsole"
                  :label="tl('consoleOutput')"
                />
                <el-option
                  :value="RuleOutput.Republish"
                  :disabled="isDisabledRepublish"
                  :label="tl('republish')"
                />
              </el-select>
              <div class="handlers-container">
                <el-icon
                  class="btn-handler"
                  :class="{ 'is-disabled': !isOutputToBridge }"
                  @click="editBridge"
                >
                  <edit />
                </el-icon>
                <el-icon class="btn-handler" @click="addBridge"><plus /></el-icon>
              </div>
            </div>
          </el-form-item>
        </el-col>
      </el-row>

      <div class="output-content" v-if="outputForm.type === RuleOutput.Republish">
        <div class="part-header">{{ tl('paramSetting') }}</div>
        <el-row>
          <el-col :span="14">
            <el-form-item label="Topic">
              <el-input v-model="outputForm.args.topic" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="14">
            <el-form-item label="QoS">
              <el-select v-model="outputForm.args.qos">
                <el-option v-for="item in QoSOptions" :value="item" :key="item" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="14">
            <el-form-item label="Payload">
              <el-input type="textarea" v-model="outputForm.args.payload" />
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <BridgePreview
        class="output-content"
        v-else-if="isOutputToBridge"
        :bridge-id="outputForm.type"
        :bridge-list="egressBridgeList"
      />
    </el-form>
    <template #footer>
      <el-button @click="cancel()">
        {{ $t('Base.cancel') }}
      </el-button>
      <el-button type="primary" @click="submitOutput(isEdit)" :loading="isLoading">
        {{ isEdit ? $t('Base.update') : $t('Base.add') }}
      </el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'RuleOutputsDialog',
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
  PropType,
  onActivated,
  nextTick,
} from 'vue'
import { useI18n } from 'vue-i18n'
import { getBridgeList } from '@/api/ruleengine'
import { MQTTBridgeDirection, RuleOutput } from '@/types/enum'
import { BridgeItem, OutputItem } from '@/types/rule'
import { QoSOptions } from '@/common/constants'
import { useRoute, useRouter } from 'vue-router'
import { Plus, Edit } from '@element-plus/icons-vue'
import BridgePreview from './BridgePreview.vue'

type OutputForm = {
  type: string
  args?: Record<string, unknown>
}

const router = useRouter()
const { t } = useI18n()
const tl = (key: string, moduleName = 'RuleEngine') => t(`${moduleName}.${key}`)

const props = defineProps({
  modelValue: {
    type: Boolean,
  },
  output: {
    type: Object as PropType<OutputItem>,
    required: false,
  },
  outputDisableList: {
    type: Array,
    required: true,
  },
})

const emit = defineEmits(['update:modelValue', 'submit'])

const createRawOutputForm = (): OutputForm => ({
  type: '',
  args: {
    topic: '',
    qos: 0,
    payload: '',
  },
})

const route = useRoute()
const formCom = ref()
const isLoading = ref(false)
const bridgeList: Ref<Array<BridgeItem>> = ref([])
const egressBridgeList: Ref<Array<BridgeItem>> = ref([])
const outputForm = ref(createRawOutputForm())
const isGoToBridge = ref(false)

const outputFormRules = {
  type: [
    {
      required: true,
      message: t('RuleEngine.outputTypeRequired'),
      trigger: ['blur', 'change'],
    },
  ],
}

const showDialog: WritableComputedRef<boolean> = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  },
})

const isEdit = computed(() => !!props.output)

const isDisabledConsole = computed(() => {
  const isEditingConsole =
    typeof props.output === 'object' && RuleOutput.Console !== props.output.function
  return props.outputDisableList.includes(RuleOutput.Console) && !isEditingConsole
})

const isDisabledRepublish = computed(() => {
  const isEditingRepublish =
    typeof props.output === 'object' && RuleOutput.Republish !== props.output.function
  return props.outputDisableList.includes(RuleOutput.Republish) && !isEditingRepublish
})

const isOutputToBridge = computed(() => {
  const { type } = outputForm.value
  return !!type && type !== RuleOutput.Console && type !== RuleOutput.Republish
})

const isEditRule = computed(() => !((route.name as string).indexOf('create') > -1))

const setFormDataWhenOpenDialog = async () => {
  const { output } = props
  if (output) {
    if (typeof output === 'string') {
      outputForm.value.type = output
    } else if (typeof output === 'object') {
      outputForm.value.type = output.function || ''
      if (output.function === RuleOutput.Republish) {
        outputForm.value.args = output.args
      }
    }
  } else {
    outputForm.value = createRawOutputForm()
    await nextTick()
    formCom.value.clearValidate()
  }
}

const loadEgressBridgeList = async () => {
  try {
    bridgeList.value = await getBridgeList()
    egressBridgeList.value = bridgeList.value.filter((v: BridgeItem) => {
      const isOutDirection = 'direction' in v && v.direction === MQTTBridgeDirection.Out
      return !('direction' in v) || isOutDirection
    })
  } catch (error) {
    console.error(error)
  }
}

const isDisabledBridge = ({ id }: BridgeItem) => {
  return props.outputDisableList.includes(id) && id !== props.output
}

const editBridge = async () => {
  if (!isOutputToBridge.value) {
    return
  }
  isGoToBridge.value = true
  await nextTick()
  router.push({
    name: isEditRule.value ? 'edit-bridge-for-edit-iot' : 'edit-bridge-for-create-iot',
    params: { activeTab: 'Setting', id: outputForm.value.type, from: route.name as string },
  })
}

const addBridge = async () => {
  isGoToBridge.value = true
  await nextTick()
  router.push({
    name: isEditRule.value ? 'create-bridge-for-edit-iot' : 'create-bridge-for-create-iot',
    params: { from: route.name as string },
  })
}

const submitOutput = async (edit = false) => {
  try {
    await formCom.value?.validate()
    isLoading.value = true
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
      default:
        opObj = outputForm.value.type
    }

    emit('submit', opObj)
    showDialog.value = false
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
  }
}

const cancel = () => {
  showDialog.value = false
}

watch(showDialog, (val) => {
  if (val) {
    loadEgressBridgeList()
    setFormDataWhenOpenDialog()
  }
})

onActivated(async () => {
  const { params } = route
  isGoToBridge.value = false
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
  .handlers-container {
    display: flex;
    flex-shrink: 0;
    margin-left: 8px;
  }
  .btn-handler {
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    margin: 0 8px;
    border: 1px solid var(--color-border-primary);
    border-radius: var(--el-border-radius-base);
    cursor: pointer;
    &.is-disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
}

.output-content {
  margin-top: 16px;
  padding-top: 20px;
  border-top: 1px solid var(--color-border-primary);
}
</style>
