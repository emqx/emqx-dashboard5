<template>
  <el-dialog
    :title="tl('upgradeRecords')"
    v-model="showDialog"
    class="records-dialog"
    width="75%"
    destroy-on-close
  >
    <el-table :data="list">
      <el-table-column :label="tl('startedAt')">
        <template #default="{ row }">
          {{ dayjs(row.started_at).format('YYYY-MM-DD HH:mm:ss') }}
        </template>
      </el-table-column>
      <el-table-column :label="tl('finishedAt')">
        <template #default="{ row }">
          {{ dayjs(row.finished_at).format('YYYY-MM-DD HH:mm:ss') }}
        </template>
      </el-table-column>
      <el-table-column prop="from_vsn" :label="tl('fromVsn')" />
      <el-table-column prop="target_vsn" :label="tl('targetVsn')" />
      <el-table-column :label="t('Base.status')">
        <template #default="{ row }">
          {{ getNodeStatusLabel(row.status) }}
        </template>
      </el-table-column>
      <el-table-column :label="t('Clients.result')">
        <template #default="{ row }">
          <span>{{ getResultLabel(row.result) }}</span>
          <InfoTooltip v-if="!isSucResult(row.result)" :content="stringifyObjSafely(row.result)" />
        </template>
      </el-table-column>
    </el-table>
    <template #footer>
      <el-button @click="showDialog = false">
        {{ t('APIKey.close') }}
      </el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import InfoTooltip from '@/components/InfoTooltip.vue'

import { NodeUpgradeData } from '@/types/typeAlias'
import { stringifyObjSafely } from '@emqx/shared-ui-utils'
import dayjs from 'dayjs'

const props = defineProps<{ modelValue: boolean; node?: NodeUpgradeData }>()
const emit = defineEmits(['update:modelValue'])

const showDialog = computed({
  get: () => props.modelValue,
  set: (val: boolean) => {
    emit('update:modelValue', val)
  },
})

const { t, tl } = useI18nTl('General')

const list = computed(() => props?.node?.upgrade_history || [])

const isUpgrading = (status: string) => status === 'in-progress'

const getNodeStatusLabel = (status: string) =>
  isUpgrading(status) ? tl('upgrading') : tl('finished')

const isSucResult = (result: string | Record<string, any>) => result === 'success'
const getResultLabel = (result: string | Record<string, any>) =>
  isSucResult(result) ? t('Base.success') : t('Base.failed')
</script>
