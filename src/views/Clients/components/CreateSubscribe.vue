<template>
  <el-dialog
    v-bind="$attrs"
    :title="$t('Clients.addASubscription')"
    width="400px"
    v-model="dialogVisible"
    @close="close"
    @open="open"
  >
    <el-form
      ref="FormCom"
      :model="record"
      :rules="rules"
      label-position="top"
      require-asterisk-position="right"
    >
      <el-form-item v-if="!clientId" prop="clientid" :label="$t('Base.clientid')">
        <el-input v-model="record.clientid" :placeholder="$t('Base.clientid')" />
      </el-form-item>
      <el-form-item prop="topic" :label="$t('Base.topic')">
        <el-input v-model="record.topic" placeholder="Topic" />
      </el-form-item>
      <!-- For stomp gateway -->
      <el-form-item
        v-if="gateway && gateway === 'stomp'"
        prop="subid"
        :label="`${$t('Tools.Subscription')} ID`"
      >
        <el-input v-model="record.subid" />
      </el-form-item>
      <el-form-item prop="qos" label="QoS">
        <el-select v-model.number="record.qos">
          <el-option v-for="item in QoSOptions" :key="item" :value="item" />
        </el-select>
      </el-form-item>
      <template v-if="isMQTTVersion5">
        <el-form-item prop="nl" :label="tl('noLocal')">
          <el-select v-model="record.nl">
            <el-option
              v-for="{ value, label } in noLocalOpts"
              :label="label"
              :value="value"
              :key="value"
            />
          </el-select>
        </el-form-item>
        <el-form-item prop="rap" :label="tl('retainAsPublished')">
          <el-select v-model="record.rap">
            <el-option
              v-for="{ value, label } in retainAsPublishedOpts"
              :label="label"
              :value="value"
              :key="value"
            />
          </el-select>
        </el-form-item>
        <el-form-item prop="rh" :label="tl('retainHandling')">
          <el-select v-model="record.rh">
            <el-option v-for="item in retainHandlingOpts" :label="item" :value="item" :key="item" />
          </el-select>
        </el-form-item>
      </template>
    </el-form>
    <template #footer>
      <div class="dialog-align-footer">
        <el-button @click="close">{{ $t('Base.cancel') }}</el-button>
        <el-button type="primary" @click="handleAdd" :loading="submitLoading">
          {{ $t('Base.add') }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts">
export default {
  inheritAttrs: false,
}
</script>

<script setup lang="ts">
import { subscribe } from '@/api/clients'
import { addGatewayClientSubs } from '@/api/gateway'
import { QoSOptions } from '@/common/constants'
import { QoSLevel } from '@/types/enum'

interface SubRecord {
  clientid: string
  qos: QoSLevel
  topic: string
  nl: number
  rap: number
  rh: number
  subid?: string
}

const { tl } = useI18nTl('Clients')

const props = defineProps({
  visible: {
    type: Boolean,
    required: true,
  },
  clientId: {
    type: String,
    default: '',
  },
  gateway: {
    type: String,
    required: false,
    default: '',
  },
  isMQTTVersion5: {
    type: Boolean,
    required: false,
    default: false,
  },
})

const emit = defineEmits(['create:subs', 'update:visible'])

const record: Ref<SubRecord> = ref({
  clientid: props.clientId,
  qos: QoSLevel.QoS0,
  topic: '',
  nl: 0,
  rap: 0,
  rh: 0,
})

const rules = {
  clientid: { required: true, message: tl('pleaseEnter') },
  topic: { required: true, message: tl('pleaseEnter') },
  subid: { required: true, message: tl('pleaseEnter') },
}

const submitLoading = ref(false)

const FormCom = ref()

const dialogVisible = computed(() => props.visible)
const { noLocalOpts, retainAsPublishedOpts, retainHandlingOpts } = useMQTTVersion5NewConfig()

const open = () => {
  record.value.clientid = props.clientId
}
const getTopicMsg = () => {
  if (props.isMQTTVersion5) {
    return omit(record.value, 'clientid')
  }
  return pick(record.value, ['qos', 'topic'])
}

const getClientId = () => props.clientId || record.value.clientid

const regularAdd = () => subscribe(getClientId(), getTopicMsg())

const addFromGateway = () => {
  const data: any = pick(record.value, ['topic', 'qos'])
  if (record.value.subid && props.gateway && props.gateway === 'stomp') {
    data.sub_props = { subid: record.value.subid }
  }
  return addGatewayClientSubs(props.gateway, getClientId(), data)
}

const handleAdd = async () => {
  try {
    await FormCom.value.validate()
    const request = props.gateway ? addFromGateway : regularAdd
    submitLoading.value = true
    await request()
    emit('create:subs')
    close()
  } catch (error) {
    //
  } finally {
    submitLoading.value = false
  }
}

const close = () => {
  emit('update:visible', false)
  FormCom.value.resetFields()
}
</script>

<style lang="scss">
.create-subscribe {
  .el-select,
  .el-input {
    width: 100%;
  }
}
</style>
