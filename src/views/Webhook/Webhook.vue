<template>
  <div class="webhook app-wrapper">
    <template v-if="!isEmpty || namespaceFilter || isLoading">
      <div class="section-header">
        <el-row :gutter="20" justify="space-between">
          <el-col v-bind="colProps">
            <NamespaceSelect
              v-if="isMultiTenancyEnabled && !isNamespaceUser"
              v-model="namespaceFilter"
              :placeholder="t('BasicConfig.namespace')"
              :global="{ enable: true, value: GLOBAL_NAMESPACE_VALUE }"
              @change="getWebhookList"
            />
          </el-col>
          <el-col v-bind="colProps">
            <div class="flex justify-end">
              <CreateButton :disabled="isLoading || !$hasPermission('post')" @click="addWebhook" />
            </div>
          </el-col>
        </el-row>
      </div>
      <el-table :data="webhookList" v-loading="isLoading">
        <el-table-column prop="name" :label="t('Base.name')">
          <template #default="{ row }">
            <router-link
              :to="{
                name: 'webhook-detail',
                params: { name: row.name },
                query: getNsParams(row.rule.namespace),
              }"
            >
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
            <OperationDisabledPopover
              :disabled-by-webhook="true"
              :name="row.id"
              target-label="Webhook"
              :namespace="row.rule.namespace"
              :operation="`${t('Base.enable')}${tl('or')}${t('Base.disable')}`"
            >
              <template #default="{ disabledOpByNsResource }">
                <el-switch
                  v-model="row.enable"
                  :disabled="!$hasPermission('put') || disabledOpByNsResource"
                  @change="handleToggleStatus(row)"
                />
              </template>
            </OperationDisabledPopover>
          </template>
        </el-table-column>
        <el-table-column
          v-if="isMultiTenancyEnabled && !isNamespaceUser"
          prop="rule.namespace"
          :label="t('BasicConfig.namespace')"
          :min-width="108"
        />
        <el-table-column :label="$t('Base.operation')">
          <template #default="{ row }">
            <TableButton :disabled="!$hasPermission('put')" @click="goEditWebhook(row)">
              {{ $t('Base.edit') }}
            </TableButton>
            <OperationDisabledPopover
              :disabled-by-webhook="true"
              :name="row.id"
              target-label="Webhook"
              :namespace="row.rule.namespace"
              :operation="`${t('Base.enable')}${tl('or')}${t('Base.disable')}`"
            >
              <template #default="{ disabledOpByNsResource }">
                <TableButton
                  :disabled="!$hasPermission('delete') || disabledOpByNsResource"
                  :loading="deleteLoading"
                  @click="handleDeleteWebhook(row)"
                >
                  {{ $t('Base.delete') }}
                </TableButton>
              </template>
            </OperationDisabledPopover>

            <!-- <TableItemDropdown :row-data="row" /> -->
          </template>
        </el-table-column>
      </el-table>
    </template>
    <div v-else class="webhook-placeholder-container">
      <img class="img-placeholder" width="480" :src="placeholderImg" alt="webhook_placeholder" />
      <el-button type="primary" :disabled="!$hasPermission('post')" @click="addWebhook">
        {{ $t('Base.create') }} Webhook
      </el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import placeholderImgDark from '@/assets/img/webhook-placeholder-dark.png'
import placeholderImgLight from '@/assets/img/webhook-placeholder-light.png'
import { SEARCH_FORM_RES_PROPS as colProps } from '@/common/constants'
import useMultiTenancyEnabled from '@/hooks/Config/useMultiTenancyEnabled'
import { DetailTab } from '@/types/enum'
import { WebhookItem } from '@/types/webhook'
import OperationDisabledPopover from '../RuleEngine/components/OperationDisabledPopover.vue'

const router = useRouter()
const { t, tl } = useI18nTl('RuleEngine')
const store = useStore()
const isMultiTenancyEnabled = useMultiTenancyEnabled()

const theme = computed(() => store.state.theme)

const placeholderImg = computed(() =>
  theme.value === 'dark' ? placeholderImgDark : placeholderImgLight,
)

const { namespaceFilter, webhookList, isLoading, isEmpty, getWebhookList } = useWebhookList()
const { toggleWebhookEnableStatus, deleteLoading, deleteWebhook } = useWebhookItem()

const isNamespaceUser = computed(() => store.getters.isNamespaceUser)
const { getNsParams } = useNsParams()

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

const goEditWebhook = (webhook: WebhookItem) => {
  router.push({
    name: 'webhook-detail',
    params: { name: webhook.name },
    query: { tab: DetailTab.Setting, ...getNsParams((webhook.rule as any).namespace) },
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
