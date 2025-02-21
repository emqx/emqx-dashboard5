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
  <span v-else-if="field == 'connected_at' || field == 'disconnected_at'">
    <span>
      {{ client[field] && dayjs(client[field]).format('YYYY-MM-DD HH:mm:ss') }}
    </span>
  </span>
  <span v-else-if="field == 'ip_address'">
    <span>{{ client.ip_address + ':' + client.port }}</span>
  </span>
  <span class="space-between vertical-align-center" v-else-if="field == 'clientid'">
    <span class="keep-spaces">{{ client[field] }}</span>
    <el-button class="btn-copy" size="small" @click="copyText(client.clientid as string)">
      {{ t('Base.copy') }}
    </el-button>
  </span>
  <span v-else-if="isSessionField">
    {{ getSessionInfoItem(field) }}
  </span>
  <span v-else>
    <span class="keep-spaces">{{ client[field] }}</span>
  </span>
</template>

<script setup lang="ts">
import CheckIcon from '@/components/CheckIcon.vue'
import { Client } from '@/types/client'
import { CheckStatus } from '@/types/enum'
import dayjs from 'dayjs'

CheckStatus

const props = defineProps<{
  client: Partial<Client>
  field: string
}>()
const clientData = computed(() => props.client)

const { t, tl } = useI18nTl('Clients')

const mqttVersion: Record<number, string> = {
  3: 'v3.1',
  4: 'v3.1.1',
  5: 'v5.0',
}

const { copyText } = useCopy()

const { getSessionInfoItem } = useClientDetail(clientData)
const { clientFields } = useClientFields()
const sessionFields = clientFields.session
const isSessionField = computed(() => sessionFields.includes(props.field))
</script>

<style lang="scss"></style>
