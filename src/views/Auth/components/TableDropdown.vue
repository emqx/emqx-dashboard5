<template>
  <el-dropdown class="table-dropdown" @command="handleCommand(rowData, $event)">
    <el-button class="dropdown-btn" size="mini">
      <i class="el-icon-more"></i>
    </el-button>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item command="setting">
          <i class="el-icon-setting"></i>
          {{ $t("Auth.setting") }}
        </el-dropdown-item>
        <template v-if="tableDataLen !== 1">
          <el-dropdown-item command="moveUp" :disabled="position === 0">
            <i class="el-icon-top"></i>
            {{ $t("Auth.moveUp") }}
          </el-dropdown-item>
          <el-dropdown-item
            command="moveDown"
            :disabled="position === tableDataLen - 1"
          >
            <i class="el-icon-bottom"></i>
            {{ $t("Auth.moveDown") }}
          </el-dropdown-item>
        </template>
        <el-dropdown-item
          v-if="rowData.enable"
          class="danger"
          command="disable"
        >
          <i class="el-icon-switch-button"></i>
          {{ $t("Auth.disable") }}
        </el-dropdown-item>
        <el-dropdown-item v-else command="enable">
          <i class="el-icon-video-play"></i>
          {{ $t("Auth.enable") }}
        </el-dropdown-item>
        <el-dropdown-item command="delete">
          <i class="el-icon-delete"></i>
          {{ $t("Base.delete") }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "TableDropdown",
  props: {
    tableDataLen: {
      required: true,
      type: Number,
    },
    rowData: {
      required: true,
      type: Object,
    },
    position: {
      required: true,
      type: Number,
    },
  },
  emits: ["setting", "delete", "move", "update"],
  setup(props, ctx) {
    const handleCommand = function (row, command) {
      switch (command) {
        case "setting":
          ctx.emit("setting", row);
          break;
        case "disable":
          ctx.emit("update", { ...row, enable: false });
          break;
        case "enable":
          ctx.emit("update", { ...row, enable: true });
          break;
        case "delete":
          ctx.emit("delete", row);
          break;
        case "moveUp":
          ctx.emit("move", row, "top");
          break;
        case "moveDown":
          ctx.emit("move", row, "bottom");
          break;
        default:
          break;
      }
    };
    return {
      handleCommand,
    };
  },
});
</script>

<style scoped>
.dropdown-btn {
  padding: 1px 6px;
}
.el-dropdown-menu__item.danger {
  color: #e34242;
}
</style>
