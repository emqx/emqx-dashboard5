<template>
  <div class="retainer app-wrapper">
    <el-card v-loading="configLoading">
      <el-form
        ref="retainerForm"
        :rules="retainerRules"
        :model="retainerConfig"
        label-position="top"
        class="schema-form"
      >
        <el-row align="middle">
          <el-col :span="16" class="custom-col">
            <el-form-item :label="tl('enable')">
              <p class="item-desc">
                {{ tl('enableDesc') }}
              </p>
              <el-switch v-model="retainerConfig.enable" @change="toggleStatus()" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-form
        :disabled="!configEnable"
        ref="retainerForm"
        :rules="retainerRules"
        :model="retainerConfig"
        label-position="top"
        @keyup.enter="updateConfigData()"
        class="schema-form"
      >
        <el-row>
          <el-col :span="16">
            <div class="group-title">{{ tl('storage') }}</div>
          </el-col>
          <el-col :span="16" class="custom-col">
            <el-form-item :label="tl('storageType')">
              <el-select v-model="retainerConfig.backend.type">
                <el-option value="built_in_database" :label="tl('builtInDatabase')" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="16" class="custom-col">
            <el-form-item :label="tl('storageMethod')" required prop="backend.storage_type">
              <el-select v-model="retainerConfig.backend.storage_type">
                <el-option value="ram" />
                <el-option value="disc" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="16">
            <div class="group-title">{{ tl('policy') }}</div>
          </el-col>
          <el-col :span="16" class="custom-col">
            <el-form-item :label="tl('maxRetainedMessages')" prop="backend.max_retained_messages">
              <el-input
                v-model.number="retainerConfig.backend.max_retained_messages"
                :readonly="selOptions.retained == 'unlimited'"
                maxlength="6"
              >
                <template #append>
                  <el-select v-model="selOptions.retained">
                    <el-option value="unlimited" :label="tl('unlimited')" />
                    <el-option value="custom" :label="tl('custom')" />
                  </el-select>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="16" class="custom-col">
            <el-form-item :label="tl('maxPayloadSize')" prop="max_payload_size">
              <InputWithUnit v-model="retainerConfig.max_payload_size" :units="['KB', 'MB']" />
            </el-form-item>
          </el-col>
          <el-col :span="16" class="custom-col">
            <el-form-item :label="tl('expire')" prop="msg_expiry_interval">
              <InputWithUnit
                v-model="retainerConfig.msg_expiry_interval"
                :units="expiryTimeUnits"
                :disabled-opt="{ value: DISABLED_VALUE, label: tl('noExp') }"
              />
            </el-form-item>
          </el-col>
          <el-col :span="16" class="custom-col">
            <el-form-item :label="tl('intervalClean')" prop="msg_clear_interval">
              <InputWithUnit
                v-model="retainerConfig.msg_clear_interval"
                :units="expiryTimeUnits"
                :disabled-opt="{ value: DISABLED_VALUE, label: tl('disable') }"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="16">
            <div class="group-title">{{ tl('flowControl') }}</div>
          </el-col>
          <el-col :span="16" class="custom-col">
            <el-form-item :label="tl('batchReadNumber')" prop="flow_control.batch_read_number">
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
          <el-col :span="16" class="custom-col">
            <el-form-item
              :label="tl('batchDeliverNumber')"
              prop="flow_control.batch_deliver_number"
            >
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
          </el-col>
          <el-col :span="24" class="btn-col" :style="store.getters.configPageBtnStyle">
            <el-button type="primary" @click="updateConfigData()">
              {{ $t('Base.save') }}
            </el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { nextTick, onMounted, reactive, ref, watch, computed } from 'vue'
import { getRetainer, updateRetainer } from '@/api/extension'
import { ElMessage } from 'element-plus'
import _ from 'lodash'
import useI18nTl from '@/hooks/useI18nTl'
import useFormRules from '@/hooks/useFormRules'
import InputWithUnit from '@/components/InputWithUnit.vue'
import useDataNotSaveConfirm, { useCheckDataChanged } from '@/hooks/useDataNotSaveConfirm'
import { useStore } from 'vuex'

const { tl, t } = useI18nTl('Extension')
const store = useStore()
const { createRequiredRule } = useFormRules()

const DISABLED_VALUE = 'disabled'
const VALUE_FOR_NO_VALUE = '0s'
const expiryTimeUnits = [
  { value: 's', label: tl('sec') },
  { value: 'm', label: tl('min') },
  { value: 'h', label: tl('hour') },
]
const keysNeedTrans = ['msg_expiry_interval', 'msg_clear_interval']

let retainerConfig = reactive({
  max_payload_size: '1MB',
  msg_clear_interval: DISABLED_VALUE,
  msg_expiry_interval: DISABLED_VALUE,
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
  enable: false,
})

const selOptions = reactive({
  retained: 'custom',
  read: 'custom',
  deliver: 'custom',
})

let configLoading = ref(true)
let retainerForm = ref(null)

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
  validator: (rule, value) => {
    const num = parseFloat(value)
    if (num < 0) {
      return new Error(t('Rule.minimumError', { min: 0 }))
    }
    return []
  },
}

const retainerRules = ref({
  backend: {
    max_retained_messages: validatorRules,
    storage_type: createRequiredRule('Storage', 'select'),
  },
  max_payload_size: [...createRequiredRule('Max Payload Size'), numberRule],
  msg_expiry_interval: [...createRequiredRule(tl('expire')), numberRule],
  msg_clear_interval: [...createRequiredRule(tl('intervalClean')), numberRule],
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
    if (newV.retained == 'unlimited') {
      retainerConfig.backend.max_retained_messages = 0
    }
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
  configEnable.value = true
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

const transDataFromDataRequested = (config) => {
  keysNeedTrans.forEach((key) => {
    if (config[key] === VALUE_FOR_NO_VALUE) {
      config[key] = DISABLED_VALUE
    }
  })
  return config
}

const getSelectedOptions = (value) => (value === 0 ? 'unlimited' : 'custom')

const derivedOptionsFromConfig = () => {
  let config = transDataFromDataRequested(retainerConfig)
  // trans some values from string to array
  selOptions.retained = getSelectedOptions(config?.backend?.max_retained_messages)
  selOptions.read = getSelectedOptions(config?.flow_control?.batch_read_number)
  selOptions.deliver = getSelectedOptions(config?.flow_control?.batch_deliver_number)
}

const transDataToSubmit = (config) => {
  const ret = _.cloneDeep(config)
  keysNeedTrans.forEach((key) => {
    if (ret[key] === DISABLED_VALUE) {
      ret[key] = VALUE_FOR_NO_VALUE
    }
  })
  return ret
}

const toggleStatus = async () => {
  let valid = await retainerForm.value.validate().catch(() => {})
  if (!valid) {
    retainerConfig.enable = !retainerConfig.enable
    return
  }
  updateConfigData()
}

const updateConfigData = async function () {
  let valid = await retainerForm.value.validate().catch(() => {})
  if (!valid) return
  try {
    configLoading.value = true
    const formData = transDataToSubmit(retainerConfig)
    await updateRetainer(formData)
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
