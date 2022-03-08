<template>
  <div>
    <p class="preview-title">{{ tl('parametersPreview') }} - {{ bridgeId }}</p>
    <BridgeHttpConfig
      v-if="bridgeData?.type === BridgeType.HTTP"
      v-model="bridgeData"
      :disabled="true"
    />
    <BridgeMqttConfig
      v-else-if="bridgeData?.type === BridgeType.MQTT"
      v-model="bridgeData"
      :disabled="true"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'BridgePreview',
})
</script>

<script setup lang="ts">
import useI18nTl from '@/hooks/useI18nTl'
import { BridgeType } from '@/types/enum'
import { BridgeItem } from '@/types/rule'
import { computed, defineProps, PropType } from 'vue'
import BridgeHttpConfig from '../Bridge/BridgeHttpConfig.vue'
import BridgeMqttConfig from '../Bridge/BridgeMqttConfig.vue'

const props = defineProps({
  bridgeId: {
    type: String,
    required: true,
  },
  bridgeList: {
    type: Array as PropType<Array<BridgeItem>>,
  },
})

const { tl } = useI18nTl('RuleEngine')

const bridgeData = computed(() => {
  return props.bridgeList?.find(({ id }) => id === props.bridgeId)
})
</script>

<style lang="scss" scoped>
.preview-title {
  margin: 8px 0 16px;
  font-size: 18px;
}
</style>
