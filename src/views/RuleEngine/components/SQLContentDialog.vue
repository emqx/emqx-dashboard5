<template>
  <el-dialog
    v-model="showDialog"
    :width="500"
    class="common-dialog"
    :title="title"
    append-to-body
    destroy-on-close
  >
    <el-form ref="FormCom" label-position="top" :rules="rules" :model="form" hide-required-asterisk>
      <el-form-item prop="sql">
        <div class="monaco-container">
          <monaco id="database-filter" v-model="form.sql" lang="sql" />
        </div>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-align-footer">
        <el-button @click="showDialog = false">
          {{ t('Base.cancel') }}
        </el-button>
        <el-button type="primary" @click="submit">
          {{ t('Base.confirm') }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import Monaco from '@/components/Monaco.vue'

const props = defineProps<{ modelValue: boolean; sql?: string; title?: string }>()
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
    form.value.sql = ''
  } else {
    form.value.sql = props.sql || ''
  }
})

const FormCom = ref()

const form = ref({ sql: '' })

const { createRequiredRule } = useFormRules()

const rules = { sql: createRequiredRule('SQL') }

const submit = async () => {
  try {
    await FormCom.value.validate()
    emit('submit', form.value.sql)
    showDialog.value = false
  } catch (error: any) {
    //
  }
}
</script>
