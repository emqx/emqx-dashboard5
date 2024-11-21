<template>
  <div>
    <el-form label-position="top">
      <el-row :gutter="30">
        <el-col :span="12">
          <el-form-item prop="connection_required">
            <template #label>
              <FormItemLabel
                :label="tl('connectionRequire')"
                :desc="tl('connectionRequireDesc')"
                desc-marked
              />
            </template>
            <el-select v-model="cValue.connection_required">
              <el-option :value="true" label="true" />
              <el-option :value="false" label="false" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="tl('notifyType')">
            <el-select v-model="cValue.notify_type">
              <el-option value="qos" />
              <el-option value="con" />
              <el-option value="non" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="cValue.connection_required === true">
          <el-form-item :label="tl('heartbeat')">
            <TimeInputWithUnitSelect
              v-model="cValue.heartbeat"
              :number-placeholder="parseInt(createDefault().heartbeat).toString()"
              :enabled-units="['s']"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="tl('subQos')">
            <el-select v-model="cValue.subscribe_qos">
              <el-option value="coap" />
              <el-option value="qos0" />
              <el-option value="qos1" />
              <el-option value="qos2" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="tl('pubQos')">
            <el-select v-model="cValue.publish_qos">
              <el-option value="coap" />
              <el-option value="qos0" />
              <el-option value="qos1" />
              <el-option value="qos2" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="tl('mountPoint')">
            <el-input v-model="cValue.mountpoint" :placeholder="cValueDefault.mountpoint" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item :label="tl('useLog')">
            <el-switch v-model="cValue.enable_stats" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { defineComponent, onMounted, reactive, watch } from 'vue'
import _ from 'lodash'
import { useI18n } from 'vue-i18n'
import TimeInputWithUnitSelect from '@/components/TimeInputWithUnitSelect.vue'
import FormItemLabel from '@/components/FormItemLabel.vue'

export default defineComponent({
  name: 'CoapBasic',
  components: {
    TimeInputWithUnitSelect,
    FormItemLabel,
  },
  props: {
    value: {
      type: Object,
      required: false,
      default: () => ({}),
    },
  },
  setup(props, context) {
    const createDefault = () => ({
      connection_required: false,
      heartbeat: '30s',
      notify_type: 'qos',
      enable_stats: true,

      subscribe_qos: 'coap',
      publish_qos: 'coap',
      mountpoint: '',
    })
    let cValueDefault = createDefault()

    const { t } = useI18n()

    const cValue = reactive(_.merge(cValueDefault, props.value))

    const checkHeartBeat = (source) => {
      if (!source.connection_required) {
        Reflect.deleteProperty(source, 'heartbeat')
      } else if (source.connection_required && !source.heartbeat) {
        source.heartbeat = createDefault().heartbeat
      }
      return source
    }

    watch(
      () => cValue.connection_required,
      () => {
        context.emit('update:value', checkHeartBeat(cValue))
      },
    )
    onMounted(() => {
      context.emit('update:value', checkHeartBeat(cValue))
    })

    return {
      tl: (key, collection = 'Gateway') => t(collection + '.' + key),
      createDefault,
      cValueDefault,
      cValue,
    }
  },
})
</script>
