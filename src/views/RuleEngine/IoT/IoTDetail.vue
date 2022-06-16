<template>
  <div class="iot-detail app-wrapper">
    <detail-header :item="{ name: ruleInfo.id, path: '/rules' }" />
    <div class="section-header">
      <div>
        <span class="title-n-status">
          <RuleItemStatus :rule="ruleInfo" is-tag />
        </span>
      </div>
      <div>
        <el-button type="primary" @click="loadRuleDetail()">
          {{ $t('Base.refresh') }}
        </el-button>
        <el-button @click="enableOrDisableRule()">
          {{ ruleInfo.enable ? $t('Base.disable') : $t('Base.enable') }}
        </el-button>
        <el-button type="danger" plain @click="deleteRule">
          {{ $t('Base.delete') }}
        </el-button>
      </div>
    </div>
    <el-tabs type="card" class="detail-tabs" v-model="activeTab">
      <el-tab-pane :label="tl('overview')" :name="Tab.Overview">
        <div v-loading="infoLoading">
          <RuleItemOverview :rule-msg="ruleInfo" @reset="loadRuleDetail" />
        </div>
      </el-tab-pane>
      <el-tab-pane :label="tl('settings')" :name="Tab.Setting" lazy>
        <el-card class="detail-card" v-loading="infoLoading">
          <iotform
            ref="formCom"
            v-model="ruleInfo"
            is-edit
            :submit-loading="submitLoading"
            @save="submitUpdateRules"
          />
        </el-card>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, Ref, computed } from 'vue'
import iotform from '../components/IoTForm.vue'
import { deleteRules, getRuleInfo, updateRules } from '@/api/ruleengine'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ElMessage, ElMessageBox } from 'element-plus'
import { RuleItem } from '@/types/rule'
import RuleItemOverview from './components/RuleItemOverview.vue'
import useI18nTl from '@/hooks/useI18nTl'
import RuleItemStatus from './components/RuleItemStatus.vue'
import DetailHeader from '@/components/DetailHeader.vue'

enum Tab {
  Overview = 'overview',
  Setting = 'settings',
}

const ruleInfo: Ref<RuleItem> = ref({} as RuleItem)
const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const id = route.params.id as string
const iKey = ref(0)
const infoLoading = ref(false)
const submitLoading = ref(false)
const activeTab = ref(Tab.Overview)

const formCom = ref()

const queryTab = computed(() => {
  return route.query.tab as Tab
})
if (queryTab.value) {
  activeTab.value = queryTab.value
}

const { tl } = useI18nTl('RuleEngine')

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
  submitLoading.value = true
  const { id, sql, enable, description, actions } = ruleInfo.value
  const updateData: Partial<RuleItem> = { id, sql, enable, description, actions }
  try {
    await updateRules(id, updateData)
    ElMessage.success(t('Base.updateSuccess'))
    router.push({ name: 'iot' })
  } catch (error) {
    console.error(error)
  } finally {
    submitLoading.value = false
  }
}

onMounted(() => {
  loadRuleDetail()
})
</script>

<style lang="scss">
.iot-detail {
  .el-card.detail-card {
    .el-card__body {
      padding: 0px;
    }
  }
}
</style>
