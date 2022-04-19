<template>
  <el-card class="app-card">
    <div class="part-header">{{ tl('output') }}</div>
    <div class="sub-block-desc">
      <span>{{ tl('outputDesc') }}</span>
    </div>
    <el-row>
      <el-col :span="14">
        <template v-for="(item, index) in ruleValue.outputs" :key="item">
          <div class="outputs-item">
            <span>
              <img
                :src="getOutputImage(item.function ? item.function : item.split(':')[0])"
                width="80"
              />
            </span>
            <span>
              <div v-if="!item.function">{{ item.split(':')[1] }}</div>
              <div class="output-desc">
                {{ (item.function ? item.function : item.split(':')[0]).toUpperCase() }}
              </div>
            </span>
            <span class="output-op">
              <el-button size="small" @click="openOutputDialog(true, index)">
                {{ $t('Base.edit') }}
              </el-button>
              <el-button size="small" type="danger" plain @click="deleteOutput(index)">
                {{ $t('Base.delete') }}
              </el-button>
            </span>
          </div>
        </template>
        <el-button
          class="btn-add"
          type="primary"
          @click="openOutputDialog(false)"
          plain
          size="large"
        >
          <el-icon><plus /></el-icon>
          <span>{{ tl('addOutput') }}</span>
        </el-button>
      </el-col>
    </el-row>
  </el-card>
  <RuleOutputsDialog
    v-model="showOutputDialog"
    :output="currentOutputItem"
    :output-disable-list="outputDisableList"
    @submit="submitOutput"
  />
</template>

<!-- <script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'RuleOutputs',
})
</script> -->

<script setup lang="ts">
import { defineProps, PropType, computed, defineEmits, ref, Ref, WritableComputedRef } from 'vue'
import { BasicRule, OutputItem, RuleItem } from '@/types/rule'
import useI18nTl from '@/hooks/useI18nTl'
import RuleOutputsDialog from './RuleOutputsDialog.vue'
import { RuleOutput } from '@/types/enum'
import { useI18n } from 'vue-i18n'
import { ElMessageBox as MB } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'

const props = defineProps({
  modelValue: {
    type: Object as PropType<RuleItem | BasicRule>,
    required: true,
  },
})

const emit = defineEmits(['update:modelValue'])

const ruleValue: WritableComputedRef<RuleItem | BasicRule> = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  },
})

const { t } = useI18n()
const { tl } = useI18nTl('RuleEngine')
const showOutputDialog = ref(false)
const outputDisableList: Ref<Array<string>> = ref([])
const editIndex: Ref<number | undefined> = ref(undefined)
const currentOutputItem: Ref<OutputItem | undefined> = ref(undefined)

const calcDisableList = () => {
  outputDisableList.value = []
  if (!Array.isArray(ruleValue.value.outputs)) {
    return
  }
  ruleValue.value.outputs?.forEach((v: OutputItem) => {
    if (typeof v === 'string') {
      outputDisableList.value.push(v)
    } else if (typeof v === 'object') {
      //republish can be duplicated
      if (v.function === RuleOutput.Republish) return
      v.function && outputDisableList.value.push(v.function)
    }
  })
}

const openOutputDialog: (edit: boolean, itemIndex?: number | undefined) => void = async (
  edit = false,
  itemIndex,
) => {
  showOutputDialog.value = true
  let item: OutputItem | undefined
  editIndex.value = itemIndex
  if (itemIndex !== undefined && Array.isArray(ruleValue.value.outputs)) {
    item = ruleValue.value.outputs?.[itemIndex]
  }
  if (edit) {
    currentOutputItem.value = item
  } else {
    currentOutputItem.value = undefined
  }
  calcDisableList()
}

const deleteOutput = async (itemIndex: number | undefined) => {
  await MB.confirm(t('Base.confirmDelete'), {
    confirmButtonText: t('Base.confirm'),
    cancelButtonText: t('Base.cancel'),
    type: 'warning',
  })
  if (itemIndex !== undefined && Array.isArray(ruleValue.value.outputs)) {
    ruleValue.value.outputs?.splice(itemIndex, 1)
    calcDisableList()
  }
}

const submitOutput = (opObj: OutputItem) => {
  const output = ruleValue.value.outputs || []
  if (Array.isArray(output)) {
    if (!currentOutputItem.value) {
      output.push(opObj)
    } else {
      editIndex.value !== undefined && output.splice(editIndex.value, 1, opObj)
    }
  }
  calcDisableList()
}

const getOutputImage = (item: string) => {
  try {
    return require(`@/assets/img/${item}.png`)
  } catch (e) {
    //May it be a user defined module
    console.log('ImgErr:', e)
  }
}
</script>

<style lang="scss" scoped>
.outputs-item {
  height: 92px;
  border: 1px solid var(--color-border-primary);
  margin-top: 10px;
  display: flex;
  align-items: center;
  padding: 10px;
  box-sizing: border-box;
  border-radius: var(--el-border-radius-base);

  span:nth-child(2) {
    flex-grow: 1;

    div {
      line-height: 200%;
    }

    .output-desc {
      color: #5b5b5b;
    }
  }

  .output-op {
    padding: 0 10px;
    visibility: hidden;
  }

  &:first-of-type {
    margin-top: 20px;
  }
  &:hover {
    border-color: var(--el-color-primary);
    cursor: pointer;
    span {
      color: var(--el-color-primary);
      visibility: visible;
    }
  }
}

.btn-add {
  margin-top: 24px;
  :deep(span) {
    display: flex;
    align-items: center;
  }
  .el-icon {
    font-size: 16px;
  }
}

.edit-output {
  color: var(--el-color-primary);
  line-height: 50px;
  cursor: pointer;
}
</style>
