<template>
  <div class="websocket">
    <el-tabs
      v-model="activeTab"
      type="card"
      class="detail-tabs"
      :before-leave="handleBeforeLeave"
      @tab-remove="handleTabEdit"
    >
      <el-tab-pane v-for="(item, i) in tabs" :key="item.name" :closable="i > 0" :name="item.name">
        <template #label>
          <span>
            <el-badge
              class="message-count"
              :hidden="item.messageCount === 0"
              :value="item.messageCount"
              is-dot
            >
              {{ item.label }}
            </el-badge>
          </span>
        </template>
      </el-tab-pane>
      <el-tab-pane v-if="showAddTab" key="add" class="add-btn" name="add">
        <template #label>
          <span :title="$t('Tools.createNew')">
            <el-icon><Plus /></el-icon>
          </span>
        </template>
      </el-tab-pane>
    </el-tabs>

    <web-socket-item
      v-for="item in tabs"
      v-show="item.name === activeTab"
      :ref="(el:typeof WebSocketItem) => storeItemRef(item.name, el)"
      :key="item.name"
      :name="item.name"
      class="websocket-item"
      v-model:message-count="item.messageCount"
    />
  </div>
</template>

<script lang="ts" setup>
import WebSocketItem from './components/WebSocketItem.vue'
import { ElMessage, TabPanelName } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import type { Ref } from 'vue'
import { nextTick, ref, watch } from 'vue'
import useI18nTl from '@/hooks/useI18nTl'

interface TabItem {
  name: string
  label: string
  messageCount: number
}

const { tl } = useI18nTl('Tools')

const activeTab = ref('')
const tabs: Ref<Array<TabItem>> = ref([])
const showAddTab = ref(true)

const WebSocketItemRefMap = ref(new Map())

watch(activeTab, (val, oldVal) => {
  const ins = tabs.value.find(($) => $.name === val)
  const oldIns = tabs.value.find(($) => $.name === oldVal)

  if (oldIns) {
    oldIns.messageCount = 0
  }
  if (ins) {
    ins.messageCount = 0
  }
})

const storeItemRef = (name: string, el: typeof WebSocketItem) => {
  WebSocketItemRefMap.value.set(name, el)
}

const calcRandomName = (len = 6) => {
  const b64 = (window && window.btoa) || (global && global.btoa)
  const rNum = String(Math && Math.random()).split('.')[1]
  if (b64) {
    return b64(rNum).substring(0, len)
  }
  return String(rNum).substring(0, len)
}

/**
 * hack for keep add tab is the last tab
 */
const controlShowAddTab = async () => {
  showAddTab.value = false
  await nextTick()
  showAddTab.value = true
}

const handleBeforeLeave = (currentName: TabPanelName) => {
  if (currentName === 'add') {
    handleTabEdit('add')
    controlShowAddTab()
    return false
  }
  return true
}

const addNewTab = () => {
  if (tabs.value.length > 6) {
    ElMessage.error(tl('maxSix'))
    return
  }
  const name = calcRandomName()
  tabs.value.push({
    name,
    label: tabs.value.length === 0 ? tl('defaultConnection') : tl('connectionName') + name,
    messageCount: 0,
  })
  activeTab.value = name
}

const removeTab = (name: string) => {
  const ins = WebSocketItemRefMap.value.get(name)
  if (!ins) {
    return
  }
  if (activeTab.value === name) {
    for (let index = 0; index < tabs.value.length; index++) {
      if (tabs.value[index].name === name) {
        const nextTab = tabs.value[index + 1] || tabs.value[index - 1]
        if (nextTab) {
          activeTab.value = nextTab.name
          break
        }
      }
    }
  }
  tabs.value = tabs.value.filter(($) => $.name !== name)
}

const handleTabEdit = (targetName: TabPanelName) => {
  if (targetName === 'add') {
    addNewTab()
  } else if (typeof targetName === 'string') {
    removeTab(targetName)
  }
}

addNewTab()
</script>

<style lang="scss" scoped>
.websocket {
  padding-top: 16px;
  .el-tabs.detail-tabs {
    margin-bottom: 0;
    border-bottom: none;
  }
}
.websocket-item {
  margin-left: 16px;
  margin-right: 16px;
  margin-bottom: 16px;
  border-top: none;
}
.el-tabs {
  :deep(.el-tabs__header) {
    .el-tabs__item.is-active {
      border-bottom: 1px solid var(--color-bg-main);
    }
  }
  & :deep(.el-badge__content.is-dot) {
    top: 7px;
    right: 5px;
  }
}
</style>

<style lang="scss">
.websocket-item {
  .el-card__body {
    padding-top: 0;
  }
}
</style>
