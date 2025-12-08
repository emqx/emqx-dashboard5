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
              <el-form-item prop="enable" :label="tl('enableMessageStream')">
                <el-tooltip
                  class="box-item"
                  effect="dark"
                  placement="top"
                  :disabled="!isEnabled"
                  :content="tl('disableMessageStreamTip')"
                >
                  <el-switch v-model="streamConfig.enable" :disabled="isEnabled" />
                </el-tooltip>
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
            <!-- LASTVALUE -->
            <el-col :span="21" class="custom-col">
              <el-form-item class="divider-item" :label="tl('lastValueMSConf')">
                <el-divider />
              </el-form-item>
            </el-col>
            <el-col :span="21" class="custom-col">
              <el-form-item prop="auto_create.lastvalue">
                <template #label>
                  <FormItemLabel :label="tl('enableAutoCreateLastValueMS')" desc-marked />
                </template>
                <el-switch v-model="lastvalueProxy" />
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
            </template>
            <el-col :span="21" class="custom-col">
              <el-form-item class="divider-item" :label="tl('regularMSConf')">
                <el-divider />
              </el-form-item>
            </el-col>
            <!-- REGULAR -->
            <el-col :span="21" class="custom-col">
              <el-form-item prop="auto_create.lastvalue">
                <template #label>
                  <FormItemLabel :label="tl('enableAutoCreateRegularMS')" desc-marked />
                </template>
                <el-switch v-model="regularProxy" />
              </el-form-item>
            </el-col>
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

const { t, tl } = useI18nTl('BasicConfig')

const configLoading = ref(false)
const saveLoading = ref(false)
const store = useStore()
let rawData: any = undefined

const isEnabled = ref(true)
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

const createDefaultCommonConf = (): MessageStreamConfig['auto_create']['regular'] => ({
  data_retention_period: '7d',
  key_expression: 'message.from',
  ...createDefaultLimits(),
})
const createDefaultAutoCreateLastvalue = (): MessageStreamConfig['auto_create']['lastvalue'] => ({
  ...createDefaultCommonConf(),
  key_expression: 'message.from',
  ...createDefaultLimits(),
})
const lastvalueProxy = computed({
  get() {
    return !!streamConfig.value.auto_create.lastvalue
  },
  set(val) {
    streamConfig.value.auto_create.lastvalue = val ? createDefaultAutoCreateLastvalue() : false
  },
})
const { descForKeyExpression } = useMessageStream()

const regularProxy = computed({
  get() {
    return !!streamConfig.value.auto_create.regular
  },
  set(val) {
    streamConfig.value.auto_create.regular = val ? createDefaultCommonConf() : false
  },
})

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
    streamConfig.value = res
    isEnabled.value = res.enable ?? false
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
    isEnabled.value = streamConfig.value.enable ?? false
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
