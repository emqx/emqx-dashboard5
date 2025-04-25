<template>
  <el-tag type="info" v-if="field === 'connected'">
    <CheckIcon :status="client.connected ? CheckStatus.Check : CheckStatus.Close" size="small" />
    {{ client.connected ? tl('connected') : tl('disconnected') }}
  </el-tag>
  <el-tag type="info" v-else-if="field === 'proto_type'">
    <span>{{ client.proto_name }}</span>
    &nbsp;
    <span v-if="client.proto_name === 'MQTT' && client.proto_ver !== undefined">
      {{ mqttVersion[client.proto_ver] }}
    </span>
    <span v-else>{{ client.proto_ver }}</span>
  </el-tag>
  <span class="space-between vertical-align-center" v-else-if="field == 'clientid'">
    <span class="keep-spaces">{{ client[field] }}</span>
    <el-button class="btn-copy" size="small" @click="copyText(client.clientid as string)">
      {{ t('Base.copy') }}
    </el-button>
  </span>
  <span v-else>
    <span class="keep-spaces">{{ getSimpleClientInfoValue(client, field) }}</span>
  </span>
</template>

<script setup lang="ts">
import { Client } from '@/types/client'
import { CheckStatus } from '@/types/enum'

defineProps<{
  client: Partial<Client>
  field: string
}>()

const { t, tl } = useI18nTl('Clients')

const mqttVersion: Record<number, string> = {
  3: 'v3.1',
  4: 'v3.1.1',
  5: 'v5.0',
}

const { copyText } = useCopy()
const { getSimpleClientInfoValue } = useClientInfoItem()
</script>
