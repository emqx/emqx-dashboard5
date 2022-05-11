<template>
  <div class="plugin-detail app-wrapper">
    <detail-header :item="{ name: pluginInfo.name, path: '/plugins' }" />
    <div v-loading.lock="isDetailLoading">
      <div class="plugin-detail-hd">
        <div class="plugin-base-info">
          <!-- <i class="icon icon-plugin"></i> -->
          <div>
            <div>
              <PluginItemStatus is-tag :plugin-data="pluginInfo" />
              <el-tag type="info" class="section-status">
                {{ pluginInfo.rel_vsn }}
              </el-tag>
            </div>
          </div>
        </div>
        <div>
          <el-button @click="goDoc(pluginInfo)" :disabled="!isReadMoreEnable">
            {{ tl('more') }}
          </el-button>
          <el-button
            v-if="getTheWorstStatus(pluginInfo) === PluginStatus.Running"
            @click="handleDisable"
          >
            {{ tl('stop', 'Base') }}
          </el-button>
          <el-button @click="handleEnable" v-else>
            {{ tl('start') }}
          </el-button>
          <el-button type="danger" plain @click="handleUninstall">
            {{ tl('uninstall') }}
          </el-button>
        </div>
      </div>
      <el-card class="app-card">
        <div class="plugin-info-bd">
          <MarkdownContent class="plugin-content" :content="pluginInfo.readme" />
          <PluginInfo :plugin-data="pluginInfo" />
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ComputedRef, Ref, ref } from 'vue'
import { PluginDetail } from '@/types/plugin'
import { useI18n } from 'vue-i18n'
import PluginInfo from './components/PluginInfo.vue'
import { useRoute } from 'vue-router'
import usePluginStatus from '@/hooks/Plugins/usePluginStatus'
import usePluginItem from '@/hooks/Plugins/usePluginItem'
import { queryPluginDetail } from '@/api/plugins'
import MarkdownContent from '@/components/MarkdownContent.vue'
import DetailHeader from '@/components/DetailHeader.vue'
import { PluginStatus } from '@/types/enum'
import router from '@/router'
import PluginItemStatus from './components/PluginItemStatus.vue'

const { t } = useI18n()
const tl = (key: string, moduleName = 'Plugins') => t(`${moduleName}.${key}`)
const { dotClass, statusText, statusTextClass } = usePluginStatus(tl)

const route = useRoute()

const pluginInfo: Ref<PluginDetail> = ref({} as PluginDetail)
const isDetailLoading = ref(false)

const pluginName: ComputedRef<string> = computed(() => route.params.pluginName.toString())
const pluginVersion: ComputedRef<string> = computed(() => route.params.pluginVersion.toString())

const { NAME_VERSION_JOINER, goDoc, disablePlugin, uninstall, enablePlugin, getTheWorstStatus } =
  usePluginItem()

const isReadMoreEnable = computed(() => pluginInfo.value?.builder?.website)

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
@import './style/pluginInfo.scss';
.plugin-detail-hd {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}
.plugin-base-info {
  display: flex;
  line-height: 1;
  :deep(.node-status) {
    margin-right: 8px;
  }
  .el-tag {
    vertical-align: top;
  }
}
.icon-plugin {
  display: inline-block;
  width: 56px;
  height: 56px;
  margin-right: 10px;
  background: #f4fdff;
}
.plugin-name {
  position: relative;
  top: -4px;
  margin-top: 0;
  margin-bottom: 10px;
  font-size: 16px;
  font-weight: bold;
  line-height: 22px;
}
</style>
