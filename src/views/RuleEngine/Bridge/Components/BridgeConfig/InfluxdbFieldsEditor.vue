<template>
  <el-table class="influxdb-fields-editor shadow-none" :data="tableData">
    <el-table-column :label="keyValueLabel.key">
      <template #default="{ row }">
        <el-input v-model="row.key" class="key-input" @input="atInputChange" />
      </template>
    </el-table-column>
    <el-table-column :label="keyValueLabel.value">
      <template #default="{ row }">
        <el-input v-model="row.value" @input="atInputChange">
          <template #suffix>
            <div class="suffix-container">
              <template v-if="explicitlySpecifyTypeInValue(row.value)">
                <el-tooltip
                  class="box-item"
                  effect="dark"
                  :content="getTooltipContent(row.value)"
                  placement="top-start"
                >
                  <el-icon><Warning /></el-icon>
                </el-tooltip>
              </template>
            </div>
          </template>
        </el-input>
      </template>
    </el-table-column>
    <el-table-column width="100">
      <template #header>
        <a href="javascript:;" class="btn" @click="addColumn">
          {{ $t('Base.add') }}
        </a>
      </template>
      <template #default="{ row }">
        <a href="javascript:;" class="btn" @click="deleteItem(row)">
          {{ $t('Base.delete') }}
        </a>
      </template>
    </el-table-column>
  </el-table>
</template>

<script lang="ts">
import useInfluxdbFieldsEditor, {
  FieldValueType,
} from '@/hooks/Rule/bridge/useInfluxdbFieldsEditor'
import useI18nTl from '@/hooks/useI18nTl'
import { Warning } from '@element-plus/icons-vue'
import { cloneDeep, isEqual, isPlainObject } from 'lodash'
import { computed, defineComponent, ref, Ref, watch } from 'vue'

type kvRow = {
  key: string
  value: string
}

export default defineComponent({
  components: { Warning },
  emits: ['update:modelValue', 'add'],
  props: {
    modelValue: {
      type: Object,
    },
    customLabel: {
      type: Object,
      default: null,
    },
  },
  setup(props, context) {
    const rowData: kvRow = {
      key: '',
      value: '',
    }
    const tableData: Ref<kvRow[]> = ref([])

    let lastTimeObjData = {}

    const { t, tl } = useI18nTl('RuleEngine')
    const { emit } = context

    const { judgeFieldValueType, judgeValueInInput, explicitlySpecifyTypeInValue, getTypeLabel } =
      useInfluxdbFieldsEditor()

    function createTbData() {
      const d = props.modelValue
      if (!d || !isPlainObject(d)) {
        return
      }
      lastTimeObjData = cloneDeep(d)
      tableData.value = []
      Object.entries(d).forEach(([key, value]: [string, string]) => {
        const type = judgeFieldValueType(value)
        if (type === FieldValueType.String) {
          // remove quotes
          tableData.value.push({ key, value: value.slice(1, -1) })
        } else {
          tableData.value.push({ key, value })
        }
      })
    }

    createTbData()

    const keyValueLabel = computed(() => {
      if (props.customLabel === null) {
        return {
          key: t('components.key'),
          value: t('components.value'),
        }
      }
      return props.customLabel
    })

    function atInputChange() {
      const data: Record<string, unknown> = {}
      tableData.value.forEach((item) => {
        const { key, value } = item
        const type = judgeValueInInput(value)
        if (value !== undefined) {
          if (type === FieldValueType.String) {
            data[key] = `"${value}"`
          } else {
            data[key] = value
          }
        }
      })
      lastTimeObjData = cloneDeep(data)
      emit('update:modelValue', data)
    }
    function deleteItem(row: kvRow) {
      tableData.value = tableData.value.filter(($) => $ !== row)
      atInputChange()
    }
    function addColumn() {
      tableData.value.push({ ...rowData })
      emit('add')
    }

    const getTooltipContent = (value: string) => {
      return t('RuleEngine.specifiedTypeTip', {
        type: getTypeLabel(
          explicitlySpecifyTypeInValue(value) as FieldValueType.Integer | FieldValueType.UInteger,
        ),
      })
    }

    watch(
      () => props.modelValue,
      (val) => {
        if (!isEqual(val, lastTimeObjData)) {
          createTbData()
        }
      },
    )

    return {
      tl,
      tableData,
      FieldValueType,
      explicitlySpecifyTypeInValue,
      getTooltipContent,
      getTypeLabel,
      atInputChange,
      deleteItem,
      addColumn,
      keyValueLabel,
    }
  },
})
</script>

<style lang="scss" scoped>
.key-and-value-editor {
  min-width: 200px;
}
.suffix-container {
  display: flex;
  align-items: center;
}
</style>
