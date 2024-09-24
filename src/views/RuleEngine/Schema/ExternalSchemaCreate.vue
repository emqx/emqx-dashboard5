<template>
  <div class="external-schema-create" :class="[isInSinglePage ? 'app-wrapper' : '']">
    <detail-header v-if="isInSinglePage" :item="{ name: title, routeName: 'external-schema' }" />
    <el-card class="app-card schema-create-card">
      <ExternalSchemaConfluentForm class="schema-create-form" ref="FormCom" v-model="formData" />
      <div class="schema-create-ft">
        <el-button @click="cancel">
          {{ $t('Base.cancel') }}
        </el-button>
        <el-button
          type="primary"
          :disabled="!$hasPermission('post')"
          :loading="isSubmitting"
          @click="submit"
        >
          {{ $t('Base.create') }}
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { getExternalSchemaDetail, postExternalSchema } from '@/api/ruleengine'
import { countDuplicationName } from '@/common/tools'
import DetailHeader from '@/components/DetailHeader.vue'
import useDetectIsComInSinglePage from '@/hooks/useDetectIsComInSinglePage'
import useI18nTl from '@/hooks/useI18nTl'
import type { ExternalSchema } from '@/types/typeAlias'
import { ExternalSchemaType } from '@/types/typeAlias'
import { ElMessage } from 'element-plus'
import { cloneDeep } from 'lodash'
import { defineEmits, defineProps, Ref, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ExternalSchemaConfluentForm from './components/ExternalSchemaConfluentForm.vue'

/**
 * props and emit is for use this component in drawer
 */
const props = defineProps<{
  type?: string
}>()
const emit = defineEmits<{
  (e: 'submitted', name: string): void
  (e: 'cancel'): void
}>()

const router = useRouter()
const route = useRoute()
const { t } = useI18nTl('RuleEngine')

/**
 * diff from in component
 */
const isInSinglePage = ref(true)
const { detectIsComInSinglePage } = useDetectIsComInSinglePage()

const title = t('Base.createTarget', { target: t('components.external-schema') })

const createRawSchemaForm = (): ExternalSchema => ({
  name: '',
  type: ExternalSchemaType.Confluent,
  url: '',
  auth: 'none',
})

const FormCom = ref()
const formData: Ref<ExternalSchema> = ref(createRawSchemaForm())
const isSubmitting = ref(false)

const checkClipStatus = async () => {
  const { query } = route
  if (query.action === 'copy' && query.target) {
    const schema = await getExternalSchemaDetail(query.target.toString())
    formData.value = { ...schema, name: countDuplicationName(query.target.toString()) }
  }
}

const cancel = () => {
  if (isInSinglePage.value) {
    router.push({ name: 'external-schema' })
  } else {
    emit('cancel')
  }
}

const submit = async () => {
  try {
    isSubmitting.value = true
    await FormCom.value.validate()
    const ret = await postExternalSchema(cloneDeep(formData.value))
    if (isInSinglePage.value) {
      ElMessage.success(t('Base.createSuccess'))
      router.push({ name: 'external-schema' })
    } else {
      emit('submitted', ret.name)
    }
  } catch (error) {
    //
  } finally {
    isSubmitting.value = false
  }
}

const setTypeFromProps = () => {
  if (props.type) {
    formData.value.type = props.type as ExternalSchema['type']
  }
}

;(() => {
  isInSinglePage.value = detectIsComInSinglePage()
  if (isInSinglePage.value) {
    checkClipStatus()
  } else {
    setTypeFromProps()
  }
})()
</script>

<style lang="scss" scoped>
.schema-create-form {
  width: 70%;
}
</style>
