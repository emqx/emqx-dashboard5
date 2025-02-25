<template>
  <el-dialog
    class="flow-select-dialog dialog-with-divider"
    v-model="showDialog"
    destroy-on-close
    :width="480"
    :z-index="2000"
    :title="tl('flowSelect')"
  >
    <el-form ref="FormCom" :model="record" :rules="rules">
      <p class="desc">{{ tl('flowSelectDesc') }}</p>
      <el-form-item label="Flow" prop="flow">
        <el-select v-model="record.flow">
          <el-option
            v-for="value in idArr"
            :key="value"
            :label="value"
            :value="value"
            :disabled="isDisabled(value)"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="showDialog = false">{{ $t('Base.cancel') }}</el-button>
        <el-button type="primary" :disabled="!$hasPermission('post')" @click="submit">
          {{ $t('Base.confirm') }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import useFormRules from '@/hooks/useFormRules'
import useI18nTl from '@/hooks/useI18nTl'
import { ElDialog } from 'element-plus'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  idArr: {
    type: Array as PropType<Array<string>>,
    required: true,
    default: () => [],
  },
  disabledIdArr: {
    type: Array as PropType<Array<string>>,
    required: true,
    default: () => [],
  },
})
const emit = defineEmits(['update:modelValue', 'selected'])

const { tl } = useI18nTl('Flow')

const showDialog = computed({
  get: () => props.modelValue,
  set: (val: boolean) => {
    emit('update:modelValue', val)
  },
})

watch(showDialog, (val) => {
  if (!val) {
    record.value.flow = ''
  } else {
    record.value.flow = props.disabledIdArr.length
      ? props.idArr.find((id) => !props.disabledIdArr.includes(id)) || props.idArr[0]
      : props.idArr[0]
  }
})

const { createRequiredRule } = useFormRules()

const FormCom = ref()
const record = ref({ flow: '' })
const rules = { flow: createRequiredRule('Flow') }

const submit = async () => {
  try {
    await FormCom.value.validate()
    emit('selected', record.value.flow)
  } catch (error) {
    //
  }
}

const isDisabled = (id: string) => {
  if (props.disabledIdArr.length === 0) {
    return false
  }
  return props.disabledIdArr.includes(id)
}
</script>

<style lang="scss">
.flow-select-dialog {
  .desc {
    margin-bottom: 24px;
  }
}
</style>
