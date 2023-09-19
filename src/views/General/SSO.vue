<template>
  <div class="sso app-wrapper">
    <el-row class="sso-list">
      <el-col :span="6" class="sso-item" v-for="item in ssoList" :key="item.name">
        <el-card>
          <div class="card-hd">{{ item.name }}</div>
          <div class="card-ft">
            <el-tag type="success">{{ tl('ssoEnabled') }}</el-tag>
            <el-tag type="info">{{ tl('ssoDisabled') }}</el-tag>
            <el-button>
              {{ t('Base.edit') }}
              {{ t('Base.enable') }}
            </el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import useI18nTl from '@/hooks/useI18nTl'
import { ref } from 'vue'

const { t, tl } = useI18nTl('General')

const ssoList = ref([{ name: 'xxx' }])
</script>

<style lang="scss">
.sso {
  .sso-list {
    list-style: none;
  }
}
</style>
