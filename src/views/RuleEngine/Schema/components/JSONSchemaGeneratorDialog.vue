<template>
  <el-dialog
    v-model="showDialog"
    :width="500"
    class="common-dialog"
    :title="tl('generateJSONSchema')"
    destroy-on-close
  >
    <el-form ref="FormCom" label-position="top" :rules="rules" :model="form" hide-required-asterisk>
      <el-form-item prop="json" :label="tl('generateJSONSchemaTip')">
        <div class="monaco-container">
          <monaco id="database-filter" v-model="form.json" lang="json" json-without-validate />
        </div>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-align-footer">
        <el-button @click="showDialog = false">
          {{ t('Base.cancel') }}
        </el-button>
        <el-button type="primary" @click="submit">
          {{ t('Base.generate') }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import Monaco from '@/components/Monaco.vue'
import useFormRules from '@/hooks/useFormRules'
import useI18nTl from '@/hooks/useI18nTl'
import { ElMessage } from 'element-plus'
import { createSchema } from 'genson-js'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
})
const emit = defineEmits<{
  (e: 'update:modelValue', v: boolean): void
  (e: 'submit', v: string): void
}>()

const { t, tl } = useI18nTl('RuleEngine')

const showDialog = computed({
  get: () => props.modelValue,
  set: (val: boolean) => {
    emit('update:modelValue', val)
  },
})

watch(showDialog, (val) => {
  if (!val) {
    form.value.json = ''
  }
})

const FormCom = ref()

const form = ref({ json: '' })

const { createRequiredRule } = useFormRules()

const rules = { json: createRequiredRule('JSON') }

const submit = async () => {
  try {
    await FormCom.value.validate()
  } catch (error) {
    return
  }
  try {
    const schema: Record<string, any> = {
      $schema: 'http://json-schema.org/draft-06/schema#',
      ...createSchema(JSON.parse(form.value.json)),
    }
    emit('submit', JSON.stringify(schema, null, 2))
    showDialog.value = false
  } catch (error: any) {
    ElMessage.error(error.toString())
  }
}
</script>
