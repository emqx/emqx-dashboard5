<template>
  <div class="retainer app-wrapper">
    <el-card class="app-card allow-overflow">
      <el-skeleton v-if="configLoading" :rows="12" animated />
      <div class="schema-form" v-else>
        <el-form
          ref="retainerForm"
          class="configuration-form"
          label-position="right"
          hide-required-asterisk
          :label-width="store.state.lang === 'zh' ? 184 : 240"
          :rules="retainerRules"
          :model="retainerConfig"
          :validate-on-rule-change="false"
          @keyup.enter="updateConfigData()"
        >
          <el-row>
            <el-col :span="21" class="custom-col">
              <el-form-item>
                <template #label>
                  <FormItemLabel :label="tl('storageType')" :desc="tl('typeDesc')" />
                </template>
                <el-select v-model="retainerConfig.backend.type">
                  <el-option value="built_in_database" :label="t('Auth.builtInDatabase')" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="21" class="custom-col">
              <el-form-item required prop="backend.storage_type">
                <template #label>
                  <FormItemLabel :label="tl('storageMethod')" :desc="tl('storageTypeDesc')" />
                </template>
                <el-select v-model="retainerConfig.backend.storage_type">
                  <el-option value="ram" />
                  <el-option value="disc" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="21" class="custom-col">
              <el-form-item prop="backend.max_retained_messages">
                <template #label>
                  <FormItemLabel
                    :label="tl('maxRetainedMessages')"
                    :desc="tl('maxRetainedMessagesDesc')"
                  />
                </template>
                <Oneof
                  v-model="retainerConfig.backend.max_retained_messages"
                  :items="[{ type: 'number' }, { type: 'enum', symbols: [0] }]"
                  :disabled-label="tl('unlimited')"
                />
              </el-form-item>
            </el-col>
            <el-col :span="21" class="custom-col">
              <el-form-item prop="max_payload_size">
                <template #label>
                  <FormItemLabel :label="tl('maxPayloadSize')" :desc="tl('maxPayloadSizeDesc')" />
                </template>
                <InputWithUnit v-model="retainerConfig.max_payload_size" :units="['KB', 'MB']" />
              </el-form-item>
            </el-col>
            <el-col :span="21" class="custom-col">
              <el-form-item prop="msg_expiry_interval">
                <template #label>
                  <FormItemLabel
                    :label="tl('msgExpiryInterval')"
                    :desc="tl('msgExpiryIntervalDesc')"
                    desc-marked
                  />
                </template>
                <Oneof
                  v-model="retainerConfig.msg_expiry_interval"
                  :items="[{ type: 'duration' }, { type: 'enum', symbols: [NO_INTERVAL_VALUE] }]"
                  :disabled-label="tl('noExp')"
                />
              </el-form-item>
            </el-col>
            <el-col :span="21" class="custom-col">
              <el-form-item prop="msg_expiry_interval_override">
                <template #label>
                  <FormItemLabel
                    :label="tl('msgExpiryIntervalOverride')"
                    :desc="tl('msgExpiryIntervalOverrideDesc')"
                    desc-marked
                  />
                </template>
                <Oneof
                  v-model="retainerConfig.msg_expiry_interval_override"
                  :items="[{ type: 'duration' }, { type: 'enum', symbols: [DISABLED_VALUE] }]"
                  :disabled-label="tl('disable')"
                />
              </el-form-item>
            </el-col>
            <el-col
              :span="21"
              class="custom-col"
              v-if="retainerConfig.msg_expiry_interval_override !== DISABLED_VALUE"
            >
              <el-form-item prop="allow_never_expire">
                <template #label>
                  <FormItemLabel
                    :label="tl('allowNeverExpire')"
                    :desc="tl('allowNeverExpireDesc')"
                    desc-marked
                  />
                </template>
                <el-switch v-model="retainerConfig.allow_never_expire" />
              </el-form-item>
            </el-col>
            <el-col :span="21" class="custom-col">
              <el-form-item prop="msg_clear_interval">
                <template #label>
                  <FormItemLabel
                    :label="tl('msgClearInterval')"
                    :desc="tl('msgClearIntervalDesc')"
                    desc-marked
                  />
                </template>
                <Oneof
                  v-model="retainerConfig.msg_clear_interval"
                  :items="[{ type: 'duration' }, { type: 'enum', symbols: [NO_INTERVAL_VALUE] }]"
                  :disabled-label="tl('disable')"
                />
              </el-form-item>
            </el-col>
            <el-col :span="21" class="custom-col">
              <el-form-item prop="max_publish_rate">
                <template #label>
                  <FormItemLabel :label="tl('maxPublishRate')" :desc="tl('maxPublishRateDesc')" />
                </template>
                <InputWithUnit
                  v-model="retainerConfig.max_publish_rate"
                  :units="[{ label: `/${t('Base.second')}`, value: '/s' }]"
                />
              </el-form-item>
            </el-col>
            <el-col :span="21" class="custom-col">
              <el-form-item prop="delivery_rate">
                <template #label>
                  <FormItemLabel :label="tl('deliverRate')" :desc="tl('deliverRateDesc')" />
                </template>
                <InputWithUnit
                  v-model="retainerConfig.delivery_rate"
                  :units="[{ label: `/${t('Base.second')}`, value: '/s' }]"
                />
              </el-form-item>
            </el-col>
            <el-col :span="24" class="btn-col">
              <el-button type="primary" :loading="saveLoading" @click="updateConfigData()">
                {{ $t('Base.saveChanges') }}
              </el-button>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { getRetainer, updateRetainer } from '@/api/extension'
import { Retainer } from '@/types/extension'

const { tl, t } = useI18nTl('Extension')
const store = useStore()
const { createRequiredRule } = useFormRules()

const NO_INTERVAL_VALUE = '0s'
const DISABLED_VALUE = 'disabled'

const retainerConfig = ref<Retainer>({
  max_payload_size: '1MB',
  msg_clear_interval: NO_INTERVAL_VALUE,
  msg_expiry_interval: NO_INTERVAL_VALUE,
  msg_expiry_interval_override: DISABLED_VALUE,
  allow_never_expire: true,
  delivery_rate: '1000/s',
  max_publish_rate: '1000/s',
  backend: {
    storage_type: 'ram',
    type: 'built_in_database',
    max_retained_messages: 0,
  },
})

const configLoading = ref(true)
const saveLoading = ref(false)
const retainerForm = ref<HTMLFormElement | null>(null)

const validatorRules = [
  { required: true, message: tl('required'), trigger: 'blur' },
  {
    type: 'number',
    message: tl('needNumber'),
    trigger: 'blur',
  },
  {
    type: 'number',
    min: 0,
    message: t('Rule.minimumError', { min: 0 }),
  },
]

const numberRule = {
  validator: (rule: unknown, value: string) => {
    const num = parseFloat(value)
    if (num < 0) {
      return new Error(t('Rule.minimumError', { min: 0 }))
    }
    return []
  },
}

const retainerRules = ref<Record<string, any>>({
  backend: {
    max_retained_messages: validatorRules,
    storage_type: createRequiredRule('Storage', 'select'),
  },
  max_payload_size: [...createRequiredRule(tl('maxPayloadSize')), numberRule],
  msg_expiry_interval: [...createRequiredRule(tl('msgExpiryInterval')), numberRule],
  msg_clear_interval: [...createRequiredRule(tl('msgClearInterval')), numberRule],
  msg_expiry_interval_override: [
    ...createRequiredRule(tl('msgExpiryIntervalOverride')),
    numberRule,
  ],
})

const { setRawData, checkDataIsChanged } = useCheckDataChanged(retainerConfig)
useDataNotSaveConfirm(checkDataIsChanged)

const loadConfigData = async () => {
  configLoading.value = true
  retainerForm.value?.resetFields()
  try {
    const res = await getRetainer()
    if (res) {
      retainerConfig.value = res
      setRawData(retainerConfig.value)
    }
  } catch (error) {
    console.error(error)
  } finally {
    configLoading.value = false
  }
}

const updateConfigData = async function () {
  const valid = await retainerForm.value?.validate().catch(() => {
    // ignore error
  })
  if (!valid) return
  try {
    saveLoading.value = true
    await updateRetainer(retainerConfig.value)
    setRawData(retainerConfig.value)
    ElMessage.success(t('Base.updateSuccess'))
  } catch (error) {
    loadConfigData()
  } finally {
    saveLoading.value = false
  }
}

const { addObserverToFooter } = useConfFooterStyle()

;(async () => {
  await loadConfigData()
  addObserverToFooter()
})()
</script>

<style lang="scss">
.retainer {
  .schema-form:not(:last-child) {
    padding-bottom: 0;
  }
  .el-tabs.el-tabs--card.el-tabs--top {
    .el-tabs__content {
      padding: 0 8px;
      .el-tab-pane {
        margin: 24px 0;
      }
    }
  }
}
</style>
