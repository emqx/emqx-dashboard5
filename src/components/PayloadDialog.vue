<template>
  <el-dialog v-model="showDialog" class="payload-dialog" width="700px" :title="t('Extension.view')">
    <el-row v-loading="isLoading">
      <el-col :span="24" v-if="topic">
        <el-row>
          <el-col :span="2">
            <label>{{ t('Base.topic') }}</label>
          </el-col>
          <el-col :span="21">
            <p class="topic-text">{{ topic }}</p>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="24">
        <label class="label-top">Payload</label>
        <div class="monaco-container">
          <Monaco
            disabled
            id="payload"
            v-model="payloadForShow"
            :lang="plaintextShow ? 'plaintext' : 'json'"
            :jsonWithoutValidate="payloadShowBy !== PayloadShowByType.JSON"
          />
        </div>
      </el-col>
    </el-row>
    <template #footer>
      <div class="payload-dialog-ft" v-if="!(rawPayload === null)">
        <el-select v-model="payloadShowBy">
          <el-option v-for="item in payloadShowByOptions" :key="item" :label="item" :value="item" />
        </el-select>
        <el-button @click="copyText(payloadForShow)">
          {{ t('Base.copy') }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { SHOW_PAYLOAD_BY_WHICH_OPTION_LIST } from '@/common/constants'
import Monaco from '@/components/Monaco.vue'
import useCopy from '@/hooks/useCopy'
import useI18nTl from '@/hooks/useI18nTl'
import useShowTextByDifferent from '@/hooks/useShowTextByDifferent'
import { PayloadShowByType } from '@/types/enum'
import { ElDialog } from 'element-plus'

const props = withDefaults(
  defineProps<{
    modelValue: boolean
    isLoading?: boolean
    rawPayload: string | null
    rawPayloadFormat?: PayloadShowByType
    topic?: string
  }>(),
  {
    rawPayloadFormat: PayloadShowByType.Base64,
  },
)
const emit = defineEmits<{
  (e: 'update:modelValue', v: boolean): void
}>()

const showDialog = computed({
  get: () => props.modelValue,
  set: (val: boolean) => {
    emit('update:modelValue', val)
  },
})

watch(showDialog, (val) => {
  if (val) {
    setRawText(props.rawPayload)
  } else {
    // init format
    payloadShowBy.value = SHOW_PAYLOAD_BY_WHICH_OPTION_LIST[0]
  }
})

const { payloadForShow, payloadShowBy, payloadShowByOptions, setRawText } = useShowTextByDifferent()

watch(
  () => props.rawPayload,
  (val) => {
    if (showDialog.value) {
      setRawText(val)
    }
  },
)

const { t } = useI18nTl('Clients')

const { copyText } = useCopy()

const plaintextShow = computed(() => {
  return (
    payloadShowBy.value === PayloadShowByType.Hex ||
    payloadShowBy.value === PayloadShowByType.Base64
  )
})
</script>

<style lang="scss">
.payload-dialog {
  .el-col-24 {
    margin-bottom: 20px;
    line-height: 20px;
  }
  .topic-text {
    margin: 0;
    word-wrap: break-word;
    white-space: pre-wrap;
    color: var(--el-text-color-regular);
  }
  .label-top {
    display: block;
    margin-bottom: 16px;
  }
  label {
    color: var(--color-text-secondary);
  }
  .payload-dialog-ft {
    display: flex;
    justify-content: space-between;
    .el-select {
      width: 200px;
    }
  }
}
</style>
