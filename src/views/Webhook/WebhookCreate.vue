<template>
  <div class="app-wrapper">
    <el-card class="webhook-create-card">
      <WebhookForm v-model="webhook" />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import WebhookForm from './components/WebhookForm.vue'
import useWebhookForm from '@/hooks/Webhook/useWebhookForm'

const { createRawWebhookForm } = useWebhookForm()

const webhook = ref(createRawWebhookForm())
</script>

<style lang="scss">
.webhook-create-card {
  padding: 12px 104px;
}
</style>
