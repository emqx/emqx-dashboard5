<template>
  <div>
    <el-form label-position="top">
      <div class="part-header">
        {{ tl('basic') }}
      </div>
      <el-row :gutter="30">
        <el-col :span="12">
          <el-form-item :label="'Gateway ID'">
            <el-input
              :placeholder="String(mValueDefault.gateway_id)"
              v-model="mValue.gateway_id"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="tl('broadcast')">
            <el-select v-model="mValue.broadcast">
              <el-option :value="true"></el-option>
              <el-option :value="false"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="tl('qos3')">
            <el-select v-model="mValue.enable_qos3">
              <el-option :value="true"></el-option>
              <el-option :value="false"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="tl('idleTime')">
            <el-input
              :placeholder="String(mValueDefault.idle_timeout[0])"
              v-model.number="mValue.idle_timeout[0]"
            >
              <template #append>
                <el-select v-model="mValue.idle_timeout[1]">
                  <el-option value="s"></el-option>
                </el-select>
              </template>
            </el-input> </el-form-item
        ></el-col>
        <el-col :span="12">
          <el-form-item :label="tl('useLog')">
            <el-select v-model="mValue.enable_stats">
              <el-option :value="true"></el-option>
              <el-option :value="false"></el-option>
            </el-select> </el-form-item
        ></el-col>
      </el-row>
      <div class="part-header">
        {{ tl('predefinedTopic') }}
      </div>
      <topic-edit-list
        v-model:list="mValue.predefined"
        v-model:passed="formPassed"
      ></topic-edit-list>
      <div class="part-header">{{ tl('mountSetting') }}</div>
      <el-row :gutter="30">
        <el-col :span="12">
          <el-form-item :label="tl('mountPoint')">
            <el-input
              :placeholder="mValueDefault.mountpoint"
              v-model="mValue.mountpoint"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { defineComponent, onMounted, reactive, ref, watch } from 'vue'
import topicEditList from './topicEditList.vue'
import _ from 'lodash'
import { transformUnitArrayToStr, transformStrToUnitArray } from '@/common/utils'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  components: { topicEditList },
  name: 'MqttsnBasic',
  props: {
    value: {
      type: Object,
      required: false,
      default: () => ({}),
    },
  },
  setup(props, context) {
    let mValueDefault = {
      idle_timeout: [30, 's'],
      gateway_id: 1,
      broadcast: true,
      enable_qos3: true,
      enable_stats: true,
      predefined: [],
      mountpoint: '',
    }

    const { t } = useI18n()

    const mValue = reactive(
      _.merge(mValueDefault, transformStrToUnitArray(props.value, ['idle_timeout'])),
    )

    const formPassed = ref(false)

    watch(
      () => _.cloneDeep(mValue),
      (v) => {
        context.emit('update:value', transformUnitArrayToStr(v))
      },
    )
    onMounted(() => {
      context.emit('update:value', transformUnitArrayToStr(mValue))
    })

    return {
      tl: (key, collection = 'Gateway') => t(collection + '.' + key),
      mValueDefault,
      mValue,
      formPassed,
    }
  },
})
</script>

<style lang="scss" scoped>
.part-header {
  margin-bottom: 20px;
}
</style>
