<template>
  <el-table class="influxdb-fields-editor key-and-value-editor shadow-none" :data="displayData">
    <el-table-column :label="keyValueLabel.key">
      <template #default="{ row }">
        <InputWithPlaceholderSelect
          v-if="!readonly"
          v-model="row.key"
          class="key-input"
          @input="atInputChange"
        />
        <p class="value" v-else>{{ row.key }}</p>
      </template>
    </el-table-column>
    <el-table-column :label="keyValueLabel.value">
      <template #default="{ row }">
        <InputWithPlaceholderSelect v-if="!readonly" v-model="row.value" @input="atInputChange">
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
        </InputWithPlaceholderSelect>
        <p class="value" v-else>{{ row.value }}</p>
      </template>
    </el-table-column>
    <el-table-column width="180" v-if="!readonly && !disabled">
      <template #header>
        <div class="header-settings">
          <batch-settings :type="dbType" @uploaded-data="handleUploadedData" />
          <el-button link type="primary" class="btn" @click="addColumn">
            {{ $t('Base.add') }}
          </el-button>
        </div>
      </template>
      <template #default="{ row }">
        <el-button link type="primary" class="btn" @click="deleteItem(row)">
          {{ $t('Base.delete') }}
        </el-button>
      </template>
    </el-table-column>
  </el-table>
  <el-pagination
    v-if="shouldPaginate"
    class="fields-editor-pagination"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
    :current-page="currentPage"
    :page-sizes="[100, 200, 300, 400]"
    :page-size="pageSize"
    layout="total, sizes, prev, pager, next"
    :total="tableData.length"
  >
  </el-pagination>
</template>

<script lang="ts">
import useInfluxdbFieldsEditor, {
  FieldValueType,
} from '@/hooks/Rule/bridge/useInfluxdbFieldsEditor'
import { BatchSettingDatabaseType, BridgeType } from '@/types/enum'
import { Warning } from '@element-plus/icons-vue'

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
    readonly: {
      type: Boolean,
    },
    disabled: {
      type: Boolean,
    },
    type: {
      type: String,
    },
  },
  setup(props, context) {
    const dbType = computed<BatchSettingDatabaseType>(() =>
      props.type === BridgeType.Datalayers
        ? BatchSettingDatabaseType.Datalayers
        : BatchSettingDatabaseType.InfluxDB,
    )
    const rowData: kvRow = {
      key: '',
      value: '',
    }
    const tableData: Ref<kvRow[]> = ref([])

    let lastTimeObjData = {}

    const { t, tl } = useI18nTl('RuleEngine')
    const { emit } = context

    const pageSize = ref(100)
    const currentPage = ref(1)
    const shouldPaginate = ref(false)

    const displayData = computed(() => {
      if (!shouldPaginate.value) {
        return tableData.value
      }
      const start = (currentPage.value - 1) * pageSize.value
      const end = start + pageSize.value
      return tableData.value.slice(start, end)
    })

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
      shouldPaginate.value = tableData.value.length > 100
    }

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

    const handleSizeChange = (val: number) => {
      pageSize.value = val
      currentPage.value = 1
    }

    const handleCurrentChange = (val: number) => {
      currentPage.value = val
    }

    function handleUploadedData(newTableData: kvRow[]) {
      shouldPaginate.value = newTableData.length > 100
      currentPage.value = 1
      tableData.value = newTableData
      atInputChange()
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

    createTbData()

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
      dbType,
      handleUploadedData,
      displayData,
      pageSize,
      currentPage,
      shouldPaginate,
      handleSizeChange,
      handleCurrentChange,
    }
  },
})
</script>

<style lang="scss" scoped>
.influxdb-fields-editor {
  .header-settings {
    display: flex;
    justify-content: space-around;
  }
}
.fields-editor-pagination {
  margin-top: 16px;
}
.key-and-value-editor {
  min-width: 200px;
}
.suffix-container {
  display: flex;
  align-items: center;
}
</style>
