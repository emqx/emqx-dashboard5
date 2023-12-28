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
      :model="inputForm"
      :rules="rules"
      ref="formCom"
    >
      <el-row :gutter="26">
        <el-col :span="12">
          <el-form-item :label="$tc('RuleEngine.actionType')" prop="type">
            <el-select v-model="inputForm.type" filterable @change="handleTypeChanged">
              <el-option
                v-for="{ value, label } in inputTypeOpts"
                :key="value"
                :value="value"
                :label="label"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            v-if="inputForm.type === SourceType.Event"
            :label="tl('event')"
            prop="event"
          >
            <!-- TODO::disabled="isEventDisabled(item.event)" -->
            <RuleInputEventSelect v-model="inputForm.event" />
          </el-form-item>
          <el-form-item
            v-else-if="inputForm.type === SourceType.Message"
            :label="t('Base.topic')"
            prop="event"
          >
            <el-input v-model="inputForm.topic" />
          </el-form-item>
          <el-form-item v-if="isInputFromSource" :label="$tc('RuleEngine.action')">
            <ActionSelect
              v-model="inputForm.sourceId"
              :type="removeDirectionFromSpecificType(inputForm.type)"
              :disable-list="disabledSourceList"
              :direction="BridgeDirection.Ingress"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template v-if="isInputFromSource">
      <!-- Setting key is to refresh the component -->
      <div class="source-content" v-if="!isCreateSource">
        <p class="detail-title">{{ tl('confPreview') }}</p>
        <SourceDetail
          ref="SourceDetailRef"
          :bridge-id="inputForm.sourceId"
          :disabled="!isEdit"
          hide-name
        />
      </div>
      <!-- TODO:Create Source -->
    </template>
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

      <el-button
        v-if="isInputFromSource && isCreateSource"
        type="primary"
        @click="addSource"
        :loading="isSubmitting"
      >
        {{ tl('create') }}
      </el-button>

      <el-button v-else type="primary" @click="submit" :loading="isSubmitting">
        {{ isEdit ? $t('Base.update') : $t('Base.add') }}
      </el-button>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import { RULE_INPUT_BRIDGE_TYPE_PREFIX } from '@/common/constants'
import useFlowNode, { SourceType } from '@/hooks/Flow/useFlowNode'
import useGenerateFlowDataUtils from '@/hooks/Flow/useGenerateFlowDataUtils'
import useI18nTl from '@/hooks/useI18nTl'
import { BridgeDirection } from '@/types/enum'
import type { WritableComputedRef } from 'vue'
import { computed, defineEmits, defineProps, ref, watch } from 'vue'
import ActionSelect from '../Rule/components/ActionSelect.vue'
import SourceDetail from '../Source/SourceDetail.vue'
import RuleInputEventSelect from './RuleInputEventSelect.vue'

const props = defineProps<{
  modelValue: boolean
  /**
   * The input currently being edited,
   * if there is no value, it is a new one
   */
  input?: string
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

const { getBridgeIdFromInput, detectInputType } = useGenerateFlowDataUtils()

const isEdit = computed(() => !!props.input)

const initData = () => {
  inputForm.value = { type: SourceType.Message, event: '', sourceId: '', topic: '' }
}

const setFormWhenOpening = () => {
  const { input } = props
  if (!input) {
    return
  }

  const type = detectInputType(input)
  inputForm.value.type = type
  if (type === SourceType.Event) {
    inputForm.value.event = input
  } else if (type === SourceType.Message) {
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

const { sourceNodeList, removeDirectionFromSpecificType } = useFlowNode()
const inputTypeOpts = sourceNodeList.map(({ name, specificType }) => ({
  value: specificType,
  label: name,
}))

const inputForm = ref({
  type: '',
  event: '',
  topic: '',
  sourceId: '',
})
const rules = {}

const handleTypeChanged = () => {
  initData()
}

// TODO:
const disabledSourceList = computed(() => [])

const notSourceType = [SourceType.Message, SourceType.Event]
const isInputFromSource = computed(() => {
  const { type } = inputForm.value
  return type && !notSourceType.includes(type)
})

const isCreateSource = computed(() => !inputForm.value.sourceId)

const SourceDetailRef = ref()

const cancel = () => {
  showDrawer.value = false
}

const isTesting = ref(false)
const testConnection = async () => {
  // TODO:
}

const isSubmitting = ref(false)
const addSource = async () => {
  // TODO:
}
const submit = () => {
  // TODO: validate
  const { type, event, sourceId, topic } = inputForm.value
  if (type === SourceType.Message) {
    emit('submit', topic)
  } else if (type === SourceType.Event) {
    emit('submit', event)
  } else {
    const id = `${RULE_INPUT_BRIDGE_TYPE_PREFIX}${sourceId}`
    emit('submit', id)
  }
  showDrawer.value = false
}
</script>

<style lang="scss" scoped>
.source-content {
  margin-top: 16px;
  padding-top: 20px;
  border-top: 1px solid var(--color-border-primary);
  :deep(.el-tab-pane > .el-card) {
    border: none;
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
</style>
