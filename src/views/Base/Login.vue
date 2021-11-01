<template>
  <div
    :class="[
      'login',
      loginKeepHeight && 'login-align-height',
      loginKeepWidth && 'login-align-width',
    ]"
  >
    <el-card shadow="never" class="login-card emq-list-card" id="login">
      <div class="split-wrapper">
        <div class="logo-wrapper"></div>

        <div :span="12" class="login-wrapper">
          <div class="emq-title">
            {{ $t("Base.signIn") }}
            <div class="sub-title">
              {{ $t("Base.loginUserAccount") }}
            </div>
          </div>
          <el-form
            ref="record"
            :model="record"
            :rules="rules"
            hide-required-asterisk
            @keyup.enter="nativeLogin"
          >
            <el-form-item prop="username">
              <el-input
                v-model="record.username"
                :placeholder="$t('Base.userName')"
                tabindex="1"
              ></el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input
                v-model="record.password"
                type="password"
                :placeholder="$t('Base.password')"
                tabindex="2"
              ></el-input>
            </el-form-item>
            <el-form-item class="oper-wrapper" label="">
              <el-button
                class="sub-btn"
                type="primary"
                @click="nativeLogin"
                :loading="logining"
                >{{ $t("Base.signIn") }}</el-button
              >
            </el-form-item>
          </el-form>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { login as loginApi } from "@/api/common";
import { setLanguage } from "@/common/utils";
import { toLogin } from "@/router";
// import sha256 from 'crypto-js/sha256'

export default {
  name: "Login",
  data() {
    return {
      record: {
        username: "",
        password: "",
      },
      logining: false,
      rules: {
        username: [
          {
            required: true,
            message: this.$t("Base.unameRequired"),
            trigger: blur,
          },
        ],
        password: [
          {
            required: true,
            message: this.$t("Base.passwordRequired"),
            trigger: blur,
          },
        ],
      },
      loginKeepHeight: false,
      loginKeepWidth: false,
    };
  },
  created() {
    this.login(true);
  },
  mounted() {
    this.adjustLayout();
    window.addEventListener("resize", this.adjustLayout);
  },
  unmounted() {
    window.removeEventListener("resize", this.adjustLayout);
  },

  methods: {
    adjustLayout() {
      const wWidth = window.innerWidth;
      const wHeight = window.innerHeight;
      const loginDom = document.querySelector("#login");
      const lWidth = loginDom.clientWidth;
      const lHeight = loginDom.clientHeight;
      const loginParentDomStyle = window.getComputedStyle(
        loginDom.parentElement
      );
      const lpPadding = loginParentDomStyle.paddingTop;

      wHeight > lHeight + 2 * parseInt(lpPadding)
        ? (this.loginKeepHeight = true)
        : (this.loginKeepHeight = false);
      // wWidth >lWidth?(this.loginKeepWidth=true):(this.loginKeepWidth=false)
    },
    async login(auto = false) {
      const { username, token, password } =
        (auto && this.$store.state.user) || this.record;

      if (auto && username && token) this.redirect();
      else toLogin(), setLanguage();

      if (!auto) {
        this.logining = true;
        let res = await loginApi({
          username,
          password,
        }).catch();

        if (!res) {
          this.logining = false;
          return;
        }

        this.$store.commit("UPDATE_USER_INFO", {
          token: res.token,
          username,
        });
        this.$store.commit("UPDATE_EDITION", res.license?.edition);

        this.redirect();
      }
    },
    redirect() {
      const { to = "/dashboard" } = this.$route.query;
      this.$router.replace({
        path: to,
      });
    },
    async nativeLogin() {
      (await this.$refs.record.validate().catch(() => {
        /**/
      })) && this.login();
    },
  },
};
</script>

<style lang="scss">
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
  // margin: 10px;
  // width: 100vw;
  // height: 100vh;

  .emq-title {
    margin-bottom: 32px;
  }

  .el-form-item {
    margin: 42px 0;
  }

  .logo-wrapper {
    background-image: url("../../assets/emqx_banner.png");
    background-size: 100%;
    background-repeat: no-repeat;
    position: relative;
    height: 340px;
    border-radius: 6px 0 0 6px;

    .logo {
      position: relative;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 10;
      text-align: center;

      img {
        width: 84px;
      }
    }

    width: 50%;
    float: left;
  }

  .login-wrapper {
    width: 44%;
    float: left;
    padding: 3%;
    height: 333px;
    overflow: hidden;
  }

  .login-card {
    width: 640px;
    flex: 0 0 auto;
    box-shadow: 0 7px 14px rgba(50, 50, 93, 0.1), 0 3px 6px rgba(0, 0, 0, 0.08);
  }

  .oper-wrapper {
    margin-top: 32px;
    margin-bottom: 12px;
  }

  .sub-btn {
    width: 100%;
  }
}
.login-align-height {
  height: 100vh;
}
.login-align-width {
  width: 100vw;
}
</style>
