<template>
  <div class="authz-rules-list-container">
    <ul class="authz-rules-list">
      <li v-for="(row, index) in list" :key="index" class="rule-item">
        <el-card>
          <AuthzRuleForm v-model="list[index]" :is-edit="isEdit" :type="type">
            <template #operation>
              <slot name="operation" v-bind="{ $index: index, row }" />
            </template>
          </AuthzRuleForm>
        </el-card>
      </li>
    </ul>
    <slot name="add-button" />
  </div>
</template>

<script setup lang="ts">
import { BuiltInDBRule } from '@/types/auth'
import { BuiltInDBType } from '@/types/enum'
import AuthzRuleForm from './AuthzRuleForm.vue'

const props = withDefaults(
  defineProps<{
    data: Array<BuiltInDBRule>
    isEdit?: boolean
    type?: BuiltInDBType
  }>(),
  {
    type: BuiltInDBType.All,
  },
)
const emit = defineEmits<{
  (e: 'update:modelValue', v: Array<BuiltInDBRule>): void
}>()

const list = computed({
  get() {
    return props.data
  },
  set(value) {
    emit('update:modelValue', value)
  },
})
</script>

<style lang="scss">
.authz-rules-list-container {
  width: 100%;
}
.authz-rules-list {
  list-style: none;
  margin: 0;
  padding: 0;
  width: 100%;
  .rule-item {
    &:not(:last-child) {
      margin-bottom: 8px;
    }
  }
}
</style>
