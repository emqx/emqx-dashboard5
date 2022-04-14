<template>
  <div class="login">
    <el-row>
      <el-col class="intro" :span="10">
        <div class="logo">
          <img src="@/assets/img/emqx-logo.png" width="96" height="33" alt="emqx-logo" />
        </div>
        <div class="content">
          <img
            class="dashboard-img"
            src="@/assets/img/login-banner.png"
            width="455"
            height="352"
            alt="emqx-dashboard"
          />
          <div class="description">
            <p><CheckIcon />{{ $t('Base.dataManager') }}</p>
            <p><CheckIcon />{{ $t('Base.ruleEngine') }}</p>
            <p><CheckIcon />{{ $t('Base.visualConfig') }}</p>
          </div>
        </div>
      </el-col>
      <el-col class="form" :span="14">
        <div class="login-wrapper">
          <h1>{{ $t('Base.login') }}</h1>
          <el-form
            ref="formCom"
            :model="record"
            :rules="rules"
            hide-required-asterisk
            size="large"
            @keyup.enter="nativeLogin"
          >
            <el-form-item prop="username">
              <el-input
                v-model.trim="record.username"
                :placeholder="$t('Base.userName')"
                tabindex="1"
              ></el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input
                v-model.trim="record.password"
                type="password"
                :placeholder="$t('Base.password')"
                tabindex="2"
              ></el-input>
            </el-form-item>
            <el-form-item class="oper-wrapper">
              <el-button type="primary" @click="nativeLogin" :loading="isLogining">{{
                $t('Base.login')
              }}</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { login as loginApi } from '@/api/common'
import CheckIcon from '@/components/CheckIcon.vue'
import { toLogin } from '@/router'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'

const { t } = useI18n()
const store = useStore()
const router = useRouter()
const route = useRoute()

const record = reactive({
  username: '',
  password: '',
})
const isLogining = ref(false)
const rules = {
  username: [
    {
      required: true,
      message: t('Base.unameRequired'),
    },
  ],
  password: [
    {
      required: true,
      message: t('Base.passwordRequired'),
    },
  ],
}

const formCom = ref()

const login = async (auto = false) => {
  const { username, token, password } = (auto && store.state.user) || record
  if (auto && username && token) redirect()
  else toLogin()
  if (!auto) {
    isLogining.value = true
    try {
      let res = await loginApi({
        username,
        password,
      })
      if (!res) {
        isLogining.value = false
        return
      }
      store.commit('UPDATE_USER_INFO', {
        token: res.token,
        username,
      })
      store.commit('UPDATE_EDITION', res.license?.edition)
      redirect()
    } catch (error) {
      // ignore error
    } finally {
      isLogining.value = false
    }
  }
}

const redirect = () => {
  router.replace({
    path: (route.query.to ?? '/dashboard').toString(),
  })
}

const nativeLogin = async () => {
  ;(await formCom.value.validate().catch(() => {
    /**/
  })) && login()
}
</script>

<style lang="scss">
.login {
  background-color: var(--color-bg-primary);
  width: 100vw;
  height: 100vh;
  .el-row {
    height: 100%;
    .el-col.intro {
      background-color: var(--color-bg-split);
      position: relative;
      .logo {
        padding: 32px;
      }
      .content {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        position: absolute;
        top: 0;
        bottom: 60px;
        width: 100%;
        .description {
          display: flex;
          color: var(--color-text-secondary);
          p {
            display: flex;
            padding: 0px 10px;
            align-items: center;
            margin: 8px 0;
          }
        }
      }
    }
    .el-col.form {
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      .login-wrapper {
        width: 55%;
        max-width: 500px;
        h1 {
          margin-bottom: 50px;
        }
        .el-form-item--large {
          margin-bottom: 32px;
          .el-input--large .el-input__inner {
            height: 48px;
            line-height: 48px;
          }
        }
        .el-button {
          width: 100%;
          height: 48px;
          line-height: 48px;
        }
      }
    }
  }
}
html:lang(en) .login .intro .description {
  flex-direction: column;
}
html:lang(zh) .login .intro .description {
  flex-direction: row;
}
</style>
