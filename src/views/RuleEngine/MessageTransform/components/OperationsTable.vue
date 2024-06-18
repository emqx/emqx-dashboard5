<template>
  <el-table
    class="operations-table"
    :data="tableData"
    row-key="id"
    border
    default-expand-all
    :tree-props="{ children: 'convert' }"
  >
    <el-table-column :label="tl('transformationProperties')">
      <template #default="{ row }">
        <!-- PARENT -->
        <div class="prop-belong-container" v-if="row.convert">
          <el-select v-model="row.propBelong">
            <el-option v-for="item in propBelongOpts" :key="item" :label="item" :value="item" />
          </el-select>
          <el-button
            v-if="canGetSubProp(row.propBelong)"
            class="btn-add"
            :icon="Plus"
            :disabled="!$hasPermission('post')"
            @click="addSubOperation(row)"
          />
        </div>
        <!-- CHILD -->
        <div v-else class="sub-convert-container">
          <el-input v-model="row.propValue" />
        </div>
      </template>
    </el-table-column>
    <el-table-column>
      <template #header>
        <div class="target-value-header">
          <span>{{ tl('targetValue') }}</span>
          <el-button
            type="primary"
            :icon="Plus"
            :disabled="!$hasPermission('post')"
            @click="addOperation"
          >
          </el-button>
        </div>
      </template>
      <template #default="data">
        <!-- PARENT -->
        <template v-if="data.row.convert && !Array.isArray(data.row.convert)">
          <TargetValue v-model="data.row.convert" />
          <el-button
            class="btn-del"
            :icon="Delete"
            :disabled="!$hasPermission('delete')"
            @click="deleteOperation(data.$index)"
          />
        </template>
        <!-- CHILD -->
        <template v-else-if="!data.row.convert">
          <TargetValue v-model="data.row" />
          <el-button
            class="btn-del"
            :icon="Delete"
            :disabled="!$hasPermission('delete')"
            @click="deleteSubOperation(data.$index)"
          />
        </template>
      </template>
    </el-table-column>
  </el-table>
</template>

<script lang="ts" setup>
import { createRandomString } from '@/common/tools'
import {
  PropBelong,
  TargetBelong,
  useMessageTransformForm,
} from '@/hooks/Rule/transform/useMessageTransform'
import useI18nTl from '@/hooks/useI18nTl'
import { MessageTransformOperation } from '@/types/typeAlias'
import { Delete, Plus } from '@element-plus/icons-vue'
import { isEqual, isUndefined } from 'lodash'
import { defineEmits, defineProps, ref, watch } from 'vue'
import TargetValue from './TargetValue.vue'

interface SubOperation {
  propValue: string
  targetBelong: TargetBelong | ''
  targetValue?: string
}

interface OperationTarget {
  targetBelong: TargetBelong | ''
  targetValue?: string
}

interface Operation {
  /**
   * for table component
   */
  id: string
  propBelong: PropBelong | ''
  convert: OperationTarget | Array<SubOperation>
}

const { propBelongOpts, subPropReg, targetBelongReg, canGetSubProp } = useMessageTransformForm()

const props = defineProps<{ modelValue: Array<MessageTransformOperation> }>()
const emit = defineEmits<{
  (e: 'update:modelValue', value: Array<{ key: string; value: string }>): void
}>()

const { tl } = useI18nTl('RuleEngine')

const tableData = ref<Operation[]>([])

let operationsCache: Array<MessageTransformOperation> = []
const updateTableDataByModel = () => {
  if (isUndefined(props.modelValue)) {
    return
  }
  tableData.value = []
  let currentParentProp: undefined | string = undefined
  props.modelValue.forEach(({ key, value }) => {
    const targetWithBelong = targetBelongReg.test(value)
    const targetBelong: TargetBelong | '' = !value
      ? ''
      : targetWithBelong
      ? (value.match(targetBelongReg)?.[1] as TargetBelong)
      : TargetBelong.Expression
    const targetValue: string | undefined = targetWithBelong
      ? value.replace(targetBelongReg, '')
      : value
    if (subPropReg.test(key)) {
      const parentProp = key.match(subPropReg)?.[1]
      const propValue = key.replace(subPropReg, '')

      const convertItem = { propValue, targetBelong, targetValue }
      if (currentParentProp === parentProp) {
        // combine same parent
        const lastItem = tableData.value[tableData.value.length - 1]
        // second confirmation
        if (lastItem.propBelong === parentProp && Array.isArray(lastItem.convert)) {
          lastItem.convert.push(convertItem)
        }
      } else {
        // create new operation items
        tableData.value.push({
          id: createRandomString(),
          propBelong: parentProp as PropBelong,
          convert: [convertItem],
        })
      }
      currentParentProp = parentProp
    } else {
      tableData.value.push({
        id: createRandomString(),
        propBelong: key as PropBelong,
        convert: { targetBelong, targetValue },
      })
      currentParentProp = undefined
    }
  })
}
updateTableDataByModel()

watch(
  () => props.modelValue,
  (val) => {
    if (!isEqual(val, operationsCache)) {
      updateTableDataByModel()
    }
  },
)

const getTargetValue = ({ targetValue, targetBelong }: OperationTarget & unknown) =>
  targetValue ? `${targetBelong}.${targetValue}` : targetBelong

const getOperationsByTableData = () => {
  const operations: Array<MessageTransformOperation> = []
  tableData.value.forEach((item) => {
    if (Array.isArray(item.convert)) {
      item.convert.forEach((subItem) => {
        operations.push({
          key: `${item.propBelong}.${subItem.propValue}`,
          value: getTargetValue(subItem),
        })
      })
    } else {
      operations.push({
        key: item.propBelong,
        value: getTargetValue(item.convert),
      })
    }
  })
  return operations
}

watch(
  tableData,
  () => {
    operationsCache = getOperationsByTableData()
    emit('update:modelValue', operationsCache)
  },
  { deep: true },
)

const createRawSubOperation = (): SubOperation => ({
  propValue: '',
  targetBelong: '',
  targetValue: '',
})

const createRawOperationTarget = (): OperationTarget => ({
  targetBelong: '',
  targetValue: '',
})

const createRawOperation = (): Operation => ({
  id: createRandomString(),
  propBelong: '',
  convert: createRawOperationTarget(),
})

const addOperation = () => {
  tableData.value.push(createRawOperation())
}

const findOperationParent = (
  rowIndex: number,
): { parent: Operation; parentIndex: number; subIndex: number } | null => {
  let start = 0
  let end = 0
  for (let parentIndex = 0; parentIndex < tableData.value.length; parentIndex++) {
    const item = tableData.value[parentIndex]
    const convertLength = Array.isArray(item.convert) ? item.convert.length + 1 : 1
    end += convertLength
    if (rowIndex < end && rowIndex >= start) {
      return { parent: item, parentIndex, subIndex: rowIndex - start - 1 }
    }
    start = end
  }
  return null
}

const deleteOperation = (rowIndex: number) => {
  const findRet = findOperationParent(rowIndex)
  if (findRet) {
    tableData.value.splice(findRet.parentIndex, 1)
  }
}

const addSubOperation = (parent: Operation) => {
  if (!Array.isArray(parent.convert)) {
    parent.convert = []
  }
  parent.convert.push(createRawSubOperation())
}

const deleteSubOperation = (index: number) => {
  const findRet = findOperationParent(index)
  if (findRet) {
    const convert = findRet.parent.convert as Array<SubOperation>
    convert.splice(findRet.subIndex, 1)
    if (convert.length === 0) {
      findRet.parent.convert = createRawOperationTarget()
    }
  }
}
</script>

<style lang="scss">
.operations-table {
  .cell {
    line-height: 1;
  }
  .el-table__expand-icon,
  .el-table__placeholder,
  .el-table__indent {
    display: none !important;
  }
  .el-button.el-button--primary {
    padding-left: 8px;
    padding-right: 8px;
  }
  .target-value-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
  }
  .prop-belong-container {
    position: relative;
    flex-grow: 1;
    padding-right: 49px;
    .btn-add {
      position: absolute;
      right: 0;
      top: 0;
    }
  }
  .sub-convert-container {
    padding-left: 40px;
    padding-right: 49px;
  }
  .cell {
    display: flex;
  }
  .el-select,
  .el-input,
  .sub-convert-container {
    flex-grow: 1;
  }
  .el-select,
  .el-input {
    margin-right: 16px;
  }
}
</style>
