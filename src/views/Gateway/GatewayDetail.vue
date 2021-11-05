<template>
  <div class="app-wrapper gateway-detail">
    <div class="section-header">
      <div>
        <span :class="['g-icon', `g-${gname}`]"></span>
        <span class="title-n-status">
          <span class="section-title">{{ gname }}</span>
          <el-tag type="info" class="section-status">
            <span
              ><i
                :class="[
                  'g-status',
                  gInfo.status !== 'running' && 'is-stopped',
                ]"
              ></i
              ><span>{{ gInfo.status }}</span></span
            >
          </el-tag>
        </span>
      </div>
      <div>
        <!-- <el-button type="danger"  size="small">{{ $t('Base.delete') }}</el-button> -->
        <el-button
          size="small"
          type="danger"
          :disabled="gInfo.status !== 'running'"
          @click="gatewayStop()"
        >
          {{ $t("Base.stop") }}</el-button
        >
      </div>
    </div>
    <el-menu router :default-active="matchedUrl" mode="horizontal">
      <template v-for="item in types" :key="item">
        <el-menu-item :index="`${item}`">{{ tl(item) }}</el-menu-item>
      </template>
    </el-menu>
    <router-view></router-view>
  </div>
</template>

<script>
import { defineComponent, getCurrentInstance, onMounted, ref } from "vue";
import { getGateway, updateGateway } from "@/api/gateway";
import { ElMessage as M } from "element-plus";
import i18n from "@/i18n";

export default defineComponent({
  name: "GatewayDetail",
  data: function () {
    return {
      types: ["basic", "listeners", "auth", "clients"],
      gname: String(this.$route.params.name).toLowerCase(),
    };
  },
  computed: {
    matchedUrl: function () {
      let currentPath = this.$route.path || "";
      return (
        this.types.find((v) => {
          return currentPath.match(v);
        }) || this.types[0]
      );
    },
  },
  setup() {
    let gInfo = ref({});
    let vm = getCurrentInstance();
    const tl = function (key, collection = "Gateway") {
      return this.$t(collection + "." + key);
    };

    const getGatewayInfo = async () => {
      let res = await getGateway(vm.data.gname).catch(() => {});
      if (res) {
        gInfo.value = res;
      } else {
        gInfo.value = {};
      }
    };

    const gatewayStop = async () => {
      let body = { enable: false };
      let res = await updateGateway(vm.data.gname, body).catch(() => {});
      if (res) {
        M({
          type: "success",
          message: i18n.t("Base.disabledSuccess"),
        });
        gInfo.value.status = "stopped";
      }
    };

    onMounted(getGatewayInfo);

    return {
      tl,
      gInfo,
      gatewayStop,
    };
  },
});
</script>

<style lang="scss" scoped>
.g-icon::before {
  width: 60px;
  height: 60px;
  content: "";
  display: inline-block;
  background-size: contain;
}

.title-n-status {
  height: 45px;
}
// .section-header > span {
//   display: inline-block;
// }
.section-title {
  font-size: 14px;
  font-weight: 700;
  flex-grow: 1;
}
.section-status {
  height: 18px;
  border-radius: 6px;
}
.el-menu.el-menu--horizontal {
  margin-bottom: 40px;
}
.el-tag.el-tag--info {
  line-height: 18px;
  height: 20px;

  .g-status {
    width: 10px;
    height: 10px;
    display: inline-block;
    background-color: #00b173;
    border-radius: 5px;
    margin-right: 4px;

    &.is-stopped {
      background-color: #575f6e;
    }
  }
}
</style>
