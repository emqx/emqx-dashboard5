<template>
  <div class="schema-create app-wrapper">
    <detail-header :item="{ name: title, routeName: 'schema' }" />
    <el-card class="app-card schema-create-card">
      <SchemaRegistryForm class="schema-create-form" ref="FormCom" v-model="formData" />
      <div class="schema-create-ft">
        <el-button @click="cancel">
          {{ $t('Base.cancel') }}
        </el-button>
        <el-button type="primary" :loading="isSubmitting" @click="submit">
          {{ $t('Base.create') }}
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { createSchema, querySchemaDetail } from '@/api/ruleengine'
import { countDuplicationName } from '@/common/tools'
import DetailHeader from '@/components/DetailHeader.vue'
import useI18nTl from '@/hooks/useI18nTl'
import { SchemaRegistryType } from '@/types/enum'
import { SchemaRegistry } from '@/types/rule'
import { ElMessage } from 'element-plus'
import { cloneDeep } from 'lodash'
import { Ref, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import SchemaRegistryForm from './components/SchemaRegistryForm.vue'

const router = useRouter()
const route = useRoute()
const { t } = useI18nTl('RuleEngine')

const title = t('Base.createTarget', { target: t('components.schema') })

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

const cancel = () => router.push({ name: 'schema' })

const submit = async () => {
  try {
    isSubmitting.value = true
    await FormCom.value.validate()
    await createSchema(cloneDeep(formData.value))
    ElMessage.success(t('Base.createSuccess'))
    router.push({ name: 'schema' })
  } catch (error) {
    //
  } finally {
    isSubmitting.value = false
  }
}

checkClipStatus()
</script>

<style lang="scss" scoped>
.schema-create-form {
  width: 70%;
}
.form-sub-block {
  margin-bottom: 8px;
}
</style>
