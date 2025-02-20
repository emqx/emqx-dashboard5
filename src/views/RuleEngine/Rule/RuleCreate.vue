<template>
  <div class="rule-create app-wrapper">
    <detail-header :item="{ name: $t('RuleEngine.createRule'), routeName: 'rule' }" />
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
import { createRules, getRuleInfo, updateRules } from '@/api/ruleengine'
import { countDuplicationName } from '@/common/tools'
import DetailHeader from '@/components/DetailHeader.vue'
import { useStatusController } from '@/hooks/Rule/rule/useDebugRule'
import useRuleForm from '@/hooks/Rule/rule/useRuleForm'
import useDataNotSaveConfirm from '@/hooks/useDataNotSaveConfirm'
import { RuleItem } from '@/types/rule'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import RuleForm from '../components/RuleForm.vue'

const { t } = useI18n()

const route = useRoute()
const router = useRouter()

const submitLoading = ref(false)

// const mode = 'sql'

const { createRawRuleForm } = useRuleForm()

const ruleValue = ref(createRawRuleForm())
let rawRuleValue = cloneDeep(ruleValue.value)
const countIsRuleRecordChanged = () => !isEqual(ruleValue.value, rawRuleValue)

let isRuleCreated = false
const { isTesting, savedAfterDataChange, updateSavedData } = useStatusController(ruleValue)
savedAfterDataChange.value = false

const formCom = ref()

useDataNotSaveConfirm(countIsRuleRecordChanged)

const checkRuleClipStatus = async () => {
  if (route.query.action === 'copy' && route.query.target) {
    const ruleData = await getRuleInfo(route.query.target as string)
    const rule = pick(ruleData, ['sql', 'actions', 'description', 'actions'])

    if (rule) {
      ruleValue.value = { ...(rule as RuleItem), id: countDuplicationName(ruleData.id) }
    }
  }
}

const submitCreateRule = async () => {
  await formCom.value.validate()

  submitLoading.value = true

  try {
    await (isRuleCreated
      ? updateRules(ruleValue.value.id, { ...ruleValue.value })
      : createRules({ ...ruleValue.value }))
    rawRuleValue = ruleValue.value
    ElMessage.success(t('Base.createSuccess'))
    isRuleCreated = true
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
