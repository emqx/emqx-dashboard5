<template>
  <div class="rule-create app-wrapper">
    <detail-header :item="{ name: $t('RuleEngine.createRule'), routeName: 'rule' }" />
    <el-card class="rule-form-card overview-visible app-card">
      <ruleform
        ref="formCom"
        v-model="ruleValue"
        :submit-loading="submitLoading"
        @save="submitCreateRule"
      />
    </el-card>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'RuleCreate',
})
</script>

<script lang="ts" setup>
import { createRules, getRuleInfo } from '@/api/ruleengine'
import { countDuplicationName } from '@/common/tools'
import DetailHeader from '@/components/DetailHeader.vue'
import useRuleForm from '@/hooks/Rule/rule/useRuleForm'
import useDataNotSaveConfirm from '@/hooks/useDataNotSaveConfirm'
import { RuleItem } from '@/types/rule'
import { ElMessage } from 'element-plus'
import { cloneDeep, isEqual, pick } from 'lodash'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import ruleform from '../components/RuleForm.vue'

const { t } = useI18n()

const route = useRoute()
const router = useRouter()
const submitLoading = ref(false)

// const mode = 'sql'

const { createRawRuleForm } = useRuleForm()

const ruleValue = ref(createRawRuleForm())
let rawRuleValue = cloneDeep(ruleValue.value)
const countIsRuleRecordChanged = () => !isEqual(ruleValue.value, rawRuleValue)

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
    await createRules({ ...ruleValue.value })
    rawRuleValue = ruleValue.value
    ElMessage.success(t('Base.createSuccess'))
    router.push({ name: 'rule' })
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
