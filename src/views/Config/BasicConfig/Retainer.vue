<template>
  <div class="retainer app-wrapper">
    <el-card>
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
                  <FormItemLabel :label="tl('enableRetained')" :desc="tl('enableDesc')" />
                </template>
                <el-switch v-model="retainerConfig.enable" />
              </el-form-item>
            </el-col>
            <el-col :span="21" class="custom-col">
              <el-form-item>
                <template #label>
                  <FormItemLabel :label="tl('storageType')" :desc="tl('typeDesc')" />
                </template>
                <el-select v-model="retainerConfig.backend.type" :disabled="!configEnable">
                  <el-option value="built_in_database" :label="tl('builtInDatabase')" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="21" class="custom-col">
              <el-form-item required prop="backend.storage_type">
                <template #label>
                  <FormItemLabel :label="tl('storageMethod')" :desc="tl('storageTypeDesc')" />
                </template>
                <el-select :disabled="!configEnable" v-model="retainerConfig.backend.storage_type">
                  <el-option value="ram" />
                  <el-option value="disc" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
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
                  :disabled="!configEnable"
                />
              </el-form-item>
            </el-col>
            <el-col :span="21" class="custom-col">
              <el-form-item prop="max_payload_size">
                <template #label>
                  <FormItemLabel :label="tl('maxPayloadSize')" :desc="tl('maxPayloadSizeDesc')" />
                </template>
                <InputWithUnit
                  v-model="retainerConfig.max_payload_size"
                  :units="['KB', 'MB']"
                  :disabled="!configEnable"
                />
              </el-form-item>
            </el-col>
            <el-col :span="21" class="custom-col">
              <el-form-item prop="msg_expiry_interval">
                <template #label>
                  <FormItemLabel
                    :label="tl('msgExpiryInterval')"
                    :desc="tl('msgExpiryIntervalDesc')"
                  />
                </template>
                <Oneof
                  v-model="retainerConfig.msg_expiry_interval"
                  :items="[{ type: 'duration' }, { type: 'enum', symbols: [NO_INTERVAL_VALUE] }]"
                  :disabled-label="tl('noExp')"
                  :disabled="!configEnable"
                />
              </el-form-item>
            </el-col>
            <el-col :span="21" class="custom-col">
              <el-form-item prop="msg_clear_interval">
                <template #label>
                  <FormItemLabel
                    :label="tl('msgClearInterval')"
                    :desc="tl('msgClearIntervalDesc')"
                  />
                </template>
                <Oneof
                  v-model="retainerConfig.msg_clear_interval"
                  :items="[{ type: 'duration' }, { type: 'enum', symbols: [NO_INTERVAL_VALUE] }]"
                  :disabled-label="tl('disable')"
                  :disabled="!configEnable"
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
                  :disabled="!configEnable"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24" class="btn-col" :style="store.getters.configPageBtnStyle">
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
import FormItemLabel from '@/components/FormItemLabel.vue'
import InputWithUnit from '@/components/InputWithUnit.vue'
import Oneof from '@/components/Oneof.vue'
import useDataNotSaveConfirm, { useCheckDataChanged } from '@/hooks/useDataNotSaveConfirm'
import useFormRules from '@/hooks/useFormRules'
import useI18nTl from '@/hooks/useI18nTl'
import { Retainer } from '@/types/extension'
import { ElMessage } from 'element-plus'
import { computed, onMounted, reactive, ref } from 'vue'
import { useStore } from 'vuex'

const { tl, t } = useI18nTl('Extension')
const store = useStore()
const { createRequiredRule } = useFormRules()

const NO_INTERVAL_VALUE = '0s'

let retainerConfig = ref<Retainer>({
  enable: false,
  max_payload_size: '1MB',
  msg_clear_interval: NO_INTERVAL_VALUE,
  msg_expiry_interval: NO_INTERVAL_VALUE,
  delivery_rate: '1000/s',
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
})

const configEnable = computed(() => retainerConfig.value?.enable === true)

const { setRawData, checkDataIsChanged } = useCheckDataChanged(retainerConfig)
useDataNotSaveConfirm(checkDataIsChanged)

const loadConfigData = async () => {
  configLoading.value = true
  retainerForm.value?.resetFields()
  try {
    let res = await getRetainer()
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
  let valid = await retainerForm.value?.validate().catch(() => {
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

onMounted(() => {
  loadConfigData()
})
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
  .payload-copied {
    padding-right: 10px;
  }
  .payload-dialog {
    .payload-dialog-ft {
      display: flex;
      justify-content: space-between;
      .el-select {
        width: 200px;
      }
    }
  }
}
</style>
