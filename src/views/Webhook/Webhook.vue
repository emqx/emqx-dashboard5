<template>
  <div class="webhook app-wrapper">
    <div class="section-header">
      <div></div>
      <el-button type="primary" @click="addWebhook" :icon="Plus">
        {{ $t('Base.create') }}
      </el-button>
    </div>
    <el-table :data="webhookList" v-loading="isLoading">
      <el-table-column prop="name" :label="t('Base.name')" />
      <el-table-column label="URL">
        <template #default="{ row }">
          {{ row.bridge?.url }}
        </template>
      </el-table-column>
      <el-table-column prop="enable" :label="$t('Base.isEnabled')" :min-width="92">
        <template #default="{ row }">
          <el-switch v-model="row.enable" @change="handleToggleStatus(row)" />
        </template>
      </el-table-column>
      <el-table-column :label="$t('Base.operation')">
        <template #default="{ row }">
          <el-button size="small" @click="goEditWebhook(row.name)">
            {{ $t('Base.edit') }}
          </el-button>
          <!-- <TableItemDropdown :row-data="row" /> -->
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts" setup>
import useWebhookItem from '@/hooks/Webhook/useWebhookItem'
import useWebhookList from '@/hooks/Webhook/useWebhookList'
import useI18nTl from '@/hooks/useI18nTl'
import { WebhookItem } from '@/types/webhook'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'

const router = useRouter()
const { t } = useI18nTl('RuleEngine')

const { webhookList, isLoading, getWebhookList } = useWebhookList()
const { toggleWebhookEnableStatus } = useWebhookItem()

const addWebhook = () => {
  router.push({ name: 'webhook-create' })
}

const handleToggleStatus = async (webhook: WebhookItem) => {
  const sucMessage = webhook.enable ? 'Base.enableSuccess' : 'Base.disabledSuccess'
  try {
    await toggleWebhookEnableStatus(webhook)
    ElMessage.success(t(sucMessage))
    getWebhookList()
  } catch (error) {
    webhook.enable = !webhook.enable
  }
}

const goEditWebhook = (webhookName: string) => {
  router.push({ name: 'webhook-detail', params: { name: webhookName } })
}
</script>
