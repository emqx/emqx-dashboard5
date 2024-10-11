<template>
  <div>
    <el-form label-position="top">
      <el-row :gutter="30">
        <el-col :span="12">
          <el-form-item :label="tl('maxHeader')">
            <CustomInputNumber
              v-model.number="sValue.frame.max_headers"
              :placeholder="String(sValueDefault.frame.max_headers)"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="tl('maxHeaderLen')">
            <CustomInputNumber
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
              :enabled-units="['s']"
              :number-placeholder="parseInt(sValueDefault.idle_timeout).toString()"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="tl('useLog')">
            <el-select v-model="sValue.enable_stats">
              <el-option :value="true" label="true" />
              <el-option :value="false" label="false" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12" />
        <el-col :span="12">
          <el-form-item :label="tl('mountPoint')">
            <el-input v-model="sValue.mountpoint" :placeholder="sValueDefault.mountpoint" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import CustomInputNumber from '@/components/CustomInputNumber.vue'
import TimeInputWithUnitSelect from '@/components/TimeInputWithUnitSelect.vue'
import _ from 'lodash'
import { onMounted, reactive, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps<{
  value?: {
    frame?: {
      max_headers?: number
      max_headers_length?: number
      max_body_length?: number
    }
    idle_timeout?: string
    enable_stats?: boolean
    mountpoint?: string
  }
}>()

const emit = defineEmits(['update:value'])

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

const sValueDefault = createDefault()

const { t } = useI18n()

const sValue = reactive(_.merge(createDefault(), props.value))

watch(
  () => _.cloneDeep(sValue),
  (v) => {
    emit('update:value', v)
  },
)

onMounted(() => {
  emit('update:value', sValue)
})

const tl = (key: string, collection = 'Gateway') => t(collection + '.' + key)
</script>

<style lang="scss" scoped>
.part-header {
  margin-bottom: 20px;
}
</style>
