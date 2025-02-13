<template>
  <div class="force-shutdown app-wrapper">
    <el-card class="allow-overflow">
      <el-skeleton v-if="configLoading" :rows="12" animated />
      <div class="schema-form" v-else>
        <el-form
          ref="forceShutdownForm"
          class="configuration-form"
          label-position="right"
          :label-width="store.state.lang === 'zh' ? 138 : 210"
          :model="forceShutdownConfig"
          :validate-on-rule-change="false"
          @keyup.enter="updateConfigData()"
        >
          <el-row>
            <el-col :span="21" class="custom-col">
              <el-form-item prop="enable">
                <template #label>
                  <FormItemLabel
                    :label="tl('enableForceShutdown')"
                    :desc="tl('enableForceShutdownDesc')"
                    desc-marked
                  />
                </template>
                <el-switch v-model="forceShutdownConfig.enable" />
              </el-form-item>
            </el-col>

            <el-col :span="21" class="custom-col">
              <el-form-item prop="max_heap_size">
                <template #label>
                  <FormItemLabel
                    :label="tl('maxHeapSize')"
                    :desc="tl('maxHeapSizeDesc')"
                    desc-marked
                  />
                </template>
                <InputWithUnit
                  v-model="forceShutdownConfig.max_heap_size"
                  :units="['KB', 'MB', 'GB']"
                  :disabled="!configEnable"
                />
              </el-form-item>
            </el-col>

            <el-col :span="21" class="custom-col">
              <el-form-item prop="max_mailbox_size">
                <template #label>
                  <FormItemLabel
                    :label="tl('maxMailboxSize')"
                    :desc="tl('maxMailboxSizeDesc')"
                    desc-marked
                  />
                </template>
                <CustomInputNumber
                  v-model.number="forceShutdownConfig.max_mailbox_size"
                  placeholder="1000"
                  :min="0"
                  :disabled="!configEnable"
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
import InputWithUnit from '@/components/InputWithUnit.vue'
import useConfFooterStyle from '@/hooks/useConfFooterStyle'
import useDataNotSaveConfirm from '@/hooks/useDataNotSaveConfirm'
import useI18nTl from '@/hooks/useI18nTl'
import { Zone } from '@/types/config'
import { ElMessage } from 'element-plus'
import { isEqual, cloneDeep } from 'lodash'
import { onMounted, ref, computed } from 'vue'
import { useStore } from 'vuex'
import { EmqxForceShutdown } from '@/types/schemas/configs.schemas'

const { t, tl } = useI18nTl('General')

const configLoading = ref(false)
const saveLoading = ref(false)
const store = useStore()
let rawData: any = undefined

const forceShutdownConfig = ref<EmqxForceShutdown>({
  enable: false,
  max_heap_size: '32MB',
  max_mailbox_size: 1000,
})

const configEnable = computed(() => forceShutdownConfig.value?.enable === true)

const checkDataIsChanged = () => !isEqual(forceShutdownConfig.value, rawData)
useDataNotSaveConfirm(checkDataIsChanged)

const loadData = async () => {
  try {
    configLoading.value = true
    const res = await getDefaultZoneConfigs()
    forceShutdownConfig.value = res.force_shutdown
    rawData = cloneDeep(forceShutdownConfig.value)
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
    zoneData.force_shutdown = forceShutdownConfig.value
    await updateDefaultZoneConfigs(zoneData)
    ElMessage.success(t('Base.updateSuccess'))
    rawData = cloneDeep(forceShutdownConfig.value)
  } catch (err) {
    loadData()
  } finally {
    saveLoading.value = false
  }
}

const { addObserverToFooter } = useConfFooterStyle()

onMounted(async () => {
  await loadData()
  addObserverToFooter()
})
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
