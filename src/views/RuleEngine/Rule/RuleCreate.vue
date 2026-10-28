<template>
  <div class="rule-create app-wrapper">
    <detail-header :item="{ name: $t('RuleEngine.createRule'), routeName: 'rule' }">
      <template #content>
        <div class="flex items-center gap-3">
          <span>{{ t('RuleEngine.createRule') }}</span>
          <NamespaceResourceTag :namespace="namespace" />
        </div>
      </template>
    </detail-header>
    <el-card class="rule-form-card overview-visible app-card">
      <rule-form
        ref="formCom"
        v-model="ruleValue"
        :submit-loading="submitLoading"
        :name-disabled="savedAfterDataChange"
        @save="submitCreateRule"
      />
    </el-card>
  </div>
</template>

<script lang="ts">
export default defineComponent({
  name: 'RuleCreate',
})
</script>

<script lang="ts" setup>
import { createRules } from '@/api/ruleengine'
import { RuleItem } from '@/types/rule'
import RuleForm from '../components/RuleForm.vue'

const { t } = useI18n()

const route = useRoute()
const router = useRouter()
const inheritedNamespace = useResourceNamespace()
const namespace = ref(inheritedNamespace.value)
provide('ns', namespace)
const { getNsParams } = useNsParams()

const submitLoading = ref(false)

// const mode = 'sql'

const { createRawRuleForm } = useRuleForm()

const ruleValue = ref({ ...createRawRuleForm(), namespace: namespace.value })
let rawRuleValue = cloneDeep(ruleValue.value)
const countIsRuleRecordChanged = () => !isEqual(ruleValue.value, rawRuleValue)

const isRuleCreated = ref(false)
const { isTesting, savedAfterDataChange, updateSavedData } = useStatusController(ruleValue)
savedAfterDataChange.value = false

const formCom = ref()

useDataNotSaveConfirm(countIsRuleRecordChanged)

const { getRuleDetail } = useRuleItem()
const checkRuleClipStatus = async () => {
  if (route.query.action === 'copy' && route.query.target) {
    const ruleData = await getRuleDetail(route.query.target as string, namespace.value)
    const rule = pick(ruleData, ['sql', 'actions', 'description', 'actions'])

    if (rule) {
      ruleValue.value = {
        ...(rule as RuleItem),
        id: countDuplicationName(ruleData.id),
        namespace: namespace.value,
      }
    }
  }
}

const { updateRule } = useRuleItem()
const submitCreateRule = async () => {
  await formCom.value.validate()

  submitLoading.value = true

  try {
    const { namespace: ns, ...body } = ruleValue.value
    await (isRuleCreated.value
      ? updateRule(ruleValue.value.id, { ...ruleValue.value })
      : createRules(body, getNsParams(ns)))
    rawRuleValue = ruleValue.value
    ElMessage.success(t('Base.createSuccess'))
    isRuleCreated.value = true
    if (!isTesting.value) {
      router.push({ name: 'rule' })
    } else {
      updateSavedData(ruleValue.value)
    }
  } catch (error) {
    //
  } finally {
    submitLoading.value = false
  }
}

checkRuleClipStatus()
</script>

<style lang="scss">
.rule-create {
  .rule-form-card {
    > .el-card__body {
      padding: 0px;
    }
  }
}
</style>
