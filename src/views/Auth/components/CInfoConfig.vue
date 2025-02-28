<template>
  <div class="cinfo-config config">
    <el-form
      ref="formCom"
      :model="cinfoConfig"
      :rules="rules"
      class="create-form"
      label-position="top"
    >
      <el-row :gutter="20">
        <el-col :span="20">
          <el-form-item prop="checks" :label="$t('Auth.checks')">
            <ObjectArrayEditor
              v-model="cinfoConfig.checks"
              propKey="checks"
              :properties="checksProperties"
              :rules="rules"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  modelValue: {
    type: Object,
    required: true,
  },
  isEdit: {
    type: Boolean,
  },
})

const emit = defineEmits(['update:modelValue'])

const { tl } = useI18nTl('Auth')

const checksProperties = {
  is_match: {
    type: 'string',
    format: 'textarea',
    rows: 3,
    placeholder: "e.g., regex_match(username, '^admin-')",
    path: 'checks.is_match',
    key: 'checks.is_match',
    label: tl('isMatch'),
    description: tl('isMatchDesc'),
    required: true,
  },
  result: {
    type: 'enum',
    symbols: ['allow', 'ignore', 'deny'],
    path: 'checks.result',
    key: 'checks.result',
    label: tl('result'),
    description: tl('resultDesc'),
    required: true,
  },
}

const cinfoConfig = reactive(props.modelValue)
const { formCom, rules, validate } = useCInfoConfigForm()

let preConfigs: Record<string, any> = { checks: [] }
watch(cinfoConfig, (value) => {
  if (value.checks.length === preConfigs.checks.length) {
    validate()
  } else {
    preConfigs = cloneDeep(value)
  }
  emit('update:modelValue', value)
})

defineExpose({
  validate,
})
</script>

<style lang="scss">
@use '../style/authConfig.scss';
</style>
