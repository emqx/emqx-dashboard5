<template>
  <div class="footer">
    <ul class="link-list">
      <li class="link-item" v-for="{ label, link } in linkList" :key="label">
        <a :href="link" target="_blank">
          <span> {{ label }} </span>
        </a>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import useI18nTl from '@/hooks/useI18nTl'
import useDocLink from '@/hooks/useDocLink'

const { tl } = useI18nTl('Base')
const { docMap } = useDocLink()

const linkList = [
  { label: tl('documentation'), link: docMap.documentation },
  { label: tl('forum'), link: docMap.forum },
  { label: tl('discord'), link: docMap.discord },
  { label: tl('gitHub'), link: docMap.gitHub },
  { label: tl('contact'), link: docMap.contact },
]
</script>

<style lang="scss">
.footer {
  padding: 20px 0;
  .link-list {
    display: flex;
    justify-content: center;
    align-items: center;
    list-style: none;
  }
  .link-item {
    position: relative;
    padding: 0 12px;
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
      padding: 8px;
      color: var(--color-text-secondary);
    }
  }
}
</style>
