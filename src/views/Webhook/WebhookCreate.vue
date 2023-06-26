<template>
  <div class="app-wrapper">
    <el-card class="webhook-create-card">
      <WebhookFormCom v-model="webhook" />
      <div class="card-ft">
        <el-button :loading="isSubmitting" type="primary" @click="submit">{{
          tl('save')
        }}</el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, Ref } from 'vue'
import WebhookFormCom from './components/WebhookForm.vue'
import useWebhookForm from '@/hooks/Webhook/useWebhookForm'
import useI18nTl from '@/hooks/useI18nTl'
import { createRules, createBridge, testConnect } from '@/api/ruleengine'
import { WebhookForm } from '@/types/webhook'
import { WEBHOOK_PREFIX } from '@/common/constants'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import { checkNOmitFromObj } from '@/common/tools'
import { getBridgeKey } from '@/common/tools'

const { tl } = useI18nTl('Base')
const router = useRouter()

const { createRawWebhookForm } = useWebhookForm()

const webhook: Ref<WebhookForm> = ref(createRawWebhookForm())
const isSubmitting = ref(false)

const setName = (data: WebhookForm) => {
  const { name } = data
  data.bridge.name = `${WEBHOOK_PREFIX}${name}`
  data.rule.id = `${WEBHOOK_PREFIX}${name}`
  data.rule.actions = [getBridgeKey(data.bridge)]
  return data
}

const submit = async () => {
  const data: any = checkNOmitFromObj(setName(webhook.value))
  try {
    isSubmitting.value = true
    // Because it is easier to report errors when creating bridge, put it in the front..
    const bridge = await createBridge(data.bridge)
    await createRules({ ...data.rule, actions: [bridge.id] })
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
