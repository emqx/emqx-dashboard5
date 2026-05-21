<template>
  <div class="rule-engine-security app-wrapper with-padding-top">
    <el-card class="app-card allow-overflow schema-form">
      <el-skeleton v-if="configLoading" :rows="10" animated />
      <div v-else class="schema-form">
        <el-row>
          <el-col :span="18" class="custom-col">
            <el-alert class="mb-6 security-tip" type="info" :closable="false" show-icon>
              <MarkdownContent :content="tl('ruleEngineSsrfPolicyTip')" in-tooltip />
            </el-alert>
          </el-col>
        </el-row>

        <el-form
          class="configuration-form"
          label-position="right"
          hide-required-asterisk
          :label-width="store.state.lang === 'zh' ? 172 : 212"
          :model="ssrfConfig"
        >
          <el-row>
            <el-col :span="18" class="custom-col">
              <el-form-item>
                <template #label>
                  <FormItemLabel
                    :label="tl('enableSsrfProtection')"
                    :desc="tl('enableSsrfProtectionDesc')"
                    desc-marked
                  />
                </template>
                <el-switch v-model="ssrfConfig.enable" />
              </el-form-item>
            </el-col>
            <el-col :span="18" class="custom-col">
              <el-form-item>
                <template #label>
                  <FormItemLabel
                    :label="tl('allowedCIDRRanges')"
                    :desc="tl('allowedCIDRRangesDesc')"
                    desc-marked
                  />
                </template>
                <ArrayEditor v-model="ssrfConfig.allow_cidrs" />
              </el-form-item>
            </el-col>
            <el-col :span="18" class="custom-col">
              <el-form-item>
                <template #label>
                  <FormItemLabel
                    :label="tl('deniedCIDRRanges')"
                    :desc="tl('deniedCIDRRangesDesc')"
                    desc-marked
                  />
                </template>
                <ArrayEditor v-model="ssrfConfig.deny_cidrs" />
              </el-form-item>
            </el-col>
            <el-col :span="18" class="custom-col">
              <el-form-item>
                <template #label>
                  <FormItemLabel
                    :label="tl('deniedHostnames')"
                    :desc="tl('deniedHostnamesDesc')"
                    desc-marked
                  />
                </template>
                <ArrayEditor v-model="ssrfConfig.deny_hosts" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="18" class="btn-col">
              <el-button
                :disabled="!$hasPermission('put')"
                type="primary"
                :loading="saveLoading"
                @click="updateConfigData()"
              >
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
import { getRuleEngineConfigs, updateRuleEngineConfigs } from '@/api/config'
import { RuleEngine, RuleEngineSSRF } from '@/types/config'

const createDefaultConfig = (): RuleEngineSSRF => ({
  enable: false,
  allow_cidrs: [],
  deny_cidrs: [],
  deny_hosts: [],
})

const { t, tl } = useI18nTl('BasicConfig')
const store = useStore()

const configLoading = ref(true)
const saveLoading = ref(false)
const ssrfConfig = ref<RuleEngineSSRF>(createDefaultConfig())
const rawRuleEngineConfig = ref<RuleEngine | null>(null)
let rawData: RuleEngineSSRF | undefined = undefined

const normalizeStringArray = (items: string[] = []) =>
  items.map((item) => item.trim()).filter(Boolean)

const getPayloadConfig = (): RuleEngineSSRF => ({
  enable: ssrfConfig.value.enable,
  allow_cidrs: normalizeStringArray(ssrfConfig.value.allow_cidrs),
  deny_cidrs: normalizeStringArray(ssrfConfig.value.deny_cidrs),
  deny_hosts: normalizeStringArray(ssrfConfig.value.deny_hosts),
})

const checkDataIsChanged = () => !isEqual(getPayloadConfig(), rawData)
useDataNotSaveConfirm(checkDataIsChanged)

const loadData = async () => {
  try {
    configLoading.value = true
    const ruleEngineConfig = await getRuleEngineConfigs()
    rawRuleEngineConfig.value = cloneDeep(ruleEngineConfig)
    ssrfConfig.value = {
      ...createDefaultConfig(),
      ...(ruleEngineConfig.ssrf ?? {}),
    }
    rawData = cloneDeep(getPayloadConfig())
  } catch (error) {
    //
  } finally {
    configLoading.value = false
  }
}

const updateConfigData = async () => {
  try {
    saveLoading.value = true
    const payload = getPayloadConfig()
    const updatedRuleEngineConfig = await updateRuleEngineConfigs({
      ...(rawRuleEngineConfig.value ?? { ssrf: createDefaultConfig() }),
      ssrf: payload,
    })
    rawRuleEngineConfig.value = cloneDeep(updatedRuleEngineConfig)
    ssrfConfig.value = cloneDeep(payload)
    rawData = cloneDeep(payload)
    ElMessage.success(t('Base.updateSuccess'))
  } catch (error) {
    //
  } finally {
    saveLoading.value = false
  }
}

loadData()
</script>

<style lang="scss">
.rule-engine-security {
  .custom-col {
    margin-bottom: 12px;
  }
  .btn-col {
    margin-top: 12px;
  }

  .el-alert.security-tip {
    align-items: flex-start;
    margin-bottom: 12px;
    .el-icon {
      margin-top: 16px;
      font-size: 16px;
    }
  }
}
</style>
