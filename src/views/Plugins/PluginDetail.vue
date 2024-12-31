<template>
  <div class="plugin-detail details">
    <div class="detail-top">
      <detail-header :item="{ name: pluginInfo.name, path: '/plugins' }">
        <template #content>
          <div class="vertical-align-center">
            <p class="block-title">{{ pluginInfo.name }}</p>
            <PluginItemStatus is-tag :plugin-data="pluginInfo" />
            <el-tag type="info" class="section-status">
              {{ pluginInfo.rel_vsn }}
            </el-tag>
          </div>
        </template>
        <template #extra>
          <el-button @click="goDoc(pluginInfo)" :disabled="!isReadMoreEnable">
            {{ tl('more') }}
          </el-button>
          <el-button
            v-if="getTheWorstStatus(pluginInfo) === PluginStatus.Running"
            @click="handleDisable"
            :disabled="!$hasPermission('put')"
          >
            {{ tl('stop', 'Base') }}
          </el-button>
          <el-button @click="handleEnable" :disabled="!$hasPermission('put')" v-else>
            {{ tl('start') }}
          </el-button>
          <el-button
            type="danger"
            :disabled="!$hasPermission('delete')"
            plain
            @click="handleUninstall"
          >
            {{ tl('uninstall') }}
          </el-button>
        </template>
      </detail-header>
    </div>
    <el-tabs class="detail-tabs" type="card" v-model="currTab">
      <div>
        <el-tab-pane :label="tl('managePlugin')" name="configs" :lazy="true">
          <el-card class="app-card no-border">
            <PluginManage
              :plugin-name="pluginName"
              :plugin-version="pluginVersion"
              :plugin-with-config="pluginWithConfig"
              :is-detail-loading="isDetailLoading"
            />
          </el-card>
        </el-tab-pane>
        <el-tab-pane :label="tl('infoPlugin')" name="readme" :lazy="true">
          <el-card class="app-card no-border">
            <el-row class="plugin-info-bd" :gutter="20">
              <el-col :span="16">
                <MarkdownContent class="plugin-content" :content="pluginInfo.readme" />
              </el-col>
              <el-col :span="8">
                <PluginInfo :plugin-data="pluginInfo" />
              </el-col>
            </el-row>
          </el-card>
        </el-tab-pane>
      </div>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import type { ComputedRef, Ref } from 'vue'
import { computed, ref } from 'vue'
import { PluginDetail } from '@/types/plugin'
import { useI18n } from 'vue-i18n'
import PluginInfo from './components/PluginInfo.vue'
import { useRoute } from 'vue-router'
import usePluginItem from '@/hooks/Plugins/usePluginItem'
import { queryPluginDetail } from '@/api/plugins'
import MarkdownContent from '@/components/MarkdownContent.vue'
import DetailHeader from '@/components/DetailHeader.vue'
import { PluginStatus } from '@/types/enum'
import router from '@/router'
import PluginItemStatus from './components/PluginItemStatus.vue'
import PluginManage from './components/PluginManage.vue'

const { t } = useI18n()
const tl = (key: string, moduleName = 'Plugins') => t(`${moduleName}.${key}`)
const currTab = ref<'configs' | 'readme'>('configs')

const route = useRoute()

const pluginInfo: Ref<PluginDetail> = ref({} as PluginDetail)
const isDetailLoading = ref(false)

const pluginName: ComputedRef<string> = computed(() => route.params.pluginName.toString())
const pluginVersion: ComputedRef<string> = computed(() => route.params.pluginVersion.toString())
const isReadMoreEnable = computed(() => pluginInfo.value?.builder?.website)
const pluginWithConfig = computed(() => pluginInfo.value?.with_config_schema)

const { NAME_VERSION_JOINER, goDoc, disablePlugin, uninstall, enablePlugin, getTheWorstStatus } =
  usePluginItem()

const getPluginDetail = async () => {
  try {
    isDetailLoading.value = true
    pluginInfo.value = await queryPluginDetail(
      `${pluginName.value}${NAME_VERSION_JOINER}${pluginVersion.value}`,
    )
  } catch (error) {
    console.error(error)
  } finally {
    isDetailLoading.value = false
  }
}

const handleUninstall = async () => {
  await uninstall(pluginInfo.value)
  router.push({ name: 'plugins' })
}

const handleDisable = async () => {
  await disablePlugin(pluginInfo.value)
  getPluginDetail()
}

const handleEnable = async () => {
  await enablePlugin(pluginInfo.value)
  getPluginDetail()
}

getPluginDetail()
</script>

<style lang="scss" scoped>
.plugin-detail {
  .el-tag {
    margin-right: 12px;
  }
}
</style>
