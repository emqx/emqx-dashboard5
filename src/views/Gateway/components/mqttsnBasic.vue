<template>
  <div>
    <el-form label-position="top">
      <el-row :gutter="30">
        <el-col :span="12">
          <el-form-item :label="'Gateway ID'">
            <el-input :placeholder="String(mValueDefault.gateway_id)" v-model="mValue.gateway_id" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="tl('broadcast')">
            <el-select v-model="mValue.broadcast">
              <el-option :value="true" label="true" />
              <el-option :value="false" label="false" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="tl('qos3')">
            <el-select v-model="mValue.enable_qos3">
              <el-option :value="true" label="true" />
              <el-option :value="false" label="false" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="tl('idleTime')">
            <TimeInputWithUnitSelect
              v-model="mValue.idle_timeout"
              :number-placeholder="parseInt(mValueDefault.idle_timeout).toString()"
              :enabled-units="['s']"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="tl('useLog')">
            <el-select v-model="mValue.enable_stats">
              <el-option :value="true" label="true" />
              <el-option :value="false" label="false" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <div class="part-header">
        {{ tl('predefinedTopic') }}
      </div>
      <topic-edit-list v-model:list="mValue.predefined" v-model:passed="formPassed" />

      <el-row :gutter="30">
        <el-col :span="12">
          <el-form-item :label="tl('mountPoint')">
            <el-input :placeholder="mValueDefault.mountpoint" v-model="mValue.mountpoint" />
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
import { useI18n } from 'vue-i18n'
import TimeInputWithUnitSelect from '@/components/TimeInputWithUnitSelect.vue'

export default defineComponent({
  components: { topicEditList, TimeInputWithUnitSelect },
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
      idle_timeout: '30s',
      gateway_id: 1,
      broadcast: true,
      enable_qos3: true,
      enable_stats: true,
      predefined: [],
      mountpoint: '',
    }

    const { t } = useI18n()

    const mValue = reactive(_.merge(mValueDefault, props.value))

    const formPassed = ref(false)

    watch(
      () => _.cloneDeep(mValue),
      (v) => {
        context.emit('update:value', v)
      },
    )
    onMounted(() => {
      context.emit('update:value', mValue)
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
