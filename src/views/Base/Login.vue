<template>
  <div class="login">
    <el-row>
      <el-col class="intro" :span="8">
        <div class="logo">
          <img src="@/assets/img/emqx-logo.png" width="96" height="33" alt="emqx-logo" />
        </div>
        <div class="content">
          <img
            class="dashboard-img"
            src="@/assets/img/login-banner.png"
            width="369"
            alt="emqx-dashboard"
          />
          <div class="cloud-list">
            <a :href="cloudLink" target="_blank" rel="noopener noreferrer">
              <img src="@/assets/img/aws.png" width="32" height="32" alt="aws" />
              <img src="@/assets/img/kubernetes.png" width="32" height="32" alt="kubernetes" />
              <img src="@/assets/img/azure.png" width="32" height="32" alt="azure" />
              <img src="@/assets/img/gcp.png" width="32" height="32" alt="gcp" />
            </a>
          </div>
          <h2>{{ $t('Base.emqxDesc') }}</h2>
        </div>
      </el-col>
      <el-col class="form" :span="16">
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
                v-model="record.password"
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
import { reactive, ref, computed } from 'vue'
import { login as loginApi } from '@/api/common'
import { toLogin } from '@/router'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'
import docLinks from '@/common/docLinks'

const { t } = useI18n()
const store = useStore()
const router = useRouter()
const route = useRoute()

const cloudLink = computed(() => {
  const doc = docLinks(store.state.lang)
  return doc.cloud
})

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
      background-color: #1f252f;
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
        .cloud-list {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-top: 24px;
          margin-bottom: 16px;
          img {
            margin: 0px 12px;
          }
        }
        h2 {
          margin-top: 6px;
          color: #fff;
          padding: 0 48px;
          line-height: 2;
          text-align: center;
        }
        .el-button {
          background-color: transparent;
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
</style>
