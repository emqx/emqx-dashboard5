<template>
  <div>
    <el-form label-position="top">
      <el-row :gutter="30">
        <el-col :span="12">
          <el-form-item :label="tl('resDirectory')">
            <el-input v-model="lValue.xml_dir" :placeholder="lValueDefault.xml_dir" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="tl('qmodewindow')">
            <TimeInputWithUnitSelect
              v-model="lValue.qmode_time_window"
              :number-placeholder="parseInt(lValueDefault.qmode_time_window).toString()"
              :enabled-units="['s']"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="tl('minLifetime')">
            <TimeInputWithUnitSelect
              v-model="lValue.lifetime_min"
              :number-placeholder="parseInt(lValueDefault.lifetime_min).toString()"
              :enabled-units="['s', 'm', 'h', 'd']"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="tl('maxLifetime')">
            <TimeInputWithUnitSelect
              v-model="lValue.lifetime_max"
              :number-placeholder="parseInt(lValueDefault.lifetime_max).toString()"
              :enabled-units="['s', 'm', 'h', 'd']"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="tl('aObserve')">
            <el-select v-model="lValue.auto_observe">
              <el-option :value="true" label="true" />
              <el-option :value="false" label="false" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="tl('updateStrategy')">
            <el-select v-model="lValue.update_msg_publish_condition">
              <el-option value="always" />
              <el-option value="contains_object_list" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="tl('useLog')">
            <el-select v-model="lValue.enable_stats">
              <el-option :value="true" label="true" />
              <el-option :value="false" label="false" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="tl('idleTime')">
            <TimeInputWithUnitSelect
              v-model="lValue.idle_timeout"
              :number-placeholder="parseInt(lValueDefault.idle_timeout).toString()"
              :enabled-units="['s']"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="30">
        <el-col :span="12">
          <el-form-item :label="tl('mountPoint')">
            <el-input v-model="lValue.mountpoint" :placeholder="lValueDefault.mountpoint" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="tl('trCommand')">
            <el-input
              :placeholder="lValueDefault.translators.command.topic"
              v-model="lValue.translators.command.topic"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="tl('trResponse')">
            <el-input
              :placeholder="lValueDefault.translators.response.topic"
              v-model="lValue.translators.response.topic"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="tl('trNotify')">
            <el-input
              :placeholder="lValueDefault.translators.notify.topic"
              v-model="lValue.translators.notify.topic"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="tl('trRegister')">
            <el-input
              :placeholder="lValueDefault.translators.register.topic"
              v-model="lValue.translators.register.topic"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="tl('trUpdate')">
            <el-input
              :placeholder="lValueDefault.translators.update.topic"
              v-model="lValue.translators.update.topic"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, watch } from 'vue'
import _ from 'lodash'
import { useI18n } from 'vue-i18n'
import TimeInputWithUnitSelect from '@/components/TimeInputWithUnitSelect.vue'

export default defineComponent({
  name: 'LwBasic',
  props: {
    value: {
      type: Object,
      required: false,
      default: () => ({}),
    },
  },
  components: {
    TimeInputWithUnitSelect,
  },
  setup(props, context) {
    const createDefaultValue = () => ({
      idle_timeout: '30s',
      xml_dir: 'etc/lwm2m_xml/',
      qmode_time_window: '22s',
      lifetime_min: '1s',
      lifetime_max: '86400s',
      auto_observe: true,
      enable_stats: true,
      update_msg_publish_condition: 'contains_object_list',
      mountpoint: '',
      translators: {
        command: { topic: 'dn/#', qos: 0 },
        response: { topic: 'up/resp', qos: 0 },
        notify: { topic: 'up/notify', qos: 0 },
        register: { topic: 'up/register', qos: 0 },
        update: { topic: 'up/update', qos: 0 },
      },
    })

    const lValueDefault = createDefaultValue()
    const { t } = useI18n()

    const lValue = reactive(_.merge(createDefaultValue(), props.value))

    watch(
      () => _.cloneDeep(lValue),
      (v) => {
        context.emit('update:value', v)
      },
    )
    onMounted(() => {
      context.emit('update:value', lValue)
    })

    return {
      tl: (key: string, collection = 'Gateway') => t(collection + '.' + key),
      lValueDefault,
      lValue,
    }
  },
})
</script>
