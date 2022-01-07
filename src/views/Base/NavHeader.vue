<template>
  <div class="nav-header" :style="{ left: leftBarCollapse ? '201px' : '80px' }">
    <div>
      <div
        class="func-item"
        @click="
          () => {
            $store.dispatch('SET_LEFT_BAR_COLLAPSE', !this.leftBarCollapse);
          }
        "
      >
        <el-icon :size="20" v-if="leftBarCollapse"><expand></expand></el-icon>
        <el-icon :size="20" v-else><fold></fold></el-icon>
      </div>
    </div>
    <div class="header-title">
      {{ $t(`components.${firstPath}`) }}
    </div>

    <div class="pull-right">
      <el-tooltip
        effect="dark"
        :content="alertText"
        placement="bottom"
        :visible-arrow="false"
      >
        <div class="alert-info func-item">
          <el-badge :is-dot="!!alertCount">
            <router-link to="/alarm" class="iconx icon-alarm"></router-link>
          </el-badge>
        </div>
      </el-tooltip>

      <el-dropdown placement="bottom" @command="handleLanguageDropdownCommand">
        <div class="user-info func-item">
          <i class="iconx icon-globe"></i>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="en" :class="{ active: lang === 'en' }">
              English
            </el-dropdown-item>
            <el-dropdown-item command="zh" :class="{ active: lang === 'zh' }">
              中文
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>

      <el-dropdown placement="bottom" @command="handleDropdownCommand">
        <div class="user-info func-item">
          <span>{{ user.username }}</span>
        </div>

        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="users">
              {{ $t("components.usersManagement") }}
            </el-dropdown-item>
            <el-dropdown-item divided command="logout">
              {{ $t("components.logOut") }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>

      <el-button class="go-link" @click="gotoCloud" size="medium">
        Try Cloud ➝
      </el-button>
    </div>
  </div>
</template>

<script>
import { loadAlarm } from "@/api/common";
import { toLogin } from "@/router";
import { setLanguage } from "@/common/utils";
import { mapState } from "vuex";
import { Fold, Expand } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";

export default {
  name: "NavHeader",
  components: { Fold, Expand },
  data() {
    return {
      firstPath: "",
    };
  },
  computed: {
    ...mapState(["alertCount", "leftBarCollapse", "user", "lang"]),

    alertText() {
      return this.alertCount > 0
        ? `${this.$t("components.theSystemHas")} ${this.alertCount} ${this.$t(
            "components.noteAlertClickView"
          )}`
        : this.$t("components.noWarning");
    },
  },
  watch: {
    $route() {
      this.setHeaderTitle();
    },
  },

  created() {
    this.loadData();
    this.setHeaderTitle();
    setLanguage(this.lang);
  },

  mounted() {
    document.addEventListener("visibilitychange", this.visibilityChangeFunc);
  },
  beforeUnmount() {
    document.removeEventListener("visibilitychange", this.visibilityChangeFunc);
  },

  methods: {
    visibilityChangeFunc() {
      return document.visibilityState === "visible" && this.loadData();
    },

    handleLanguageDropdownCommand(command) {
      if (this.language === command) {
        return;
      }
      setLanguage(command);
    },
    async loadData() {
      const alert = await loadAlarm().catch(() => {});
      this.$store.dispatch("SET_ALERT_COUNT", (alert || []).length);
    },
    logout() {
      this.$msgbox
        .confirm(this.$t("components.whetherToLogOutOrNot"), {
          confirmButtonText: this.$t("components.signOut"),
          cancelButtonText: this.$t("Base.cancel"),
          type: "warning",
        })
        .then(() => {
          ElMessage.success(this.$t("components.loggedOut"));
          toLogin();
        })
        .catch((e) => {});
    },
    handleDropdownCommand(command) {
      if (!command) {
        return;
      }
      if (this[command]) {
        return this[command].call(this);
      }

      this.$router.currentRoute?.name !== command &&
        this.$router.push({ name: command });
    },
    gotoCloud() {
      window.open("https://www.emqx.com/cloud", "_blank");
    },
    setHeaderTitle() {
      let { path } = this.$route || [];
      let firstPath = path.split("/")[1];
      this.firstPath = firstPath;
    },
  },
};
</script>

<style lang="scss" scoped>
// @import "@/style/element-variables";
.nav-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
  padding: 0 20px 0 8px;
  background-color: #fff;

  left: 201px;
  z-index: 100;
  transition: all 0.3s;
  border-bottom: 1px solid #eeeef7ff;
}

.header-title {
  font-size: 32px;
  font-weight: 900;
  padding-left: 20px;
}

.pull-right {
  font-size: 14px;
  display: flex;
  justify-content: flex-end;
  flex-grow: 1;
  align-items: center;
}

.func-item {
  padding: 0 10px;
  transition: all 0.3s;
  cursor: pointer;
}

.el-badge {
  &::v-deep .is-fixed.is-dot {
    right: 5px;
    top: 3px;
  }
}

.el-button.go-link {
  background-color: #282e38ff;
  color: #fff;
  border: 1px solid #282e38ff;
  margin-left: 10px;

  &:hover {
    background-color: #fff;
    color: #000;
    border: 1px solid #282e38ff;
  }
}
</style>
