<template>
  <el-drawer
    :title="`TODO:采样器高级设置`"
    :z-index="1999"
    :destroy-on-close="true"
    :close-on-press-escape="false"
  >
    <el-radio-group v-model="selectedBlock">
      <el-radio-button :label="tl('traceConf')" :value="ConfigBlock.Trace" />
      <el-radio-button :label="tl('whiteList')" :value="ConfigBlock.WhiteList" />
    </el-radio-group>
    <el-form :model="traceConf" v-if="selectedBlock === ConfigBlock.Trace">
      <el-form-item :label="tl('traceConnect')">
        <el-switch v-model="traceConf.XXXXX" />
      </el-form-item>
      <el-form-item :label="tl('traceSubscription')">
        <el-switch v-model="traceConf.XXXXX" />
      </el-form-item>
      <el-form-item :label="tl('traceMessage')">
        <el-switch v-model="traceConf.XXXXX" />
      </el-form-item>
      <el-form-item :label="tl('traceSamplingRatio')" prop="XXXXX">
        <CustomInputNumber v-model="traceConf.XXXXX" />
      </el-form-item>
      <el-divider />
      <el-form-item :label="tl('messageTraceDetailLevel')">
        <el-select v-model="traceConf.XXXXX">
          <el-option
            v-for="{ label, value } in traceEventLevelOpts"
            :key="value"
            :value="value"
            :label="label"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <div v-else>
      <div>
        <div class="type-hd space-between">
          <p>{{ t('Base.clientid') + t('Base.wordBdy') + tl('whiteList') }}</p>
          <el-button @click="addWhiteListItem(OpenTelemetryWhiteListType.ClientID)">
            {{ t('Base.add') }}
          </el-button>
        </div>
        <el-table :data="whiteList.clientId" style="width: 100%">
          <el-table-column prop="clientid" :label="t('Base.clientid')"> </el-table-column>
          <el-table-column :label="$t('Base.operation')" width="120">
            <template #default="{ $index }">
              <el-button
                size="small"
                :disabled="!$hasPermission('put')"
                @click="editWhiteListItem(OpenTelemetryWhiteListType.ClientID, $index)"
              >
                {{ $t('Base.edit') }}
              </el-button>
              <el-button
                plain
                size="small"
                :disabled="!$hasPermission('delete')"
                @click="deleteWhiteListItem(OpenTelemetryWhiteListType.ClientID, $index)"
              >
                {{ $t('Base.delete') }}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div>
        <div class="type-hd space-between">
          <p>{{ t('Base.topic') + t('Base.wordBdy') + tl('whiteList') }}</p>
          <el-button @click="addWhiteListItem(OpenTelemetryWhiteListType.Topic)">
            {{ t('Base.add') }}
          </el-button>
        </div>
        <el-table :data="whiteList.clientId" style="width: 100%">
          <el-table-column prop="clientid" :label="t('Base.clientid')"> </el-table-column>
          <el-table-column :label="$t('Base.operation')" width="120">
            <template #default="{ $index }">
              <el-button
                size="small"
                :disabled="!$hasPermission('put')"
                @click="editWhiteListItem(OpenTelemetryWhiteListType.ClientID, $index)"
              >
                {{ $t('Base.edit') }}
              </el-button>
              <el-popconfirm :title="t('Base.confirmDelete')">
                <template #reference>
                  <el-button
                    plain
                    size="small"
                    :disabled="!$hasPermission('delete')"
                    @click="deleteWhiteListItem(OpenTelemetryWhiteListType.ClientID, $index)"
                  >
                    {{ $t('Base.delete') }}
                  </el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </el-drawer>
  <OpenTelemetryWhiteListItemDialog
    v-model="isDialogShow"
    :value="operatingItem"
    :type="operatingType"
    @confirm="confirmWhiteListItem"
  />
</template>

<script setup lang="ts">
import CustomInputNumber from '@/components/CustomInputNumber.vue'
import useI18nTl from '@/hooks/useI18nTl'
import { OpenTelemetryWhiteListType } from '@/types/enum'
import { computed, ref } from 'vue'
import OpenTelemetryWhiteListItemDialog from './OpenTelemetryWhiteListItemDialog.vue'

const { t, tl } = useI18nTl('MonitoringIntegration')

const enum ConfigBlock {
  Trace,
  WhiteList,
}

const selectedBlock = ref(ConfigBlock.Trace)

const traceConf = ref({})

const traceEventLevelOpts = [
  { label: tl('basicEvents'), value: 'TODO:' },
  { label: `${tl('basicEvents')} + QoS1 Ack`, value: 'TODO:' },
  { label: `${tl('basicEvents')} + `, value: 'TODO:' },
]

const whiteList = ref({
  clientId: [],
  topic: [],
})

const isDialogShow = ref(false)
const operatingType = ref(OpenTelemetryWhiteListType.ClientID)
const operatingList = computed(() =>
  operatingType.value === OpenTelemetryWhiteListType.ClientID
    ? whiteList.value.clientId
    : whiteList.value.topic,
)
const operatingIndex = ref(-1)
const operatingItem = computed(() => {
  if (operatingIndex.value === -1) {
    return undefined
  }
  return operatingList.value[operatingIndex.value]
})

const openDialog = (type: OpenTelemetryWhiteListType) => {
  operatingType.value = type
  isDialogShow.value = true
}
const addWhiteListItem = (type: OpenTelemetryWhiteListType) => {
  operatingIndex.value = -1
  openDialog(type)
}
const editWhiteListItem = (type: OpenTelemetryWhiteListType, index: number) => {
  operatingIndex.value = index
  openDialog(type)
}
const confirmWhiteListItem = (val: string) => {
  if (operatingIndex.value === -1) {
    operatingList.value.push(val)
  } else {
    operatingList.value.splice(operatingIndex.value, 1, val)
  }
}
const deleteWhiteListItem = (type: OpenTelemetryWhiteListType, index: number) => {
  operatingType.value = type
  operatingList.value.splice(index, 1)
}
</script>

<style lang="scss"></style>
