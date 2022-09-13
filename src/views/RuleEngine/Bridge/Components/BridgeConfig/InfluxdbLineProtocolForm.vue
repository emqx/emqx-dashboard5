<template>
  <el-row class="influx-db-line-protocol-form" :gutter="26">
    <el-col :span="12">
      <el-form-item label="Measurement" class="is-required" prop="measurement">
        <el-input v-model="measurement" />
      </el-form-item>
    </el-col>
    <el-col :span="12">
      <el-form-item label="Timestamp">
        <el-input v-model="timestamp" />
      </el-form-item>
    </el-col>
    <el-col :span="24">
      <el-form-item label="Fields" class="is-required">
        <InfluxdbFieldsEditor v-model="fieldMap" />
      </el-form-item>
    </el-col>
    <el-col :span="24">
      <el-form-item label="Tags">
        <KeyAndValueEditor v-model="tagMap" />
      </el-form-item>
    </el-col>
  </el-row>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'InfluxDBLineProtocolForm',
})
</script>

<script setup lang="ts">
import { defineProps, ref } from 'vue'
import KeyAndValueEditor from '@/components/KeyAndValueEditor.vue'
import InfluxdbFieldsEditor from './InfluxdbFieldsEditor.vue'

// TODO:the best implementation is bi-bind model value in time, maybe sometime can refactor

const props = defineProps({
  modelValue: {
    type: String,
  },
})

const measurement = ref('')
const timestamp = ref(undefined)
const fieldMap = ref({})
const tagMap = ref({})
</script>

<style lang="scss"></style>
