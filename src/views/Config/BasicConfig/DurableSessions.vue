<template>
  <div class="session-persistence app-wrapper">
    <el-card class="allow-overflow">
      <el-skeleton v-if="configLoading" :rows="12" animated />
      <div class="schema-form" v-else>
        <el-form
          ref="sessionPersistenceForm"
          class="configuration-form"
          label-position="right"
          :label-width="store.state.lang === 'zh' ? 202 : 238"
          :model="sessionPersistenceConfig"
          :validate-on-rule-change="false"
          @keyup.enter="updateConfigData()"
        >
          <el-row>
            <el-col :span="21" class="custom-col">
              <el-form-item prop="enable">
                <template #label>
                  <FormItemLabel
                    desc-marked
                    :label="tl('enableDurableSessions')"
                    :desc="tl('enableDurableSessionsDesc')"
                  />
                </template>
                <el-switch disabled v-model="sessionPersistenceConfig.enable" />
              </el-form-item>
            </el-col>
            <el-col :span="21" class="custom-col">
              <el-form-item prop="message_retention_period">
                <template #label>
                  <FormItemLabel
                    :label="tl('messageRetentionPeriod')"
                    :desc="tl('messageRetentionPeriodDesc')"
                  />
                </template>
                <TimeInputWithUnitSelect
                  v-model="sessionPersistenceConfig.message_retention_period"
                  number-placeholder="5000"
                  :enabled-units="['d', 'h', 'm']"
                />
              </el-form-item>
            </el-col>
            <el-col :span="21" class="custom-col">
              <el-form-item prop="batch_size">
                <template #label>
                  <FormItemLabel :label="tl('batchSize')" :desc="tl('batchSizeDesc')" />
                </template>
                <CustomInputNumber
                  v-model.number="sessionPersistenceConfig.batch_size"
                  placeholder="100"
                  :min="0"
                />
              </el-form-item>
            </el-col>
            <el-col :span="21" class="custom-col">
              <el-form-item prop="idle_poll_interval">
                <template #label>
                  <FormItemLabel
                    :label="tl('idlePollInterval')"
                    :desc="tl('idlePollIntervalDesc')"
                  />
                </template>
                <TimeInputWithUnitSelect
                  v-model="sessionPersistenceConfig.idle_poll_interval"
                  number-placeholder="100"
                  :enabled-units="['m', 's', 'ms']"
                />
              </el-form-item>
            </el-col>
            <el-col :span="21" class="custom-col">
              <el-form-item prop="heartbeat_interval">
                <template #label>
                  <FormItemLabel
                    :label="tl('lastAliveUpdateInterval')"
                    :desc="tl('lastAliveUpdateIntervalDesc')"
                  />
                </template>
                <TimeInputWithUnitSelect
                  v-model="sessionPersistenceConfig.heartbeat_interval"
                  number-placeholder="5000"
                  :enabled-units="['m', 's', 'ms']"
                />
              </el-form-item>
            </el-col>
            <el-col :span="21" class="custom-col">
              <el-form-item prop="session_gc_interval">
                <template #label>
                  <FormItemLabel
                    :label="tl('sessionGcInterval')"
                    :desc="tl('sessionGcIntervalDesc')"
                  />
                </template>
                <TimeInputWithUnitSelect
                  v-model="sessionPersistenceConfig.session_gc_interval"
                  number-placeholder="5000"
                  :enabled-units="['h', 'm', 's']"
                />
              </el-form-item>
            </el-col>
            <el-col :span="21" class="custom-col">
              <el-form-item prop="session_gc_batch_size">
                <template #label>
                  <FormItemLabel
                    :label="tl('sessionGcBatchSize')"
                    :desc="tl('sessionGcBatchSizeDesc')"
                  />
                </template>
                <CustomInputNumber
                  v-model.number="sessionPersistenceConfig.session_gc_batch_size"
                  placeholder="100"
                  :min="0"
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
import { getDefaultZoneConfigs, updateDefaultZoneConfigs } from '@/api/config'
import CustomInputNumber from '@/components/CustomInputNumber.vue'
import FormItemLabel from '@/components/FormItemLabel.vue'
import TimeInputWithUnitSelect from '@/components/TimeInputWithUnitSelect.vue'
import useConfFooterStyle from '@/hooks/useConfFooterStyle'
import useDataNotSaveConfirm from '@/hooks/useDataNotSaveConfirm'
import useI18nTl from '@/hooks/useI18nTl'
import { Zone } from '@/types/config'
import { ElMessage } from 'element-plus'
import { isEqual, cloneDeep } from 'lodash'
import { onMounted, ref } from 'vue'
import { useStore } from 'vuex'

const { t, tl } = useI18nTl('General')

const configLoading = ref(false)
const saveLoading = ref(false)
const store = useStore()
let rawData: any = undefined
const sessionPersistenceConfig = ref<Zone['durable_sessions']>({
  enable: false,
  batch_size: 100,
  idle_poll_interval: '100ms',
  heartbeat_interval: '5000ms',
  session_gc_interval: '10m',
  session_gc_batch_size: 100,
  message_retention_period: '1d',
})

const checkDataIsChanged = () => !isEqual(sessionPersistenceConfig.value, rawData)
useDataNotSaveConfirm(checkDataIsChanged)

const loadData = async () => {
  try {
    configLoading.value = true
    const res = await getDefaultZoneConfigs()
    sessionPersistenceConfig.value = res.durable_sessions
    rawData = cloneDeep(sessionPersistenceConfig.value)
  } catch (error) {
    //
  } finally {
    configLoading.value = false
  }
}

const updateConfigData = async () => {
  saveLoading.value = true
  try {
    const zoneData: Zone = await getDefaultZoneConfigs()
    zoneData.durable_sessions = sessionPersistenceConfig.value
    await updateDefaultZoneConfigs(zoneData)
    ElMessage.success(t('Base.updateSuccess'))
    rawData = cloneDeep(sessionPersistenceConfig.value)
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
