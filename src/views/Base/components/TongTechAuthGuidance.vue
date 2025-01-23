<template>
  <div class="tong-tech-auth-guidance">
    <i18n-t class="tong-tech-auth-guidance-title" keypath="Base.tongTechAuthGuidance" tag="p">
      <template #add>
        <el-tooltip placement="top" popper-class="is-wider auth-config-tooltip">
          <template #content>
            <CodeView :code="configView" lang="json" />
          </template>
          <el-button link type="primary">{{ lowerCase(t('Base.add')) }}</el-button>
        </el-tooltip>
      </template>
    </i18n-t>
  </div>
</template>

<script setup lang="ts">
import CodeView from '@/components/CodeView.vue'
import { lowerCase } from 'lodash'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const dashboard_addr = location.origin + location.pathname.slice(0, -1)
const configView = `dashboard {
  sso {
    // ${t('Base.tongTechAuthConfigComment')}
    tongauth {
      enable = true
      backend = tongauth
      auth_server_addr = "http://168.1.15.162:11111"
      dashboard_addr = "${dashboard_addr}"
      client_id = tongmmp_yunjian_oauth2
      client_secret = "b2c3d4e5-f678-9c0a-1b2f-4567890abcde"
    }
  }
}`
</script>

<style lang="scss">
.tong-tech-auth-guidance {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  .el-button.is-link {
    padding: 0;
    vertical-align: baseline;
    font-size: 16px;
    font-weight: normal;
  }
}
.auth-config-tooltip {
  .code-view .hljs {
    border: 1px solid #5b5e65;
  }
}
</style>
