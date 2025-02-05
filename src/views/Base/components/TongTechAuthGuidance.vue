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
      <template #configFile>
        <el-tooltip placement="top" popper-class="is-wider auth-config-tooltip">
          <template #content>
            <MarkdownContent :content="configFileDesc" in-tooltip />
          </template>
          <el-button link type="primary">{{ lowerCase(t('Base.configFile')) }}</el-button>
        </el-tooltip>
      </template>
    </i18n-t>
  </div>
</template>

<script setup lang="ts">
import CodeView from '@/components/CodeView.vue'
import MarkdownContent from '@/components/MarkdownContent.vue'
import { lowerCase } from 'lodash'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()
const dashboard_addr = location.origin + location.pathname.slice(0, -1)
const configView = `dashboard {
  sso {
    // ${t('Base.tongTechAuthConfigComment')}
    tongauth {
      enable = true
      backend = tongauth
      auth_server_addr = "http://168.1.15.162:11111"
      dashboard_addr = "${dashboard_addr}"AI
      client_id = tongmmp_yunjian_oauth2
      client_secret = "b2c3d4e5-f678-9c0a-1b2f-4567890abcde"
    }
  }
}`

const zhConfigFileDesc = `配置文件目录位置
| 安装方式               | 路径                     |
| ---------------------- | ------------------------ |
| 使用 RPM 或 DEB 包安装 |  \`/var/lib/emqx/configs \`  |
| 在 Docker 容器中运行   |  \`/opt/emqx/data/configs \` |
| 从便携式压缩包中提取   |  \`./data/configs \`         |

目录下的 \`cluster.hocon\` 文件
`

const enConfigFileDesc = `The location of the configuration file directory
| Installation                               | Path                     |
| ------------------------------------------ | ------------------------ |
| Installed with RPM or DEB package          | \`/var/lib/emqx/configs\`  |
| Running in docker container                | \`/opt/emqx/data/configs\` |
| Extracted from portable compressed package | \`./data/configs\`         |

The \`cluster.hocon\` file in the directory
`

const configFileDesc = computed(() => {
  return locale.value === 'zh' ? zhConfigFileDesc : enConfigFileDesc
})
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
    margin-left: 0;
  }
}
.auth-config-tooltip {
  .code-view .hljs {
    border: 1px solid #5b5e65;
  }
}
</style>
