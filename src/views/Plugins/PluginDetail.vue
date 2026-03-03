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
          <el-button @click="handleDownloadConfig">
            {{ tl('downloadConfig') }}
          </el-button>
          <el-upload
            ref="upload"
            class="config-upload"
            :show-file-list="false"
            :auto-upload="false"
            :on-change="handleConfigUpload"
            accept=".json, .json_"
          >
            <el-button>
              {{ tl('uploadConfig') }}
            </el-button>
          </el-upload>
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
    <el-tabs ref="tabs" class="detail-tabs" v-model="currTab">
      <div class="app-wrapper">
        <el-tab-pane :label="tl('managePlugin')" name="configs" :lazy="true">
          <el-card class="app-card">
            <PluginManage
              ref="PluginManageRef"
              :plugin-name="pluginName"
              :plugin-version="pluginVersion"
              :plugin-with-config="pluginWithConfig"
              :is-detail-loading="isDetailLoading"
            />
          </el-card>
        </el-tab-pane>
        <el-tab-pane :label="tl('infoPlugin')" name="readme" :lazy="true">
          <el-card class="app-card">
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
        <el-tab-pane :label="tl('pluginUI')" name="ui" :lazy="true">
          <el-card class="app-card">
            <iframe
              :src="pluginUIUrl"
              frameborder="0"
              class="w-full"
              :style="{ height: iframeHeight + 'px' }"
              @load="setCookieForIframe"
            />
          </el-card>
        </el-tab-pane>
      </div>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { downloadPluginConfig, queryPluginDetail, uploadPluginConfig } from '@/api/plugins'
import { EMQX_AUTH_COOKIE_NAME } from '@/common/constants'
import router from '@/router'
import { PluginStatus } from '@/types/enum'
import { PluginDetail } from '@/types/plugin'
import type { UploadFile } from 'element-plus'
import PluginInfo from './components/PluginInfo.vue'
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

const handleDownloadConfig = () => {
  downloadPluginConfig(pluginName.value, pluginVersion.value)
}

const PluginManageRef = ref()
const { operationWarning } = useOperationConfirm()
const handleConfigUpload = async (file: UploadFile) => {
  try {
    await operationWarning(tl('uploadConfigConfirm'))
    await uploadPluginConfig(pluginName.value, pluginVersion.value, file)
    ElMessage.success(t('General.uploadSuccess'))
    PluginManageRef?.value?.getPluginConfigs?.()
  } catch (error) {
    console.error(error)
  }
}

const tabsRef = useTemplateRef('tabs')
const iframeHeight = ref(500)
const countIframeHeight = () => {
  const tabsEle = tabsRef.value?.$el
  const tabContent = tabsEle?.querySelector('.el-tabs__content')
  const tabContentTop = tabContent?.getBoundingClientRect()?.top
  if (!tabContentTop) {
    return
  }
  iframeHeight.value = window.innerHeight - tabContentTop - 20 * 2 - 24 - 10
}

const store = useStore()
const windowLocation = window.origin + window.location.pathname
const pluginUIUrl = computed(() => `${windowLocation}${API_BASE_URL}/plugin_api/${pluginName}/ui`)
const setCookieForIframe = () => {
  const token = store.state.user.token
  document.cookie = `${EMQX_AUTH_COOKIE_NAME}=${token}; path=/; SameSite=Lax`
  countIframeHeight()
}
const removeCookie = () => {
  document.cookie = `${EMQX_AUTH_COOKIE_NAME}=; path=/; SameSite=Lax`
}
onUnmounted(removeCookie)
</script>

<style lang="scss" scoped>
.plugin-detail {
  .el-tag {
    margin-right: 12px;
  }
  :deep(.el-page-header__extra) {
    display: flex;
    align-items: center;
  }
  .config-upload {
    margin-left: 8px;
    & + .el-button {
      margin-left: 8px;
    }
  }
}
</style>
