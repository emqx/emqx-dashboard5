<template>
  <div>
    <el-form class="tong-form" label-width="200px">
      <el-row :gutter="30">
        <el-col :span="12">
          <el-form-item :label="tl('maxHeader')">
            <el-input
              type="number"
              v-model.number="sValue.frame.max_headers"
              :placeholder="String(sValueDefault.frame.max_headers)"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="tl('maxHeaderLen')">
            <el-input
              type="number"
              v-model.number="sValue.frame.max_headers_length"
              :placeholder="String(sValueDefault.frame.max_headers_length)"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="tl('maxBodyLen')">
            <CustomInputNumber
              v-model.number="sValue.frame.max_body_length"
              :min="0"
              :placeholder="String(sValueDefault.frame.max_body_length)"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="tl('idleTime')">
            <TimeInputWithUnitSelect
              v-model="sValue.idle_timeout"
              :number-placeholder="parseInt(sValueDefault.qmode_time_window).toString()"
              :enabled-units="['s']"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="30">
        <el-col :span="12">
          <el-form-item :label="tl('mountPoint')">
            <el-input v-model="sValue.mountpoint" :placeholder="sValueDefault.mountpoint" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item :label="tl('useLog')">
            <el-switch v-model="sValue.enable_stats" />
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
import CustomInputNumber from '@/components/CustomInputNumber.vue'
import TimeInputWithUnitSelect from '@/components/TimeInputWithUnitSelect.vue'

export default defineComponent({
  name: 'StompBasic',
  components: {
    TimeInputWithUnitSelect,
    CustomInputNumber,
  },
  props: {
    value: {
      type: Object,
      required: false,
      default: () => ({}),
    },
  },
  emits: ['update:value'],
  setup(props, context) {
    const createDefault = () => ({
      frame: {
        max_headers: 10,
        max_headers_length: 1024,
        max_body_length: 8192,
      },
      idle_timeout: '30s',
      enable_stats: true,
      mountpoint: '',
    })
    let sValueDefault = createDefault()

    const { t } = useI18n()

    const sValue = reactive(_.merge(sValueDefault, props.value))

    watch(
      () => _.cloneDeep(sValue),
      (v) => {
        context.emit('update:value', v)
      },
    )
    onMounted(() => {
      context.emit('update:value', sValue)
    })
    return {
      tl: (key, collection = 'Gateway') => t(collection + '.' + key),
      sValue,
      sValueDefault,
    }
  },
})
</script>
<style lang="scss" scoped>
.part-header {
  margin-bottom: 20px;
}
</style>
