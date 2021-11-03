<template>
  <div class="built-in-config config">
    <div class="create-form-title">File-ACL</div>
    <el-row :gutter="20">
      <el-form class="create-form">
        <el-col :span="24">
          <el-form-item :label="$t('components.rules')">
            <el-input
              v-model="fileConfig.rules"
              type="textarea"
              :rows="6"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>
  </div>
</template>

<script>
import { defineComponent, reactive, watch } from "vue";

export default defineComponent({
  name: "FileConfig",
  model: {
    prop: "value",
    event: "update",
  },
  props: {
    value: {
      type: Object,
      required: true,
    },
  },
  setup(props, ctx) {
    const fileConfig = reactive(props.value);
    watch(fileConfig, (value) => {
      ctx.emit("update", value);
    });
    return {
      fileConfig,
    };
  },
});
</script>

<style lang="scss">
@import "../style/authConfig.scss";
</style>
