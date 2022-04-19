<template>
  <div class="iot-detail app-wrapper">
    <detail-header :item="{ name: id, path: '/iot' }" />
    <div class="section-header">
      <div>
        <span class="title-n-status">
          <RuleItemStatus :rule="ruleInfo" is-tag />
        </span>
      </div>
      <div>
        <el-button @click="testSQL" v-if="activeTab !== Tab.Setting">
          {{ tl('testsql') }}
        </el-button>
        <el-button @click="enableOrDisableRule()">
          {{ ruleInfo.enable ? $t('Base.disable') : $t('Base.enable') }}
        </el-button>
        <el-button type="danger" plain @click="deleteRule">
          {{ $t('Base.delete') }}
        </el-button>
      </div>
    </div>
    <el-tabs v-model="activeTab">
      <el-tab-pane :label="tl('overview')" :name="Tab.Overview">
        <RuleItemOverview :rule-msg="ruleInfo" @reset="loadRuleDetail" />
      </el-tab-pane>
      <el-tab-pane :label="tl('settings')" :name="Tab.Setting" lazy>
        <div v-loading="infoLoading">
          <iotform ref="formCom" v-model="ruleInfo" :key="iKey" />
          <el-row class="config-btn">
            <el-button type="primary" :loading="infoLoading" @click="submitUpdateRules()">
              {{ $t('Base.update') }}
            </el-button>
          </el-row>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
  <SQLTestDialog
    v-model="isSQLTestDialogShow"
    :sql="SQLForTest"
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
import { MQTTBridgeDirection } from '@/types/enum'
import RuleItemStatus from './components/RuleItemStatus.vue'
import DetailHeader from '@/components/DetailHeader.vue'

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
const SQLForTest = ref('')
const eventList: Ref<Array<RuleEvent>> = ref([])
const ingressBridgeList: Ref<Array<BridgeItem>> = ref([])

const formCom = ref()

const { tl } = useI18nTl('RuleEngine')

// watch(
//   () => rInfo.value,
//   (val) => {
//     console.log(val);
//   }
// );

const loadRuleDetail = async () => {
  infoLoading.value = true
  try {
    ruleInfo.value = await getRuleInfo(id)
    ++iKey.value
  } catch (error) {
    console.error(error)
  } finally {
    infoLoading.value = false
  }
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
  try {
    await updateRules(id, { enable: !ruleInfo.value.enable })
    ElMessage.success(t(ruleInfo.value.enable ? 'Base.disabledSuccess' : 'Base.enableSuccess'))
    ruleInfo.value.enable = !ruleInfo.value.enable
  } catch (error) {
    console.error(error)
  } finally {
    infoLoading.value = false
  }
}

const testSQL = async () => {
  await Promise.all([loadRuleEvents(), getIngressBridgeList()])
  SQLForTest.value = ruleInfo.value.sql
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
  await formCom.value.validate()
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
