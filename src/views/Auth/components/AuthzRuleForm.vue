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
    <el-form-item :label="t('Dashboard.listener')">
      <el-input v-if="isEdit" v-model="listenerInputValue">
        <template #prepend>
          <el-select v-model="listenerType">
            <el-option
              v-for="{ label, value } in listenerTypeOpts"
              :key="value"
              :label="label"
              :value="value"
            />
          </el-select>
        </template>
        <template #suffix>
          <InfoTooltip>
            <template #content>
              <MarkdownContent :content="listenerInputTooltip" />
            </template>
          </InfoTooltip>
        </template>
      </el-input>
      <p class="tip align-" v-else>
        {{ listenerInputValue }} ({{
          getLabelFromValueInOptionList(listenerType, listenerTypeOpts)
        }})
      </p>
    </el-form-item>
    <el-form-item label="Zone">
      <el-input v-if="isEdit" v-model="zoneInputValue">
        <template #prepend>
          <el-select v-model="zoneType">
            <el-option
              v-for="{ label, value } in listenerTypeOpts"
              :key="value"
              :label="label"
              :value="value"
            />
          </el-select>
        </template>
        <template #suffix>
          <InfoTooltip>
            <template #content>
              <MarkdownContent :content="zoneInputTooltip" />
            </template>
          </InfoTooltip>
        </template>
      </el-input>
      <p class="tip" v-else>
        {{ zoneInputValue }} ({{ getLabelFromValueInOptionList(zoneType, listenerTypeOpts) }})
      </p>
    </el-form-item>
    <div class="operation-container" v-if="$slots.operation">
      <slot name="operation" />
    </div>
  </el-form>
</template>

<script setup lang="ts">
import { BuiltInDBRule } from '@/types/auth'
import { BuiltInDBType } from '@/types/enum'

/**
 * listener and zone
 */
const enum ListenerConfigType {
  Name,
  Regex,
}

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

const listenerTypeOpts = [
  { value: ListenerConfigType.Name, label: t('Base.name') },
  { value: ListenerConfigType.Regex, label: tl('pattern') },
]
// LISTENER
const selectedListenerType = ref<undefined | ListenerConfigType>(undefined)
const listenerType = computed({
  get() {
    if (!record.value.listener && !record.value.listener_re) {
      return selectedListenerType.value ?? ListenerConfigType.Name
    }
    if (record.value.listener_re) {
      return ListenerConfigType.Regex
    }
    return ListenerConfigType.Name
  },
  set(value) {
    selectedListenerType.value = value
    if (value === ListenerConfigType.Name && record.value.listener_re) {
      record.value.listener_re = ''
    }
    if (value === ListenerConfigType.Regex && record.value.listener) {
      record.value.listener = ''
    }
  },
})
const listenerInputKey = computed(() =>
  listenerType.value === ListenerConfigType.Name ? 'listener' : 'listener_re',
)
const listenerInputValue = computed({
  get() {
    return record.value[listenerInputKey.value]
  },
  set(value) {
    record.value[listenerInputKey.value] = value
  },
})
const listenerInputTooltip = computed(() => {
  return listenerType.value === ListenerConfigType.Name
    ? tl('permissionListenerDesc')
    : tl('permissionListenerRegexDesc')
})

// ZONE
const selectedZoneType = ref<undefined | ListenerConfigType>(undefined)
const zoneType = computed({
  get() {
    if (!record.value.zone && !record.value.zone_re) {
      return selectedZoneType.value ?? ListenerConfigType.Name
    }
    if (record.value.zone_re) {
      return ListenerConfigType.Regex
    }
    return ListenerConfigType.Name
  },
  set(value) {
    selectedZoneType.value = value
    if (value === ListenerConfigType.Name && record.value.zone_re) {
      record.value.zone_re = ''
    }
    if (value === ListenerConfigType.Regex && record.value.zone) {
      record.value.zone = ''
    }
  },
})
const zoneInputKey = computed(() =>
  zoneType.value === ListenerConfigType.Name ? 'zone' : 'zone_re',
)
const zoneInputValue = computed({
  get() {
    return record.value[zoneInputKey.value]
  },
  set(value) {
    record.value[zoneInputKey.value] = value
  },
})
const zoneInputTooltip = computed(() => {
  return zoneType.value === ListenerConfigType.Name
    ? tl('permissionZoneDesc')
    : tl('permissionZoneRegexDesc')
})

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
