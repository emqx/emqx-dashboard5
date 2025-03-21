<template>
  <div class="webhook app-wrapper">
    <template v-if="!isEmpty">
      <div class="section-header">
        <div></div>
        <CreateButton :disabled="isLoading" @click="addWebhook" />
      </div>
      <el-table :data="webhookList" v-loading="isLoading">
        <el-table-column prop="name" :label="t('Base.name')">
          <template #default="{ row }">
            <router-link :to="{ name: 'webhook-detail', params: { name: row.name } }">
              {{ row.name }}
            </router-link>
          </template>
        </el-table-column>
        <el-table-column label="URL">
          <template #default="{ row }">
            {{ row.connector?.url }}
          </template>
        </el-table-column>
        <el-table-column prop="enable" :label="$t('Base.isEnabled')" :min-width="92">
          <template #default="{ row }">
            <el-switch v-model="row.enable" @change="handleToggleStatus(row)" />
          </template>
        </el-table-column>
        <el-table-column :label="$t('Base.operation')">
          <template #default="{ row }">
            <TableButton @click="goEditWebhook(row.name)">
              {{ $t('Base.setting') }}
            </TableButton>
            <TableButton :loading="deleteLoading" @click="handleDeleteWebhook(row)">
              {{ $t('Base.delete') }}
            </TableButton>
            <!-- <TableItemDropdown :row-data="row" /> -->
          </template>
        </el-table-column>
      </el-table>
    </template>
    <div v-else class="webhook-placeholder-container">
      <img class="img-placeholder" width="480" :src="getImgSrc()" alt="webhook_placeholder" />
      <el-button type="primary" @click="addWebhook">{{ $t('Base.create') }} Webhook</el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import useWebhookItem from '@/hooks/Webhook/useWebhookItem'
import useWebhookList from '@/hooks/Webhook/useWebhookList'
import useI18nTl from '@/hooks/useI18nTl'
import { DetailTab } from '@/types/enum'
import { WebhookItem } from '@/types/webhook'
import { ElMessage } from 'element-plus'
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

const router = useRouter()
const { t } = useI18nTl('RuleEngine')
const store = useStore()

const theme = computed(() => {
  return store.state.theme
})

const getImgSrc = () => {
  try {
    return require(`@/assets/img/webhook-placeholder-${theme.value}.png`)
  } catch (error) {
    return ''
  }
}

const { webhookList, isLoading, isEmpty, getWebhookList } = useWebhookList()
const { toggleWebhookEnableStatus, deleteLoading, deleteWebhook } = useWebhookItem()

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

const handleDeleteWebhook = async (webhook: WebhookItem) => {
  try {
    await deleteWebhook(webhook)
    getWebhookList()
  } catch (error) {
    //
  }
}

const goEditWebhook = (webhookName: string) => {
  router.push({
    name: 'webhook-detail',
    params: { name: webhookName },
    query: { tab: DetailTab.Setting },
  })
}
</script>

<style lang="scss">
.webhook {
  width: 100%;
  height: 100%;
  .webhook-placeholder-container {
    display: flex;
    flex-direction: column;
    height: 70vh;
    align-items: center;
    justify-content: center;
  }
  .img-placeholder {
    margin-bottom: 48px;
  }
}
</style>
