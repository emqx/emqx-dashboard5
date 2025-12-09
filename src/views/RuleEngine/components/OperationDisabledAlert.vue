<template>
  <el-alert class="webhook-tip-alert" show-icon type="info" :closable="false">
    <i18n-t
      v-if="by === 'webhook'"
      keypath="RuleEngine.handleWebhookAssociatedTip"
      tag="p"
      scope="global"
    >
      <template #target>
        <span>{{ targetLabel }}</span>
      </template>
      <template #operation>
        <span>{{ lowerCase(t('Base.edit')) }}</span>
      </template>
      <template #page>
        <router-link :to="webhookRoute">Webhook {{ t('RuleEngine.page') }}</router-link>
      </template>
    </i18n-t>
    <i18n-t
      v-else-if="by === 'ns'"
      keypath="RuleEngine.namespaceResourceTip"
      tag="div"
      scope="global"
    >
      <template #target>
        <span>{{ targetLabel }}</span>
      </template>
      <template #namespace>
        <span class="font-bold">{{ data.namespace }}</span>
      </template>
    </i18n-t>
  </el-alert>
</template>

<script setup lang="ts">
import { DetailTab } from '@/types/enum'
const props = defineProps<{
  data: { name: string; namespace?: string | null } & unknown
  by: 'webhook' | 'ns'
  type: 'rule' | 'connector' | 'action' | 'source' | 'webhook'
}>()

const { t } = useI18nTl('RuleEngine')

const { getNsParams } = useNsParams()
const webhookRoute = computed(() => ({
  name: 'webhook-detail',
  params: { name: props.data.name },
  query: { tab: DetailTab.Setting, ...getNsParams(props.data.namespace) },
}))

const targetLabelMap = new Map([
  ['rule', lowerCase(t('RuleEngine.rule'))],
  ['connector', lowerCase(t('RuleEngine.connector'))],
  ['action', lowerCase(t('RuleEngine.action'))],
  ['source', 'source'],
  ['webhook', 'Webhook'],
])
const targetLabel = computed(() => targetLabelMap.get(props.type))
</script>
