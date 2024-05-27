<template>
  <el-col :span="colSpan" v-bind="$attrs">
    <CustomFormItem
      :label="getLabel(property)"
      :readonly="readonly"
      :value="getLabelFromValueInOptionList(typeIndex, typeOpts)"
    >
      <el-select v-if="type === 'select'" v-model="typeIndex" @change="handleTypeChanged">
        <el-option
          v-for="{ value, label } in typeOpts"
          :key="value"
          :value="value"
          :label="label"
        />
      </el-select>
      <el-radio-group v-else v-model="typeIndex" @change="handleTypeChanged">
        <el-radio v-for="{ value, label } in typeOpts" :key="value" :label="value" border>
          <span>{{ label }}</span>
        </el-radio>
      </el-radio-group>
    </CustomFormItem>
  </el-col>
</template>

<script setup lang="ts">
import { getLabelFromValueInOptionList } from '@/common/tools'
import { useSymbolLabel } from '@/hooks/Schema/useItemLabelAndDesc'
import { Properties, Property } from '@/types/schemaForm'
import { isEqual, isFunction, snakeCase } from 'lodash'
import { PropType, Ref, computed, defineEmits, defineProps, ref, watch } from 'vue'
import CustomFormItem from './CustomFormItem.vue'

type OneOfItem = Property | Properties
type FieldValue = string | number | boolean | Record<string, any>
type Symbols = Array<string>

const props = defineProps({
  fieldValue: {
    type: [String, Number, Object] as PropType<string | number | Record<string, any> | undefined>,
  },
  property: {
    type: Object as PropType<Property>,
    required: true,
  },
  items: {
    type: Array as PropType<Array<OneOfItem>>,
    required: true,
    default: () => [],
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  colSpan: {
    type: Number,
    default: 12,
  },
  readonly: {
    type: Boolean,
  },
  getText: {
    type: Function as PropType<(property: Property) => { label: string; desc?: string }>,
  },
  type: {
    type: String as PropType<'select' | 'radio'>,
    default: 'select',
  },
})
const emit = defineEmits(['change'])

const isFixedEnum = (item: OneOfItem) => Array.isArray(item.symbols) && item.symbols.length === 1

const typeIndex: Ref<undefined | number> = ref(undefined)

const propertyPath = computed(() => props.property.path || '')

const nameReg = /^.*\.([^.]+)$/

const { getOptLabel } = useSymbolLabel()
const getLabelKey = (item: OneOfItem) => {
  let end = ''
  if (isFixedEnum(item)) {
    end = (item.symbols as Symbols)[0]
  } else if (typeof item.$ref === 'string') {
    const name = item.$ref.match(nameReg)?.[1]
    end = name || item.$ref
  } else {
    end = getOptLabel(item?.toString?.())
  }
  return snakeCase(`${propertyPath.value || ''}${propertyPath.value && '_'}${end}`)
}
const typeOpts = computed(() => {
  return props.items.map((item, $index) => ({
    value: $index,
    label: getOptLabel(getLabelKey(item)),
  }))
})
const handleTypeChanged = (value: number) => {
  const newProps = props.items[value]
  emit('change', newProps)
}

const judgeTypeIndexByValue = (value: FieldValue, items: Array<OneOfItem>): number => {
  if (!value) {
    return 0
  }
  const ret = items.findIndex((item) => {
    if (typeof value !== 'object') {
      return item.$ref ? false : isFixedEnum(item) && (item.symbols as Symbols)[0] === value
    }
    if (!item.$ref || !item.properties) {
      return false
    }
    const keyValuePairs = Object.entries(value)
    return keyValuePairs.every(([key, value]) => {
      if (!item.properties || !(key in item.properties)) {
        return false
      }
      const prop = (item.properties as Properties)[key]
      if (isFixedEnum(prop)) {
        return value === undefined || value === '' || value === prop.symbols?.[0]
      }
      return prop
    })
  })
  return ret < -1 ? 0 : ret
}
const init = () => {
  if (props.fieldValue) {
    typeIndex.value = judgeTypeIndexByValue(props.fieldValue, props.items)
    handleTypeChanged(typeIndex.value)
  }
}

const getLocalizedValue = (property: Property, field: 'label' | 'desc') => {
  const { key } = property
  if (isFunction(props.getText)) {
    const localizedText = props.getText(property)
    return localizedText ? localizedText[field] || key : key
  }
  return key
}

const getLabel = (property: Property) => getLocalizedValue(property, 'label')

watch(
  () => props.fieldValue,
  (nV, oV) => {
    if (!isEqual(nV, oV)) {
      init()
    }
  },
)

init()
</script>

<style lang="scss"></style>
