<template>
  <div>
    <el-form label-position="top">
      <div class="part-header">
        {{ tl('basic') }}
      </div>
      <el-row :gutter="30">
        <el-col :span="12">
          <el-form-item :label="tl('resDirectory')">
            <el-input v-model="lValue.xml_dir" :placeholder="lValueDefault.xml_dir"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="tl('qmodewindow')">
            <el-input
              :placeholder="String(lValueDefault.qmode_time_window[0])"
              v-model.number="lValue.qmode_time_window[0]"
            >
              <template #append>
                <el-select v-model="lValue.qmode_time_window[1]">
                  <el-option value="s"></el-option>
                </el-select>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="tl('minLifetime')">
            <el-input
              :placeholder="String(lValueDefault.lifetime_min[0])"
              v-model.number="lValue.lifetime_min[0]"
              ><template #append>
                <el-select v-model="lValue.lifetime_min[1]">
                  <el-option value="s"></el-option>
                  <el-option value="m"></el-option>
                  <el-option value="h"></el-option>
                  <el-option value="d"></el-option>
                </el-select>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="tl('maxLifetime')">
            <el-input
              :placeholder="String(lValueDefault.lifetime_max[0])"
              v-model.number="lValue.lifetime_max[0]"
            >
              <template #append>
                <el-select v-model="lValue.lifetime_max[1]">
                  <el-option value="s"></el-option>
                  <el-option value="m"></el-option>
                  <el-option value="h"></el-option>
                  <el-option value="d"></el-option>
                </el-select>
              </template> </el-input
          ></el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="tl('aObserve')">
            <el-select v-model="lValue.auto_observe">
              <el-option :value="true"></el-option>
              <el-option :value="false"></el-option> </el-select
          ></el-form-item> </el-col
        ><el-col :span="12">
          <el-form-item :label="tl('updateStrategy')">
            <el-select v-model="lValue.update_msg_publish_condition">
              <el-option value="always"></el-option>
              <el-option value="contains_object_list"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="tl('useLog')">
            <el-select v-model="lValue.enable_stats">
              <el-option :value="true"></el-option>
              <el-option :value="false"></el-option>
            </el-select> </el-form-item></el-col
        ><el-col :span="12">
          <el-form-item :label="tl('idleTime')">
            <el-input
              v-model.number="lValue.idle_timeout[0]"
              :placeholder="String(lValueDefault.idle_timeout[0])"
            >
              <template #append>
                <el-select v-model="lValue.idle_timeout[1]">
                  <el-option value="s"></el-option>
                </el-select>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <div class="part-header">{{ tl('mountSetting') }}</div>
      <el-row :gutter="30">
        <el-col :span="12">
          <el-form-item :label="tl('mountPoint')">
            <el-input
              v-model="lValue.mountpoint"
              :placeholder="lValueDefault.mountpoint"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="tl('trCommand')">
            <el-input
              :placeholder="lValueDefault.translators.command.topic"
              v-model="lValue.translators.command.topic"
            ></el-input
          ></el-form-item> </el-col
        ><el-col :span="12">
          <el-form-item :label="tl('trResponse')"
            ><el-input
              :placeholder="lValueDefault.translators.response.topic"
              v-model="lValue.translators.response.topic"
            ></el-input
          ></el-form-item> </el-col
        ><el-col :span="12">
          <el-form-item :label="tl('trNotify')"
            ><el-input
              :placeholder="lValueDefault.translators.notify.topic"
              v-model="lValue.translators.notify.topic"
            ></el-input
          ></el-form-item> </el-col
        ><el-col :span="12">
          <el-form-item :label="tl('trRegister')"
            ><el-input
              :placeholder="lValueDefault.translators.register.topic"
              v-model="lValue.translators.register.topic"
            ></el-input
          ></el-form-item> </el-col
        ><el-col :span="12">
          <el-form-item :label="tl('trUpdate')"
            ><el-input
              :placeholder="lValueDefault.translators.update.topic"
              v-model="lValue.translators.update.topic"
            ></el-input
          ></el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, watch } from 'vue'
import _ from 'lodash'
import { transformUnitArrayToStr, transformStrToUnitArray } from '@/common/utils'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  name: 'LwBasic',
  props: {
    value: {
      type: Object,
      required: false,
      default: () => ({}),
    },
  },
  setup(props, context) {
    let lValueDefault = {
      idle_timeout: [30, 's'],
      xml_dir: 'etc/lwm2m_xml/',
      qmode_time_window: [22, 's'],
      lifetime_min: [1, 's'],
      lifetime_max: [86400, 's'],
      auto_observe: true,
      enable_stats: true,
      update_msg_publish_condition: 'contains_object_list',
      mountpoint: '',
      translators: {
        command: { topic: 'dn/#', qos: 0 },
        response: { topic: 'up/resp', qos: 0 },
        notify: { topic: 'up/notify', qos: 0 },
        register: { topic: 'up/resp', qos: 0 },
        update: { topic: 'up/update', qos: 0 },
      },
    }
    const { t } = useI18n()

    const lValue = reactive(
      _.merge(
        lValueDefault,
        transformStrToUnitArray(props.value, [
          'idle_timeout',
          'qmode_time_window',
          'lifetime_min',
          'lifetime_max',
        ]),
      ),
    )

    watch(
      () => _.cloneDeep(lValue),
      (v) => {
        context.emit('update:value', transformUnitArrayToStr(v))
      },
    )
    onMounted(() => {
      context.emit('update:value', transformUnitArrayToStr(lValue))
    })

    return {
      tl: (key: string, collection = 'Gateway') => t(collection + '.' + key),
      lValueDefault,
      lValue,
    }
  },
})
</script>

<style lang="scss" scoped></style>
