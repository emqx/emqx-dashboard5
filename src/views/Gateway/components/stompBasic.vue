<template>
  <div>
    <el-form label-position="top">
      <div class="part-header">
        {{ tl('basic') }}
      </div>
      <el-row :gutter="30">
        <el-col :span="12">
          <el-form-item :label="tl('maxHeader')">
            <el-input
              type="number"
              v-model.number="sValue.frame.max_headers"
              :placeholder="String(sValueDefault.frame.max_headers)"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="tl('maxHeaderLen')">
            <el-input
              type="number"
              v-model.number="sValue.frame.max_headers_length"
              :placeholder="String(sValueDefault.frame.max_headers_length)"
            ></el-input> </el-form-item
        ></el-col>
        <el-col :span="12">
          <el-form-item :label="tl('maxBodyLen')">
            <el-input
              type="number"
              v-model.number="sValue.frame.max_body_length"
              :placeholder="String(sValueDefault.frame.max_body_length)"
            ></el-input> </el-form-item
        ></el-col>
        <el-col :span="12">
          <el-form-item :label="tl('idleTime')">
            <el-input
              v-model.number="sValue.idle_timeout[0]"
              :placeholder="String(sValueDefault.idle_timeout[0])"
            >
              <template #append>
                <el-select v-model="sValueDefault.idle_timeout[1]">
                  <el-option value="s"></el-option>
                </el-select>
              </template>
            </el-input> </el-form-item
        ></el-col>
        <el-col :span="12">
          <el-form-item :label="tl('useLog')">
            <el-select v-model="sValue.enable_stats">
              <el-option :value="true"></el-option>
              <el-option :value="false"></el-option>
            </el-select> </el-form-item
        ></el-col>
      </el-row>
      <div class="part-header">{{ tl('mountSetting') }}</div>
      <el-row :gutter="30">
        <el-col :span="12">
          <el-form-item :label="tl('mountPoint')">
            <el-input
              v-model="sValue.mountpoint"
              :placeholder="sValueDefault.mountpoint"
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
  name: 'StompBasic',
  props: {
    value: {
      type: Object,
      required: false,
      default: () => ({}),
    },
  },
  emits: ['update:value'],
  setup(props, context) {
    let sValueDefault = {
      frame: {
        max_headers: 10,
        max_headers_length: 1024,
        max_body_length: 8192,
      },
      idle_timeout: [30, 's'],
      enable_stats: true,
      mountpoint: '',
    }

    const { t } = useI18n()

    const sValue = reactive(
      _.merge(sValueDefault, transformStrToUnitArray(props.value, ['idle_timeout'])),
    )

    watch(
      () => _.cloneDeep(sValue),
      (v) => {
        context.emit('update:value', transformUnitArrayToStr(v))
      },
    )
    onMounted(() => {
      context.emit('update:value', transformUnitArrayToStr(sValue))
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
