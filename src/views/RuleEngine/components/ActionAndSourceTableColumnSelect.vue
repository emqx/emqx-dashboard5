<template>
  <TableColumnSelect
    :selected="selected"
    :column-options="fieldOpts"
    @reset="reset"
    @change="confirm"
  />
</template>

<script setup lang="ts">
import useMultiTenancyEnabled from '@/hooks/Config/useMultiTenancyEnabled'

defineProps<{ selected: Array<string> }>()

const emit = defineEmits<{ (e: 'change', value: Array<string>): void }>()

const store = useStore()
const isMultiTenancyEnabled = useMultiTenancyEnabled()
const isNamespaceUser = computed(() => store.getters.isNamespaceUser)

const columns = [
  ...DEFAULT_ACTION_AND_SOURCE_TABLE_COLUMNS,
  'description',
  'last_modified_at',
].filter(
  (item) => !(item === 'namespace' && (isNamespaceUser.value || !isMultiTenancyEnabled.value)),
)
const customFieldIndexMap = DEFAULT_ACTION_AND_SOURCE_TABLE_COLUMNS.reduce(
  (map: Map<string, number>, item: string, index: number) => {
    map.set(item, index)
    return map
  },
  new Map([
    ['description', 3.5],
    ['last_modified_at', DEFAULT_ACTION_AND_SOURCE_TABLE_COLUMNS.length],
  ]),
)
const { getColumnLabel } = useActionAndSourceTableColumns()
const fieldOpts = columns
  .map((item) => ({ label: getColumnLabel(item), value: item }))
  .sort((a, b) => {
    const aIndex = customFieldIndexMap.get(a.value) ?? 99
    const bIndex = customFieldIndexMap.get(b.value) ?? 99
    return aIndex - bIndex
  })

const fieldOptIndex = fieldOpts.reduce((map, { value }, index) => {
  map.set(value, index)
  return map
}, new Map<string, number>())

const confirm = (value: Array<string>) => {
  // The checklist is not in order, so reorder it.
  const list = value.sort((a, b) => (fieldOptIndex.get(a) ?? 99) - (fieldOptIndex.get(b) ?? 99))
  emit('change', list)
}

const reset = () => {
  emit('change', [...DEFAULT_ACTION_AND_SOURCE_TABLE_COLUMNS])
}
</script>
