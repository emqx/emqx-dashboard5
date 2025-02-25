<template>
  <el-form
    ref="FormCom"
    label-position="top"
    require-asterisk-position="right"
    :model="form"
    :rules="rules"
  >
    <el-row :gutter="24">
      <el-col :span="12">
        <el-form-item prop="name">
          <template #label>
            <FormItemLabel
              :label="t('Base.name')"
              :desc="tl('externalSchemaNameTip')"
              popper-class="is-wider"
              desc-marked
            />
          </template>
          <el-input v-model="form.name" :disabled="isEdit" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item :label="tl('type')" prop="type">
          <el-select v-model="form.type">
            <el-option
              v-for="{ value, label } in schemaTypeOpts"
              :key="value"
              :label="label"
              :value="value"
            />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="URL" prop="url">
          <el-input v-model="form.url" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item :label="startCase(t('Auth.authn'))">
          <el-select v-model="authType">
            <el-option :label="t('Base.none')" :value="AuthType.None" />
            <el-option :label="tl('basicAuth')" :value="AuthType.Basic" />
          </el-select>
        </el-form-item>
      </el-col>
      <template v-if="authType === AuthType.Basic">
        <el-col :span="12">
          <el-form-item :label="$t('Base.username')" prop="auth.username">
            <el-input v-model="form.auth.username" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="tl('password')" prop="auth.password">
            <CustomInputPassword v-model="form.auth.password" />
          </el-form-item>
        </el-col>
      </template>
    </el-row>
  </el-form>
</template>
<script lang="ts" setup>
const enum AuthType {
  None,
  Basic,
}

const AUTH_NONE = 'none'

const props = defineProps<{
  modelValue: any
  isEdit?: boolean
}>()
const emit = defineEmits<{
  (e: 'update:modelValue', value: any): void
}>()

const form = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  },
})

const { t, tl } = useI18nTl('RuleEngine')

const { createRequiredRule, createCommonIdRule } = useFormRules()
const rules = ref({
  name: [...createRequiredRule(t('Base.name')), ...createCommonIdRule()],
  type: createRequiredRule(tl('type'), 'select'),
  url: createRequiredRule('URL'),
  'auth.username': createRequiredRule(t('Base.username')),
  'auth.password': createRequiredRule(tl('password')),
})
const { schemaTypeOpts } = useExternalSchemaType()

const authType = computed({
  get() {
    if (typeof form.value.auth === 'object') {
      return AuthType.Basic
    }
    return AuthType.None
  },
  set(val) {
    if (val === AuthType.Basic && typeof form.value.auth !== 'object') {
      form.value.auth = { username: '', password: '' }
    } else if (val === AuthType.None && typeof form.value.auth === 'object') {
      form.value.auth = AUTH_NONE
    }
  },
})

const FormCom = ref()
const validate = () => customValidate(FormCom.value)
defineExpose({ validate })
</script>

<style scoped>
.el-form-item {
  margin-bottom: 20px;
}
</style>
