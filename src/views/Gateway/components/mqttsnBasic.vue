<template>
  <div class="mqttsn-basic">
    <el-form label-position="top" :model="mValue">
      <el-row :gutter="30">
        <el-col :span="12" prop="gateway_id">
          <el-form-item :label="'Gateway ID'">
            <CustomInputNumber v-model.number="mValue.gateway_id" :min="0" :max="255" />
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
      <topic-edit-list
        class="topic-list"
        v-model:list="mValue.predefined"
        v-model:passed="formPassed"
      />

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

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, watch } from 'vue'
import topicEditList from './topicEditList.vue'
import _ from 'lodash'
import { useI18n } from 'vue-i18n'
import TimeInputWithUnitSelect from '@/components/TimeInputWithUnitSelect.vue'
import CustomInputNumber from '@/components/CustomInputNumber.vue'

export default defineComponent({
  components: { topicEditList, TimeInputWithUnitSelect, CustomInputNumber },
  name: 'MqttsnBasic',
  props: {
    value: {
      type: Object,
      required: false,
      default: () => ({}),
    },
  },
  setup(props, context) {
    const createDefaultValue = () => ({
      idle_timeout: '30s',
      gateway_id: 1,
      broadcast: true,
      enable_qos3: true,
      enable_stats: true,
      predefined: [],
      mountpoint: '',
    })

    const mValueDefault = createDefaultValue()

    const { t } = useI18n()

    const mValue = reactive(_.merge(createDefaultValue(), props.value))

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
      tl: (key: string, collection = 'Gateway') => t(collection + '.' + key),
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
.topic-list {
  margin-bottom: 24px;
}
</style>
