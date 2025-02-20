<template>
  <el-card shadow="never" class="mqtt-doc-list card-second-doc with-border">
    <template #header>
      <div class="card-header">
        <span>{{ tl('exploreMqtt') }}</span>
        <el-tooltip :content="$t('Base.moreAboutMQTT')" placement="top">
          <el-button :icon="MoreFilled" class="icon-button" text @click="openMqttBlogs"></el-button>
        </el-tooltip>
      </div>
    </template>
    <div class="sub-block-docs">
      <ul class="list-link">
        <li class="item-link" v-for="{ link, title } in docList" :key="link">
          <a :href="link" target="_blank" class="vertical-align-center">
            <span>{{ title }}</span>
            <el-icon><Right /></el-icon>
          </a>
        </li>
      </ul>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import useI18nTl from '@/hooks/useI18nTl'
import { Right, MoreFilled } from '@element-plus/icons-vue'
import useDocLink from '@/hooks/useDocLink'

interface Doc {
  link: string
  title: string
}

defineProps({
  docList: {
    type: Array as PropType<Array<Doc>>,
  },
})

const { tl } = useI18nTl('Settings')
const { docMap } = useDocLink()
const openMqttBlogs = () => {
  window.open(docMap.moreAboutMqtt, '_blank', 'noopener noreferrer')
}
</script>

<style lang="scss">
.mqtt-doc-list {
  margin-bottom: 24px;
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    .item-link {
      margin-bottom: 24px;
      &:last-child {
        margin-bottom: 0;
      }
      .el-icon {
        margin-left: 12px;
      }
    }
  }
  .el-card__header {
    padding: 12px var(--el-card-padding);
  }
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
