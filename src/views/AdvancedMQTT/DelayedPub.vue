<template>
  <div class="app-wrapper delayed-config">
    <el-card class="config-card" v-loading="isLoading">
      <div class="part-header">{{ tl('enable') }}</div>
      <el-row class="enable-row" align="middle">
        <el-col :span="9">{{ tl('enableDescDelay') }}</el-col>
        <el-col :span="15" />
        <el-col :span="9">
          <el-switch v-model="delayedConfig.enable" @change="toggleStatus()" />
        </el-col>
      </el-row>
      <el-form
        ref="delayedForm"
        :rules="delayedRules"
        :model="delayedConfig"
        :disabled="!configEnable"
        label-position="top"
        require-asterisk-position="right"
        @keyup.enter="updateDelayedConfig()"
      >
        <el-row>
          <el-col :span="9">
            <el-form-item :label="tl('maxDelayedMsg')" prop="max_delayed_messages">
              <el-input
                v-model.number="delayedConfig.max_delayed_messages"
                :readonly="delayedOption == 'unlimited'"
                maxlength="6"
                type="number"
              >
                <template #append>
                  <el-select v-model="delayedOption">
                    <el-option value="unlimited" :label="tl('unlimited')" />
                    <el-option value="custom" :label="tl('custom')" />
                  </el-select>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-row>
        <el-button type="primary" :disabled="!delayedConfig.enable" @click="updateDelayedConfig()">
          {{ $t('Base.save') }}
        </el-button>
      </el-row>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { getDelayedConfig, updateDelayedConfig as requestUpdateConfig } from '@/api/extension'
import useDataNotSaveConfirm, { useCheckDataChanged } from '@/hooks/useDataNotSaveConfirm'
import useI18nTl from '@/hooks/useI18nTl'
import { ElMessage } from 'element-plus'
import { reactive, ref, watch } from 'vue'

const { tl, t } = useI18nTl('Extension')

const isLoading = ref(false)
let configEnable = ref(false)
let configPending = ref(true)
let delayedOption = ref('custom')
let delayedForm = ref()
let delayedConfig = reactive({
  enable: false,
  max_delayed_messages: 0,
})
let delayedRules = {
  max_delayed_messages: [
    {
      required: true,
      message: tl('required'),
      trigger: 'blur',
    },
    {
      type: 'number',
      message: tl('needNumber'),
      trigger: 'blur',
    },
  ],
}

const toggleStatus = async () => {
  try {
    await delayedForm.value.validate()
    updateDelayedConfig()
  } catch (error) {
    delayedConfig.enable = !delayedConfig.enable
  }
}

const updateDelayedConfig = async function () {
  try {
    await delayedForm.value?.validate()
    configPending.value = true
    await requestUpdateConfig(delayedConfig)
    getConfigFormEnable()
    ElMessage({ type: 'success', message: t('Base.updateSuccess') })
    loadDelayedConfig()
  } catch (error) {
    //
  } finally {
    configPending.value = false
  }
}

const getDelayedOption = () => (delayedConfig?.max_delayed_messages == 0 ? 'unlimited' : 'custom')

const getConfigFormEnable = () => (configEnable.value = delayedConfig?.enable === true)

const loadDelayedConfig = async () => {
  try {
    configPending.value = true
    delayedForm.value?.resetFields()

    let res = await getDelayedConfig()
    Object.assign(delayedConfig, res)
    setRawData(delayedConfig)
    getConfigFormEnable()
    delayedOption.value = getDelayedOption()
  } catch (error) {
    //
  } finally {
    configPending.value = false
  }
}

const { setRawData, checkDataIsChanged } = useCheckDataChanged(ref(delayedConfig))
useDataNotSaveConfirm(checkDataIsChanged)

watch(delayedOption, (newOption) => {
  if (newOption == 'unlimited') {
    delayedConfig.max_delayed_messages = 0
  }
})

loadDelayedConfig()
</script>

<style lang="scss">
.delayed-config {
  .el-row {
    margin-bottom: 24px;
  }
}
</style>
