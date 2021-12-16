<template>
  <div class="app-wrapper data-bridge-create">
    <!-- <back-button back-url="/bridge">
      {{ tl('backDataBridge') }}
    </back-button> -->
    <div class="page-header-title">
      {{ tl("createBridge") }}
    </div>

    <el-row>
      <el-col :span="12">
        <el-steps :active="stepActive" finish-status="success">
          <el-step :title="tl('bridgeType')"> </el-step>
          <el-step :title="tl('configuration')"></el-step>
        </el-steps>
      </el-col>
    </el-row>
    <div class="part-header">
      {{ tl("chooseType") }}
    </div>
    <el-row>
      <el-col :span="14">
        <el-input></el-input>
      </el-col>
    </el-row>
    <div></div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { useI18n } from "vue-i18n";
// import BackButton from './components/BackButton.vue'

export default defineComponent({
  //   components: { BackButton },
  setup() {
    const { t } = useI18n();

    const translate = function (key, collection = "RuleEngine") {
      return t(collection + "." + key);
    };

    return {
      tl: translate,
    };
  },
});
</script>

<style lang="scss">
.part-header {
  margin-bottom: 20px;
}
</style>
