<template>
  <el-form
    ref="formRef"
    :model="record"
    :label-position="isEdit ? 'top' : undefined"
    :hide-required-asterisk="!isEdit"
    class="authz-rule-form"
    :class="`is-column-${props.column}`"
  >
    <el-form-item :label="tl('action')" prop="action">
      <el-select v-if="isEdit" v-model="record.action">
        <el-option
          v-for="{ label, value } in actionOpts"
          :key="value"
          :value="value"
          :label="label"
        />
      </el-select>
      <p class="tip" v-else>
        {{ getLabelFromValueInOptionList(record.action, actionOpts) }}
      </p>
    </el-form-item>

    <el-form-item :label="tl('permission')" prop="permission">
      <el-select v-if="isEdit" v-model="record.permission">
        <el-option
          v-for="{ label, value } in permissionOpts"
          :key="value"
          :value="value"
          :label="label"
        />
      </el-select>
      <p class="tip" v-else>
        {{ getLabelFromValueInOptionList(record.permission, permissionOpts) }}
      </p>
    </el-form-item>

    <el-form-item :label="t('Base.topic')" prop="topic" :rules="topicRules">
      <el-input v-if="isEdit" v-model="record.topic" />
      <p class="tip" v-else>{{ replaceSpaceForHTML(record.topic) }}</p>
    </el-form-item>

    <el-form-item label="QoS">
      <el-select v-if="isEdit" v-model="record.qos" multiple>
        <el-option v-for="item in QoSOptions" :key="item" :label="item" :value="item" />
      </el-select>
      <p class="tip" v-else>{{ record.qos?.join?.(', ') }}</p>
    </el-form-item>

    <el-form-item label="Retain">
      <el-select v-if="isEdit" v-model="record.retain">
        <el-option :value="true" label="true" />
        <el-option :value="false" label="false" />
        <el-option value="all" :label="retainAllLabel" />
      </el-select>
      <p class="tip" v-else>{{ record.retain === 'all' ? retainAllLabel : record.retain }}</p>
    </el-form-item>

    <el-form-item :label="t('Clients.clientIdReg')" v-if="type !== BuiltInDBType.Client">
      <el-input v-if="isEdit" v-model="record.clientid_re" />
      <p class="tip" v-else>{{ record.clientid_re }}</p>
    </el-form-item>

    <el-form-item :label="t('Clients.usernameReg')" v-if="type !== BuiltInDBType.User">
      <el-input v-if="isEdit" v-model="record.username_re" />
      <p class="tip" v-else>{{ record.username_re }}</p>
    </el-form-item>

    <el-form-item :label="t('Clients.ipAddressRange')">
      <el-input v-if="isEdit" v-model="record.ipaddr" />
      <p class="tip" v-else>{{ record.ipaddr }}</p>
    </el-form-item>
    <!-- <el-form-item label="Listener">
            <el-input v-if="isEdit" v-model="record.ipaddr" />
            <p class="tip" v-else>{{ record.ipaddr }}</p>
          </el-form-item>
          <el-form-item label="Zone">
            <el-input v-if="isEdit" v-model="record.ipaddr" />
            <p class="tip" v-else>{{ record.ipaddr }}</p>
          </el-form-item> -->
    <div class="operation-container" v-if="$slots.operation">
      <slot name="operation" />
    </div>
  </el-form>
</template>

<script setup lang="ts">
import { BuiltInDBRule } from '@/types/auth'
import { BuiltInDBType } from '@/types/enum'

const props = withDefaults(
  defineProps<{
    modelValue: BuiltInDBRule
    isEdit?: boolean
    type?: BuiltInDBType
    column?: number
  }>(),
  {
    type: BuiltInDBType.All,
    column: 5,
  },
)
const emit = defineEmits<{
  (e: 'update:modelValue', value: BuiltInDBRule): void
}>()

const record = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  },
})

const { t, tl } = useI18nTl('Auth')

const formRef = ref()

const { actionOpts, permissionOpts } = useAuthzManager()

const retainAllLabel = t('Base.all')

const { createRequiredRule } = useFormRules()
const topicRules = createRequiredRule(t('Base.topic'))

const validate = async () => formRef.value?.validate()

defineExpose({
  validate,
})
</script>

<style lang="scss">
@use 'sass:math';

$form-gap: 20px;
.authz-rule-form {
  display: flex;
  flex-wrap: wrap;
  gap: $form-gap;
  &.is-column-5 {
    .el-form-item,
    .operation-container {
      width: calc(20% - math.div($form-gap * 4, 5));
    }
  }
  &.is-column-2 {
    .el-form-item,
    .operation-container {
      width: calc(50% - math.div($form-gap * 1, 2));
    }
  }
  .el-form-item {
    margin-bottom: 0;
  }
  .operation-container {
    padding-top: 30px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
}
</style>
