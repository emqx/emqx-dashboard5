<template>
  <div class="no-tab-wrapper">
    <div class="title-desc">{{ tl('eventTitleDesc') }}</div>
    <div class="section-header">
      <div>{{ tl('configMsg') }}</div>
    </div>
    <div>
      <el-row v-for="(item, key) in eventMsg" :key="key">
        <el-col :span="15">
          <div class="item-title">{{ key }}</div>
          <div class="item-desc">{{ tl(key) }}</div>
        </el-col>
        <el-col :span="5" class="item-switch">
          <el-switch
            v-model="eventMsg[key]"
            v-loading="operationPending"
            @change="updateEventMsg()"
          ></el-switch>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { defineComponent, onMounted, ref } from 'vue'
import { getEventMsg, editEventMsg } from '@/api/advanced'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'
import useI18nTl from '@/hooks/useI18nTl'

export default defineComponent({
  name: 'Message',
  setup() {
    const { t } = useI18n()
    const { tl } = useI18nTl('Advanced')

    let eventMsg = ref({
      client_connected: false,
      client_disconnected: false,
      client_subscribed: false,
      client_unsubscribed: false,
      message_delivered: false,
      message_dropped: false,
      message_acked: false,
    })
    let operationPending = ref(true)

    const loadData = async function () {
      operationPending.value = true
      try {
        let res = await getEventMsg()
        eventMsg.value = res
      } catch (error) {
        console.error(error)
      } finally {
        operationPending.value = false
      }
    }

    const updateEventMsg = async function () {
      operationPending.value = true
      let pendingEventMsg = { ...eventMsg.value }
      try {
        await editEventMsg(pendingEventMsg).catch(() => {})
        ElMessage({
          type: 'success',
          message: t('Base.editSuccess'),
        })
      } catch (error) {
        loadData()
      } finally {
        operationPending.value = false
      }
    }

    onMounted(loadData)

    const reloading = () => {
      loadData()
    }

    return {
      eventMsg,
      operationPending,
      tl,
      updateEventMsg,
      reloading,
    }
  },
})
</script>
<style lang="scss" scoped>
.title-desc {
  color: #8d96a2;
}
.item-title {
  font-size: 14px;
  font-weight: 700;
  line-height: 24px;
}
.item-desc {
  font-size: 14px;
  color: #5b5b5b;
  line-height: 28px;
}
.el-row {
  padding: 20px;
  border: 1px solid #eeeef7;
}
.el-row:not(:first-of-type) {
  border-top: none;
}
.item-switch > .el-switch {
  height: 50px;
}
</style>
