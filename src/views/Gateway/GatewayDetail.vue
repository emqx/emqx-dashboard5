<template>
  <div class="app-wrapper gateway-detail">
    <detail-header :item="{ name: gname, path: '/gateway' }" />
    <div class="section-header">
      <div>
        <span :class="['g-icon', `g-${gname}`]"></span>
        <span class="title-n-status">
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
          plain
          :disabled="gInfo.status === GatewayStatus.Unloaded"
          @click="toggleGatewayStatus()"
        >
          {{ $t(`Base.${gInfo.status === GatewayStatus.Running ? 'disable' : 'enable'}`) }}
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
import DetailHeader from '@/components/DetailHeader.vue'
import { GatewayStatus } from '@/types/enum.ts'

export default defineComponent({
  name: 'GatewayDetail',
  components: {
    DetailHeader,
  },
  setup() {
    let gInfo = ref({})
    const { t } = useI18n()
    const route = useRoute()
    const types = ['settings', 'connections', 'auth', 'listeners']
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

    const toggleGatewayStatus = async () => {
      const enable = !(gInfo.value.status === GatewayStatus.Running)
      let body = { enable }
      try {
        await updateGateway(gname, body)
        M.success(t(`Base.${enable ? 'enableSuccess' : 'disabledSuccess'}`))
        gInfo.value.status = enable ? GatewayStatus.Running : GatewayStatus.Stopped
      } catch (error) {
        //
      }
    }

    onMounted(getGatewayInfo)

    return {
      tl: (key, collection = 'Gateway') => t(collection + '.' + key),
      gInfo,
      toggleGatewayStatus,
      gname,
      types,
      matchedUrl,
      GatewayStatus,
    }
  },
})
</script>

<style lang="scss">
.gateway-detail {
  .section-header:not(:first-of-type) {
    padding-right: 1px;
    margin-top: 0px;
  }
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
      padding: 0px 12px;
    }
  }
}
</style>
