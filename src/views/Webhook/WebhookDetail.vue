<template>
  <div class="webhook-detail app-wrapper">
    <el-card class="webhook-create-card">
      <WebhookFormCom v-model="webhookData" />
      <div class="card-ft">
        <el-button :loading="isSubmitting" type="primary" @click="submit">
          {{ tl('save') }}
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { getBridgeInfo, getRuleInfo, updateBridge, updateRules } from '@/api/ruleengine'
import { checkNOmitFromObj, getBridgeKey } from '@/common/tools'
import useRuleForm from '@/hooks/Rule/rule/useRuleForm'
import useWebhookForm from '@/hooks/Webhook/useWebhookForm'
import useI18nTl from '@/hooks/useI18nTl'
import { BridgeType } from '@/types/enum'
import { ElMessage } from 'element-plus'
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import WebhookFormCom from './components/WebhookForm.vue'

const route = useRoute()
const router = useRouter()

const { tl } = useI18nTl('Base')

const webhookName = computed(() => route.params.name.toString())
const bridgeId = computed(() => {
  const bridgeName = getBridgeNameByName(webhookName.value)
  return getBridgeKey({ type: BridgeType.Webhook, name: bridgeName })
})
const ruleId = computed(() => getRuleIdByName(webhookName.value))

const { createRawWebhookForm, getRuleIdByName, getBridgeNameByName } = useWebhookForm()
const webhookData = ref(createRawWebhookForm())
const isSubmitting = ref(false)

const getWebhookData = async () => {
  if (!webhookName.value) {
    return
  }
  const [bridgeData, ruleData] = await Promise.all([
    getBridgeInfo(bridgeId.value),
    getRuleInfo(ruleId.value),
  ])
  webhookData.value = {
    name: webhookName.value,
    rule: ruleData,
    bridge: bridgeData,
  }
}

const { getRuleDataForUpdate } = useRuleForm()
const submit = async () => {
  const data: any = checkNOmitFromObj(webhookData.value)
  try {
    isSubmitting.value = true
    // Because it is easier to report errors when creating bridge, put it in the front..
    await updateBridge(bridgeId.value, data.bridge)
    await updateRules(ruleId.value, getRuleDataForUpdate(data.rule))
    ElMessage.success(tl('updateSuccess'))
    router.push({ name: 'webhook' })
  } catch (error) {
    //
  } finally {
    isSubmitting.value = false
  }
}

getWebhookData()
</script>

<style lang="scss">
.webhook-detail {
  .card-ft {
    display: flex;
    justify-content: flex-end;
  }
}
</style>
