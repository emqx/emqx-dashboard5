<template>
  <div class="app-wrapper data-bridge">
    <div class="section-header">
      <div></div>
      <el-button
        size="small"
        type="primary"
        icon="el-icon-plus"
        @click="$router.push({ name: 'bridge-create' })"
        >{{ tl("createBridge") }}</el-button
      >
    </div>

    <el-table :data="bridgeTb" v-loading="tbLoading">
      <el-table-column :label="'Bridge'"></el-table-column>
      <el-table-column :label="tl('status')"></el-table-column>
      <el-table-column :label="$t('Base.operation')">
        <template #default>
          <el-button size="mini">{{ $t("Base.setting") }}</el-button>
          <el-button size="mini">{{ $t("Base.enable") }}</el-button>
          <el-button size="mini">{{ $t("Base.delete") }}</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { defineComponent, onMounted, ref } from "vue";
import { getBridgeList } from "@/api/ruleengine";
import { useI18n } from "vue-i18n";

export default defineComponent({
  setup() {
    const { t } = useI18n();

    let bridgeTb = ref([]);
    let tbLoading = ref(false);

    const translate = function (key, collection = "RuleEngine") {
      return t(collection + "." + key);
    };

    const listBridge = async function () {
      tbLoading.value = true;
      let res = await getBridgeList().catch(() => {});
      if (res) {
        bridgeTb.value = res;
      }
      tbLoading.value = false;
    };

    // onMounted(listBridge)

    return {
      tl: translate,
      bridgeTb,
      tbLoading,
    };
  },
});
</script>

<style lang="scss"></style>
