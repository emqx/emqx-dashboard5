<template>
  <div class="function-form">
    <template v-if="record.editedWay === EditedWay.Form">
      <ul class="field-list">
        <li class="field-item" v-for="(item, $index) in record.form" :key="item.id">
          <FunctionBlock
            v-model="record.form[$index]"
            :ref="(el) => setFormCom(el, $index)"
            :readonly="readonly"
            @vnode-before-unmount="delFormCom($index)"
          />
          <el-button
            v-if="!readonly && record.form.length > 1"
            link
            class="btn-del"
            @click="deleteItem($index)"
          >
            <el-icon :size="16" class="icon-del"><Delete /></el-icon>
          </el-button>
        </li>
      </ul>
      <el-button v-if="!readonly" link type="primary" :icon="Plus" @click="addItem">
        {{ tl('add') }}
      </el-button>
    </template>

    <el-form
      v-else
      ref="FormCom"
      class="message-form"
      hide-required-asterisk
      :rules="rules"
      :model="record"
      :validate-on-rule-change="false"
      @keyup.enter.prevent="saveConfig()"
    >
      <el-form-item prop="sql">
        <div class="monaco-container">
          <Monaco
            :id="createRandomString()"
            lang="sql"
            v-model="record.sql"
            @blur="transformToFormFromSql"
          />
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { DEFAULT_SELECT } from '@/common/constants'
import { createRandomString, trimSpacesAndLFs } from '@/common/tools'
import Monaco from '@/components/Monaco.vue'
import { FunctionForm, EditedWay } from '@/hooks/Flow/useFlowNode'
import useGenerateFlowDataUtils from '@/hooks/Flow/useGenerateFlowDataUtils'
import useHandleFlowDataUtils from '@/hooks/Flow/useHandleFlowDataUtils'
import { createFunctionItem } from '@/hooks/Flow/useNodeForm'
import useFormRules from '@/hooks/useFormRules'
import useI18nTl from '@/hooks/useI18nTl'
import { Delete, Plus } from '@element-plus/icons-vue'
import { isFunction } from 'lodash'
import { PropType, computed, defineEmits, defineExpose, defineProps, ref, watch } from 'vue'
import FunctionBlock from './FunctionBlock.vue'

const props = defineProps({
  modelValue: {
    type: Object as PropType<FunctionForm>,
    default: () => ({ form: [] }),
  },
  readonly: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue', 'save'])

const { tl } = useI18nTl('Base')

const { getFuncExpressionFromFuncList } = useHandleFlowDataUtils()
const { generateFunctionFormFromExpression } = useGenerateFlowDataUtils()

const FormCom = ref()

const FormComArr: Array<any> = []
const setFormCom = (form: any, index: number) => {
  FormComArr[index] = form
}

const delFormCom = (index: number) => {
  FormComArr.splice(index, 1)
}

const record = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  },
})

const { createRequiredRule } = useFormRules()
const rules = { sql: createRequiredRule('SQL') }

const addItem = () => {
  record.value.form.push(createFunctionItem())
}

const deleteItem = (index: number) => {
  record.value.form.splice(index, 1)
}

const validate = () => {
  if (record.value.editedWay === EditedWay.Form) {
    return Promise.all(
      FormComArr.map((item) => {
        if (item.validate && isFunction(item.validate)) {
          return item.validate()
        }
        return Promise.resolve()
      }),
    )
  } else {
    return FormCom.value.validate()
  }
}

const transformToSqlFormForm = () => {
  record.value.sql = getFuncExpressionFromFuncList(record.value.form) || ''
}

const transformToFormFromSql = () => {
  const defaultForm = [createFunctionItem()]
  if (trimSpacesAndLFs(record.value.sql) === DEFAULT_SELECT) {
    record.value.form = defaultForm
  } else {
    const form = generateFunctionFormFromExpression(record.value.sql)
    record.value.form = form?.length ? form : defaultForm
  }
}

const saveConfig = () => {
  emit('save', record.value)
}

watch(
  () => props.modelValue?.editedWay,
  (val) => {
    if (val === EditedWay.SQL) {
      transformToSqlFormForm()
    } else {
      transformToFormFromSql()
    }
  },
)

defineExpose({ validate })
</script>

<style lang="scss">
.function-form {
  ul {
    list-style: none;
  }
  ul,
  li {
    padding: 0;
    margin-top: 0;
  }
  .field-item {
    position: relative;
    padding-right: 36px;
    margin-bottom: 16px;
  }
  .btn-del {
    position: absolute;
    top: 0;
    right: 0;
  }
}
</style>
