<template>
  <el-drawer
    :title="$t('components.help')"
    v-model="showDrawer"
    size="600px"
    destroy-on-close
    class="help"
  >
    <el-row class="website-links" :gutter="16">
      <el-col :span="8" v-for="{ link, icon, title } in platformList" :key="link">
        <a :href="link" target="_blank" rel="noopener noreferrer">
          <el-card class="card-link" shadow="never">
            <div class="card-icon">
              <component :is="icon" class="icon-platform" />
            </div>
            <p class="text-title">{{ title }}</p>
          </el-card>
        </a>
      </el-col>
    </el-row>
    <el-row class="docs-links">
      <el-col :span="24" class="flex-column">
        <template v-for="({ link, title }, $index) in emqxDocumentList" :key="link">
          <div class="text-large">
            <a
              :href="link"
              target="_blank"
              rel="noopener noreferrer"
              class="vertical-align-center space-between"
            >
              <span>{{ title }}</span>
              <el-icon :size="20"><Right /></el-icon>
            </a>
          </div>
          <el-divider v-if="$index !== emqxDocumentList.length - 1" />
        </template>
      </el-col>
    </el-row>
    <DocListCard :doc-list="mqttDocumentList" />
    <el-card shadow="never" class="follow-cards">
      <el-row class="follow-links" align="middle">
        <el-col :span="12">
          <p class="label-follow text-title">{{ $t('Base.followUs') }}</p>
        </el-col>
        <el-col :span="12" class="social-media">
          <a
            class="item-icon"
            v-for="{ link, icon } in followUsList"
            :key="link"
            :href="link"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i class="iconfont" :class="icon"></i>
          </a>
        </el-col>
      </el-row>
    </el-card>
    <template #footer>
      <el-button type="primary" plain @click="handleLinkGo('feedback')">
        {{ $t('Base.feedback') }}
      </el-button>
      <el-button type="primary" @click="handleLinkGo('contactUs')">
        {{ $t('Base.contactUs') }}
      </el-button>
    </template>
  </el-drawer>
</template>

<script lang="ts">
export default defineComponent({
  name: 'Help',
})
</script>

<script setup lang="ts">
import { Right } from '@element-plus/icons-vue'
import { BookOpen, MessageCircle, Newspaper } from 'lucide-vue-next'
import DocListCard from './components/DocListCard.vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
  },
})
const emit = defineEmits(['update:modelValue'])
const showDrawer = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  },
})

const { t, tl } = useI18nTl('Base')
const { docMap } = useDocLink()

const platformList = [
  {
    link: docMap.documentation,
    icon: BookOpen,
    title: tl('documentation'),
  },
  {
    link: docMap.forum,
    icon: MessageCircle,
    title: tl('forum'),
  },
  {
    link: docMap.blog,
    icon: Newspaper,
    title: tl('blog'),
  },
]

const emqxDocumentList = [
  { link: docMap.emqxGettingStarted, title: t('Settings.gettingStarted') },
  { link: docMap.dashboard, title: t('Settings.dashboardIntro') },
  { link: docMap.accessControl, title: t('Settings.howAccessControl') },
  { link: docMap.dataBridge, title: t('Settings.howDataIntegration') },
  { link: docMap.ruleEngine, title: t('Settings.howRuleEngine') },
  { link: docMap.learnConfig, title: t('Settings.learnConfig') },
  { link: docMap.restAPI, title: t('Settings.restAPI') },
  { link: docMap.faq, title: t('Settings.faq') },
]

const mqttDocumentList = [
  { link: docMap.mqttStudy, title: t('Settings.mqttStudy') },
  { link: docMap.mqttV5, title: t('Settings.mqttV5Intro') },
  { link: docMap.mqttClient, title: t('Settings.findMQTTClient') },
]

const followUsList = [
  { link: docMap.githubHome, icon: 'icon-github' },
  { link: docMap.xHome, icon: 'icon-x' },
  { link: docMap.youtubeHome, icon: 'icon-youtube' },
  { link: docMap.linkedInHome, icon: 'icon-linkedin' },
]

const handleLinkGo = (key: 'feedback' | 'contactUs') => {
  const linksMap = {
    feedback: docMap.feedback,
    contactUs: docMap.contactUs,
  }
  const url = linksMap[key]
  window.open(url, '_blank', 'noopener noreferrer')
}
</script>

<style lang="scss">
.help {
  .website-links {
    .card-link {
      background-color: var(--color-bg-split);
      .el-card__body {
        text-align: center;
        padding: 16px;
        .card-icon {
          width: 48px;
          height: 48px;
          margin: 0 auto 12px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: var(--el-color-primary-light-9);
        }
        .icon-platform {
          font-size: 24px;
          color: var(--color-primary);
        }
        p {
          margin-bottom: 0;
        }
      }
      &:hover {
        box-shadow: var(--el-box-shadow-light);
        .text-title {
          color: var(--color-primary);
        }
      }
    }
  }
  .docs-links {
    margin-top: 32px;
    margin-bottom: 32px;
    padding: 0 12px;
  }
  .follow-cards {
    margin-top: 32px;
    background-color: var(--color-bg-split);
    .follow-links {
      .label-follow {
        margin: 0px;
      }
      .social-media {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        gap: 24px;
      }
      .item-icon {
        display: block;
        .iconfont {
          color: var(--color-text-secondary);
          &:hover {
            color: var(--color-primary);
          }
        }
      }
    }
  }
  a {
    color: var(--color-text-primary);
    &:hover {
      color: var(--color-primary);
    }
  }
}
</style>
