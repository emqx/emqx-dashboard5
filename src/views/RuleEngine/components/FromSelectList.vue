<template>
  <div class="from-select-list">
    <ul class="input-list">
      <li class="input-item" v-for="(item, $index) in inputList" :key="item.key">
        <FromSelect
          class="from-select"
          v-model="item.value"
          :ingress-bridge-list="ingressBridgeList"
          :event-list="eventList"
          @change="handleInputItemChanged"
        />
        <el-button class="btn-delete" type="danger" plain @click="deleteInputItem($index)">
          {{ $t('Base.delete') }}
        </el-button>
      </li>
    </ul>
    <el-button type="primary" plain class="btn-add" @click="addInputItem">
      {{ tl('addDataSource') }}
    </el-button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'FromSelectList',
})
</script>

<script setup lang="ts">
import { createRandomString } from '@/common/tools'
import useI18nTl from '@/hooks/useI18nTl'
import { BridgeItem, RuleEvent } from '@/types/rule'
import { Ref, defineProps, PropType, defineEmits, ref, watch } from 'vue'
import FromSelect from './FromSelect.vue'

interface InnerInputItem {
  value: string
  key: string
}

const props = defineProps({
  modelValue: {
    type: Array as PropType<Array<string>>,
    required: true,
  },
  ingressBridgeList: {
    type: Array as PropType<Array<BridgeItem>>,
  },
  eventList: {
    type: Array as PropType<Array<RuleEvent>>,
  },
})

const emit = defineEmits(['update:modelValue', 'change'])

const { tl } = useI18nTl('RuleEngine')

const inputList: Ref<Array<InnerInputItem>> = ref([])

const setInputList = () => {
  const list = props.modelValue && props.modelValue.length > 0 ? props.modelValue : ['']
  inputList.value = list.map((item) => ({ value: item, key: createRandomString() }))
}

watch(
  () => props.modelValue,
  (val) => {
    if (val.join(',') !== inputList.value.map(({ value }) => value).join(',')) {
      setInputList()
    }
  },
)

const handleInputItemChanged = () => {
  emit(
    'update:modelValue',
    inputList.value.filter(({ value }) => !!value).map(({ value }) => value),
  )
  emit('change')
}

const deleteInputItem = (index: number) => {
  inputList.value.splice(index, 1)
  handleInputItemChanged()
}

const addInputItem = () => {
  inputList.value.push({ value: '', key: createRandomString() })
}

setInputList()
</script>

<style lang="scss" scoped>
.from-select-list {
  width: 100%;
  .input-list {
    padding-left: 0;
    margin-top: 0;
    margin-bottom: 0;
    list-style: none;
  }
  .input-item {
    box-sizing: content-box;
    position: relative;
    margin: 8px 0;
    width: 100%;
    padding-right: 100px;
    &:hover {
      .btn-delete {
        visibility: visible;
      }
    }
    &::after {
      content: '';
      display: block;
      background-color: red;
      width: 200px;
      height: 100%;
    }
  }
  .btn-delete {
    visibility: hidden;
    position: absolute;
    top: 0;
    right: 0;
  }
  .btn-add {
    width: 100%;
  }
}
</style>
