<template>
  <el-tooltip placement="right" popper-class="tooltip-node-status-list">
    <span class="exhook-status" :class="dotClass(getTheWorstStatus(exhook))">
      <el-badge is-dot :type="dotClass(getTheWorstStatus(exhook))" />
      <span class="text-status" :class="statusTextClass(getTheWorstStatus(exhook))">
        {{ statusText(getTheWorstStatus(exhook)) }}
      </span>
    </span>
    <template #content>
      <div class="status-detail" v-if="Array.isArray(exhook.node_status)">
        <ul class="node-status-list">
          <li class="node-status-item" v-for="{ node, status } in exhook.node_status" :key="node">
            <span class="text-status" :class="statusTextClass(status)">
              {{ statusText(status) }}
            </span>
            <span class="node-name">{{ node }}</span>
          </li>
        </ul>
      </div>
    </template>
  </el-tooltip>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'ExhookItemStatus',
})
</script>

<script setup lang="ts">
import { PropType, defineProps } from 'vue'
import useExhookStatus from '@/hooks/Exhook/useExhookStatus'
import { useI18n } from 'vue-i18n'
import { Exhook } from '@/types/systemModule'

const { t } = useI18n()

const tl = (key: string, moduleName = 'Exhook') => t(`${moduleName}.${key}`)

const props = defineProps({
  exhook: {
    type: Object as PropType<Exhook>,
    required: true,
  },
})
const { getTheWorstStatus, dotClass, statusText, statusTextClass } = useExhookStatus(tl)
</script>
