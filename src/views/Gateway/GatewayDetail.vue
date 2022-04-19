<template>
  <div class="app-wrapper gateway-detail">
    <div class="section-header">
      <div>
        <span :class="['g-icon', `g-${gname}`]"></span>
        <span class="title-n-status">
          <span class="section-title">{{ gname }}</span>
          <el-tag type="info" class="section-status">
            <span>
              <i :class="['status', gInfo.status !== 'running' && 'stopped']" />
              <span>{{ gInfo.status }}</span>
            </span>
          </el-tag>
        </span>
      </div>
      <div>
        <el-button
          type="danger"
          plain
          :disabled="gInfo.status !== 'running'"
          @click="gatewayStop()"
        >
          {{ $t('Base.stop') }}
        </el-button>
      </div>
    </div>
    <el-card class="menu-card">
      <el-menu router :default-active="matchedUrl" mode="horizontal">
        <template v-for="item in types" :key="item">
          <el-menu-item :index="`${item}`">{{ tl(item) }}</el-menu-item>
        </template>
      </el-menu>
    </el-card>
    <router-view></router-view>
  </div>
</template>

<script>
import { computed, defineComponent, onMounted, ref } from 'vue'
import { getGateway, updateGateway } from '@/api/gateway'
import { ElMessage as M } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

export default defineComponent({
  name: 'GatewayDetail',
  setup() {
    let gInfo = ref({})
    const { t } = useI18n()
    const route = useRoute()
    const types = ['basic', 'listeners', 'auth', 'clients']
    const gname = String(route.params.name).toLowerCase()

    const matchedUrl = computed(function () {
      let currentPath = route.path || ''
      return (
        types.find((v) => {
          return currentPath.match(v)
        }) || types[0]
      )
    })

    const getGatewayInfo = async () => {
      let res = await getGateway(gname).catch(() => {})
      if (res) {
        gInfo.value = res
      } else {
        gInfo.value = {}
      }
    }

    const gatewayStop = async () => {
      let body = { enable: false }
      let res = await updateGateway(gname, body).catch(() => {})
      if (res) {
        M({
          type: 'success',
          message: t('Base.disabledSuccess'),
        })
        gInfo.value.status = 'stopped'
      }
    }

    onMounted(getGatewayInfo)

    return {
      tl: (key, collection = 'Gateway') => t(collection + '.' + key),
      gInfo,
      gatewayStop,
      gname,
      types,
      matchedUrl,
    }
  },
})
</script>

<style lang="scss">
.gateway-detail {
  .g-icon::before {
    width: 60px;
    height: 60px;
    content: '';
    display: inline-block;
    background-size: contain;
  }
  .el-menu--horizontal {
    border-bottom: 0px;
  }
  .el-card.menu-card {
    margin-bottom: 40px;
    .el-card__body {
      padding: 0px;
    }
  }
}
</style>
