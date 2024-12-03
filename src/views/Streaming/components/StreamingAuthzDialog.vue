<template>
  <el-dialog
    v-model="showDialog"
    :title="t('Base.createTarget', { target: titleCase(t('Auth.authz')) })"
    destroy-on-close
    width="700px"
  >
    <StreamingACLForm :lang="state.lang" v-model="record" :rules="rules" />
    <template #footer>
      <div class="dialog-align-footer">
        <el-button @click="showDialog = false">{{ t('Base.cancel') }}</el-button>
        <el-button
          type="primary"
          :disabled="!$hasPermission('post')"
          @click="submit"
          :loading="isSubmitting"
        >
          {{ t('Base.create') }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { createStreamingAuthz } from '@/api/streaming'
import { titleCase } from '@/common/tools'
import useFormRules from '@/hooks/useFormRules'
import { StreamingAuthz, StreamingAuthzPrincipalType } from '@/types/typeAlias'
import { StreamingACLForm } from '@emqx/shared-ui-components'
import {
  STREAMING_MATCH_ALL,
  StreamOperation,
  StreamPatternType,
  StreamPermission,
  StreamResourceType,
} from '@emqx/shared-ui-constants'
import { useLocale } from '@emqx/shared-ui-utils'
import { ElMessage } from 'element-plus'
import { omit } from 'lodash'
import { computed, defineEmits, defineProps, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'

type StreamingAuthzRecord = Omit<StreamingAuthz, 'pattern_type'> & {
  principal_name_type: StreamPatternType
  pattern_type: StreamPatternType
  host_type: StreamPatternType
}

const props = defineProps<{
  modelValue: boolean
}>()
const emit = defineEmits<{
  (e: 'update:modelValue', v: boolean): void
  (e: 'submitted'): void
}>()
const { state } = useStore()

const showDialog = computed({
  get: () => props.modelValue,
  set: (val: boolean) => {
    emit('update:modelValue', val)
  },
})
watch(showDialog, (val) => {
  if (!val) {
    record.value = createRawAuthz()
  }
})

const { t, locale } = useI18n()
const { t: sharedT } = useLocale(locale.value)
const tl = (key: string) => sharedT(`streaming.${key}`)

const createRawAuthz = (): StreamingAuthzRecord => ({
  principal_type: StreamingAuthzPrincipalType.User,
  principal_name: STREAMING_MATCH_ALL,
  host_type: StreamPatternType.All,
  host: STREAMING_MATCH_ALL,
  resource_type: StreamResourceType.Topic,
  pattern_type: StreamPatternType.All,
  resource_name: STREAMING_MATCH_ALL,
  operation: StreamOperation.All,
  permission: StreamPermission.Deny,
  principal_name_type: StreamPatternType.All,
})

const record = ref<StreamingAuthzRecord>(createRawAuthz())

const matchAllUsers = computed(() => record.value.principal_name_type === StreamPatternType.All)
const matchAllResources = computed(() => record.value.pattern_type === StreamPatternType.All)

const FormCom = ref()
const { createRequiredRule } = useFormRules()
const rules = computed(() => ({
  principal_name: [
    ...createRequiredRule(t('Base.username')),
    {
      pattern: matchAllUsers.value ? undefined : /^[\w./+%$#@&-]{1,128}$/,
      message: tl('usernameRule'),
    },
  ],
  host: createRequiredRule(tl('host')),
  resource_type: createRequiredRule(tl('aclResourceType'), 'select'),
  resource_name: [
    ...createRequiredRule(tl('aclResourceName')),
    {
      pattern: matchAllResources.value ? undefined : /^[a-z\d][\w.-]{0,63}$/i,
      message: tl('streamNameFormatTip'),
    },
  ],
  operation: createRequiredRule(tl('aclOperation'), 'select'),
  permission: createRequiredRule(t('Base.permission'), 'select'),
}))

const isSubmitting = ref(false)
const submit = async () => {
  try {
    await FormCom.value.validate()
    isSubmitting.value = true
    const { pattern_type: patternType } = record.value
    const pattern_type =
      patternType === StreamPatternType.All ? StreamPatternType.Literal : patternType
    await createStreamingAuthz({
      ...omit(record.value, ['host_type', 'principal_name_type']),
      pattern_type,
    })
    emit('submitted')
    showDialog.value = false
    ElMessage.success(t('Base.createSuccess'))
  } catch (error) {
    //
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style lang="scss"></style>
