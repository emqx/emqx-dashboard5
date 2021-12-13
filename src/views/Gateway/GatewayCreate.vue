<template>
  <div class="app-wrapper gateway-create">
    <div class="section-header">
      {{ tl("initial") + name }}
    </div>
    <el-row>
      <el-col :span="16">
        <el-steps :active="stepActive" finish-status="success">
          <el-step :title="tl('basicConfig')"> </el-step>
          <el-step :title="tl('listeners')"></el-step>
          <el-step :title="tl('auth')"></el-step>
        </el-steps>
      </el-col>
    </el-row>
    <el-row class="config-main">
      <el-col :span="18" v-if="stepActive === 0" class="config-basic">
        <template v-if="name === 'STOMP'">
          <stomp-basic v-model:value="basicData" />
        </template>
        <template v-else-if="name === 'MQTTSN'">
          <mqttsn-basic v-model:value="basicData"></mqttsn-basic>
        </template>
        <template v-else-if="name === 'COAP'">
          <coap-basic v-model:value="basicData"></coap-basic>
        </template>
        <template v-else-if="name === 'LWM2M'">
          <lw-basic v-model:value="basicData"></lw-basic>
        </template>
        <template v-else-if="name === 'EXPROTO'">
          <exproto-basic v-model:value="basicData"></exproto-basic>
        </template>
      </el-col>

      <el-col :span="24" v-else-if="stepActive === 1">
        <listeners
          :integration="true"
          :gateway-name="name"
          v-model:list="listenerList"
        ></listeners>
      </el-col>
      <el-col :span="24" v-else-if="stepActive === 2">
        <div class="part-header">
          {{ tl("clientAuth") }}
        </div>
        <div class="config-auth">
          {{ tl("clientAuthDesc") }}
        </div>
      </el-col>
    </el-row>
    <el-row class="config-op">
      <el-button
        size="small"
        type="primary"
        v-if="stepActive === 2"
        :loading="submitLoading"
        @click="createGateway()"
        >{{ $t("Base.enable") }}</el-button
      >
      <el-button
        type="primary"
        size="small"
        @click="++stepActive"
        v-if="stepActive < 2"
        :disabled="submitLoading"
        >{{ $t("Base.nextStep") }}</el-button
      >
      <el-button
        size="small"
        @click="--stepActive"
        v-if="stepActive > 0"
        :disabled="submitLoading"
        >{{ $t("Base.backStep") }}</el-button
      >
      <el-button size="small" v-if="stepActive === 0" @click="gotoList">{{
        $t("Base.cancel")
      }}</el-button>
    </el-row>
  </div>
</template>

<script>
import {
  defineComponent,
  onMounted,
  ref,
  watch,
  getCurrentInstance,
} from "vue";
import CoapBasic from "./components/coapBasic.vue";
import Listeners from "./components/listeners.vue";
import LwBasic from "./components/lwm2mBasic.vue";
import MqttsnBasic from "./components/mqttsnBasic.vue";
import stompBasic from "./components/stompBasic.vue";
import ExprotoBasic from "./components/exprotoBasic.vue";

import _ from "lodash";
import { postGateway, getGateway } from "@/api/gateway";
import router from "@/router";
import { ElMessage as M } from "element-plus";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";

const STATIC_LISTENER = {
  exproto: {
    type: "tcp",
    name: "default",
    bind: "7993",
    max_conn_rate: 1000,
    max_connections: 1024000,
  },
  lwm2m: {
    type: "udp",
    name: "default",
    bind: "5783",
    max_conn_rate: 1000,
    max_connections: 1024000,
  },
  coap: {
    type: "udp",
    name: "default",
    bind: "5683",
    max_conn_rate: 1000,
    max_connections: 1024000,
  },
  mqttsn: {
    type: "udp",
    name: "default",
    bind: "1884",
    max_conn_rate: 1000,
    max_connections: 1024000,
  },
  stomp: {
    type: "tcp",
    name: "default",
    bind: "61613",
    max_conn_rate: 1000,
    max_connections: 1024000,
  },
};

export default defineComponent({
  components: {
    stompBasic,
    Listeners,
    MqttsnBasic,
    LwBasic,
    CoapBasic,
    ExprotoBasic,
  },
  name: "GatewayCreate",

  setup(props) {
    let stepActive = ref(0);
    let basicData = ref({});
    let listenerList = ref([]);
    let submitLoading = ref(false);

    // let vm = getCurrentInstance();
    const { t } = useI18n();
    const route = useRoute();
    const gname = ref(String(route.params.name).toUpperCase());

    const tl = function (key, collection = "Gateway") {
      return t(collection + "." + key);
    };

    // watch(
    //   () => [_.cloneDeep(basicData.value), _.cloneDeep(listenerList.value)],
    //   (v) => {
    //     console.log(v);
    //   }
    // );

    const gotoList = function () {
      router.push({ name: "gateway" });
    };

    const createGateway = async () => {
      submitLoading.value = true;
      const name = String(gname.value).toLowerCase();
      if (!name) return;

      let res = await postGateway({
        ...basicData.value,
        listeners: [...listenerList.value],
        name,
      }).catch(() => {});
      if (res) {
        M({
          type: "success",
          message: t("Base.createSuccess"),
        });
        gotoList();
      } else {
        //todo
      }
      submitLoading.value = false;
    };

    const gatewayStatus = async () => {
      const name = String(gname.value).toLowerCase();

      if (!name) {
        gotoList();
      }

      let res = await getGateway(name).catch(() => {});
      if (res) {
        let { status } = res;
        if (status !== "unloaded") {
          M({
            type: "error",
            message: t("Gateway.alreadyLoad"),
          });
          gotoList();
        }
      }
    };

    onMounted(() => {
      gatewayStatus();

      let staticListener = STATIC_LISTENER[String(gname.value).toLowerCase()];
      staticListener && listenerList.value.push({ ...staticListener });
    });

    return {
      tl,
      stepActive,
      basicData,
      gotoList,
      listenerList,
      submitLoading,
      createGateway,
      name: gname,
    };
  },
});
</script>

<style lang="scss" scoped>
.config-main {
  margin-top: 30px;
}
.config-op {
  margin-top: 30px;
}
.config-auth {
  width: 50%;
  margin: 20px 0;
}
</style>
