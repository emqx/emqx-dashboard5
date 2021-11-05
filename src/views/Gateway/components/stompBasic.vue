<template>
  <div>
    <el-form label-position="top">
      <div class="part-header">
        {{ tl("basic") }}
      </div>
      <el-row :gutter="30">
        <el-col :span="12">
          <el-form-item :label="tl('maxHeader')">
            <el-input
              v-model="sValue.frame.max_headers"
              :placeholder="sValueDefault.frame.max_headers"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="tl('maxHeaderLen')">
            <el-input
              v-model="sValue.frame.max_headers_length"
              :placeholder="sValueDefault.frame.max_headers_length"
            ></el-input> </el-form-item
        ></el-col>
        <el-col :span="12">
          <el-form-item :label="tl('maxBodyLen')">
            <el-input
              v-model="sValue.frame.max_body_length"
              :placeholder="sValueDefault.frame.max_body_length"
            ></el-input> </el-form-item
        ></el-col>
        <el-col :span="12">
          <el-form-item :label="tl('idleTime')">
            <el-input
              v-model.number="sValue.idle_timeout[0]"
              :placeholder="sValueDefault.idle_timeout[0]"
            >
              <template #append>
                <el-select v-model="sValueDefault.idle_timeout[1]">
                  <el-option value="s"></el-option>
                </el-select>
              </template>
            </el-input> </el-form-item
        ></el-col>
        <el-col :span="12">
          <el-form-item :label="tl('useLog')">
            <el-select v-model="sValue.enable_stats">
              <el-option value="true"></el-option>
              <el-option value="false"></el-option>
            </el-select> </el-form-item
        ></el-col>
      </el-row>
      <div class="part-header">{{ tl("mountSetting") }}</div>
      <el-row :gutter="30">
        <el-col :span="12">
          <el-form-item :label="tl('mountPoint')">
            <el-input
              v-model="sValue.mountpoint"
              :placeholder="sValueDefault.mountpoint"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { defineComponent, onMounted, reactive, watch } from "vue";
import _ from "lodash";
import {
  transformUnitArrayToStr,
  transformStrToUnitArray,
} from "@/common/utils";

export default defineComponent({
  name: "StompBasic",
  props: {
    value: {
      type: Object,
      required: false,
      default: () => ({}),
    },
  },
  setup(props, context) {
    let sValueDefault = {
      frame: {
        max_headers: 10,
        max_headers_length: 1024,
        max_body_length: 8192,
      },
      idle_timeout: [30, "s"],
      enable_stats: true,
      mountpoint: "",
    };
    let normalizeProps = transformStrToUnitArray(_.cloneDeep(props.value), [
      "idle_timeout",
    ]);
    let sValue = reactive({ ..._.cloneDeep(sValueDefault), ...normalizeProps });
    const tl = function (key, collection = "Gateway") {
      return this.$t(collection + "." + key);
    };
    watch(
      () => _.cloneDeep(sValue),
      (v) => {
        context.emit("update:value", transformUnitArrayToStr(v));
      }
    );
    onMounted(() => {
      context.emit("update:value", transformUnitArrayToStr(sValue));
    });
    return {
      tl,
      sValue,
      sValueDefault,
    };
  },
});
</script>
<style lang="scss" scoped>
.part-header {
  margin-bottom: 20px;
}
</style>
