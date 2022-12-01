<template>
  <div class="help app-wrapper">
    <el-row :gutter="28">
      <el-col :span="6">
        <el-card class="card-link" shadow="never">
          <a :href="docMap.documentation" target="_blank">
            <img src="@/assets/img/help-doc.png" />
            <p>{{ tl('documentation') }}</p>
          </a>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="card-link" shadow="never">
          <a :href="docMap.forum" target="_blank">
            <img src="@/assets/img/help-forum.png" />
            <p>{{ tl('forum') }}</p>
          </a>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="card-link" shadow="never">
          <a :href="docMap.gitHub" target="_blank">
            <img src="@/assets/img/help-github.png" />
            <p>{{ tl('gitHub') }}</p>
          </a>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="card-link" shadow="never">
          <a :href="docMap.TODO" target="_blank">
            <img src="@/assets/img/help-blog.png" />
            <p>{{ tl('blog') }}</p>
          </a>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="28">
      <el-col :span="12">
        <el-card shadow="never" class="card-doc">
          <div class="text-large getting-started">
            <a :href="docMap.TODO" target="_blank" class="vertical-align-center">
              <span>{{ tl('gettingStarted') }}</span>
              <el-icon><Right /></el-icon>
            </a>
          </div>
          <div class="text-large dashboard-intro">
            <a :href="docMap.dashboard" target="_blank" class="vertical-align-center">
              <span>{{ tl('dashboardIntro') }}</span>
              <el-icon><Right /></el-icon>
            </a>
          </div>
          <div class="sub-block-docs">
            <p class="text-large">{{ tl('relatedResources') }}</p>
            <ul class="list-link">
              <li class="item-link">
                <a :href="docMap.mqttStudy" target="_blank" class="vertical-align-center">
                  <span>{{ t('Settings.mqttStudy') }}</span>
                  <el-icon><Right /></el-icon>
                </a>
              </li>
              <li class="item-link">
                <a :href="docMap.mqttV5" target="_blank" class="vertical-align-center">
                  <span>MQTT 5.0</span>
                  <el-icon><Right /></el-icon>
                </a>
              </li>
              <li class="item-link">
                <a :href="docMap.mqttClient" target="_blank" class="vertical-align-center">
                  <span>{{ t('Settings.findMQTTClient') }}</span>
                  <el-icon><Right /></el-icon>
                </a>
              </li>
            </ul>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-row>
          <el-col :span="24">
            <el-card shadow="never" class="card-product top-border enterprise">
              <div class="card-product-hd">
                <a :href="docMap.emqxEnterprise" target="_blank" class="vertical-align-center">
                  <img src="@/assets/img/emqx-enterprise.png" />
                  <p class="card-product-name">EMQX Enterprise</p>
                </a>
              </div>
              <p class="card-product-desc tip">{{ tl('eeDesc') }}</p>
            </el-card>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-card shadow="never" class="card-product top-border cloud">
              <div class="card-product-hd">
                <a :href="docMap.cloudHome" target="_blank" class="vertical-align-center">
                  <img src="@/assets/img/cloud.png" />
                  <p class="card-product-name">EMQX Cloud</p>
                </a>
              </div>
              <p class="card-product-desc tip">{{ tl('cloudDesc') }}</p>
            </el-card>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <el-row :gutter="28">
      <el-col :span="24">
        <el-card class="card-follow" shadow="never">
          <p class="label-follow">Follow us</p>
          <ul class="list-icon">
            <li class="item-icon">
              <a :href="docMap.githubHome" target="_blank">
                <i class="iconfont icon-github"></i>
              </a>
            </li>
            <li class="item-icon">
              <a :href="docMap.twitterHome" target="_blank">
                <i class="iconfont icon-twitter"></i>
              </a>
            </li>
            <li class="item-icon">
              <a :href="docMap.youtubeHome" target="_blank">
                <i class="iconfont icon-youtube"></i>
              </a>
            </li>
            <li class="item-icon">
              <a :href="docMap.linkedInHome" target="_blank">
                <i class="iconfont icon-linkedin"></i>
              </a>
            </li>
          </ul>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import useI18nTl from '@/hooks/useI18nTl'
import { Right } from '@element-plus/icons-vue'
import useDocLink from '@/hooks/useDocLink'

const { t, tl } = useI18nTl('Base')
const { docMap } = useDocLink()
</script>

<style lang="scss">
.help {
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  a {
    color: unset;
    transition: none;
    &:hover,
    &:hover .iconfont,
    &:hover .card-product-desc {
      color: var(--color-primary);
    }
  }
  .el-row:not(:last-child) {
    margin-bottom: 24px;
  }
  .card-link {
    .el-card__body {
      display: flex;
      justify-content: center;
    }
    a {
      display: flex;
      justify-content: center;
      align-items: center;
    }
    img {
      height: 40px;
      margin-right: 24px;
    }
  }
  .text-large {
    position: relative;
    display: flex;
    padding-left: 10px + 2px;
    font-size: 16px;
    font-weight: 600;
    line-height: 22px;
    color: var(--color-text-primary);
    span {
      margin-right: 8px;
    }
    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 2px;
      height: 16px;
      background: linear-gradient(135deg, #0ad18e 0%, #03a4a5 100%);
    }
  }
  .getting-started {
    margin-bottom: 21px;
  }
  .dashboard-intro {
    margin-bottom: 45px;
  }
  .item-link {
    display: flex;
    line-height: 32px;
    color: var(--color-text-secondary);

    span {
      margin-right: 8px;
    }
  }
  .card-product {
    text-align: center;
    .el-card__body {
      padding: 28px;
    }
    &.enterprise {
      &:before {
        background: linear-gradient(317deg, #866dff 0%, #4d6bff 100%);
      }
    }
    &.cloud {
      &:before {
        background: linear-gradient(135deg, #00b173 0%, #23c0aa 100%);
      }
    }
  }
  .card-product-hd {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 32px;
    margin-bottom: 16px;
    img {
      height: 32px;
      margin-right: 16px;
    }
  }
  .card-product-name {
    margin: 0;
    font-size: 16px;
    font-weight: 500;
    line-height: 19px;
  }
  .card-product-desc {
    line-height: 26px;
  }
  .card-follow {
    .el-card__body {
      display: flex;
      justify-content: flex-start;
      align-items: center;
    }
    .label-follow {
      margin-right: 92px;
    }
  }
  .list-icon {
    display: flex;
  }
  .item-icon {
    margin-right: 48px;
    font-size: 20px;
    .iconfont {
      color: var(--color-text-secondary);
    }
  }
}
</style>
