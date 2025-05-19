<template>
  <PayloadDialog
    v-model="showDialog"
    :raw-payload="detail.payload"
    :is-loading="isLoading"
    @open="getDetail"
  >
    <el-row class="message-analysis-info">
      <el-col :span="12">
        <label>{{ t('Base.topic') }}</label>
        <span>{{ detail.topic }}</span>
      </el-col>
      <el-col :span="6">
        <label>{{ t('QoS.size') }}</label>
        <span>{{ transMemorySizeNumToStr(detail.size, 2) }}</span>
      </el-col>
      <el-col :span="6">
        <label>{{ t('QoS.transportTime') }}</label>
        <span>{{ transMSNumToString(detail.latency) }}</span>
      </el-col>
      <el-col :span="12">
        <label>QoS</label>
        <span>{{ detail.qos }}</span>
      </el-col>
    </el-row>
  </PayloadDialog>
</template>

<script setup lang="ts">
import { queryMessageAnalysisDetail } from '@/api/diagnose'
import { MessageAnalysisDetail } from '@/types/diagnose'
import { MessageAnalysisStatus, QoSLevel, TopicEvent } from '@/types/enum'

const props = defineProps<{
  modelValue: boolean
  id: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const showDialog = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

const { t } = useI18n()

const isLoading = ref(false)

const detail = ref<MessageAnalysisDetail>({
  id: '',
  topic: '',
  qos: QoSLevel.QoS0,
  event: TopicEvent.MessagePublish,
  from_clientid: '',
  clientid: '',
  status: MessageAnalysisStatus.Completed,
  time: '',
  size: 0,
  latency: 0,
  payload: '',
})

const getDetail = async () => {
  try {
    isLoading.value = true
    detail.value = await queryMessageAnalysisDetail(props.id)
  } catch (error) {
    //
  } finally {
    isLoading.value = false
  }
}
</script>

<style lang="scss">
.message-analysis-info {
  .el-col {
    margin-bottom: 12px;
  }
  label {
    margin-right: 4px;
  }
}
</style>
