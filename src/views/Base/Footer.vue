<template>
  <div class="footer">
    <ul class="link-list">
      <li class="link-item" v-for="{ label, link, icon } in linkList" :key="label">
        <a :href="link" target="_blank">
          <el-icon :size="14" v-if="isComponent(icon)"><component :is="icon" /></el-icon>
          <i v-else class="iconfont" :class="icon"></i>
          <span> {{ label }} </span>
        </a>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import useI18nTl from '@/hooks/useI18nTl'
import useDocLink from '@/hooks/useDocLink'
import { Document, ChatLineSquare, Phone } from '@element-plus/icons-vue'
import { Component } from 'vue'

const { tl } = useI18nTl('Base')
const { docMap } = useDocLink()

const linkList = [
  { label: tl('documentation'), link: docMap.documentation, icon: Document },
  { label: tl('forum'), link: docMap.forum, icon: ChatLineSquare },
  { label: tl('discord'), link: docMap.discord, icon: 'icon-discord' },
  { label: tl('gitHub'), link: docMap.gitHub, icon: 'icon-github' },
  { label: tl('contact'), link: docMap.contact, icon: Phone },
]

const isComponent = (icon: string | Component) => typeof icon !== 'string'
</script>

<style lang="scss">
.footer {
  .link-list {
    display: flex;
    justify-content: center;
    align-items: center;
    list-style: none;
    margin: 0px;
    padding: 0px;
  }
  .link-item {
    position: relative;
    padding: 0 12px;
    font-size: 12px;
    &:not(:last-child) {
      &::after {
        content: '';
        position: absolute;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
        display: block;
        height: 20px;
        width: 1px;
        background-color: var(--color-border-primary);
      }
    }
    a {
      display: flex;
      align-items: center;
      padding: 16px 8px;
      color: var(--color-text-footer);
      &:hover {
        color: var(--color-text-primary);
        .iconfont {
          color: var(--color-text-primary);
        }
      }
    }
  }
  .iconfont,
  .el-icon {
    font-size: 14px;
    margin-right: 8px;
  }
  .iconfont {
    color: var(--color-text-footer);
    opacity: 0.8;
  }
}
</style>
