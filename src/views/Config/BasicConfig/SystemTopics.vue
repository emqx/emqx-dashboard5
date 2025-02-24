<template>
  <div class="sys-topics app-wrapper">
    <el-card class="app-card allow-overflow">
      <el-skeleton v-if="configLoading" :rows="12" animated />
      <div class="schema-form" v-else>
        <el-form
          ref="retainerForm"
          class="configuration-form schema-form"
          label-position="right"
          :rules="rules"
          :model="sysTopics"
          :label-width="store.state.lang === 'zh' ? 192 : 270"
        >
          <el-row>
            <el-col :span="21" class="custom-col">
              <el-form-item prop="sys_msg_interval">
                <template #label>
                  <FormItemLabel
                    :label="tl('messagePublishInterval')"
                    :desc="tl('sysMsgIntervalDesc')"
                    place="right"
                    desc-marked
                  />
                </template>
                <TimeInputWithUnitSelect
                  v-model="sysTopics.sys_msg_interval"
                  v-bind="timeInputProps"
                />
              </el-form-item>
            </el-col>
            <el-col :span="21" class="custom-col">
              <el-form-item prop="sys_heartbeat_interval">
                <template #label>
                  <FormItemLabel
                    :label="tl('heartbeatInterval')"
                    :desc="tl('sysHeartbeatIntervalDesc')"
                    desc-marked
                  />
                </template>
                <TimeInputWithUnitSelect
                  v-model="sysTopics.sys_heartbeat_interval"
                  v-bind="timeInputProps"
                />
              </el-form-item>
            </el-col>
            <el-col :span="21" class="custom-col">
              <el-form-item prop="sys_event_messages.client_connected">
                <template #label>
                  <FormItemLabel
                    :label="tl('clientConnected')"
                    :desc="tl('sysEventClientConnectedDesc')"
                  />
                </template>
                <el-switch v-model="sysTopics.sys_event_messages.client_connected" />
              </el-form-item>
            </el-col>
            <el-col :span="21" class="custom-col">
              <el-form-item prop="sys_event_messages.client_disconnected">
                <template #label>
                  <FormItemLabel
                    :label="tl('clientDisconnected')"
                    :desc="tl('sysEventClientDisconnectedDesc')"
                  />
                </template>
                <el-switch v-model="sysTopics.sys_event_messages.client_disconnected" />
              </el-form-item>
            </el-col>
            <el-col :span="21" class="custom-col">
              <el-form-item prop="sys_event_messages.client_subscribed">
                <template #label>
                  <FormItemLabel
                    :label="tl('clientSubscribed')"
                    :desc="tl('sysEventClientSubscribedDesc')"
                  />
                </template>
                <el-switch v-model="sysTopics.sys_event_messages.client_subscribed" />
              </el-form-item>
            </el-col>
            <el-col :span="21" class="custom-col">
              <el-form-item prop="sys_event_messages.client_unsubscribed">
                <template #label>
                  <FormItemLabel
                    :label="tl('clientUnsubscribed')"
                    :desc="tl('sysEventClientUnsubscribedDesc')"
                  />
                </template>
                <el-switch v-model="sysTopics.sys_event_messages.client_unsubscribed" />
              </el-form-item>
            </el-col>
            <el-col :span="24" class="btn-col">
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

<script lang="ts">
export default defineComponent({
  name: 'sysTopics',
})
</script>

<script setup lang="ts">
import { getSystemTopicsConfig, updateSystemTopicConfig } from '@/api/extension'
import { SysTopics } from '@/types/extension'

const { t, tl } = useI18nTl('Extension')
const store = useStore()
const timeInputProps = {
  enabledUnits: ['s', 'm'],
  defaultUnit: 's',
}

const rules = {}
const sysTopics: Ref<SysTopics> = ref({
  sys_event_messages: {},
} as SysTopics)
const configLoading = ref(false)
const saveLoading = ref(false)

const { setRawData, checkDataIsChanged } = useCheckDataChanged(sysTopics)
useDataNotSaveConfirm(checkDataIsChanged)

const getConfig = async () => {
  try {
    configLoading.value = true
    sysTopics.value = await getSystemTopicsConfig()
    setRawData(sysTopics.value)
  } catch (error) {
    //
  } finally {
    configLoading.value = false
  }
}

const updateConfigData = async () => {
  try {
    saveLoading.value = true
    await updateSystemTopicConfig(sysTopics.value)
    ElMessage.success(t('Base.updateSuccess'))
    setRawData(sysTopics.value)
  } catch (error) {
    // ignore error
  } finally {
    saveLoading.value = false
  }
}

const { addObserverToFooter } = useConfFooterStyle()
;(async () => {
  await getConfig()
  addObserverToFooter()
})()
</script>

<style lang="scss">
.sys-topics {
  .sys-tip {
    margin: 16px 0;
    padding-left: 12px + 4px;
  }
}
</style>
