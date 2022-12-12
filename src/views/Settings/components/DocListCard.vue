<template>
  <el-card shadow="never" class="card-doc card-second-doc">
    <div class="sub-block-docs">
      <p class="text-large">{{ tl('relatedResources') }}</p>
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
import { defineProps, PropType } from 'vue'

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
</script>

<style lang="scss"></style>
