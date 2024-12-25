<template>
  <div class="app-wrapper">
    <detail-header :item="{ name: t('components.webhook-create'), routeName: 'webhook' }" />
    <el-card class="webhook-create-card app-card">
      <WebhookFormCom v-if="webhook" ref="FormCom" v-model="webhook" />
      <el-skeleton v-else :rows="10" />
      <div class="card-ft">
        <el-button :loading="isSubmitting" type="primary" @click="submit">
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
import { checkNOmitFromObj, customValidate, getBridgeKey } from '@/common/tools'
import DetailHeader from '@/components/DetailHeader.vue'
import useWebhookForm from '@/hooks/Webhook/useWebhookForm'
import useI18nTl from '@/hooks/useI18nTl'
import { WebhookForm } from '@/types/webhook'
import { ElMessage } from 'element-plus'
import type { Ref } from 'vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import WebhookFormCom from './components/WebhookForm.vue'

const { t, tl } = useI18nTl('Base')
const router = useRouter()

const FormCom = ref()

const { createRawWebhookForm, getRuleIdByName, getActionNameByName, syncHeaders } = useWebhookForm()

const webhook: Ref<WebhookForm | undefined> = ref(undefined)
const initForm = async () => {
  webhook.value = await createRawWebhookForm()
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
