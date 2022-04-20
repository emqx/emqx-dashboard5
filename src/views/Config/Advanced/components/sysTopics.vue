<template>
  <div class="sys-topics">
    <div class="sys-tip">{{ tl('sysTopicsDesc') }}</div>
    <div class="no-tab-wrapper">
      <el-form ref="retainerForm" :rules="rules" :model="sysTopics" label-position="top">
        <section>
          <div class="part-header">{{ tl('basicConfig') }}</div>
          <el-row :gutter="30">
            <el-col :span="8">
              <el-form-item :label="tl('messagePublishInterval')" prop="sys_msg_interval">
                <InputWithUnit v-model="sysTopics.sys_msg_interval" v-bind="timeInputProps" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="tl('heartbeatInterval')" prop="sys_heartbeat_interval">
                <InputWithUnit v-model="sysTopics.sys_heartbeat_interval" v-bind="timeInputProps" />
              </el-form-item>
            </el-col>
          </el-row>
        </section>
        <section>
          <div class="part-header">{{ tl('clientEvent') }}</div>
          <el-row :gutter="30">
            <el-col :span="8">
              <el-form-item
                :label="tl('clientConnected')"
                prop="sys_event_messages.client_connected"
              >
                <BooleanSelect
                  v-model="sysTopics.sys_event_messages.client_connected"
                  v-bind="booleanSelectProps"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                :label="tl('clientDisconnected')"
                prop="sys_event_messages.client_disconnected"
              >
                <BooleanSelect
                  v-model="sysTopics.sys_event_messages.client_disconnected"
                  v-bind="booleanSelectProps"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="30">
            <el-col :span="8">
              <el-form-item
                :label="tl('clientSubscribed')"
                prop="sys_event_messages.client_subscribed"
              >
                <BooleanSelect
                  v-model="sysTopics.sys_event_messages.client_unsubscribed"
                  v-bind="booleanSelectProps"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                :label="tl('clientUnsubscribed')"
                prop="sys_event_messages.client_disconnected"
              >
                <BooleanSelect
                  v-model="sysTopics.sys_event_messages.client_unsubscribed"
                  v-bind="booleanSelectProps"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </section>
        <el-row>
          <el-button type="primary" @click="updateConfigData()">
            {{ $t('Base.update') }}
          </el-button>
        </el-row>
      </el-form>
    </div>
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
import BooleanSelect from '@/components/BooleanSelect.vue'
import InputWithUnit from '@/components/InputWithUnit.vue'
import { SysTopics } from '@/types/advanced'
import { getSystemTopicsConfig, updateSystemTopicConfig } from '@/api/advanced'
import { ElMessage } from 'element-plus'

const { t, tl } = useI18nTl('Advanced')
const timeInputProps = {
  units: ['s', 'm'],
  defaultUnit: 's',
}
const booleanSelectProps = {
  trueLabel: tl('enable'),
  falseLabel: tl('disable'),
}

const rules = {}
const sysTopics: Ref<SysTopics> = ref({
  sys_event_messages: {},
} as SysTopics)

const getConfig = async () => {
  sysTopics.value = await getSystemTopicsConfig()
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
    margin-bottom: 24px;
  }
}
</style>
