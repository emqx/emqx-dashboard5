<template>
  <div>
    <el-form label-position="top">
      <div class="part-header">
        {{ tl("basic") }}
      </div>
      <el-row :gutter="30">
        <el-col :span="12">
          <el-form-item :label="tl('useLog')">
            <el-select v-model="eValue.enable_stats">
              <el-option :value="true"></el-option>
              <el-option :value="false"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="tl('idleTime')">
            <el-input
              v-model.number="eValue.idle_timeout[0]"
              :placeholder="String(eValueDefault.idle_timeout[0])"
            >
              <template #append>
                <el-select v-model="eValue.idle_timeout[1]">
                  <el-option value="s"></el-option>
                </el-select>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <div class="part-header">{{ tl("mountSetting") }}</div>
      <el-row :gutter="30">
        <el-col :span="12">
          <el-form-item :label="tl('mountPoint')">
            <el-input
              v-model="eValue.mountpoint"
              :placeholder="eValueDefault.mountpoint"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <div class="part-header">{{ tl("grpcListener") }}</div>
      <el-row :gutter="30">
        <el-col :span="12">
          <el-form-item :label="tl('lAddress')">
            <el-input
              v-model="eValue.server.bind"
              :placeholder="eValueDefault.server.bind"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <div class="part-header">{{ tl("tlsConfig") }}</div>
      <el-row :gutter="30">
        <el-col :span="12">
          <el-checkbox
            border
            :label="tl('enableTls')"
            v-model="eValue.server.ssl.enable"
            class="sole-chkbox"
          >
          </el-checkbox>
        </el-col>

        <template v-if="eValue.server.ssl.enable">
          <el-col :span="18">
            <el-form-item :label="'Cert'">
              <el-input
                type="textarea"
                rows="3"
                :placeholder="enableTLS.certfile"
                v-model="eValue.server.ssl.certfile"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="18">
            <el-form-item :label="'CA Cert'">
              <el-input
                type="textarea"
                rows="3"
                :placeholder="enableTLS.cacertfile"
                v-model="eValue.server.ssl.cacertfile"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="18">
            <el-form-item :label="'Key'">
              <el-input
                type="textarea"
                rows="3"
                :placeholder="enableTLS.keyfile"
                v-model="eValue.server.ssl.keyfile"
              ></el-input>
            </el-form-item>
          </el-col>
        </template>
      </el-row>
      <div class="part-header">{{ tl("grpcConnection") }}</div>
      <el-row :gutter="30">
        <el-col :span="12">
          <el-form-item :label="'Server'">
            <el-input
              v-model="eValue.handler.address"
              :placeholder="eValueDefault.handler.address"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <div class="part-header">{{ tl("tlsConfig") }}</div>
      <el-row :gutter="30">
        <el-col :span="12">
          <el-checkbox
            border
            :label="tl('enableTls')"
            v-model="eValue.handler.ssl.enable"
            class="sole-chkbox"
          >
          </el-checkbox>
        </el-col>

        <template v-if="eValue.handler.ssl.enable">
          <el-col :span="18">
            <el-form-item :label="'Cert'">
              <el-input
                type="textarea"
                rows="3"
                :placeholder="enableTLS.certfile"
                v-model="eValue.handler.ssl.certfile"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="18">
            <el-form-item :label="'CA Cert'">
              <el-input
                type="textarea"
                rows="3"
                :placeholder="enableTLS.cacertfile"
                v-model="eValue.handler.ssl.cacertfile"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="18">
            <el-form-item :label="'Key'">
              <el-input
                type="textarea"
                rows="3"
                :placeholder="enableTLS.keyfile"
                v-model="eValue.handler.ssl.keyfile"
              ></el-input>
            </el-form-item>
          </el-col>
        </template>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { defineComponent, reactive, watch, onMounted } from "vue";
import _ from "lodash";
import {
  transformUnitArrayToStr,
  transformStrToUnitArray,
  getValueIntersectionWithTemplate,
} from "@/common/utils";
import { useI18n } from "vue-i18n";

export default defineComponent({
  name: "ExprotoBasic",
  props: {
    value: {
      type: Object,
      required: false,
      default: () => ({}),
    },
  },
  setup(props, context) {
    let eValueDefault = {
      enable_stats: true,
      idle_timeout: [30, "s"],
      mountpoint: "",
      handler: {
        address: "http://127.0.0.1:9001",
        ssl: {
          certfile: "",
          keyfile: "",
          cacertfile: "",
          enable: false,
        },
      },
      server: {
        bind: "127.0.0.1:9100",
        ssl: {
          certfile: "",
          keyfile: "",
          cacertfile: "",
          enable: false,
        },
      },
    };
    const { t } = useI18n();

    let eValue = reactive(
      getValueIntersectionWithTemplate(
        eValueDefault,
        transformStrToUnitArray(props.value, ["idle_timeout"])
      )
    );
    let enableTLS = reactive({
      cacertfile: "Begins with ----BEGIN CERTIFICATE----",
      certfile: "Begins with ----BEGIN CERTIFICATE----",
      keyfile: "Begins with ----BEGIN PRIVATE KEY----",
    });

    watch(
      () => _.cloneDeep(eValue),
      (v) => {
        context.emit("update:value", transformUnitArrayToStr(v));
      }
    );
    onMounted(() => {
      context.emit("update:value", transformUnitArrayToStr(eValue));
    });

    return {
      tl: (key, collection = "Gateway") => t(collection + "." + key),
      eValueDefault,
      eValue,
      enableTLS,
    };
  },
});
</script>

<style lang="scss">
.sole-chkbox {
  margin-bottom: 20px;
  margin-top: 20px;
}
</style>
