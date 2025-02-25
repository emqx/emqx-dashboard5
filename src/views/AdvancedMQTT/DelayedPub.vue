<template>
  <div class="app-wrapper delayed-config with-padding-top">
    <el-card class="app-card" v-loading="isLoading">
      <el-form
        ref="delayedForm"
        :rules="delayedRules"
        :model="delayedConfig"
        label-position="right"
        :label-width="store.state.lang === 'zh' ? 160 : 220"
        class="configuration-form schema-form"
        require-asterisk-position="right"
        hide-required-asterisk
        @keyup.enter="updateDelayedConfig()"
      >
        <el-row>
          <el-col :span="21">
            <el-form-item prop="enable">
              <template #label>
                <FormItemLabel :label="tl('enableDelayed')" :desc="tl('enableDelayedDesc')" />
              </template>
              <el-switch v-model="delayedConfig.enable" />
            </el-form-item>
          </el-col>
          <el-col :span="21">
            <el-form-item :label="tl('maxDelayedMsg')" prop="max_delayed_messages">
              <template #label>
                <FormItemLabel :label="tl('maxDelayedMsg')" :desc="tl('maxDelayedMsgDesc')" />
              </template>
              <Oneof
                v-model="delayedConfig.max_delayed_messages"
                :items="[{ type: 'number' }, { type: 'enum', symbols: [0] }]"
                :disabled-label="tl('unlimited')"
                :disabled="!configEnable"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="btn-row">
          <el-col :span="24">
            <el-button
              type="primary"
              :disabled="!$hasPermission('put')"
              :loading="saveLoading"
              @click="updateDelayedConfig()"
            >
              {{ $t('Base.saveChanges') }}
            </el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { getDelayedConfig, updateDelayedConfig as requestUpdateConfig } from '@/api/extension'
import FormItemLabel from '@/components/FormItemLabel.vue'
import Oneof from '@/components/Oneof.vue'

import { usePerms } from '@/plugins/permissionsPlugin'

const { hasPermission } = usePerms()

const { tl, t } = useI18nTl('Extension')
const store = useStore()
const isLoading = ref(false)
const saveLoading = ref(false)
const delayedOption = ref('custom')
const delayedForm = ref()
const delayedConfig = reactive({
  enable: false,
  max_delayed_messages: 0,
})
const configEnable = computed(() => delayedConfig?.enable === true)

const { createIntFieldRule } = useFormRules()
const delayedRules: Record<string, any> = {
  max_delayed_messages: [
    {
      required: true,
      message: tl('required'),
      trigger: 'change',
    },
    ...createIntFieldRule(0),
  ],
}

const updateDelayedConfig = async function () {
  if (!hasPermission('put')) {
    return
  }
  try {
    await delayedForm.value?.validate()
    saveLoading.value = true
    await requestUpdateConfig(delayedConfig)
    ElMessage({ type: 'success', message: t('Base.updateSuccess') })
    setRawData(delayedConfig)
  } catch (error) {
    //
  } finally {
    saveLoading.value = false
  }
}

const getDelayedOption = () => (delayedConfig?.max_delayed_messages == 0 ? 'unlimited' : 'custom')

const loadDelayedConfig = async () => {
  try {
    isLoading.value = true
    delayedForm.value?.resetFields()
    const res = await getDelayedConfig()
    Object.assign(delayedConfig, res)
    setRawData(delayedConfig)
    delayedOption.value = getDelayedOption()
  } catch (error) {
    //
  } finally {
    isLoading.value = false
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
  .btn-row {
    margin-top: 24px;
    margin-left: 24px;
  }
}
</style>
