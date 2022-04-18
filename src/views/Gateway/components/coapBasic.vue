<template>
  <div>
    <el-form label-position="top">
      <div class="part-header">
        {{ tl('basic') }}
      </div>
      <el-row :gutter="30">
        <el-col :span="12">
          <el-form-item :label="tl('connectionRequire')">
            <el-select v-model="cValue.connection_required">
              <el-option :value="true"></el-option>
              <el-option :value="false"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="tl('notifyType')">
            <el-select v-model="cValue.notify_type">
              <el-option value="qos"></el-option>
              <el-option value="con"></el-option>
              <el-option value="non"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="cValue.connection_required === true">
          <el-form-item :label="tl('heartbeat')">
            <el-input
              v-model.number="cValue.heartbeat[0]"
              :placeholder="String(cValueDefault.heartbeat[0])"
            >
              <template #append>
                <el-select v-model="cValue.heartbeat[1]">
                  <el-option value="s"></el-option>
                </el-select>
              </template>
            </el-input> </el-form-item
        ></el-col>
        <el-col :span="12">
          <el-form-item :label="tl('useLog')">
            <el-select v-model="cValue.enable_stats">
              <el-option :value="true"></el-option>
              <el-option :value="false"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="tl('subQos')">
            <el-select v-model="cValue.subscribe_qos">
              <el-option value="coap"></el-option>
              <el-option value="qos0"></el-option>
              <el-option value="qos1"></el-option>
              <el-option value="qos2"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="tl('pubQos')">
            <el-select v-model="cValue.publish_qos">
              <el-option value="coap"></el-option>
              <el-option value="qos0"></el-option>
              <el-option value="qos1"></el-option>
              <el-option value="qos2"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <div class="part-header">{{ tl('mountSetting') }}</div>
      <el-row :gutter="30">
        <el-col :span="12">
          <el-form-item :label="tl('mountPoint')">
            <el-input
              v-model="cValue.mountpoint"
              :placeholder="cValueDefault.mountpoint"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { defineComponent, onMounted, reactive, watch } from 'vue'
import _ from 'lodash'
import { transformUnitArrayToStr, transformStrToUnitArray } from '@/common/utils'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  name: 'CoapBasic',
  props: {
    value: {
      type: Object,
      required: false,
      default: () => ({}),
    },
  },
  setup(props, context) {
    let cValueDefault = {
      connection_required: false,
      heartbeat: [30, 's'],
      notify_type: 'qos',
      enable_stats: true,

      subscribe_qos: 'coap',
      publish_qos: 'coap',
      mountpoint: '',
    }

    const { t } = useI18n()

    const cValue = reactive(
      _.merge(cValueDefault, transformStrToUnitArray(props.value, ['heartbeat'])),
    )

    const checkHeartBeat = (source) => {
      if (!source.connection_required) {
        Reflect.deleteProperty(source, 'heartbeat')
      }
      return source
    }

    watch(
      () => _.cloneDeep(cValue),
      (v) => {
        context.emit('update:value', checkHeartBeat(transformUnitArrayToStr(v)))
      },
    )
    onMounted(() => {
      context.emit('update:value', checkHeartBeat(transformUnitArrayToStr(cValue)))
    })

    return {
      tl: (key, collection = 'Gateway') => t(collection + '.' + key),
      cValueDefault,
      cValue,
    }
  },
})
</script>

<style lang="scss" scoped></style>
