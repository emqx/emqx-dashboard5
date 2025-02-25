<template>
  <ul class="form-topic-list-vertical">
    <li class="topic-item" v-for="(item, $index) in topics" :key="$index">
      <el-form-item :prop="`${prop}.${$index}`" :rules="rules">
        <el-input v-model="topics[$index]" />
        <div class="btn-container vertical-align-center">
          <el-button
            class="btn-del"
            :icon="Delete"
            :disabled="(!allowEmpty && topics.length <= 1) || !$hasPermission('delete')"
            @click="delTopic($index)"
          />
          <el-button
            v-if="$index === topics.length - 1"
            class="btn-add"
            :icon="Plus"
            :disabled="!$hasPermission('post')"
            @click="addTopic"
          />
        </div>
      </el-form-item>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { Delete, Plus } from '@element-plus/icons-vue'
import type { FormItemRule } from 'element-plus'

const props = defineProps<{
  modelValue: string[]
  allowEmpty?: boolean
  rules?: Array<FormItemRule>
  prop?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string[]): void
}>()

const topics = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  },
})

const addTopic = () => {
  topics.value.push('')
}

const delTopic = (index: number) => {
  topics.value.splice(index, 1)
}
</script>
