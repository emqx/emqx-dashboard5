<template>
  <div class="sys-topics app-wrapper">
    <el-card>
      <el-form
        ref="retainerForm"
        :rules="rules"
        :model="sysTopics"
        label-position="top"
        class="schema-form"
      >
        <el-row>
          <el-col :span="16" class="custom-col">
            <el-form-item :label="tl('messagePublishInterval')" prop="sys_msg_interval">
              <pre class="item-desc">{{ tl('sysMsgIntervalDesc') }}</pre>
              <TimeInputWithUnitSelect
                v-model="sysTopics.sys_msg_interval"
                v-bind="timeInputProps"
              />
            </el-form-item>
          </el-col>
          <el-col :span="16" class="custom-col">
            <el-form-item :label="tl('heartbeatInterval')" prop="sys_heartbeat_interval">
              <pre class="item-desc">{{ tl('sysHeartbeatIntervalDesc') }}</pre>
              <TimeInputWithUnitSelect
                v-model="sysTopics.sys_heartbeat_interval"
                v-bind="timeInputProps"
              />
            </el-form-item>
          </el-col>
          <el-col :span="16" class="custom-col">
            <el-form-item :label="tl('clientConnected')" prop="sys_event_messages.client_connected">
              <p class="item-desc">
                {{ tl('sysEventClientConnectedDesc') }}
              </p>
              <el-switch v-model="sysTopics.sys_event_messages.client_connected"></el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="16" class="custom-col">
            <el-form-item
              :label="tl('clientDisconnected')"
              prop="sys_event_messages.client_disconnected"
            >
              <p class="item-desc">
                {{ tl('sysEventClientDisconnectedDesc') }}
              </p>
              <el-switch v-model="sysTopics.sys_event_messages.client_disconnected"></el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="16" class="custom-col">
            <el-form-item
              :label="tl('clientSubscribed')"
              prop="sys_event_messages.client_subscribed"
            >
              <p class="item-desc">
                {{ tl('sysEventClientSubscribedDesc') }}
              </p>
              <el-switch v-model="sysTopics.sys_event_messages.client_subscribed"></el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="16" class="custom-col">
            <el-form-item
              :label="tl('clientUnsubscribed')"
              prop="sys_event_messages.client_unsubscribed"
            >
              <p class="item-desc">
                {{ tl('sysEventClientUnsubscribedDesc') }}
              </p>
              <el-switch v-model="sysTopics.sys_event_messages.client_unsubscribed"></el-switch>
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

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'sysTopics',
})
</script>

<script setup lang="ts">
import { ref, Ref } from 'vue'
import useI18nTl from '@/hooks/useI18nTl'
import TimeInputWithUnitSelect from '@/components/TimeInputWithUnitSelect.vue'
import { SysTopics } from '@/types/extension'
import { getSystemTopicsConfig, updateSystemTopicConfig } from '@/api/extension'
import { ElMessage } from 'element-plus'
import useDataNotSaveConfirm, { useCheckDataChanged } from '@/hooks/useDataNotSaveConfirm'
import { useStore } from 'vuex'

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

const { setRawData, checkDataIsChanged } = useCheckDataChanged(sysTopics)
useDataNotSaveConfirm(checkDataIsChanged)

const getConfig = async () => {
  try {
    sysTopics.value = await getSystemTopicsConfig()
    setRawData(sysTopics.value)
  } catch (error) {
    //
  }
}

const updateConfigData = async () => {
  await updateSystemTopicConfig(sysTopics.value)
  ElMessage.success(t('Base.updateSuccess'))
  getConfig()
}

getConfig()
</script>

<style lang="scss">
.sys-topics {
  .sys-tip {
    margin: 16px 0;
    padding-left: 12px + 4px;
  }
}
</style>
