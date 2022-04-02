<template>
  <div class="nav-header" :style="{ left: leftBarCollapse ? '201px' : '80px' }">
    <div>
      <div
        class="func-item"
        @click="
          () => {
            store.dispatch('SET_LEFT_BAR_COLLAPSE', !leftBarCollapse)
          }
        "
      >
        <el-icon :size="20" v-if="leftBarCollapse"><expand></expand></el-icon>
        <el-icon :size="20" v-else><fold></fold></el-icon>
      </div>
    </div>
    <div class="header-title">
      {{ $t(`components.${firstPath}`) }}
    </div>

    <div class="pull-right">
      <el-tooltip effect="dark" :content="alertText" placement="bottom" :show-arrow="false">
        <div class="alert-info func-item">
          <el-badge :is-dot="!!alertCount">
            <router-link to="/alarm" class="iconx icon-alarm"></router-link>
          </el-badge>
        </div>
      </el-tooltip>

      <el-dropdown placement="bottom" @command="handleLanguageDropdownCommand">
        <div class="user-info func-item">
          <i class="iconx icon-globe"></i>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="en" :class="{ active: lang === 'en' }">
              English
            </el-dropdown-item>
            <el-dropdown-item command="zh" :class="{ active: lang === 'zh' }">
              中文
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>

      <el-dropdown placement="bottom" @command="handleDropdownCommand">
        <div class="user-info func-item">
          <span>{{ user.username }}</span>
        </div>

        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="users">
              {{ $t('components.usersManagement') }}
            </el-dropdown-item>
            <el-dropdown-item divided command="logout">
              {{ $t('components.logOut') }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>

      <el-button class="go-link" @click="gotoCloud"> Try Cloud ➝ </el-button>
    </div>
  </div>
</template>

<script lang="ts">
import { loadAlarm } from '@/api/common'
import { toLogin } from '@/router'
import { setLanguage } from '@/common/utils'
import { useStore } from 'vuex'
import { Fold, Expand } from '@element-plus/icons-vue'
import { ElNotification, ElMessageBox } from 'element-plus'
import { computed, defineComponent, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'

export default defineComponent({
  name: 'NavHeader',
  components: {
    Fold,
    Expand,
  },
  setup() {
    const firstPath = ref('')
    const store = useStore()
    const { t } = useI18n()
    const route = useRoute()
    const router = useRouter()
    const alertCount = computed(() => {
      return store.state.alertCount
    })
    const leftBarCollapse = computed(() => {
      return store.state.leftBarCollapse
    })
    const user = computed(() => {
      return store.state.user
    })
    const lang = computed(() => {
      return store.state.lang
    })
    const alertText = computed(() => {
      return alertCount.value > 0
        ? `${t('components.theSystemHas')} ${alertCount.value} ${t(
            'components.noteAlertClickView',
          )}`
        : t('components.noWarning')
    })
    const visibilityChangeFunc = () => {
      return document.visibilityState === 'visible' && loadData()
    }
    const handleLanguageDropdownCommand = (command: string) => {
      if (lang.value === command) {
        return
      }
      setLanguage(command)
    }
    const loadData = async () => {
      const alert = (await loadAlarm().catch(() => {
        // do noting
      })) as unknown as string[]
      store.dispatch('SET_ALERT_COUNT', (alert || []).length)
    }
    const logout = () => {
      ElMessageBox.confirm(t('components.whetherToLogOutOrNot'), {
        confirmButtonText: t('components.signOut'),
        cancelButtonText: t('Base.cancel'),
        type: 'warning',
      })
        .then(() => {
          ElNotification.success(t('components.loggedOut'))
          toLogin()
        })
        .catch(() => {
          // do nothing
        })
    }
    const handleDropdownCommand = (command: string) => {
      if (!command) {
        return
      }
      if (command === 'logout') {
        return logout()
      }
      router.currentRoute.value.name !== command && router.push({ name: command })
    }
    const gotoCloud = () => {
      window.open('https://www.emqx.com/cloud', '_blank')
    }
    const setHeaderTitle = () => {
      let { path } = route || []
      let _firstPath = path.split('/')[1]
      firstPath.value = _firstPath
    }
    watch(route, () => {
      setHeaderTitle()
    })
    loadData()
    setHeaderTitle()
    setLanguage(lang.value)
    onMounted(() => {
      document.addEventListener('visibilitychange', visibilityChangeFunc)
    })
    onBeforeUnmount(() => {
      document.removeEventListener('visibilitychange', visibilityChangeFunc)
    })
    return {
      store,
      firstPath,
      leftBarCollapse,
      alertCount,
      alertText,
      user,
      lang,
      gotoCloud,
      handleDropdownCommand,
      logout,
      visibilityChangeFunc,
      handleLanguageDropdownCommand,
    }
  },
})
</script>

<style lang="scss" scoped>
.nav-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
  padding: 0 20px 0 8px;
  background-color: #fff;

  left: 201px;
  z-index: 100;
  transition: all 0.3s;
  border-bottom: 1px solid #eeeef7ff;
}

.header-title {
  font-size: 28px;
  font-weight: 600;
  padding-left: 20px;
}

.pull-right {
  font-size: 14px;
  display: flex;
  justify-content: flex-end;
  flex-grow: 1;
  align-items: center;
}

.func-item {
  padding: 0 10px;
  transition: all 0.3s;
  cursor: pointer;
}

.el-badge {
  &:deep(.is-fixed.is-dot) {
    right: 5px;
    top: 3px;
  }
}

.el-button.go-link {
  background-color: #282e38ff;
  color: #fff;
  border: 1px solid #282e38ff;
  margin-left: 10px;

  &:hover {
    background-color: #fff;
    color: #000;
    border: 1px solid #282e38ff;
  }
}
</style>
