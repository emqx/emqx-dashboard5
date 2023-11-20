<template>
  <div class="connector-detail">
    <div class="detail-top">
      <detail-header v-if="!isFromRule" :item="{ name: connectorName, routeName: 'connector' }" />
      <div v-if="!isFromRule" class="section-header">
        <div>
          <img :src="getBridgeIcon(connectorData.type)" />
          <div class="title-n-status">
            <div class="info-tags">
              <TargetItemStatus :bridge="connectorData" is-tag />
              <el-tag type="info" class="section-status">
                {{ getTypeStr(connectorData) }}
              </el-tag>
            </div>
          </div>
        </div>
        <div>
          <el-tooltip
            :content="connectorData.enable ? $t('Base.disable') : $t('Base.enable')"
            placement="top"
          >
            <el-switch
              class="enable-btn"
              v-model="connectorData.enable"
              @change="toggleConnectorEnable"
            />
          </el-tooltip>
          <!-- TODO:TODO:TODO: -->
          <el-tooltip :content="$t('Base.delete')" placement="top" :disabled="connectorData.XXXXX">
            <el-button class="icon-button" type="danger" :icon="Delete" @click="handleDelete" plain>
            </el-button>
          </el-tooltip>
        </div>
      </div>
      <div>
        <el-alert v-if="pwdErrorWhenCoping" :title="pwdErrorWhenCoping" type="error" />
        <el-card
          v-loading="isLoading"
          :class="['app-card', isFromRule && 'app-inline-card']"
          :shadow="isFromRule ? 'never' : undefined"
        >
          <div class="form-container"></div>
          <div class="btn-area">
            <el-button @click="saveAsCopy">
              {{ tl('saveAsCopy') }}
            </el-button>
            <el-button
              v-if="connectorData.type"
              type="primary"
              plain
              :loading="isTesting"
              @click="testConnectivity(connectorData)"
            >
              {{ tl('testTheConnection') }}
            </el-button>
            <el-button
              type="primary"
              v-if="connectorData.type"
              :loading="isSubmitting"
              @click="submit"
            >
              {{ $t('Base.update') }}
            </el-button>
          </div>
        </el-card>
      </div>
    </div>
  </div>
  <CopySubmitDialog v-model="showNameInputDialog" :target="copyTarget" />
</template>

<script setup lang="ts">
import { deleteConnector, putConnector } from '@/api/connector'
import { customValidate } from '@/common/tools'
import DetailHeader from '@/components/DetailHeader.vue'
import { useBridgeTypeIcon, useBridgeTypeOptions } from '@/hooks/Rule/bridge/useBridgeTypeValue'
import useCheckBeforeSaveAsCopy from '@/hooks/Rule/bridge/useCheckBeforeSaveAsCopy'
import useTestConnector from '@/hooks/Rule/connector/useTestConnector'
import { useConnectorDataHandler } from '@/hooks/Rule/useDataHandler'
import useI18nTl from '@/hooks/useI18nTl'
import useOperationConfirm from '@/hooks/useOperationConfirm'
import { Connector } from '@/types/rule'
import { Delete } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import CopySubmitDialog from '../components/CopySubmitDialog.vue'
import TargetItemStatus from '../components/TargetItemStatus.vue'

const route = useRoute()
const router = useRouter()
const isFromRule = computed(() => ['iot-detail', 'iot-create'].includes(route.name as string))

const { t, tl } = useI18nTl('RuleEngine')

const FormCom = ref()

const isLoading = ref(false)
const connectorData = ref<Connector>({} as Connector)

const showNameInputDialog = ref(false)
const duplication = ref<Connector>({} as Connector)
const copyTarget = computed<{ type: 'connector'; obj: Connector }>(() => ({
  type: 'connector',
  obj: duplication.value,
}))

const connectorName = computed(() => connectorData.value.name)
const { getBridgeIcon } = useBridgeTypeIcon()
const { getTypeStr } = useBridgeTypeOptions()

const toggleConnectorEnable = async () => {}

const { operationWarning, confirmDel } = useOperationConfirm()
const handleDelete = async () => {
  try {
    await confirmDel(() => deleteConnector(connectorData.value.id))
    router.push({ name: 'connector' })
  } catch (error) {
    //
  }
}

const { isTesting, testConnectivity } = useTestConnector()

const { handleConnectorDataBeforeSubmit, handleConnectorDataForSaveAsCopy } =
  useConnectorDataHandler()
const { pwdErrorWhenCoping, checkLikePwdField } = useCheckBeforeSaveAsCopy()
const saveAsCopy = async () => {
  try {
    await customValidate(FormCom.value)
    await checkLikePwdField(connectorData.value)
    duplication.value = handleConnectorDataForSaveAsCopy(connectorData.value)
    showNameInputDialog.value = true
  } catch (error) {
    //
  }
}

const isSubmitting = ref(false)
const submit = async () => {
  try {
    await customValidate(FormCom.value)
    // TODO: some confirm when submit in bridge/rule page
    // TODO: confirm update
    await operationWarning(tl('updateBridgeTip'))
    isSubmitting.value = true
    const data = await handleConnectorDataBeforeSubmit(connectorData.value)
    const res = await putConnector(data.id, data)
    if (!isFromRule.value) {
      ElMessage.success(t('Base.updateSuccess'))
      router.push({ name: 'connector' })
    }
    return Promise.resolve(res.id)
  } catch (error) {
    //
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style lang="scss"></style>
