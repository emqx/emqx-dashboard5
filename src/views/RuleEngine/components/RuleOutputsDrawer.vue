<template>
  <el-drawer
    :title="!isEdit ? tl('addAction') : tl('editAction')"
    v-model="showDrawer"
    :lock-scroll="false"
    size="60%"
    destroy-on-close
  >
    <el-form
      label-position="top"
      require-asterisk-position="right"
      :model="outputForm"
      :rules="outputFormRules"
      ref="formCom"
    >
      <el-row :gutter="26">
        <el-col :span="12">
          <el-form-item :label="$tc('RuleEngine.actionType')" prop="type">
            <el-select v-model="outputForm.type" filterable @change="handleTypeChanged">
              <el-option
                v-for="{ value, label } in actionTypeOpts"
                :key="value"
                :value="value"
                :disabled="isOutputTypeDisabled(value)"
                :label="label"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="isOutputToBridge">
          <el-form-item :label="$tc('RuleEngine.action')">
            <ActionSelect
              v-model="bridgeForm.id"
              :type="outputForm.type"
              :disable-list="outputDisableList"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="output-content" v-if="outputForm.type === RuleOutput.Republish">
      <RePubForm ref="RePubFormCom" v-model="outputForm" />
    </div>
    <div class="output-content" v-else-if="outputForm.type === RuleOutput.Console">
      {{ tl('console') }}
    </div>
    <template v-else-if="isOutputToBridge">
      <!-- Setting key is to refresh the component -->
      <div class="output-content" v-if="!isCreatingAction">
        <p class="detail-title">{{ tl('confPreview') }}</p>
        <BridgeDetail
          ref="BridgeDetailRef"
          :bridge-id="bridgeForm.id"
          :disabled="!isEdit"
          hide-name
        />
      </div>
      <BridgeCreate
        v-else
        ref="BridgeCreateRef"
        class="output-content"
        :key="outputForm.type"
        :type="outputForm.type"
      />
    </template>
    <template #footer>
      <el-button
        v-if="isOutputToBridge"
        plain
        type="primary"
        :loading="isTesting"
        @click="testConnection"
      >
        {{ tl('testTheConnection') }}
      </el-button>
      <el-button class="btn-cancel" @click="cancel">
        {{ $t('Base.cancel') }}
      </el-button>
      <el-button
        v-if="isOutputToBridge && isCreatingAction"
        type="primary"
        @click="submitOutput"
        :loading="submitLoading"
      >
        {{ tl('create') }}
      </el-button>
      <el-button v-else type="primary" @click="submitOutput" :loading="submitLoading">
        {{ isEdit ? $t('Base.update') : $t('Base.add') }}
      </el-button>
    </template>
  </el-drawer>
</template>

<script lang="ts">
import useI18nTl from '@/hooks/useI18nTl'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'RuleOutputsDrawer',
})
</script>

<script setup lang="ts">
import { getTypeAndNameFromKey } from '@/common/tools'
import useHandleActionItem from '@/hooks/Rule/action/useHandleActionItem'
import { useBridgeTypeValue } from '@/hooks/Rule/bridge/useBridgeTypeValue'
import useFormRules from '@/hooks/useFormRules'
import { RuleOutput } from '@/types/enum'
import { OutputItemObj, RePub } from '@/types/rule'
import {
  PropType,
  WritableComputedRef,
  computed,
  defineEmits,
  defineProps,
  nextTick,
  ref,
  watch,
} from 'vue'
import BridgeCreate from '../Bridge/BridgeCreate.vue'
import BridgeDetail from '../Bridge/BridgeDetail.vue'
import ActionSelect from '../Rule/components/ActionSelect.vue'
import RePubForm from './RePubForm.vue'

type OutputForm = {
  type: string
  args?: RePub
}

const { tl, t } = useI18nTl('RuleEngine')
const BridgeDetailRef = ref()

const props = defineProps({
  modelValue: {
    type: Boolean,
  },
  output: {
    type: [Object, String] as PropType<OutputItemObj | string>,
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
    mqtt_properties: {},
    user_properties: '',
    direct_dispatch: false,
  },
})

const formCom = ref()
const RePubFormCom = ref()
const submitLoading = ref(false)
const outputForm = ref(createRawOutputForm())
const bridgeForm = ref<Record<string, any>>({})

const { createRequiredRule } = useFormRules()
const outputFormRules: Record<string, any> = {
  type: createRequiredRule(t('RuleEngine.action', 1).toLowerCase(), 'select'),
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

const { egressBridgeTypeList } = useBridgeTypeValue()
const actionTypeOpts: Array<{ value: string; label: string }> = [
  { value: RuleOutput.Republish, label: tl('republish') },
  { value: RuleOutput.Console, label: tl('consoleOutput') },
  ...egressBridgeTypeList,
]

const typesNotAction: Array<string> = [RuleOutput.Republish, RuleOutput.Console]
const isOutputToBridge = computed(
  () => outputForm.value.type && !typesNotAction.includes(outputForm.value.type),
)
/**
 * is creating true action
 */
const isCreatingAction = computed(() => !bridgeForm.value.id)
const BridgeCreateRef = ref()

const handleTypeChanged = () => {
  bridgeForm.value.id = ''
}

const isOutputTypeDisabled = (type: string) => {
  switch (type) {
    case RuleOutput.Republish: {
      const isEditingRepublish =
        typeof props.output === 'object' && RuleOutput.Republish !== props.output?.function
      return props.outputDisableList.includes(RuleOutput.Republish) && !isEditingRepublish
    }
    case RuleOutput.Console: {
      const isEditingConsole =
        typeof props.output === 'object' && RuleOutput.Console !== props.output?.function
      return props.outputDisableList.includes(RuleOutput.Console) && !isEditingConsole
    }
    default:
      return false
  }
}

const { getBridgeGeneralType } = useBridgeTypeValue()
const setFormDataWhenOpenDialog = async () => {
  const { output } = props
  if (output) {
    if (typeof output === 'string') {
      const { type } = getTypeAndNameFromKey(output)
      outputForm.value.type = getBridgeGeneralType(type)
      bridgeForm.value.id = output
    } else if (typeof output === 'object') {
      outputForm.value.type = output.function || ''
      if (output.function === RuleOutput.Republish && output.args) {
        outputForm.value.args = output.args
      }
    }
  }
  await nextTick()
  formCom.value.clearValidate()
}

const isTesting = ref(false)
const testConnection = async () => {
  isTesting.value = true
  try {
    const com = isCreatingAction.value ? BridgeCreateRef.value : BridgeDetailRef.value
    await com?.testConnection?.()
  } catch (error) {
    // ignore error
  } finally {
    isTesting.value = false
  }
}

const submitNewAction = async () => {
  try {
    const actionId = await BridgeCreateRef.value.submitCreateBridge()
    return Promise.resolve(actionId)
  } catch (error) {
    return Promise.reject(error)
    // ignore error
  }
}

const submitOutput = async () => {
  try {
    await formCom.value?.validate()
    submitLoading.value = true
    let opObj
    const { type } = outputForm.value
    if (!isOutputToBridge.value) {
      if (type === RuleOutput.Console) {
        opObj = { function: type }
      } else if (type === RuleOutput.Republish) {
        await RePubFormCom.value?.validate()
        opObj = { function: type, args: { ...outputForm.value.args } }
      } else {
        throw new Error('can not handle output form')
      }
    } else {
      if (!isCreatingAction.value) {
        opObj = !isEdit.value
          ? bridgeForm.value.id
          : await BridgeDetailRef.value?.updateBridgeInfo()
        if (!opObj) {
          return
        }
      } else {
        opObj = await submitNewAction()
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
    setFormDataWhenOpenDialog()
  } else {
    outputForm.value = createRawOutputForm()
    bridgeForm.value = {}
  }
})

const { handleConnDirection } = useHandleActionItem()

handleConnDirection(async (direction, connName, connType) => {
  setTimeout(async () => {
    showDrawer.value = true
    if (connType) {
      outputForm.value.type = connType
    }
    if (connName) {
      await nextTick()
      BridgeCreateRef.value.bridgeData.connector = connName
    }
  }, 800)
})
</script>

<style lang="scss" scoped>
.output-content {
  margin-top: 16px;
  padding-top: 24px;
  border-top: 1px solid var(--color-border-primary);
  :deep(.el-tab-pane > .el-card) {
    border: none;
  }
  :deep(.el-row + .el-divider) {
    margin-top: 8px;
  }
}
.detail-title {
  padding: 0 4px;
  margin: 4px 0 12px;
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-primary);
}
.payload-desc {
  color: var(--color-text-secondary);
}

.btn-cancel {
  margin-left: 28px;
}
</style>
