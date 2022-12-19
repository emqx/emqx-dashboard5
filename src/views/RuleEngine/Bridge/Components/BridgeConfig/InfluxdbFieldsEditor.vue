<template>
  <el-table class="influxdb-fields-editor shadow-none" :data="tableData">
    <el-table-column :label="keyValueLabel.key">
      <template #default="{ row }">
        <el-input v-model="row.key" class="key-input" @input="atInputChange" />
      </template>
    </el-table-column>
    <el-table-column :label="keyValueLabel.value">
      <template #default="{ row }">
        <BooleanSelect
          v-model="row.value"
          v-if="row.type === FieldValueType.Boolean"
          @change="atInputChange"
        />
        <el-input
          v-else-if="row.type === FieldValueType.Integer || row.type === FieldValueType.UInteger"
          v-model="row.value"
          @input="atInputChange"
        />
        <el-input v-else v-model="row.value" @input="atInputChange" />
      </template>
    </el-table-column>
    <el-table-column :label="tl('type')">
      <template #default="{ row }">
        <el-select v-model="row.type">
          <el-option
            v-for="{ value, label } in typeOpts"
            :label="label"
            :value="value"
            :key="value"
          />
        </el-select>
      </template>
    </el-table-column>
    <el-table-column v-if="!disabled" width="100">
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
import { ref, computed, Ref, defineComponent, watch } from 'vue'
import { isPlainObject, cloneDeep, isEqual } from 'lodash'
import useI18nTl from '@/hooks/useI18nTl'
import BooleanSelect from '@/components/BooleanSelect.vue'
import useInfluxdbFieldsEditor, {
  FieldValueType,
} from '@/hooks/Rule/bridge/useInfluxdbFieldsEditor'

enum State {
  OK = 0,
  Error,
}
type kvRow = {
  key: string
  value: string | undefined | boolean
  type: FieldValueType
  state: State
}

const { judgeFieldValueType, convertToRawValueByType, handleValueByType } =
  useInfluxdbFieldsEditor()

export default defineComponent({
  name: 'KeyAndValueEditor',
  emits: ['update:modelValue', 'add'],
  components: { BooleanSelect },
  props: {
    modelValue: {
      type: Object,
    },
    customLabel: {
      type: Object,
      default: null,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, context) {
    const rowData: kvRow = {
      key: '',
      value: undefined,
      type: FieldValueType.Placeholder,
      state: State.OK,
    }
    const tableData: Ref<kvRow[]> = ref([])

    let lastTimeObjData = {}

    const { t, tl } = useI18nTl('RuleEngine')
    const { emit } = context

    const typeOpts = [
      { value: FieldValueType.Placeholder, label: tl('placeholder') },
      { value: FieldValueType.Float, label: tl('float') },
      { value: FieldValueType.Integer, label: tl('integer') },
      { value: FieldValueType.UInteger, label: tl('uInteger') },
      { value: FieldValueType.String, label: tl('string') },
      { value: FieldValueType.Boolean, label: tl('boolean') },
    ]

    function createTbData() {
      const d = props.modelValue
      if (!d || !isPlainObject(d)) {
        return
      }
      lastTimeObjData = cloneDeep(d)
      tableData.value = []
      Object.entries(d).forEach(([key, value]: [string, string]) => {
        const type = judgeFieldValueType(value)
        if (type !== undefined) {
          const rawValue = convertToRawValueByType(value, type)
          tableData.value.push({ key, value: rawValue, state: 0, type })
        } else {
          // TODO:throw error
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
        const { key, value, type } = item
        if (value !== undefined) {
          data[key] = handleValueByType(value, type)
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
      typeOpts,
      FieldValueType,
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
</style>
