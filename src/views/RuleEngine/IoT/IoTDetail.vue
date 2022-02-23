<template>
  <div class="iot-detail app-wrapper">
    <router-link class="back-button" :to="{ name: 'iot' }">{{ tl('backToIoTList') }}</router-link>
    <div class="section-header">
      <div>
        <span class="title-n-status">
          <span class="section-title">{{ id }}</span>
          <el-tag type="info" class="section-status">
            <span>
              <i :class="['status', !ruleInfo.enable && 'stopped']" />
              <span>{{ ruleInfo.enable ? $t('Base.enable') : $t('Base.disable') }}</span>
            </span>
          </el-tag>
        </span>
      </div>
      <div>
        <el-button type="danger" size="small">{{ $t('Base.delete') }}</el-button>
        <el-button size="small" @click="enableOrDisableRule()">
          {{ ruleInfo.enable ? $t('Base.disable') : $t('Base.enable') }}
        </el-button>
      </div>
    </div>
    <el-tabs v-model="activeTab">
      <el-tab-pane :label="tl('overview')" :name="Tab.Overview">
        <RuleItemOverview :rule-msg="ruleInfo" />
      </el-tab-pane>
      <el-tab-pane :label="tl('settings')" :name="Tab.Setting">
        <el-card shadow="never" class="app-card" v-loading="infoLoading">
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
        </el-card>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, Ref } from 'vue'
import iotform from '../components/IoTForm.vue'
import { getRuleInfo, updateRules } from '@/api/ruleengine'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import { RuleItem } from '@/types/rule'
import RuleItemOverview from './components/RuleItemOverview.vue'

enum Tab {
  Overview,
  Setting,
}

const ruleInfo: Ref<RuleItem> = ref({} as RuleItem)
const route = useRoute()
const { t } = useI18n()
const id = route.params.id as string
const iKey = ref(0)
const infoLoading = ref(false)
const activeTab = ref(Tab.Overview)

// watch(
//   () => rInfo.value,
//   (val) => {
//     console.log(val);
//   }
// );
const tl = (key: string) => t('RuleEngine.' + key)

const loadRuleDetail = async () => {
  infoLoading.value = true
  const res = await getRuleInfo(id).catch(() => {})
  if (res) {
    ruleInfo.value = res
    ++iKey.value
  }
  infoLoading.value = false
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
