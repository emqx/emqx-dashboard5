<template>
  <div class="oneof">
    <div class="oneof-item" v-for="(item, index) in items" :key="index">
      <el-input
        v-model="bindForms[index].string"
        v-if="item.type === 'string'"
        :disabled="disabled"
        @change="handleValChange(bindForms[index].string, 'string')"
        clearable
      ></el-input>
      <el-input
        v-model.number="bindForms[index].number"
        v-else-if="item.type === 'number'"
        :disabled="disabled"
        type="number"
        @change="handleValChange(bindForms[index].number, 'number')"
        clearable
      ></el-input>
      <el-select
        v-model="bindForms[index].enum"
        v-else-if="item.type === 'enum'"
        :disabled="disabled"
        @change="handleValChange(bindForms[index].enum, 'enum')"
        clearable
      >
        <el-option v-for="opt in item.symbols" :value="opt" :label="opt" :key="opt"></el-option>
      </el-select>
      <time-input-with-unit-select
        v-model="bindForms[index].duration"
        v-else-if="item.type === 'duration'"
        :disabled="disabled"
        @change="handleValChange(bindForms[index].duration, 'duration')"
      ></time-input-with-unit-select>
      <input-with-unit
        v-else-if="item.type === 'byteSize'"
        v-model="bindForms[index].byteSize"
        :disabled="disabled"
        :units="['MB', 'G', 'KB']"
        @change="handleValChange(bindForms[index].byteSize, 'byteSize')"
      ></input-with-unit>
      <el-input
        v-model="bindForms[index].ip_port"
        v-else-if="item.type === 'ip_port'"
        :disabled="disabled"
        @change="handleValChange(bindForms[index].ip_port, 'ip_port')"
        clearable
      ></el-input>
      <div v-if="index !== items.length - 1" class="split">{{ $t('Base.or') }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, watch } from 'vue'
import TimeInputWithUnitSelect from './TimeInputWithUnitSelect.vue'
import InputWithUnit from './InputWithUnit.vue'
import { IP_REG } from '@/common/constants'
import { Properties } from '@/types/schemaForm'

export default defineComponent({
  name: 'Oneof',
  components: {
    TimeInputWithUnitSelect,
    InputWithUnit,
  },
  emits: ['update:modelValue'],
  props: {
    modelValue: {
      required: true,
    },
    items: {
      type: Array as PropType<Properties[string][]>,
      required: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, ctx) {
    const bindForms = ref<{ [key: string]: '' }[]>([])
    props.items.forEach((item) => {
      bindForms.value.push({ [item.type]: '' })
    })
    const setFormValue = (val: any, type: string) => {
      bindForms.value.forEach((form) => {
        if (Object.keys(form)[0] === type) {
          form[type] = val
        }
      })
    }
    const resetOtherFormValue = (type: string) => {
      bindForms.value.forEach((form) => {
        if (Object.keys(form)[0] !== type) {
          form[Object.keys(form)[0]] = ''
        }
      })
    }
    const catchValType = (val: any) => {
      if (['disable', 'infinity', 'unlimited', 'disabled'].includes(val)) {
        return 'enum'
      }
      if (typeof val === 'number') {
        setFormValue(val, 'number')
        return 'number'
      }
      if (/s|ms|h|m+/g.test(val)) {
        setFormValue(val, 'duration')
        return 'duration'
      }
      if (/MB|KB|G+/g.test(val)) {
        setFormValue(val, 'byteSize')
        return 'byteSize'
      }
      if (IP_REG.test(val)) {
        setFormValue(val, 'ip_port')
        return 'ip_port'
      }
      return 'string'
    }
    watch(
      () => props.modelValue,
      (val: any, oldVal: any) => {
        let type = catchValType(val)
        if (val === undefined && oldVal) {
          type = catchValType(oldVal)
        } else if (val && oldVal && oldVal !== val) {
          const oldType = catchValType(oldVal)
          setFormValue('', oldType)
        }
        setFormValue(val, type)
      },
    )
    const handleValChange = (val: string | number, type: string) => {
      if (val) {
        resetOtherFormValue(type)
      }
      ctx.emit('update:modelValue', val)
    }
    return {
      bindForms,
      handleValChange,
    }
  },
})
</script>

<style lang="scss">
.oneof {
  display: flex;
  .oneof-item {
    display: flex;
    width: 50%;
    .split {
      margin: 0 12px;
    }
  }
}
</style>
