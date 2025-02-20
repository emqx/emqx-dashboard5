<template>
  <el-drawer
    :title="$t('components.help')"
    v-model="showDrawer"
    size="600px"
    destroy-on-close
    class="help"
  >
    <el-row class="website-links" :gutter="16">
      <el-col :span="6" v-for="{ link, icon, title } in platformList" :key="link">
        <a :href="link" target="_blank">
          <el-card class="card-link" shadow="never">
            <img :src="icon" />
            <p class="text-title">{{ title }}</p>
          </el-card>
        </a>
      </el-col>
    </el-row>
    <el-row class="docs-links">
      <el-col :span="24" class="flex-column">
        <template v-for="({ link, title }, $index) in emqxDocumentList" :key="link">
          <div class="text-large">
            <a :href="link" target="_blank" class="vertical-align-center space-between">
              <span>{{ title }}</span>
              <el-icon :size="20"><Right /></el-icon>
            </a>
          </div>
          <el-divider v-if="$index !== emqxDocumentList.length - 1" />
        </template>
      </el-col>
    </el-row>
    <DocListCard :doc-list="mqttDocumentList" />
    <el-row v-if="!IS_ENTERPRISE" :gutter="16" class="products-links">
      <el-col :span="24">
        <p>{{ $t('Base.upgradePlan') }}</p>
      </el-col>
      <el-col v-for="item in productList" :key="item.title" :span="12" class="flex-column">
        <el-card shadow="never" class="card-product enterprise with-border">
          <img class="img-product" :src="item.icon" />
          <div class="card-product-bd">
            <p class="card-product-name text-title">{{ item.title }}</p>
            <p class="card-product-desc tip">{{ item.desc }}</p>
            <a :href="item.link" target="_blank" class="link-product">
              <span>{{ item.linkText }}</span>
              <el-icon><Right /></el-icon>
            </a>
          </div>
        </el-card>
      </el-col>
    </el-row>
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
import cloudIcon from '@/assets/img/cloud.png'
import emqxEnterpriseIcon from '@/assets/img/emqx-enterprise-icon.png'
import helpBlogIcon from '@/assets/img/help-blog.png'
import helpDocIcon from '@/assets/img/help-doc.png'
import helpForumIcon from '@/assets/img/help-forum.png'
import helpGithubIcon from '@/assets/img/help-github.png'
import { IS_ENTERPRISE } from '@/common/constants'
import useDocLink from '@/hooks/useDocLink'
import useI18nTl from '@/hooks/useI18nTl'
import { Right } from '@element-plus/icons-vue'
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
    icon: helpDocIcon,
    title: tl('documentation'),
  },
  {
    link: docMap.forum,
    icon: helpForumIcon,
    title: tl('forum'),
  },
  {
    link: docMap.gitHub,
    icon: helpGithubIcon,
    title: tl('gitHub'),
  },
  {
    link: docMap.blog,
    icon: helpBlogIcon,
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

const productList = [
  {
    title: 'EMQX Enterprise',
    desc: tl('eeDesc'),
    linkText: t('Settings.tryEnterprise'),
    link: docMap.emqxEnterprise,
    icon: emqxEnterpriseIcon,
  },
  {
    title: 'EMQX Cloud',
    desc: tl('cloudDesc'),
    linkText: t('Settings.tryCloud'),
    link: docMap.cloudHome,
    icon: cloudIcon,
  },
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
        img {
          width: 32px;
          height: 32px;
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
  .products-links {
    .img-product {
      height: 32px;
    }
    .card-product-desc.tip {
      font-size: 13px;
      line-height: 1.6;
      margin: 14px 0;
    }
    .link-product {
      display: flex;
      align-items: center;
      gap: 8px;
    }
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
