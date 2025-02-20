<template>
  <el-drawer
    :title="!isEdit ? tl('addInput') : tl('editInput')"
    v-model="showDrawer"
    :lock-scroll="false"
    size="60%"
    destroy-on-close
  >
    <el-form
      label-position="top"
      require-asterisk-position="right"
      :model="inputForm"
      :rules="rules"
      ref="FormCom"
    >
      <el-row :gutter="26">
        <el-col :span="12">
          <el-form-item :label="tl('inputType')" prop="type">
            <el-select v-model="inputForm.type" filterable @change="handleTypeChanged">
              <el-option
                v-for="{ value, label, icon } in inputTypeOpts"
                :key="value"
                :value="value"
                :label="label"
              >
                <div class="type-opt-content vertical-align-center">
                  <img class="img-type-opt" width="20" :src="icon" />
                  <span>{{ label }}</span>
                </div>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            v-if="inputForm.type === RuleSourceType.Event"
            :label="tl('event')"
            prop="event"
          >
            <RuleInputEventSelect v-model="inputForm.event" :is-event-disabled="isEventDisabled" />
          </el-form-item>
          <el-form-item
            v-else-if="inputForm.type === RuleSourceType.Message"
            :label="t('Base.topic')"
            prop="topic"
          >
            <el-input v-model="inputForm.topic" />
          </el-form-item>
          <el-form-item v-if="isInputFromSource" label="Source">
            <ActionSelect
              v-model="inputForm.sourceId"
              :type="inputForm.type"
              :disable-list="disabledSourceList"
              :direction="BridgeDirection.Ingress"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="source-content" v-if="isInputFromSource">
      <template v-if="!isCreatingSource">
        <p class="detail-title">{{ tl('confPreview') }}</p>
        <SourceDetail
          ref="SourceDetailRef"
          :source-id="inputForm.sourceId"
          :disabled="!isEdit"
          hide-name
        />
      </template>
      <SourceCreate v-else ref="SourceCreateRef" :type="inputForm.type" />
    </div>
    <template #footer>
      <el-button
        v-if="isInputFromSource"
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
      <el-button type="primary" @click="submit" :loading="isSubmitting">
        {{ submitBtnText }}
      </el-button>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import { RULE_INPUT_BRIDGE_TYPE_PREFIX } from '@/common/constants'
import { waitAMoment } from '@/common/tools'
import useHandleActionItem from '@/hooks/Rule/action/useHandleActionItem'
import { RuleSourceType, useRuleInputs } from '@/hooks/Rule/rule/useRule'
import useFormRules from '@/hooks/useFormRules'
import useI18nTl from '@/hooks/useI18nTl'
import { BridgeDirection } from '@/types/enum'
import ActionSelect from '../Rule/components/ActionSelect.vue'
import SourceDetail from '../Source/SourceDetail.vue'
import SourceCreate from '../Source/components/SourceCreate.vue'
import RuleInputEventSelect from './RuleInputEventSelect.vue'

const props = defineProps<{
  modelValue: boolean
  /**
   * The input currently being edited,
   * if there is no value, it is a new one
   */
  input?: string
  addedList: Array<string>
}>()
const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'submit', value: string): void
}>()

const showDrawer: WritableComputedRef<boolean> = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  },
})

const { t, tl } = useI18nTl('RuleEngine')

const { getBridgeIdFromInput, detectInputType, sourceOptList, getRuleSourceIcon } = useRuleInputs()

const isEdit = computed(() => !!props.input)

const initInputForm = () => {
  inputForm.value = { type: inputForm.value.type, event: '', sourceId: '', topic: '' }
}

const initData = () => {
  initInputForm()
  inputForm.value.type = RuleSourceType.Message
}

const setFormWhenOpening = () => {
  const { input } = props
  if (!input) {
    return
  }

  const type = detectInputType(input)
  inputForm.value.type = type
  if (type === RuleSourceType.Event) {
    inputForm.value.event = input
  } else if (type === RuleSourceType.Message) {
    inputForm.value.topic = input
  } else {
    inputForm.value.sourceId = getBridgeIdFromInput(input)
  }
}

watch(showDrawer, (val) => {
  if (val) {
    setFormWhenOpening()
  } else {
    initData()
  }
})

const inputTypeOpts = sourceOptList.map(({ label, value }) => ({
  value,
  label,
  icon: getRuleSourceIcon(value),
}))

const inputForm = ref({
  type: '',
  event: '',
  topic: '',
  sourceId: '',
})
const { createRequiredRule } = useFormRules()
const rules = {
  type: createRequiredRule(tl('inputType'), 'select'),
  event: createRequiredRule(tl('event'), 'select'),
  topic: [
    ...createRequiredRule(t('Base.topic')),
    {
      validator(rules: any, value: string) {
        if (props.addedList?.includes(value) && value !== props.input) {
          return [new Error(t('Flow.topicExistedError'))]
        }
        return []
      },
    },
  ],
}

const handleTypeChanged = initInputForm

const disabledSourceList = computed(() => {
  return props.addedList.reduce((arr: Array<string>, item) => {
    const type = detectInputType(item)
    if (type === RuleSourceType.Message || type === RuleSourceType.Event) {
      return arr
    }
    return [...arr, getBridgeIdFromInput(item)]
  }, [])
})
const isEventDisabled = (event: string) =>
  Array.isArray(props.addedList) && props.addedList.includes(event)

const notSourceType = [RuleSourceType.Message, RuleSourceType.Event]
const isInputFromSource = computed(() => {
  const { type } = inputForm.value
  return type && !notSourceType.includes(type)
})

const isCreatingSource = computed(() => !inputForm.value.sourceId)

const { handleConnDirection } = useHandleActionItem()

handleConnDirection(async (direction, connName, connType) => {
  if (direction === BridgeDirection.Egress) {
    return
  }
  await waitAMoment(800)
  showDrawer.value = true
  if (connType) {
    inputForm.value.type = connType
  }
  if (connName) {
    await nextTick()
    SourceCreateRef.value.sourceRecord.connector = connName
  }
})

const SourceDetailRef = ref()
const SourceCreateRef = ref()

const cancel = () => {
  showDrawer.value = false
}

const isTesting = ref(false)
const testConnection = async () => {
  isTesting.value = true
  try {
    const com = isCreatingSource.value ? SourceCreateRef.value : SourceDetailRef.value
    await com?.testConnection?.()
  } catch (error) {
    // ignore error
  } finally {
    isTesting.value = false
  }
}

const submitBtnText = computed(() => {
  if (isInputFromSource.value && isCreatingSource.value) {
    return tl('create')
  }
  return isEdit.value ? t('Base.update') : t('Base.add')
})

const FormCom = ref()
const isSubmitting = ref(false)
const addSource = async () => {
  try {
    const id = await SourceCreateRef.value?.submitNewSource()
    return Promise.resolve(id)
  } catch (error) {
    return Promise.reject(error)
  }
}
const updateSource = async () => {
  try {
    const id = await SourceDetailRef.value?.updateSourceInfo()
    return Promise.resolve(id)
  } catch (error) {
    return Promise.reject(error)
  }
}
const submit = async () => {
  try {
    await FormCom.value?.validate?.()
    isSubmitting.value = true
    const { type, event, sourceId, topic } = inputForm.value
    if (type === RuleSourceType.Message) {
      emit('submit', topic)
    } else if (type === RuleSourceType.Event) {
      emit('submit', event)
    } else {
      let selectedSourceId = sourceId
      if (isCreatingSource.value) {
        selectedSourceId = await addSource()
      } else {
        selectedSourceId = await updateSource()
      }
      const id = `${RULE_INPUT_BRIDGE_TYPE_PREFIX}${selectedSourceId}`
      emit('submit', id)
    }
    showDrawer.value = false
  } catch (error) {
    //
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style lang="scss" scoped>
.source-content {
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

.btn-cancel {
  margin-left: 28px;
}
.type-opt-content {
  .img-type-opt {
    margin-right: 12px;
  }
}
</style>
