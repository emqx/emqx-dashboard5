<template>
  <div class="iot-detail app-wrapper">
    <router-link class="back-button" :to="{ name: 'iot' }">{{ tl('backToIoTList') }}</router-link>
    <div class="section-header">
      <div>
        <span class="title-n-status">
          <span class="section-title">{{ id }}</span>
          <RuleItemStatus :rule="ruleInfo" is-tag />
        </span>
      </div>
      <div>
        <el-button size="small" @click="testSQL" v-if="activeTab !== Tab.Setting">
          {{ tl('testsql') }}
        </el-button>
        <el-button size="small" @click="enableOrDisableRule()">
          {{ ruleInfo.enable ? $t('Base.disable') : $t('Base.enable') }}
        </el-button>
        <el-button type="danger" size="small" @click="deleteRule">
          {{ $t('Base.delete') }}
        </el-button>
      </div>
    </div>
    <el-tabs v-model="activeTab">
      <el-tab-pane :label="tl('overview')" :name="Tab.Overview">
        <RuleItemOverview :rule-msg="ruleInfo" />
      </el-tab-pane>
      <el-tab-pane :label="tl('settings')" :name="Tab.Setting" lazy>
        <div v-loading="infoLoading">
          <iotform v-model="ruleInfo" :key="iKey" />
          <el-row class="config-btn">
            <el-button
              size="small"
              type="primary"
              :loading="infoLoading"
              @click="submitUpdateRules()"
            >
              {{ $t('Base.update') }}
            </el-button>
          </el-row>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
  <SQLTestDialog
    v-model="isSQLTestDialogShow"
    :test-data="SQLTestParams"
    :first-input-item="ruleFirstInputItem"
    :ingress-bridge-list="ingressBridgeList"
    :event-list="eventList"
    :can-save="false"
  />
</template>

<script lang="ts" setup>
import { onMounted, ref, Ref } from 'vue'
import iotform from '../components/IoTForm.vue'
import {
  deleteRules,
  getBridgeList,
  getRuleEvents,
  getRuleInfo,
  updateRules,
} from '@/api/ruleengine'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ElMessage, ElMessageBox } from 'element-plus'
import { BridgeItem, RuleEvent, RuleItem } from '@/types/rule'
import RuleItemOverview from './components/RuleItemOverview.vue'
import useI18nTl from '@/hooks/useI18nTl'
import SQLTestDialog from '../components/SQLTestDialog.vue'
import { getKeywordsFromSQL } from '@/common/tools'
import { useRuleUtils } from '@/hooks/Rule/topology/useRule'
import { MQTTBridgeDirection } from '@/types/enum'
import RuleItemStatus from './components/RuleItemStatus.vue'

enum Tab {
  Overview = '0',
  Setting = '1',
}

const ruleInfo: Ref<RuleItem> = ref({} as RuleItem)
const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const id = route.params.id as string
const iKey = ref(0)
const infoLoading = ref(false)
const activeTab = ref(Tab.Overview)
const isSQLTestDialogShow = ref(false)
const SQLTestParams = ref({
  sql: '',
  context: {},
})
const ruleFirstInputItem = ref('')
const eventList: Ref<Array<RuleEvent>> = ref([])
const ingressBridgeList: Ref<Array<BridgeItem>> = ref([])

const { tl } = useI18nTl('RuleEngine')

// watch(
//   () => rInfo.value,
//   (val) => {
//     console.log(val);
//   }
// );

const loadRuleDetail = async () => {
  infoLoading.value = true
  const res = await getRuleInfo(id).catch(() => {})
  if (res) {
    ruleInfo.value = res
    ++iKey.value
  }
  infoLoading.value = false
}

const loadRuleEvents = async () => {
  try {
    eventList.value = await getRuleEvents()
  } catch (error) {
    //
  }
}

const getIngressBridgeList = async () => {
  try {
    const data = await getBridgeList()
    ingressBridgeList.value = data.filter(
      (v: BridgeItem) => 'direction' in v && v.direction === MQTTBridgeDirection.In,
    )
  } catch (error) {
    //
  }
}

const enableOrDisableRule = async () => {
  infoLoading.value = true

  const res = await updateRules(id, { enable: !ruleInfo.value.enable }).catch(() => {})
  if (res) {
    ElMessage({
      type: 'success',
      message: ruleInfo.value.enable ? t('Base.disabledSuccess') : t('Base.enableSuccess'),
    })
    ruleInfo.value.enable = !ruleInfo.value.enable
  }
  infoLoading.value = false
}

const { getTestColumns, transFromStrToFromArr, findInputTypeNTarget } = useRuleUtils()
const testSQL = async () => {
  await Promise.all([loadRuleEvents(), getIngressBridgeList()])
  const { fromStr } = getKeywordsFromSQL(ruleInfo.value.sql)
  const fromArr = transFromStrToFromArr(fromStr)
  const { type: inputType } = findInputTypeNTarget(
    fromArr[0],
    eventList.value,
    ingressBridgeList.value,
  )
  const testColumns = getTestColumns(inputType, fromArr[0], eventList.value)

  ruleFirstInputItem.value = fromArr[0]
  SQLTestParams.value = {
    sql: ruleInfo.value.sql,
    context: testColumns,
  }

  isSQLTestDialogShow.value = true
}

const deleteRule = async () => {
  await ElMessageBox.confirm(t('Base.confirmDelete'), {
    confirmButtonText: t('Base.confirm'),
    cancelButtonText: t('Base.cancel'),
    type: 'warning',
  })
  await deleteRules(id)
  ElMessage.success(t('Base.deleteSuccess'))
  router.push({ name: 'iot' })
}

const submitUpdateRules = async () => {
  infoLoading.value = true
  const { name, sql, enable, description, outputs } = ruleInfo.value
  const updateData: Partial<RuleItem> = { name, sql, enable, description, outputs }
  try {
    await updateRules(id, updateData)
    ElMessage({
      type: 'success',
      message: t('Base.updateSuccess'),
    })
    loadRuleDetail()
  } catch (error) {
    console.error(error)
  } finally {
    infoLoading.value = false
  }
}

onMounted(() => {
  loadRuleDetail()
})
</script>

<style lang="scss" scoped>
.config-btn {
  margin-top: 50px;
}

:deep(.el-tabs.el-tabs--top:not(.el-tabs--card) .el-tabs__item.is-top) {
  padding-left: 0;
  padding-right: 0;
  &::before,
  &::after {
    content: '';
    display: inline-block;
    visibility: hidden;
  }
  &::before {
    width: 20px;
  }
  &::after {
    width: 20px;
  }
}
</style>
