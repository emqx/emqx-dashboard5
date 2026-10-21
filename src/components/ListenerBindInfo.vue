<template>
  <el-tooltip
    v-if="addresses.length && isBindUnchanged"
    placement="top"
    :show-after="500"
    popper-class="listener-bind-tooltip"
  >
    <Info
      :size="13"
      class="listener-bind-info -translate-y-px"
      role="img"
      :aria-label="tl('listenerBindDetails')"
      @click.stop.prevent
    />
    <template #content>
      <div class="listener-bind-details">
        <div>{{ tl('configuredBind') }}{{ t('Base.colon') }}{{ configuredBind }}</div>
        <div v-for="(item, index) in addresses" :key="item.node || index" class="listener-address">
          <strong v-if="item.node">{{ item.node }}</strong>
          <div>
            {{ tl('effectiveListenerAddress') }}{{ t('Base.colon') }}
            {{ formatAddress(item.status) }}
          </div>
          <div>
            {{ tl('listenerAddressSource') }}{{ t('Base.colon') }}{{ formatSource(item.status) }}
          </div>
        </div>
        <div v-if="isNodeLocal" class="listener-address-note">
          {{ tl('listenerResponseNodeAddress') }}
        </div>
      </div>
    </template>
  </el-tooltip>
</template>

<script setup lang="ts">
import { Info } from 'lucide-vue-next'
import type { ListenerAddressInfo, ListenerResolvedAddress } from '@/types/listener'

const props = defineProps<{
  listener?: ListenerAddressInfo
  currentBind?: number | string
}>()

const { t, tl } = useI18nTl('Gateway')

const normalizeBind = (bind?: number | string) =>
  String(bind ?? '')
    .trim()
    .replace(/^:(\d+)$/, '$1')
const configuredBind = computed(() => normalizeBind(props.listener?.bind))
const isBindUnchanged = computed(
  () =>
    props.currentBind === undefined || normalizeBind(props.currentBind) === configuredBind.value,
)
const port = computed(() => configuredBind.value.match(/(?:^|:)(\d+)$/)?.[1])

const hasAddress = (status?: ListenerResolvedAddress) =>
  typeof status?.resolved_address === 'string' || typeof status?.resolved_address_from === 'string'

const addresses = computed(() => {
  const nodes = props.listener?.node_status
  if (Array.isArray(nodes) && nodes.some(({ status }) => hasAddress(status))) {
    return nodes.map(({ node, status }) => ({ node, status }))
  }
  return hasAddress(props.listener) ? [{ node: undefined, status: props.listener }] : []
})

const isNodeLocal = computed(
  () => addresses.value.length === 1 && addresses.value[0].status === props.listener,
)

const formatAddress = (status?: ListenerResolvedAddress) => {
  const address = status?.resolved_address
  if (address === '' && port.value) {
    return tl('listenerAllInterfacesWithPort', { port: port.value })
  }
  if (!address) {
    return t('RuleEngine.unknown')
  }
  const host = address.includes(':') && !address.startsWith('[') ? `[${address}]` : address
  const effectiveAddress = port.value ? `${host}:${port.value}` : host
  return ['0.0.0.0', '::', '[::]'].includes(address)
    ? tl('listenerAllInterfaces', { address: effectiveAddress })
    : effectiveAddress
}

const formatSource = (status?: ListenerResolvedAddress) => {
  switch (status?.resolved_address_from) {
    case 'bind':
      return tl('listenerAddressFromBind')
    case 'nodename':
      return tl('listenerAddressFromNodename')
    case '0.0.0.0':
    case '127.0.0.1':
      return tl('listenerAddressDefaultRule')
    default:
      return status?.resolved_address_from
        ? tl('listenerAddressFromDefault', { source: status.resolved_address_from })
        : t('RuleEngine.unknown')
  }
}
</script>

<style lang="scss" scoped>
.listener-bind-info {
  flex-shrink: 0;
  align-self: center;
  color: var(--el-text-color-secondary);
  cursor: pointer;
}
.listener-bind-details {
  max-width: 420px;
  max-height: 320px;
  overflow: auto;
  overflow-wrap: anywhere;
}
.listener-address,
.listener-address-note {
  margin-top: 8px;
}
</style>
