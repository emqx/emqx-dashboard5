<template>
  <div class="fallback-actions-editor">
    <!-- <h1
      style="
        position: fixed;
        top: 0;
        left: 0;
        width: 500px;
        height: 300px;
        background-color: grey;
        color: #fff;
        overflow: scroll;
        border: 4px dotted peachpuff;
        z-index: 9999;
      "
    >
      <p>🍅🍅🍅 modelValue</p>
      <pre>{{ modelValue }}</pre>
      <hr />
    </h1> -->
    <ul>
      <li v-for="(action, index) in actionList" :key="getActionKey(action)">
        <template v-if="action.kind === FallbackActionKind.Republish">
          <pre>{{ action.args }}</pre>
        </template>
        <template v-else>
          <span>{{ action.type }}{{ action.name }}</span>
        </template>
        <el-button size="small" @click.prevent="editAction(index)">
          {{ t('Base.edit') }}
        </el-button>
        <el-button size="small" plain @click.prevent="deleteAction(index)">
          {{ t('Base.delete') }}
        </el-button>
      </li>
    </ul>
    <CreateButton @click="addAction">
      {{ tl('addAction') }}
    </CreateButton>
    <RuleOutputsDrawer
      v-model="isDrawerOpen"
      is-fallback
      :edit="!!currentAction"
      :output="outputForDrawer"
      :output-disable-list="outputDisableList"
      @submit="handleActionSubmitted"
    />
  </div>
</template>

<script setup lang="ts">
import { FallbackActionKind } from '@/types/enum'
import { FallbackAction, OutputItem } from '@/types/rule'
import { defineProps } from 'vue'
import RuleOutputsDrawer from '../../components/RuleOutputsDrawer.vue'

/**
 * for adapt rules output
 */
const REPUBLISH_FUNCTION = 'republish'

type FallbackActionArr = Array<FallbackAction>

const props = defineProps<{
  modelValue: FallbackActionArr
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: FallbackActionArr): void
}>()

const actionList = computed<FallbackActionArr>({
  get() {
    return props.modelValue
  },
  set(value: FallbackActionArr) {
    emit('update:modelValue', value)
  },
})

const { t, tl } = useI18nTl('RuleEngine')

const getActionKey = (item: FallbackAction) => {
  if (item.kind === FallbackActionKind.Republish) {
    return `${item.kind}:${item.args.topic}`
  }
  return `${item.kind}:${getBridgeKey(item)}`
}

const isDrawerOpen = ref(false)
const currentEditIndex = ref<number>(-1)
const currentAction = computed<FallbackAction | null>(() => {
  return currentEditIndex.value > -1 ? actionList.value[currentEditIndex.value] : null
})
const outputForDrawer = computed<OutputItem | undefined>(() => {
  if (!currentAction.value) {
    return undefined
  }
  if (currentAction.value.kind === FallbackActionKind.Republish) {
    return {
      function: REPUBLISH_FUNCTION,
      args: currentAction.value.args,
    }
  }
  return getBridgeKey(currentAction.value)
})
const outputDisableList = computed<Array<string>>(() => {
  return (
    actionList.value?.reduce((arr: Array<string>, action) => {
      if (action.kind === FallbackActionKind.Reference) {
        arr.push(getBridgeKey(action))
      }
      return arr
    }, []) ?? []
  )
})
const editAction = (index: number) => {
  currentEditIndex.value = index
  isDrawerOpen.value = true
}

const deleteAction = async (index: number) => {
  actionList.value.splice(index, 1)
}

const addAction = () => {
  currentEditIndex.value = -1
  isDrawerOpen.value = true
}

/**
 * the action is the output item from the rule outputs drawer
 * so we need to preprocess the action before pushing it to the fallback action list
 */
const handleActionSubmitted = (action: OutputItem) => {
  if (typeof action === 'object' && action.function && action.args) {
    actionList.value.push({
      kind: FallbackActionKind.Republish,
      args: action.args,
    })
  } else if (typeof action === 'string') {
    const { type, name } = getTypeAndNameFromKey(action)
    actionList.value.push({
      kind: FallbackActionKind.Reference,
      type,
      name,
    })
  }
}
</script>

<style lang="scss"></style>
