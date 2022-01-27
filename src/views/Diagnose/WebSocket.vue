<template>
  <div class="app-wrapper websocket">
    <el-tabs
      v-model="activeTab"
      type="card"
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
      <el-tab-pane key="add" class="add-btn" name="add">
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
      :ref="item.name"
      :key="item.name"
      :name="item.name"
      v-model:message-count="item.messageCount"
    ></web-socket-item>
  </div>
</template>

<script>
import WebSocketItem from './components/WebSocketItem'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'

export default {
  name: 'WebSocket',
  components: { WebSocketItem, Plus },
  data() {
    return {
      activeTab: '',
      tabs: [],
    }
  },

  watch: {
    activeTab(val, oldVal) {
      const ins = this.tabs.find(($) => $.name === val)
      const insOld = this.tabs.find(($) => $.name === oldVal)

      if (insOld) {
        insOld.messageCount = 0
      }
      if (!ins) {
        ins.messageCount = 0
      }
    },
  },
  created() {
    let defaultConnName = this.calcRandomName()
    this.tabs.push({
      name: defaultConnName,
      label: this.$t('Tools.defaultConnection'),
      messageCount: 0,
    })
    this.activeTab = defaultConnName
  },

  methods: {
    calcRandomName(len = 6) {
      const b64 = (window && window.btoa) || (global && global.btoa)
      const rNum = String(Math && Math.random()).split('.')[1]
      if (b64) {
        return b64(rNum).substring(0, len)
      } else {
        return String(rNum).substring(0, len)
      }
    },
    // 活动标签切换时触发
    handleBeforeLeave(currentName) {
      if (currentName === 'add') {
        this.handleTabEdit('add')
        return false
      }
      return true
    },
    handleTabEdit(targetName) {
      if (targetName === 'add') {
        if (this.tabs.length > 6) {
          ElMessage.error(this.$t('Tools.maxSix'))
          return
        }
        const name = this.calcRandomName()
        this.tabs.push({
          name,
          label: this.$t('Tools.connectionName') + name,
          messageCount: 0,
        })
        this.activeTab = name
      } else {
        const ins = this.$refs[targetName]
        if (!ins) {
          return
        }

        if (this.activeTab === targetName) {
          this.tabs.forEach((tab, index) => {
            if (tab.name === targetName) {
              const nextTab = this.tabs[index + 1] || this.tabs[index - 1]
              if (nextTab) {
                this.activeTab = nextTab.name
              }
            }
          })
        }
        this.tabs = this.tabs.filter(($) => $.name !== targetName)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.el-tabs {
  & :deep(.el-badge__content.is-dot) {
    top: 7px;
    right: 5px;
  }
}
</style>
