<template>
  <div class="kerberos-config config">
    <el-form
      ref="formCom"
      :model="kerberosConfig"
      :rules="rules"
      class="create-form"
      label-position="top"
      require-asterisk-position="right"
    >
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item prop="principal">
            <template #label>
              <form-item-label :label="tl('principal')" :desc="tl('principalDesc')" descMarked />
            </template>
            <el-input v-model="kerberosConfig.principal" />
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
})

const kerberosConfig = reactive(props.modelValue)
const { formCom, rules, validate: validate } = useKerberosConfigForm()
const { tl } = useI18nTl('Auth')

defineExpose({
  formCom,
  validate,
})

const emit = defineEmits(['update:modelValue'])
watch(kerberosConfig, (value) => {
  emit('update:modelValue', value)
})
</script>

<style lang="scss">
@import '../style/authConfig.scss';
</style>
