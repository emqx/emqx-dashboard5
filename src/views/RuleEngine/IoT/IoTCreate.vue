<template>
  <div class="iot-create app-wrapper">
    <div class="page-header-title">{{ tl("createIoTRule") }}</div>
    <iotform v-model="ruleValue"></iotform>
    <el-row class="config-btn">
      <el-button
        size="small"
        type="primary"
        :loading="submitLoading"
        @click="submitCreateIoT"
        >{{ $t("Base.create") }}</el-button
      >

      <el-button size="small" @click="$router.push({ name: 'iot' })">{{
        $t("Base.cancel")
      }}</el-button>
    </el-row>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, Ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import iotform from "../components/IoTForm.vue";
import { BridgeItem, RuleItem } from "@/types/ruleengine";
import { createRules } from "@/api/ruleengine";
import { useRouter } from "vue-router";
import { ElMessage as M } from "element-plus";
import _ from "lodash";

export default defineComponent({
  components: { iotform },
  setup() {
    const { t } = useI18n();

    const router = useRouter();
    const submitLoading = ref(false);

    const ruleValue: Ref<RuleItem> = ref({
      name: "",
      sql: "",
      outputs: [],
      description: "",
    });

    // watch(
    //   () => ruleValue.value,
    //   (val) => {
    //     console.log(val);
    //   }
    // );
    const submitCreateIoT = async () => {
      submitLoading.value = true;

      const res = await createRules({
        ...ruleValue.value,
      }).catch(() => {});
      if (res) {
        M({
          type: "success",
          message: t("Base.createSuccess"),
        });
        router.push({ name: "iot" });
      }
      submitLoading.value = false;
    };

    return {
      tl: (key: string) => t("RuleEngine." + key),
      ruleValue,
      submitCreateIoT,
      submitLoading,
    };
  },
});
</script>

<style lang="scss" scoped>
.outputs-item {
  height: 92px;
  border: var(--el-border-base);
  margin-top: 10px;
  display: flex;
  align-items: center;

  span:nth-child(2) {
    flex-grow: 1;

    div {
      line-height: 200%;
    }

    .output-desc {
      color: #5b5b5b;
    }
  }

  .output-op {
    padding: 0 10px;
    visibility: hidden;
  }

  &.add {
    justify-content: center;
    // align-items: center;
  }
  &:first-of-type {
    margin-top: 20px;
  }
  &:hover {
    border-color: var(--el-color-primary);
    cursor: pointer;
    span {
      color: var(--el-color-primary);
      visibility: visible;
    }
  }
}

.edit-output {
  color: var(--el-color-primary);
  line-height: 50px;
  cursor: pointer;
}
.config-btn {
  margin-top: 50px;
}

.embedded-config {
  border: var(--el-border-base);
  padding: 30px;
}
</style>
