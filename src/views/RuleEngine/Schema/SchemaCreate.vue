<template>
  <div class="schema-create" :class="[isInSinglePage ? 'app-wrapper' : '']">
    <detail-header
      v-if="isInSinglePage"
      :item="{ name: t('components.internal-schema-create'), routeName: 'internal-schema' }"
    />
    <el-card class="app-card schema-create-card">
      <SchemaRegistryForm
        class="schema-create-form"
        ref="FormCom"
        v-model="formData"
        :fixed-type="!isInSinglePage && !!type"
      />
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
import { createSchema, querySchemaDetail } from '@/api/ruleengine'

import DetailHeader from '@/components/DetailHeader.vue'
import useDetectIsComInSinglePage from '@/hooks/useDetectIsComInSinglePage'
import useI18nTl from '@/hooks/useI18nTl'
import { SchemaRegistryType } from '@/types/enum'
import { SchemaRegistry } from '@/types/rule'
import { ElMessage } from 'element-plus'
import { cloneDeep } from 'lodash'
import { defineEmits, defineProps, Ref, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import SchemaRegistryForm from './components/SchemaRegistryForm.vue'

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

const createRawSchemaForm = (): SchemaRegistry => ({
  name: '',
  description: '',
  type: SchemaRegistryType.Avro,
  source: '',
})

const FormCom = ref()
const formData: Ref<SchemaRegistry> = ref(createRawSchemaForm())
const isSubmitting = ref(false)

const checkClipStatus = async () => {
  const { query } = route
  if (query.action === 'copy' && query.target) {
    const schema = await querySchemaDetail(query.target.toString())
    formData.value = { ...schema, name: countDuplicationName(schema.name) }
  }
}

const cancel = () => {
  if (isInSinglePage.value) {
    router.push({ name: 'internal-schema' })
  } else {
    emit('cancel')
  }
}

const submit = async () => {
  try {
    isSubmitting.value = true
    await FormCom.value.validate()
    const ret = await createSchema(cloneDeep(formData.value))
    if (isInSinglePage.value) {
      ElMessage.success(t('Base.createSuccess'))
      router.push({ name: 'internal-schema' })
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
    formData.value.type = props.type as SchemaRegistryType
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
.form-sub-block {
  margin-bottom: 8px;
}
</style>
