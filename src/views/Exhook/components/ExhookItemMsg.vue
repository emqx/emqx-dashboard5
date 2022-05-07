<template>
  <el-table-column class="exhook-item-msg" type="expand">
    <template #default="{ row }">
      <el-row :gutter="26" v-if="row?.node_status && Array.isArray(row.node_status)">
        <el-col :span="8" v-for="{ node, status } in row.node_status" :key="node">
          <el-card>
            <el-descriptions :title="node" direction="vertical" :column="1" border>
              <el-descriptions-item :label="tl('status')">
                {{ statusText(status) }}
              </el-descriptions-item>
              <el-descriptions-item :label="t('RuleEngine.success')">
                {{ getNodeMetrics(row.node).succeed }}
              </el-descriptions-item>
              <el-descriptions-item :label="t('RuleEngine.failure')">
                {{ getNodeMetrics(row.node).failed }}
              </el-descriptions-item>
              <el-descriptions-item :label="t('Base.rate')">
                {{ getNodeMetrics(row.node).rate }} {{ t('Exhook.rateUnit') }}
              </el-descriptions-item>
            </el-descriptions>
          </el-card>
        </el-col>
      </el-row>
    </template>
  </el-table-column>
</template>

<script lang="ts" setup>
import useI18nTl from '@/hooks/useI18nTl'
import { Exhook } from '@/types/systemModule'
import { defineProps, PropType } from 'vue'
import useExhookItemStatus from '@/hooks/Exhook/useExhookItemStatus'

const props = defineProps({
  exhook: {
    type: Object as PropType<Exhook>,
  },
})

const { tl, t } = useI18nTl('Base')
const { statusText } = useExhookItemStatus()

const getNodeMetrics = (exhook, node) => {
  const target = props.exhook?.node_metrics.find((item) => item.node === node)
  return target ? target : {}
}
</script>
