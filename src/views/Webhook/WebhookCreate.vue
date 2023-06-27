<template>
  <div class="app-wrapper">
    <detail-header :item="{ name: $t('RuleEngine.createWebhook'), routeName: 'webhook' }" />
    <el-card class="webhook-create-card">
      <WebhookFormCom ref="FormCom" v-model="webhook" />
      <div class="card-ft">
        <el-button :loading="isSubmitting" type="primary" @click="submit">
          {{ tl('save') }}
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { createBridge, createRules } from '@/api/ruleengine'
import { checkNOmitFromObj, getBridgeKey } from '@/common/tools'
import DetailHeader from '@/components/DetailHeader.vue'
import useWebhookForm from '@/hooks/Webhook/useWebhookForm'
import useI18nTl from '@/hooks/useI18nTl'
import { WebhookForm } from '@/types/webhook'
import { ElMessage } from 'element-plus'
import { Ref, ref } from 'vue'
import { useRouter } from 'vue-router'
import WebhookFormCom from './components/WebhookForm.vue'

const { tl } = useI18nTl('Base')
const router = useRouter()

const FormCom = ref()

const { createRawWebhookForm, getRuleIdByName, getBridgeNameByName } = useWebhookForm()

const webhook: Ref<WebhookForm> = ref(createRawWebhookForm())
const isSubmitting = ref(false)

const setName = (data: WebhookForm) => {
  const { name } = data
  data.bridge.name = getBridgeNameByName(name)
  data.rule.id = getRuleIdByName(name)
  data.rule.actions = [getBridgeKey(data.bridge)]
  return data
}

const submit = async () => {
  try {
    await FormCom.value.validate()
    const data: any = checkNOmitFromObj(setName(webhook.value))
    isSubmitting.value = true
    // Because it is easier to report errors when creating bridge, put it in the front..
    await createBridge(data.bridge)
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
    display: flex;
    justify-content: flex-end;
  }
}
</style>
