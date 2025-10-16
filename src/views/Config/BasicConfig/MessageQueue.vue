<template>
  <div class="force-shutdown app-wrapper">
    <el-card class="allow-overflow">
      <el-skeleton v-if="configLoading" :rows="12" animated />
      <div class="schema-form" v-else>
        <el-form
          ref="messageQueueForm"
          class="configuration-form"
          label-position="right"
          :label-width="store.state.lang === 'zh' ? 268 : 400"
          :model="queueConfig"
          :validate-on-rule-change="false"
          :rules="rules"
          @keyup.enter="updateConfigData()"
        >
          <el-row>
            <el-col :span="21" class="custom-col">
              <el-form-item prop="enable" :label="tl('enableMessageQueue')">
                <el-tooltip
                  class="box-item"
                  effect="dark"
                  placement="top"
                  :disabled="!isEnabled"
                  :content="tl('disableMessageQueueTip')"
                >
                  <el-switch v-model="queueConfig.enable" :disabled="isEnabled" />
                </el-tooltip>
              </el-form-item>
            </el-col>
            <el-col :span="21" class="custom-col">
              <el-form-item prop="max_queue_count" :label="tl('maxQueueCount')">
                <CustomInputNumber v-model="queueConfig.max_queue_count" :min="1" />
              </el-form-item>
            </el-col>
            <el-col :span="21" class="custom-col">
              <el-form-item prop="gc_interval">
                <template #label>
                  <FormItemLabel :label="tl('gcInterval')" />
                </template>
                <TimeInputWithUnitSelect
                  v-model="queueConfig.gc_interval"
                  :enabled-units="['ms', 's', 'm', 'h', 'd']"
                />
              </el-form-item>
            </el-col>
            <el-col :span="21" class="custom-col">
              <el-form-item prop="regular_queue_retention_period">
                <template #label>
                  <FormItemLabel :label="tl('regularQueueRetentionPeriod')" />
                </template>
                <TimeInputWithUnitSelect
                  v-model="queueConfig.regular_queue_retention_period"
                  :enabled-units="['ms', 's', 'm', 'h', 'd']"
                />
              </el-form-item>
            </el-col>
            <el-col :span="21" class="custom-col">
              <el-form-item prop="find_queue_retry_interval">
                <template #label>
                  <FormItemLabel
                    :label="tl('findQueueRetryInterval')"
                    :desc="tl('findQueueRetryIntervalDesc')"
                  />
                </template>
                <TimeInputWithUnitSelect
                  v-model="queueConfig.find_queue_retry_interval"
                  :enabled-units="['ms', 's', 'm', 'h', 'd']"
                />
              </el-form-item>
            </el-col>
            <!-- LASTVALUE -->
            <el-col :span="21" class="custom-col">
              <el-form-item class="divider-item" :label="tl('lastValueMQConf')">
                <el-divider />
              </el-form-item>
            </el-col>
            <el-col :span="21" class="custom-col">
              <el-form-item prop="auto_create.lastvalue">
                <template #label>
                  <FormItemLabel :label="tl('enableAutoCreateLastValueMQ')" desc-marked />
                </template>
                <el-switch v-model="lastvalueProxy" />
              </el-form-item>
            </el-col>
            <!-- LASTVALUE CONF-->
            <template v-if="typeof queueConfig.auto_create.lastvalue === 'object'">
              <el-col :span="21" class="custom-col">
                <el-form-item prop="auto_create.lastvalue.key_expression">
                  <template #label>
                    <FormItemLabel
                      :label="t('MessageQueue.keyExpression')"
                      :desc="descForKeyExpression"
                      desc-marked
                      :max-height="200"
                    />
                  </template>
                  <el-input v-model="queueConfig.auto_create.lastvalue.key_expression" />
                </el-form-item>
              </el-col>
              <el-col :span="21" class="custom-col">
                <el-form-item
                  prop="auto_create.lastvalue.dispatch_strategy"
                  :label="t('MessageQueue.dispatchStrategy')"
                >
                  <el-select v-model="queueConfig.auto_create.lastvalue.dispatch_strategy">
                    <el-option
                      v-for="{ value, label } in dispatchStrategyOptions"
                      :key="value"
                      :label="label"
                      :value="value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="21" class="custom-col">
                <el-form-item prop="auto_create.lastvalue.data_retention_period">
                  <template #label>
                    <FormItemLabel
                      :label="t('MessageQueue.dataRetentionPeriod')"
                      :desc="t('MessageQueue.dataRetentionPeriodDesc')"
                    />
                  </template>
                  <TimeInputWithUnitSelect
                    v-model="queueConfig.auto_create.lastvalue.data_retention_period"
                    :enabled-units="['s', 'm', 'h', 'd']"
                  />
                </el-form-item>
              </el-col>
            </template>
            <el-col :span="21" class="custom-col">
              <el-form-item class="divider-item" :label="tl('regularMQConf')">
                <el-divider />
              </el-form-item>
            </el-col>
            <!-- REGULAR -->
            <el-col :span="21" class="custom-col">
              <el-form-item prop="auto_create.lastvalue">
                <template #label>
                  <FormItemLabel :label="tl('enableAutoCreateLastValueMQ')" desc-marked />
                </template>
                <el-switch v-model="regularProxy" />
              </el-form-item>
            </el-col>
            <!-- REGULAR CONF -->
            <template v-if="typeof queueConfig.auto_create.regular === 'object'">
              <el-col :span="21" class="custom-col">
                <el-form-item
                  prop="auto_create.regular.dispatch_strategy"
                  :label="t('MessageQueue.dispatchStrategy')"
                >
                  <el-select v-model="queueConfig.auto_create.regular.dispatch_strategy">
                    <el-option
                      v-for="{ value, label } in dispatchStrategyOptions"
                      :key="value"
                      :label="label"
                      :value="value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="21" class="custom-col">
                <el-form-item prop="auto_create.regular.data_retention_period">
                  <template #label>
                    <FormItemLabel
                      :label="t('MessageQueue.dataRetentionPeriod')"
                      :desc="t('MessageQueue.dataRetentionPeriodDesc')"
                    />
                  </template>
                  <TimeInputWithUnitSelect
                    v-model="queueConfig.auto_create.regular.data_retention_period"
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
import { getMessageQueueConfigs, putMessageQueueConfigs } from '@/api/config'
import { MessageQueueConfig } from '@/types/typeAlias'

const { t, tl } = useI18nTl('BasicConfig')

const configLoading = ref(false)
const saveLoading = ref(false)
const store = useStore()
let rawData: any = undefined

const isEnabled = ref(true)
const queueConfig = ref<MessageQueueConfig>({
  enable: true,
  auto_create: {
    lastvalue: {
      data_retention_period: undefined,
      dispatch_strategy: undefined,
      key_expression: '',
    },
    regular: false,
  },
  max_queue_count: 0,
  gc_interval: '',
  regular_queue_retention_period: '',
  find_queue_retry_interval: '',
})

const createDefaultCommonConf = (): MessageQueueConfig['auto_create']['regular'] => ({
  data_retention_period: '7d',
  dispatch_strategy: 'random',
})
const createDefaultAutoCreateLastvalue = (): MessageQueueConfig['auto_create']['lastvalue'] => ({
  ...createDefaultCommonConf(),
  key_expression: 'message.from',
})
const lastvalueProxy = computed({
  get() {
    return !!queueConfig.value.auto_create.lastvalue
  },
  set(val) {
    queueConfig.value.auto_create.lastvalue = val ? createDefaultAutoCreateLastvalue() : false
  },
})
const { dispatchStrategyOptions, descForKeyExpression } = useMessageQueue()

const regularProxy = computed({
  get() {
    return !!queueConfig.value.auto_create.regular
  },
  set(val) {
    queueConfig.value.auto_create.regular = val ? createDefaultCommonConf() : false
  },
})

const messageQueueForm = ref()
const { createRequiredRule } = useFormRules()
const rules = {
  'auto_create.lastvalue.key_expression': createRequiredRule(t('MessageQueue.keyExpression')),
}

const checkDataIsChanged = () => !isEqual(queueConfig.value, rawData)
useDataNotSaveConfirm(checkDataIsChanged)

const loadData = async () => {
  try {
    configLoading.value = true
    const res = await getMessageQueueConfigs()
    queueConfig.value = res
    isEnabled.value = res.enable
    rawData = cloneDeep(queueConfig.value)
  } catch (error) {
    //
  } finally {
    configLoading.value = false
  }
}

const updateConfigData = async () => {
  await messageQueueForm.value?.validate()
  try {
    saveLoading.value = true
    await putMessageQueueConfigs(queueConfig.value)
    ElMessage.success(t('Base.updateSuccess'))
    rawData = cloneDeep(queueConfig.value)
    isEnabled.value = queueConfig.value.enable
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
