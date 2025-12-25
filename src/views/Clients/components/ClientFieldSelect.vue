<template>
  <TableColumnSelect
    :selected="selected"
    :column-options="fieldOpts"
    @reset="reset"
    @change="confirm"
  />
</template>

<script setup lang="ts">
const { tl } = useI18nTl('Clients')

defineProps<{ selected: Array<string> }>()

const emit = defineEmits<{ (e: 'change', value: Array<string>): void }>()

const customFieldIndexMap = DEFAULT_CLIENT_TABLE_COLUMNS.reduce(
  (map: Map<string, number>, item: string, index: number) => {
    map.set(item, index)
    return map
  },
  new Map([
    ['send_msg', DEFAULT_CLIENT_TABLE_COLUMNS.length],
    ['recv_msg', DEFAULT_CLIENT_TABLE_COLUMNS.length + 1],
  ]),
)
const { clientFields, getBaseLabel } = useClientFields()
const fieldOpts = Object.entries(clientFields)
  .reduce(
    (arr: Array<{ label: string; value: string }>, [, fieldArr]) => {
      fieldArr.forEach((field) => {
        if (['proto_type', 'listener'].includes(field)) {
          return
        }
        arr.push({ label: getBaseLabel(field), value: field })
      })
      return arr
    },
    [
      { label: tl('connectedStatus'), value: 'connected' },
      { label: getBaseLabel('send_msg'), value: 'send_msg' },
      { label: getBaseLabel('recv_msg'), value: 'recv_msg' },
    ],
  )
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
  emit('change', [...DEFAULT_CLIENT_TABLE_COLUMNS])
}
</script>
