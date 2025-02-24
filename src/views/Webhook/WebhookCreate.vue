<template>
  <div class="app-wrapper">
    <detail-header :item="{ name: t('components.webhook-create'), routeName: 'webhook' }" />
    <el-card class="webhook-create-card app-card">
      <WebhookFormCom v-if="webhook" ref="FormCom" v-model="webhook" />
      <el-skeleton v-else :rows="10" />
      <div class="card-ft">
        <el-button
          :loading="isSubmitting"
          :disabled="!$hasPermission('post')"
          type="primary"
          @click="submit"
        >
          {{ tl('save') }}
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { postAction } from '@/api/action'
import { postConnector } from '@/api/connector'
import { createRules } from '@/api/ruleengine'
import { RuleSQLKeyword } from '@/types/enum'
import { WebhookForm } from '@/types/webhook'
import WebhookFormCom from './components/WebhookForm.vue'

const { t, tl } = useI18nTl('Base')
const router = useRouter()
const { query } = useRoute()

const FormCom = ref()

const { createRawWebhookForm, getRuleIdByName, getActionNameByName, syncHeaders } = useWebhookForm()
const { getEventList } = useRuleEvents()
const { transFromDataArrToStr, replaceTargetPartInSQL } = useRuleUtils()

const checkTriggerInQuery = () => {
  const trigger = query.trigger
  return trigger?.toString()
}

const replaceTriggerInSQL = async (preSql: string, triggerInQuery: string) => {
  try {
    const triggerReg = new RegExp(`${escapeRegExp(triggerInQuery)}`)
    const ruleEvents = await getEventList()
    const events = ruleEvents
      .filter(({ event }) => triggerReg.test(event))
      .map(({ event }) => event)
    const fromPart = transFromDataArrToStr(events)
    return replaceTargetPartInSQL(preSql, RuleSQLKeyword.From, fromPart)
  } catch (error) {
    return Promise.reject(error)
  }
}

const webhook: Ref<WebhookForm | undefined> = ref(undefined)
const initForm = async () => {
  webhook.value = await createRawWebhookForm()
  const triggerInQuery = checkTriggerInQuery()
  if (triggerInQuery) {
    webhook.value.rule.sql = await replaceTriggerInSQL(webhook.value.rule.sql, triggerInQuery)
  }
}
initForm()

const isSubmitting = ref(false)

const setName = (data: WebhookForm) => {
  const { name } = data
  const actionAndConnectorName = getActionNameByName(name)
  data.action.name = actionAndConnectorName
  data.action.connector = actionAndConnectorName
  data.connector.name = actionAndConnectorName
  data.rule.id = getRuleIdByName(name)
  data.rule.actions = [getBridgeKey(data.action)]
  return data
}

const submit = async () => {
  if (!webhook.value) {
    return
  }
  try {
    await customValidate(FormCom.value)
    const data: any = checkNOmitFromObj(setName(webhook.value))
    isSubmitting.value = true
    // Because it is easier to report errors when creating bridge, put it in the front..
    syncHeaders(data)
    await postConnector(data.connector)
    await postAction(data.action)
    await createRules(data.rule)
    ElMessage.success(tl('createSuccess'))
    router.push({ name: 'webhook' })
  } catch (error) {
    // TODO:Dealing with the situation where the rule or bridge already exists
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style lang="scss">
.webhook-create-card {
  padding: 12px 104px;
  .card-ft {
    padding-top: 36px;
  }
}
</style>
