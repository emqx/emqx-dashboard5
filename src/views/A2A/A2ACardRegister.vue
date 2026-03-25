<template>
  <div class="a2a-card-register app-wrapper">
    <detail-header
      :item="{ name: isEdit ? tl('editCard') : tl('registerCard'), path: '/a2a-registry' }"
    />
    <el-card class="app-card">
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-position="top"
        class="register-form"
      >
        <el-row :gutter="24">
          <el-col :span="8">
            <el-form-item :label="tl('orgId')" prop="org_id">
              <el-input v-model="form.org_id" :disabled="isEdit" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="tl('unitId')" prop="unit_id">
              <el-input v-model="form.unit_id" :disabled="isEdit" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="tl('agentId')" prop="agent_id">
              <el-input v-model="form.agent_id" :disabled="isEdit" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item prop="card" class="card-form-item">
          <template #label>
            <span>{{ tl('agentJson') }}</span>
            <el-button class="help-btn" size="small" @click="helpVisible = !helpVisible">
              {{ $t('Base.help') }}
            </el-button>
          </template>

          <el-collapse-transition>
            <div v-if="helpVisible" class="help-container">
              <div class="help-block">
                <p>{{ tl('helpDesc') }}</p>
                <ul>
                  <li v-for="f in helpFields" :key="f.field">
                    <code>{{ f.field }}</code> <em>({{ f.type }})</em> — {{ f.desc }}
                  </li>
                </ul>
                <i18n-t keypath="A2A.moreRef" tag="p">
                  <template #link>
                    <a :href="tl('agentCardDoc')" target="_blank" rel="noopener noreferrer">
                      Agent Card
                    </a>
                  </template>
                </i18n-t>
                <code-view lang="json" :code="EXAMPLE_JSON" :show-copy-btn="false" />
                <el-button size="small" @click="copyText(EXAMPLE_JSON)">
                  {{ $t('Base.copy') }}
                </el-button>
              </div>
            </div>
          </el-collapse-transition>

          <div class="viewer-container">
            <Monaco
              :id="monacoId"
              v-model="form.card"
              lang="json"
              @change="handleCardChange"
              @blur="handleCardBlur"
            />
          </div>
        </el-form-item>

        <div class="form-footer">
          <CancelButton @click="cancel" />
          <el-button
            type="primary"
            :disabled="!$hasPermission('post')"
            :loading="isSubmitting"
            @click="submit"
          >
            {{ isEdit ? t('Base.save') : tl('registerCard') }}
          </el-button>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { getA2ACard, getA2ARegistryConfig, registerA2ACard } from '@/api/a2a'
import { A2AConf } from '@/types/typeAlias'
import type { FormInstance, FormRules } from 'element-plus'

const router = useRouter()
const route = useRoute()
const { t } = useI18n()
const tl = (key: string) => t(`A2A.${key}`)

const isEdit = computed(() => route.name === 'a2a-registry-edit')

const form = ref({
  org_id: '',
  unit_id: '',
  agent_id: '',
  card: '',
})

const agentConf = ref<A2AConf>({})
const formatJSON = (json: string) => {
  try {
    return JSON.stringify(JSON.parse(json), null, 2)
  } catch {
    return json
  }
}
const validateSchema = computed(() => agentConf.value.validate_schema ?? false)
;(async () => {
  try {
    agentConf.value = await getA2ARegistryConfig()
  } catch (error) {
    //
  }
  if (isEdit.value) {
    const { org_id, unit_id, agent_id } = route.params as Record<string, string>
    form.value.org_id = org_id
    form.value.unit_id = unit_id
    form.value.agent_id = agent_id
    try {
      const card = await getA2ACard(org_id, unit_id, agent_id)
      form.value.card = card.raw ? formatJSON(card.raw) : ''
    } catch (error) {
      //
    }
  }
})()

const ID_PATTERN = /^[A-Za-z0-9._-]+$/

const monacoId = createRandomString()
const formRef = ref<FormInstance>()
const isSubmitting = ref(false)
const helpVisible = ref(false)

const { copyText } = useCopy()

const EXAMPLE_JSON = JSON.stringify(
  {
    name: 'my-agent',
    description: 'A sample A2A agent',
    version: '1.0.0',
    url: 'https://example.com/a2a',
    skills: [
      {
        id: 'skill-1',
        name: 'Sample Skill',
        description: 'A sample skill that does something useful',
      },
    ],
  },
  null,
  2,
)

const helpFields = [
  { field: 'name', type: 'string', desc: tl('helpFieldName') },
  { field: 'description', type: 'string', desc: tl('helpFieldDescription') },
  { field: 'version', type: 'string', desc: tl('helpFieldVersion') },
  { field: 'url', type: 'string (URI)', desc: tl('helpFieldUrl') },
  { field: 'skills', type: 'array', desc: tl('helpFieldSkills') },
]

const { createRequiredRule } = useFormRules()
const createIdPatternRule = () => ({ pattern: ID_PATTERN, message: tl('idFormatTip') })

const validateCard = (_rule: any, value: string, callback: (err?: Error) => void) => {
  let parsed: any
  try {
    parsed = JSON.parse(value)
  } catch {
    callback(new Error(tl('cardJsonInvalid')))
    return
  }

  if (!validateSchema.value) {
    callback()
    return
  }

  if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
    callback(new Error(tl('cardJsonInvalid')))
    return
  }

  const requiredStringFields = ['name', 'description', 'version', 'url'] as const
  for (const field of requiredStringFields) {
    if (typeof parsed[field] !== 'string' || !parsed[field]) {
      callback(new Error(t('A2A.cardFieldRequired', { field })))
      return
    }
  }

  if (!Array.isArray(parsed.skills)) {
    callback(new Error(t('A2A.cardFieldRequired', { field: 'skills' })))
    return
  }
  if (parsed.skills.length === 0) {
    callback(new Error(tl('cardSkillsEmpty')))
    return
  }
  for (let i = 0; i < parsed.skills.length; i++) {
    const skill = parsed.skills[i]
    for (const field of ['id', 'name', 'description'] as const) {
      if (typeof skill[field] !== 'string' || !skill[field]) {
        callback(new Error(t('A2A.cardSkillItemInvalid', { index: i, field })))
        return
      }
    }
  }

  callback()
}

const rules: FormRules = {
  org_id: [...createRequiredRule(tl('orgId')), createIdPatternRule()],
  unit_id: [...createRequiredRule(tl('unitId')), createIdPatternRule()],
  agent_id: [...createRequiredRule(tl('agentId')), createIdPatternRule()],
  card: [...createRequiredRule(tl('agentJson')), { validator: validateCard, trigger: 'blur' }],
}

const handleCardChange = () => formRef.value?.validateField('card')

const handleCardBlur = () => formRef.value?.validateField('card')

const cancel = () => router.push({ name: 'a2a-registry' })

const submit = async () => {
  if (!formRef.value) return
  try {
    await formRef.value.validate()
  } catch {
    return
  }
  isSubmitting.value = true
  try {
    await registerA2ACard(form.value.org_id, form.value.unit_id, form.value.agent_id, {
      card: form.value.card,
    })
    ElMessage.success(isEdit.value ? t('Base.updateSuccess') : tl('registerSuccess'))
    router.push({ name: 'a2a-registry' })
  } catch (error) {
    // handled by global error handler
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style lang="scss" scoped>
.a2a-card-register {
  .register-form {
    max-width: 900px;
  }

  .card-form-item {
    position: relative;
  }

  .help-btn {
    position: absolute;
    right: 0;
    top: -1px;
  }

  .help-container {
    width: 100%;
    margin-top: 12px;
  }

  .help-block {
    padding: 24px;
    background: var(--color-bg-split);
    margin-bottom: 22px;
    line-height: 1.6;

    p {
      margin: 0 0 12px;
    }

    ul {
      margin: 0 0 8px;
      padding-left: 20px;

      li {
        margin-bottom: 4px;
      }
    }
  }

  .viewer-container {
    border: 1px solid var(--color-border-primary);
    margin-top: 12px;
    width: 100%;
    height: 320px;
  }

  .form-footer {
    display: flex;
    justify-content: flex-start;
    gap: 12px;
    margin-top: 8px;
  }
}
</style>
