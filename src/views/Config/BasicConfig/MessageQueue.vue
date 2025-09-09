<template>
  <div class="force-shutdown app-wrapper">
    <el-card class="allow-overflow">
      <el-skeleton v-if="configLoading" :rows="12" animated />
      <div class="schema-form" v-else>
        <el-form
          ref="forceShutdownForm"
          class="configuration-form"
          label-position="right"
          :label-width="store.state.lang === 'zh' ? 150 : 252"
          :model="queueConfig"
          :validate-on-rule-change="false"
          @keyup.enter="updateConfigData()"
        >
          <el-row>
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

const queueConfig = ref<MessageQueueConfig>({
  gc_interval: '',
  regular_queue_retention_period: '',
})

const checkDataIsChanged = () => !isEqual(queueConfig.value, rawData)
useDataNotSaveConfirm(checkDataIsChanged)

const loadData = async () => {
  try {
    configLoading.value = true
    const res = await getMessageQueueConfigs()
    queueConfig.value = res
    rawData = cloneDeep(queueConfig.value)
  } catch (error) {
    //
  } finally {
    configLoading.value = false
  }
}

const updateConfigData = async () => {
  saveLoading.value = true
  try {
    await putMessageQueueConfigs(queueConfig.value)
    ElMessage.success(t('Base.updateSuccess'))
    rawData = cloneDeep(queueConfig.value)
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
</style>
