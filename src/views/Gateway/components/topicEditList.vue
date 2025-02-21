<template>
  <div>
    <el-form
      ref="TopicFormCom"
      :model="topicModel"
      :rules="topicRules"
      :validate-on-rule-change="false"
    >
      <el-table :data="topicList" class="shadow-none">
        <el-table-column label="Topic ID">
          <template #default="{ row, $index }">
            <el-form-item :prop="`[${$index}].id`">
              <el-input v-model="row.id" @blur="validateForm" />
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column :label="t('Base.topic')">
          <template #default="{ row, $index }">
            <el-form-item :prop="`[${$index}].topic`">
              <el-input v-model="row.topic" @blur="validateForm" />
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column width="80">
          <template #header>
            <el-button link type="primary" @click="addTopic()" :disabled="disableAdd()">
              {{ $t('Base.add') }}
            </el-button>
          </template>
          <template #default="{ row }">
            <el-button link type="primary" @click="delTopic(row)">
              {{ $t('Base.delete') }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
type TopicItem = { id: number; topic: string }

const props = withDefaults(
  defineProps<{
    list: Array<TopicItem>
    passed: boolean
  }>(),
  {
    list: () => [],
    passed: false,
  },
)

const emit = defineEmits<{
  (event: 'update:passed', value: boolean): void
  (event: 'update:list', value: Array<TopicItem>): void
}>()

const TopicFormCom = ref()
const topicList = ref<Array<TopicItem>>(props.list)
const topicModel = computed(() => {
  const model: Record<number, any> = {}
  topicList.value.forEach((v, k) => {
    model[k] = v
  })
  return model
})

const formPassed = ref(props.passed)
const { t } = useI18n()
const topicRules = ref({})

const findUniqueOverflow = (nums: number[], max: number) => {
  let num
  for (let i = 1, y = max; i < y; i++) {
    if (!Array.prototype.includes.call(nums, i)) {
      num = i
      break
    }
  }
  return num
}

const addTopic = () => {
  const ids = [0]
  Array.prototype.forEach.call(topicList.value, (v) => {
    ids.push(+v.id || 0)
  })
  let maxCandidate: number | undefined = Math.max(...ids) + 1
  const maxNum = 65535
  if (maxCandidate > maxNum) {
    maxCandidate = findUniqueOverflow(ids, maxNum)
  }
  if (maxCandidate === undefined) {
    return
  }
  topicList.value.push({ id: maxCandidate, topic: '' })
  setTopicRules()
}

const disableAdd = () => {
  return topicList.value.length >= 10
}

const delTopic = (row: any) => {
  topicList.value.forEach((v, k) => {
    if (v === row) {
      topicList.value.splice(k, 1)
    }
  })
  setTopicRules()
}

const setTopicRules = () => {
  const len = topicList.value.length || 0
  const newRules: Record<number, any> = {}
  for (let x = 0; x < len; x++) {
    newRules[x] = {
      id: [
        {
          required: true,
          message: 'required',
          trigger: ['blur', 'change'],
        },
        {
          validator: (rule: any, value: any, callback: any) => {
            const identical = topicList.value.filter((v) => {
              return v.id == value
            })
            if (identical.length > 1) {
              callback(new Error('identical'))
            } else {
              callback()
            }
          },
          trigger: ['blur', 'change'],
        },
      ],
      topic: [
        {
          required: true,
          message: 'required',
          trigger: ['blur', 'change'],
        },
      ],
    }
  }

  topicRules.value = newRules
  // validateForm()
}

const validateForm = async () => {
  await nextTick()
  try {
    await TopicFormCom.value.validate()
    formPassed.value = true
  } catch (error) {
    formPassed.value = false
  } finally {
    emit('update:passed', formPassed.value)
  }
}

let preTopicList: any[] = []
watch(topicList.value, (v) => {
  emit('update:list', v)
  if (preTopicList.length === v.length) {
    validateForm()
  } else {
    preTopicList = cloneDeep(v)
  }
})

onMounted(() => {
  setTopicRules()
  validateForm()
})
</script>

<style lang="scss" scoped>
.el-form-item {
  margin: 0;
}
</style>
