<template>
  <div>
    <el-form :model="topicModel" ref="topicForm" :rules="topicRules">
      <el-table :data="topicList">
        <el-table-column :label="'Topic ID'">
          <template #default="{ row, $index }">
            <el-form-item :prop="`[${$index}].id`">
              <el-input v-model="row.id"></el-input>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column :label="'Topic'">
          <template #default="{ row, $index }">
            <el-form-item :prop="`[${$index}].topic`">
              <el-input v-model="row.topic"></el-input>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column width="80">
          <template #header="scope">
            <el-button size="small" @click="addTopic()" :disabled="disableAdd(scope)">
              {{ $t('Base.add') }}
            </el-button>
          </template>
          <template #default="{ row }">
            <el-button size="small" @click="delTopic(row)">
              {{ $t('Base.delete') }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form>
  </div>
</template>

<script>
import { computed, defineComponent, onMounted, ref, watch, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  name: 'TopicEditList',
  emits: ['update:passed', 'update:list'],
  props: {
    list: {
      type: Array,
      required: false,
      default: () => [],
    },
    passed: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  setup(props, context) {
    let topicForm = ref(null)
    let topicList = ref(props.list)
    let topicModel = computed(() => {
      let model = {}
      topicList.value.forEach((v, k) => {
        model[k] = v
      })
      return model
    })

    let formPassed = ref(props.passed)
    const { t } = useI18n()
    let topicRules = ref({})

    const findUniqueOverflow = (nums, max) => {
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
      let ids = [0]
      Array.prototype.forEach.call(topicList.value, (v) => {
        ids.push(+v.id || 0)
      })
      let maxCandidate = Math.max(...ids) + 1
      let maxNum = 65535
      if (maxCandidate > maxNum) {
        maxCandidate = findUniqueOverflow(ids, maxNum)
      }
      topicList.value.push({
        id: maxCandidate,
        topic: '',
      })

      setTopicRules()
    }

    const disableAdd = () => {
      return topicList.value.length >= 10
    }

    const delTopic = (row) => {
      topicList.value.forEach((v, k) => {
        if (v === row) {
          topicList.value.splice(k, 1)
        }
      })
      setTopicRules()
    }

    const setTopicRules = () => {
      let len = topicList.value.length || 0
      let newRules = {}
      for (let x = 0; x < len; x++) {
        newRules[x] = {
          id: [
            {
              required: true,
              message: 'required',
              trigger: ['blur', 'change'],
            },
            {
              validator: (rule, value, callback) => {
                let identical = topicList.value.filter((v) => {
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

    const validateForm = () => {
      nextTick(async () => {
        let res = await topicForm.value.validate().catch(() => {})
        if (res) {
          formPassed.value = true
          context.emit('update:passed', true)
        } else {
          formPassed.value = false
          context.emit('update:passed', false)
        }
      })
    }

    watch(topicList.value, (v) => {
      context.emit('update:list', v)
      validateForm()
    })

    onMounted(() => {
      setTopicRules()
      validateForm()
    })

    return {
      tl: (key, collection = 'Gateway') => t(collection + '.' + key),
      topicList,
      addTopic,
      disableAdd,
      delTopic,
      topicModel,
      topicForm,
      topicRules,
    }
  },
})
</script>

<style lang="scss" scoped>
.el-form-item {
  margin: 0;
}
</style>
