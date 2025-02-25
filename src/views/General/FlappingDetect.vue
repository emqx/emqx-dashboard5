<template>
  <div class="flapping-detect app-wrapper with-padding-top">
    <el-card class="allow-overflow">
      <el-skeleton v-if="configLoading" :rows="12" animated />
      <div class="schema-form" v-else>
        <el-form
          ref="flappingDetectForm"
          class="configuration-form"
          label-position="right"
          require-asterisk-position="left"
          hide-required-asterisk
          :label-width="store.state.lang === 'zh' ? 170 : 230"
          :model="flappingDetectConfig"
          :validate-on-rule-change="false"
          @keyup.enter="updateConfigData()"
        >
          <el-row>
            <el-col :span="21" class="custom-col">
              <el-form-item prop="enable">
                <template #label>
                  <FormItemLabel :label="tl('enableFlapping')" :desc="tl('enableFlappingDesc')" />
                </template>
                <el-switch v-model="flappingDetectConfig.enable" />
              </el-form-item>
              <el-form-item prop="window_time">
                <template #label>
                  <FormItemLabel :label="tl('windowTime')" :desc="tl('windowTimeDesc')" />
                </template>
                <TimeInputWithUnitSelect
                  v-model="flappingDetectConfig.window_time"
                  number-placeholder="1"
                  :enabled-units="['m']"
                  :disabled="!flappingDetectConfig.enable"
                />
              </el-form-item>
              <el-form-item prop="max_count">
                <template #label>
                  <FormItemLabel :label="tl('maxCount')" :desc="tl('maxCountDesc')" />
                </template>
                <CustomInputNumber
                  v-model.number="flappingDetectConfig.max_count"
                  placeholder="15"
                  :min="0"
                  :disabled="!flappingDetectConfig.enable"
                />
              </el-form-item>
              <el-form-item prop="ban_time">
                <template #label>
                  <FormItemLabel :label="tl('banTime')" :desc="tl('banTimeDesc')" />
                </template>
                <TimeInputWithUnitSelect
                  v-model="flappingDetectConfig.ban_time"
                  number-placeholder="5"
                  :enabled-units="['m']"
                  :disabled="!flappingDetectConfig.enable"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24" class="btn-col">
              <el-button
                type="primary"
                :disabled="!$hasPermission('put')"
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
import { getDefaultZoneConfigs, updateDefaultZoneConfigs } from '@/api/config'
import CustomInputNumber from '@/components/CustomInputNumber.vue'
import FormItemLabel from '@/components/FormItemLabel.vue'
import TimeInputWithUnitSelect from '@/components/TimeInputWithUnitSelect.vue'
import useConfFooterStyle from '@/hooks/useConfFooterStyle'
import useI18nTl from '@/hooks/useI18nTl'
import { Zone } from '@/types/config'

import { usePerms } from '@/plugins/permissionsPlugin'

const { hasPermission } = usePerms()
const { t, tl } = useI18nTl('General')

const configLoading = ref(false)
const saveLoading = ref(false)
const store = useStore()
const flappingDetectConfig = ref<Zone['flapping_detect']>({
  enable: false,
  window_time: '1m',
  max_count: 15,
  ban_time: '5m',
})

const loadData = async () => {
  try {
    configLoading.value = true
    const res = await getDefaultZoneConfigs()
    flappingDetectConfig.value = res.flapping_detect
  } catch (error) {
    //
  } finally {
    configLoading.value = false
  }
}

const updateConfigData = async () => {
  if (!hasPermission('put')) {
    return
  }
  saveLoading.value = true
  try {
    const zoneData: Zone = await getDefaultZoneConfigs()
    zoneData.flapping_detect = flappingDetectConfig.value
    await updateDefaultZoneConfigs(zoneData)
    ElMessage.success(t('Base.updateSuccess'))
  } catch (err) {
    loadData()
  } finally {
    saveLoading.value = false
  }
}

const { addObserverToFooter } = useConfFooterStyle()
// Fetch data
onMounted(async () => {
  await loadData()
  addObserverToFooter()
})
</script>
