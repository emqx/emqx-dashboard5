<template>
  <div class="bridge-detail">
    <router-link class="back-button" :to="{ name: 'data-bridge' }">{{
      tl("backToBridggeList")
    }}</router-link>
    <div class="detail-main" v-loading="infoLoading">
      <div class="section-header">
        <div>
          <img :src="bInfo.type && require(`@/assets/img/${bInfo.type}.png`)" />
          <span class="title-n-status">
            <span class="section-title">{{ id }}</span>
            <el-tag type="info" class="section-status">
              <span
                ><i
                  :class="['status', bInfo.status !== 'connected' && 'stopped']"
                ></i
                ><span>{{ bInfo.status }}</span></span
              >
            </el-tag>
          </span>
        </div>
        <div>
          <el-button type="danger" size="small">{{
            $t("Base.delete")
          }}</el-button>
          <el-button size="small" @click="enableOrDisableBridge">
            {{
              bInfo.status === "connected"
                ? $t("Base.disable")
                : $t("Base.enable")
            }}</el-button
          >
        </div>
      </div>
      <div class="setting-area">
        <bridge-http-config
          v-if="bInfo.type === 'http'"
          v-model:tls="bInfo.ssl"
          v-model="bInfo"
          :edit="true"
        ></bridge-http-config>
        <bridge-mqtt-config
          v-if="bInfo.type === 'mqtt'"
          v-model="bInfo"
        ></bridge-mqtt-config>
      </div>
      <div class="btn-area">
        <el-button
          type="primary"
          size="small"
          v-if="bInfo.type"
          :loading="infoLoading"
          @click="updateBridgeInfo()"
          >{{ $t("Base.update") }}</el-button
        >
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, Ref, watch } from "vue";
import { useRoute } from "vue-router";
import { getBridgeInfo, updateBridge, startStopBridge } from "@/api/ruleengine";
import { BridgeItem } from "@/types/ruleengine";
import _ from "lodash";
import { useI18n } from "vue-i18n";
import BridgeHttpConfig from "./BridgeHttpConfig.vue";
import BridgeMqttConfig from "./BridgeMqttConfig.vue";
import { ElMessageBox as MB, ElMessage as M } from "element-plus";

export default defineComponent({
  components: { BridgeHttpConfig, BridgeMqttConfig },
  setup() {
    const route = useRoute();
    const id = route.params.id as string;
    const bInfo: Ref<BridgeItem> = ref({} as BridgeItem);
    const { t } = useI18n();
    const infoLoading = ref(false);

    const loadBridgeInfo = async () => {
      infoLoading.value = true;
      const res = await getBridgeInfo(id).catch(() => {});
      if (res) {
        bInfo.value = res;
      }
      infoLoading.value = false;
    };

    const updateBridgeInfo = async () => {
      infoLoading.value = true;

      const res = await updateBridge(bInfo.value.id, bInfo.value).catch(
        () => {}
      );
      if (res) {
        M({ type: "success", message: t("Base.updateSuccess") });
      }
      infoLoading.value = false;
    };

    // watch(
    //   () => [_.cloneDeep(bInfo.value)],
    //   (val) => {
    //     console.log(val);
    //   }
    // );

    const enableOrDisableBridge = async () => {
      infoLoading.value = true;
      const statusToSend =
        bInfo.value.status === "connected" ? "stop" : "start";
      const sucMessage =
        bInfo.value.status === "connected"
          ? "Base.disabledSuccess"
          : "Base.enableSuccess";
      let res = await startStopBridge(bInfo.value.id, statusToSend).catch(
        () => {}
      );
      if (res) {
        M({
          type: "success",
          message: t(sucMessage),
        });
        loadBridgeInfo();
      }
      infoLoading.value = false;
    };

    onMounted(() => {
      loadBridgeInfo();
    });

    return {
      bInfo,
      id,
      enableOrDisableBridge,
      infoLoading,
      updateBridgeInfo,
      tl: (key: string) => t("RuleEngine." + key),
    };
  },
});
</script>

<style lang="scss" scoped>
.section-header img {
  width: 78px;
  vertical-align: middle;
}
.setting-area {
  width: 75%;
}
.btn-area {
  margin-top: 40px;
}
</style>
