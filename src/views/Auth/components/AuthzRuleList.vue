<template>
  <div class="authz-rules-list-container">
    <ul class="authz-rules-list">
      <li v-for="(row, index) in list" :key="index" class="rule-item">
        <el-card :class="{ 'is-error': duplicatedResult.includes(index) }">
          <AuthzRuleForm
            :ref="(el) => handleRef(el as any, index)"
            v-model="list[index]"
            :is-edit="isEdit"
            :type="type"
            @change="handleDataChanged"
          >
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

const FormRefArr = ref<Array<InstanceType<typeof AuthzRuleForm> | null>>([])
const handleRef = (el: InstanceType<typeof AuthzRuleForm> | null, index: number) => {
  FormRefArr.value[index] = el
}

const { tl } = useI18nTl('Auth')

/**
 * which index is duplicated
 */
const duplicatedResult = ref<Array<number>>([])
const checkDuplicate = async () => {
  duplicatedResult.value = []
  for (let i = 0; i < list.value.length; i++) {
    const currentItem = list.value[i]
    for (let j = i + 1; j < list.value.length; j++) {
      const nextItem = list.value[j]
      if (isEqual(currentItem, nextItem)) {
        duplicatedResult.value.push(j)
      }
    }
  }
  const hasDuplicated = duplicatedResult.value.length > 0
  if (hasDuplicated) {
    ElMessage.error(tl('duplicatedPermission'))
    await nextTick()
    const firstError = document.querySelector('.authz-rules-list .is-error')
    firstError?.scrollIntoView({ behavior: 'smooth' })
  }
  return hasDuplicated ? Promise.reject() : Promise.resolve()
}

const validate = async () => {
  try {
    await Promise.all(
      FormRefArr.value.map((el) => {
        if (el?.validate) {
          return el.validate()
        }
        return Promise.resolve()
      }),
    )
    await checkDuplicate()
    return Promise.resolve()
  } catch (error) {
    return Promise.reject(error)
  }
}

const handleDataChanged = () => {
  if (duplicatedResult.value.length > 0) {
    checkDuplicate()
  }
}

defineExpose({
  validate,
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
  .is-error {
    border-color: var(--el-color-error);
  }
}
</style>
