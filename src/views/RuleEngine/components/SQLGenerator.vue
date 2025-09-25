<template>
  <div>
    <el-button
      v-if="showSQLGeneratorButton"
      plain
      type="primary"
      @click="openDialog"
      :icon="MagicStick"
    >
      {{ tl('generateSQL') }}
    </el-button>

    <el-dialog
      v-model="dialogVisible"
      :title="tl('generateSQLWithAI')"
      width="650px"
      append-to-body
      @closed="resetDialogState"
      class="sql-generator-dialog"
    >
      <div v-if="currentStep === 1">
        <el-form :model="formData" :rules="rules" ref="formRef" label-position="top">
          <el-form-item :label="tl('description')" prop="description">
            <el-input
              v-model="formData.description"
              type="textarea"
              :rows="4"
              :placeholder="tl('descriptionPlaceholder')"
            />
          </el-form-item>
          <el-form-item prop="topics">
            <template #label>
              <FormItemLabel :label="tl('topics')" :desc="tl('topicsTips')" />
            </template>
            <el-input v-model="formData.topics" :placeholder="tl('topicsPlaceholder')" />
          </el-form-item>
          <el-form-item prop="exampleInput">
            <template #label>
              <FormItemLabel :label="tl('exampleInput')" :desc="tl('exampleInputTips')" />
            </template>
            <div class="monaco-container form-monaco-editor">
              <Monaco :id="exampleInputMonacoId" v-model="formData.exampleInput" lang="json" />
            </div>
          </el-form-item>
          <el-form-item prop="exampleOutput">
            <template #label>
              <FormItemLabel :label="tl('exampleOutput')" :desc="tl('exampleOutputTips')" />
            </template>
            <div class="monaco-container form-monaco-editor">
              <Monaco :id="exampleOutputMonacoId" v-model="formData.exampleOutput" lang="json" />
            </div>
          </el-form-item>
        </el-form>
      </div>
      <div v-else-if="currentStep === 2">
        <div class="generated-sql-header">
          <div class="generated-sql-header-title">
            <h3>{{ tl('generatedSQLOutputTitle') }}</h3>
            <p class="description">{{ tl('generatedSQLOutputDesc') }}</p>
          </div>
          <el-button type="primary" link @click="handleCopySQL" :icon="CopyDocument"> </el-button>
        </div>
        <div class="monaco-container generated-sql-display-monaco">
          <Monaco :id="generatedSQLMonacoId" v-model="generatedSQL" lang="rulesql" />
        </div>
      </div>

      <template #footer>
        <span class="dialog-footer">
          <template v-if="currentStep === 1">
            <CancelButton @click="dialogVisible = false" />
            <el-button type="primary" @click="handleGenerate" :loading="isGenerating">
              {{ tl('generate') }}
            </el-button>
          </template>
          <template v-else-if="currentStep === 2">
            <el-button @click="handleBackToForm">{{ tl('backToForm') }}</el-button>
            <el-button type="primary" @click="handleApplySQL">
              {{ tl('applySQL') }}
              <el-icon class="el-icon--right"><Right /></el-icon>
            </el-button>
          </template>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { MagicStick, Right, CopyDocument } from '@element-plus/icons-vue'
import { generateSQLByAI } from '@/api/ruleengine'
import type { FormInstance, FormRules } from 'element-plus'
import type { LicenseData } from '@/types/dashboard'
import type { GenerateSQLPayload } from '@/types/rule'

const store = useStore()
const { tl } = useI18nTl('RuleEngine')
const emit = defineEmits(['apply-sql'])

const { copyText } = useCopy()

const dialogVisible = ref(false)
const isGenerating = ref(false)
const currentStep = ref(1)
const generatedSQL = ref('')
const generatedSQLMonacoId = ref('sql-generator-monaco-output')
const exampleInputMonacoId = ref('sql-generator-monaco-input-example')
const exampleOutputMonacoId = ref('sql-generator-monaco-output-example')

const formRef = ref<FormInstance>()
const formData = reactive({
  description: '',
  topics: '',
  exampleInput: '',
  exampleOutput: '',
})

const rules = reactive<FormRules>({
  description: [{ required: true, message: tl('descriptionRequired'), trigger: 'blur' }],
})

const latestEMQXVersion = computed(
  () => store.state.emqxVersion?.latestVersion.replace('v', '') || '5.10.0',
)
const licenseData = computed<LicenseData>(() => store.state.licenseData)

const aiSqlAssistantApiUrlCn = computed<string | undefined>(
  () => import.meta.env.VITE_CLOUD_AI_SQL_ASSISTANT_API_URL_CN,
)
const aiSqlAssistantApiUrlEn = computed<string | undefined>(
  () => import.meta.env.VITE_CLOUD_AI_SQL_ASSISTANT_API_URL_EN,
)
const language = computed(() => store.state.lang || 'en')

const aiSqlAssistantApiUrl = computed<string | undefined>(() =>
  language.value === 'zh' ? aiSqlAssistantApiUrlCn.value : aiSqlAssistantApiUrlEn.value,
)
const enableSQLAI = computed<boolean>(() => store.state.enableSQLAI)

const showSQLGeneratorButton = computed<boolean>(
  () => enableSQLAI.value && !!aiSqlAssistantApiUrl.value,
)

const openDialog = () => {
  dialogVisible.value = true
  currentStep.value = 1
  resetFormFields()
}

const resetFormFields = () => {
  formData.description = ''
  formData.topics = ''
  formData.exampleInput = ''
  formData.exampleOutput = ''
  formRef.value?.clearValidate()
}

const resetDialogState = () => {
  resetFormFields()
  currentStep.value = 1
  generatedSQL.value = ''
  isGenerating.value = false
}

const handleGenerate = async () => {
  if (!formRef.value) return
  if (!aiSqlAssistantApiUrl.value) {
    ElMessage.error(tl('cloudApiUrlNotConfigured'))
    return
  }
  const valid = await formRef.value.validate()
  if (!valid) return
  try {
    isGenerating.value = true
    const generatePayload: GenerateSQLPayload = {
      language: language.value,
      version: latestEMQXVersion.value,
      description: formData.description,
      topics: formData.topics || undefined,
      exampleInput: formData.exampleInput || undefined,
      exampleOutput: formData.exampleOutput || undefined,
    }
    const response = await generateSQLByAI(
      aiSqlAssistantApiUrl.value,
      generatePayload,
      licenseData.value,
    )
    generatedSQL.value = response.sql
    currentStep.value = 2
  } catch (error: any) {
    const errorMessage = error.message || tl('failedToGenerateSQL')
    ElMessage.error(errorMessage)
  } finally {
    isGenerating.value = false
  }
}

const handleBackToForm = () => {
  currentStep.value = 1
}

const handleApplySQL = () => {
  emit('apply-sql', generatedSQL.value)
  dialogVisible.value = false
}

const handleCopySQL = async () => {
  if (generatedSQL.value) {
    await copyText(generatedSQL.value)
  } else {
    ElMessage.warning(tl('noSQLGeneratedToCopy'))
  }
}
</script>

<style lang="scss">
.sql-generator-dialog {
  .dialog-subtitle {
    font-size: 14px;
    color: var(--el-text-color-secondary);
    margin-top: -10px;
    margin-bottom: 20px;
  }
  .generated-sql-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    .generated-sql-header-title {
      flex: 1;
      h3 {
        margin: 0;
        font-size: 16px;
      }
      .description {
        max-width: 90%;
        color: var(--el-text-color-secondary);
      }
    }
  }
  .form-monaco-editor {
    height: 120px; // Adjust height as needed for form JSON inputs
    border: 1px solid var(--el-border-color);
  }
  .generated-sql-display-monaco {
    height: 240px;
    border: 1px solid var(--el-border-color);
  }
}
</style>
