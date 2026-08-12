<template>
  <div class="force-shutdown app-wrapper">
    <el-card class="allow-overflow">
      <el-skeleton v-if="configLoading" :rows="12" animated />
      <div class="schema-form" v-else>
        <el-form
          ref="form"
          class="configuration-form"
          label-position="right"
          :label-width="store.state.lang === 'zh' ? 268 : 400"
          :model="streamConfig"
          :validate-on-rule-change="false"
          :rules="rules"
          @keyup.enter="updateConfigData()"
        >
          <el-row>
            <el-col :span="21" class="custom-col">
              <el-form-item prop="enable">
                <template #label>
                  <FormItemLabel
                    :label="tl('enableMessageStream')"
                    :desc="tl('enableMessageStreamDesc')"
                  />
                </template>
                <el-switch v-model="streamConfig.enable" />
              </el-form-item>
            </el-col>
            <el-col :span="21" class="custom-col">
              <el-form-item prop="max_stream_count" :label="tl('maxStreamCount')">
                <CustomInputNumber v-model="streamConfig.max_stream_count" :min="1" />
              </el-form-item>
            </el-col>
            <el-col :span="21" class="custom-col">
              <el-form-item prop="gc_interval">
                <template #label>
                  <FormItemLabel :label="tl('gcInterval')" />
                </template>
                <TimeInputWithUnitSelect
                  v-model="streamConfig.gc_interval"
                  :enabled-units="['ms', 's', 'm', 'h', 'd']"
                />
              </el-form-item>
            </el-col>
            <el-col :span="21" class="custom-col">
              <el-form-item prop="regular_stream_retention_period">
                <template #label>
                  <FormItemLabel :label="tl('regularStreamRetentionPeriod')" />
                </template>
                <TimeInputWithUnitSelect
                  v-model="streamConfig.regular_stream_retention_period"
                  :enabled-units="['ms', 's', 'm', 'h', 'd']"
                />
              </el-form-item>
            </el-col>
            <!-- ENABLE AUTO CREATE QUEUE -->
            <el-col :span="21" class="custom-col">
              <el-form-item :label="tl('enableAutoCreateMS')">
                <el-switch v-model="enableAutoCreateProxy" />
              </el-form-item>
            </el-col>
            <!-- AUTO CREATE TYPE -->
            <el-col :span="21" class="custom-col" v-if="enableAutoCreateProxy">
              <el-form-item :label="tl('autoCreateMSType')">
                <el-radio-group class="flex-1" v-model="autoCreateTypeProxy">
                  <el-space class="flex-1" :size="28">
                    <el-radio
                      v-for="{ value, label } in autoCreateTypeOpt"
                      :key="value"
                      :value="value"
                      border
                    >
                      <span class="platform-name"> {{ label }} </span>
                    </el-radio>
                  </el-space>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <!-- LASTVALUE CONF-->
            <template v-if="typeof streamConfig.auto_create.lastvalue === 'object'">
              <el-col :span="21" class="custom-col">
                <el-form-item prop="auto_create.lastvalue.key_expression">
                  <template #label>
                    <FormItemLabel
                      :label="t('MessageStream.keyExpression')"
                      :desc="descForKeyExpression"
                      desc-marked
                      :max-height="200"
                    />
                  </template>
                  <el-input v-model="streamConfig.auto_create.lastvalue.key_expression" />
                </el-form-item>
              </el-col>
              <el-col :span="21" class="custom-col">
                <el-form-item prop="auto_create.lastvalue.data_retention_period">
                  <template #label>
                    <FormItemLabel
                      :label="t('MessageQueue.dataRetentionPeriod')"
                      :desc="t('MessageStream.dataRetentionPeriodDesc')"
                    />
                  </template>
                  <TimeInputWithUnitSelect
                    v-model="streamConfig.auto_create.lastvalue.data_retention_period"
                    :enabled-units="['s', 'm', 'h', 'd']"
                  />
                </el-form-item>
              </el-col>
              <MessageQueueStreamLimits
                v-model="streamConfig.auto_create.lastvalue.limits"
                conf="stream"
              />
            </template>
            <!-- REGULAR CONF -->
            <template v-if="typeof streamConfig.auto_create.regular === 'object'">
              <el-col :span="21" class="custom-col">
                <el-form-item prop="auto_create.regular.key_expression">
                  <template #label>
                    <FormItemLabel
                      :label="t('MessageStream.keyExpression')"
                      :desc="descForKeyExpression"
                      desc-marked
                      :max-height="200"
                    />
                  </template>
                  <el-input v-model="streamConfig.auto_create.regular.key_expression" />
                </el-form-item>
              </el-col>
              <el-col :span="21" class="custom-col">
                <el-form-item prop="auto_create.regular.data_retention_period">
                  <template #label>
                    <FormItemLabel
                      :label="t('MessageQueue.dataRetentionPeriod')"
                      :desc="t('MessageStream.dataRetentionPeriodDesc')"
                    />
                  </template>
                  <TimeInputWithUnitSelect
                    v-model="streamConfig.auto_create.regular.data_retention_period"
                    :enabled-units="['s', 'm', 'h', 'd']"
                  />
                </el-form-item>
              </el-col>
              <MessageQueueStreamLimits
                v-model="streamConfig.auto_create.regular.limits"
                conf="stream"
              />
            </template>
            <el-col :span="24" class="btn-col">
              <el-button
                type="primary"
                :loading="saveLoading"
                :disabled="!$hasPermission('put')"
                @click="updateConfigData()"
              >
                {{ t('Base.saveChanges') }}
              </el-button>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { getMessageStreamsConfig, putMessageStreamsConfig } from '@/api/messageStream'
import { MessageStreamConfig, MessageStreamLimits } from '@/types/typeAlias'
import MessageQueueStreamLimits from './components/MessageQueueStreamLimits.vue'

const { t, tl } = useI18nTl('BasicConfig')

const configLoading = ref(false)
const saveLoading = ref(false)
const store = useStore()
let rawData: any = undefined

const createDefaultLimits = (): { limits: MessageStreamLimits } => ({
  limits: {
    max_shard_message_bytes: 'infinity',
    max_shard_message_count: 'infinity',
  },
})
const streamConfig = ref<MessageStreamConfig>({
  enable: true,
  auto_create: {
    lastvalue: {
      data_retention_period: undefined,
      key_expression: '',
      ...createDefaultLimits(),
    },
    regular: false,
  },
  max_stream_count: 0,
  gc_interval: '',
  regular_stream_retention_period: '',
})

const enableAutoCreateProxy = computed<boolean>({
  get() {
    const { lastvalue, regular } = streamConfig.value.auto_create
    return !!(lastvalue || regular)
  },
  set(nV: boolean) {
    const { lastvalue, regular } = streamConfig.value.auto_create

    if (nV && !lastvalue && !regular) {
      streamConfig.value.auto_create.lastvalue = createDefaultAutoCreate()
    } else if (!nV) {
      streamConfig.value.auto_create.lastvalue = false
      streamConfig.value.auto_create.regular = false
    }
  },
})

const enum AutoCreateType {
  Lastvalue = 'lastvalue',
  Regular = 'regular',
}
const autoCreateTypeOpt = [
  {
    value: AutoCreateType.Lastvalue,
    label: t('BasicConfig.lastValueStream'),
  },
  {
    value: AutoCreateType.Regular,
    label: t('BasicConfig.regularStream'),
  },
]
const autoCreateTypeProxy = computed<AutoCreateType>({
  get() {
    if (streamConfig.value.auto_create.regular) {
      return AutoCreateType.Regular
    }
    return AutoCreateType.Lastvalue
  },
  set(nV: AutoCreateType) {
    if (nV === AutoCreateType.Regular) {
      streamConfig.value.auto_create.lastvalue = false
      streamConfig.value.auto_create.regular = createDefaultAutoCreate()
    } else {
      streamConfig.value.auto_create.regular = false
      streamConfig.value.auto_create.lastvalue = createDefaultAutoCreate()
    }
  },
})

const createDefaultAutoCreate = (): MessageStreamConfig['auto_create'][
  | 'lastvalue'
  | 'regular'] => ({
  data_retention_period: '7d',
  key_expression: 'message.from',
  ...createDefaultLimits(),
})

const { descForKeyExpression, getStreamEnabledFromList } = useMessageStream()

const formRef = useTemplateRef('form')
const { createRequiredRule } = useFormRules()
const rules = {
  'auto_create.lastvalue.key_expression': createRequiredRule(t('MessageStream.keyExpression')),
  'auto_create.regular.key_expression': createRequiredRule(t('MessageStream.keyExpression')),
}

const checkDataIsChanged = () => !isEqual(streamConfig.value, rawData)
useDataNotSaveConfirm(checkDataIsChanged)

const loadData = async () => {
  try {
    configLoading.value = true
    const res = await getMessageStreamsConfig()
    if (res.enable === 'auto') {
      res.enable = await getStreamEnabledFromList()
    }
    streamConfig.value = res
    rawData = cloneDeep(streamConfig.value)
  } catch (error) {
    //
  } finally {
    configLoading.value = false
  }
}

const updateConfigData = async () => {
  await formRef.value?.validate()
  try {
    saveLoading.value = true
    await putMessageStreamsConfig(streamConfig.value)
    ElMessage.success(t('Base.updateSuccess'))
    rawData = cloneDeep(streamConfig.value)
    if (streamConfig.value.enable === 'auto') {
      streamConfig.value.enable = await getStreamEnabledFromList()
    }
  } catch (err) {
    loadData()
  } finally {
    saveLoading.value = false
  }
}

const { addObserverToFooter } = useConfFooterStyle()

;(async () => {
  await loadData()
  addObserverToFooter()
})()
</script>

<style lang="scss" scoped>
.custom-col {
  padding-right: 0;
}
.btn-col {
  margin-top: 16px;
  text-align: right;
}
.divider-item {
  :deep(.el-form-item__label) {
    color: var(--color-text-placeholder);
  }
  .el-divider {
    margin: 0;
    width: 280px;
  }
}
</style>
