<template>
  <div class="retainer app-wrapper">
    <el-card>
      <el-skeleton v-if="configLoading" :rows="12" animated />
      <div class="schema-form" v-else>
        <el-form
          ref="retainerForm"
          class="configuration-form schema-form"
          label-position="right"
          require-asterisk-position="left"
          hide-required-asterisk
          :label-width="store.state.lang === 'zh' ? 184 : 220"
          :rules="retainerRules"
          :model="retainerConfig"
        >
          <el-row align="middle">
            <el-col :span="21" class="custom-col">
              <el-form-item>
                <template #label>
                  <FormItemLabel :label="tl('enable')" :desc="tl('enableDesc')" />
                </template>
                <el-switch v-model="retainerConfig.enable" @change="toggleStatus()" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <el-form
          ref="retainerForm"
          class="configuration-form"
          label-position="right"
          require-asterisk-position="left"
          hide-required-asterisk
          :label-width="store.state.lang === 'zh' ? 184 : 220"
          :disabled="!configEnable"
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
                  <el-option value="built_in_database" :label="tl('builtInDatabase')" />
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
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <!-- <el-col :span="21">
              <div class="group-title">{{ tl('flowControl') }}</div>
            </el-col>
            <el-col :span="21" class="custom-col">
              <el-form-item :label="tl('batchReadNumber')" prop="flow_control.batch_read_number">
                <p class="item-desc">
                  {{ tl('batchReadNumberDesc') }}
                </p>
                <el-input
                  v-model.number="retainerConfig.flow_control.batch_read_number"
                  :readonly="selOptions.read == 'unlimited'"
                  maxlength="6"
                >
                  <template #append>
                    <el-select v-model="selOptions.read">
                      <el-option value="unlimited" :label="tl('unlimited')" />
                      <el-option value="custom" :label="tl('custom')" />
                    </el-select>
                  </template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="21" class="custom-col">
              <el-form-item
                :label="tl('batchDeliverNumber')"
                prop="flow_control.batch_deliver_number"
              >
                <p class="item-desc">
                  {{ tl('batchDeliverNumberDesc') }}
                </p>
                <el-input
                  v-model.number="retainerConfig.flow_control.batch_deliver_number"
                  :readonly="selOptions.deliver == 'unlimited'"
                  maxlength="6"
                >
                  <template #append>
                    <el-select v-model="selOptions.deliver">
                      <el-option value="unlimited" :label="tl('unlimited')" />
                      <el-option value="custom" :label="tl('custom')" />
                    </el-select>
                  </template>
                </el-input>
              </el-form-item>
            </el-col> -->
            <el-col :span="24" class="btn-col" :style="store.getters.configPageBtnStyle">
              <el-button type="primary" @click="updateConfigData()">
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
import { ElMessage } from 'element-plus'
import { computed, nextTick, onMounted, reactive, ref, watch } from 'vue'
import { useStore } from 'vuex'
import { Retainer } from '@/types/extension'

const { tl, t } = useI18nTl('Extension')
const store = useStore()
const { createRequiredRule } = useFormRules()

const NO_INTERVAL_VALUE = '0s'

let retainerConfig = reactive<Retainer>({
  enable: false,
  max_payload_size: '1MB',
  msg_clear_interval: NO_INTERVAL_VALUE,
  msg_expiry_interval: NO_INTERVAL_VALUE,
  backend: {
    storage_type: 'ram',
    type: 'built_in_database',
    max_retained_messages: 0,
  },
  flow_control: {
    batch_read_number: 0,
    batch_deliver_number: 0,
    batch_deliver_limiter: '',
  },
})

const selOptions = reactive<{ read: string; deliver: string }>({
  read: 'custom',
  deliver: 'custom',
})

let configLoading = ref(true)
let retainerForm = ref<HTMLFormElement | null>(null)

let validatorRules = [
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
  flow_control: {
    batch_read_number: validatorRules,
    batch_deliver_number: validatorRules,
  },
})

const configEnable = computed(() => retainerConfig?.enable === true)

const { setRawData, checkDataIsChanged } = useCheckDataChanged(ref(retainerConfig))
useDataNotSaveConfirm(checkDataIsChanged)

watch(
  () => ({ ...selOptions }),
  async (newV) => {
    // wait derivedOptionsFromConfig finished
    await nextTick()
    if (newV.read == 'unlimited') {
      retainerConfig.flow_control.batch_read_number = 0
    }
    if (newV.deliver == 'unlimited') {
      retainerConfig.flow_control.batch_deliver_number = 0
    }
  },
)

const loadConfigData = async () => {
  configLoading.value = true
  retainerForm.value?.resetFields()
  try {
    let res = await getRetainer()
    if (res) {
      Object.assign(retainerConfig, res)
      derivedOptionsFromConfig()
      setRawData(retainerConfig)
    }
  } catch (error) {
    console.error(error)
  } finally {
    configLoading.value = false
  }
}

const getSelectedOptions = (value: number) => (value === 0 ? 'unlimited' : 'custom')

const derivedOptionsFromConfig = () => {
  let config = retainerConfig
  // trans some values from string to array
  selOptions.read = getSelectedOptions(config?.flow_control?.batch_read_number)
  selOptions.deliver = getSelectedOptions(config?.flow_control?.batch_deliver_number)
}

const toggleStatus = async () => {
  let valid = await retainerForm.value?.validate().catch(() => {
    // ignore error
  })
  if (!valid) {
    retainerConfig.enable = !retainerConfig.enable
    return
  }
  updateConfigData()
}

const updateConfigData = async function () {
  let valid = await retainerForm.value?.validate().catch(() => {
    // ignore error
  })
  if (!valid) return
  try {
    configLoading.value = true
    await updateRetainer(retainerConfig)
    setRawData(retainerConfig)
    ElMessage.success(t('Base.updateSuccess'))
  } catch (error) {
    loadConfigData()
  } finally {
    configLoading.value = false
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
