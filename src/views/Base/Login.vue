<template>
  <div class="login">
    <el-row v-if="!showChangePwdForm">
      <el-col class="intro" :span="8">
        <div class="content">
          <img class="dashboard-img" :src="loginBgBanner" width="369" alt="emqx-dashboard" />
          <div class="cloud-list">
            <a :href="docMap.cloud" target="_blank" rel="noopener noreferrer">
              <img src="@/assets/img/aws.png" width="32" height="32" alt="aws" />
              <img src="@/assets/img/kubernetes.png" width="32" height="32" alt="kubernetes" />
              <img src="@/assets/img/azure.png" width="32" height="32" alt="azure" />
              <img src="@/assets/img/gcp.png" width="32" height="32" alt="gcp" />
            </a>
          </div>
        </div>
      </el-col>
      <el-col class="form" :span="16">
        <!-- Local Login -->
        <div v-if="currentLoginBackend === 'local'" class="login-wrapper local-login">
          <div class="form-hd">
            <h1>{{ loginTitle }}</h1>
          </div>
          <el-form
            ref="FormCom"
            :model="record"
            :rules="rules"
            hide-required-asterisk
            size="large"
            @keyup.enter="submit"
          >
            <el-form-item prop="username">
              <el-input
                v-model.trim="record.username"
                :placeholder="$t('Base.username')"
                tabindex="1"
              />
            </el-form-item>
            <el-form-item class="small-mg-bt" prop="password">
              <el-input
                v-model="record.password"
                type="password"
                :placeholder="$t('Base.password')"
                tabindex="2"
              />
            </el-form-item>
            <div class="btn-container">
              <a
                target="_blank"
                rel="noopener noreferrer"
                class="forgot-btn"
                :href="docMap.resetPassword"
              >
                {{ $t('Base.forgetPassword') }}
              </a>
            </div>
            <el-form-item>
              <el-button class="btn-login" type="primary" @click="submit" :loading="isSubmitting">
                {{ $t('Base.login') }}
              </el-button>
            </el-form-item>
          </el-form>
          <div v-if="hasSSOEnabled" class="other-login">
            <p class="tip">{{ t('Base.otherMethodsLogin') }}</p>
            <div class="buttons-container vertical-align-center">
              <el-button
                v-if="enabledSSOList.includes(DashboardSsoBackendStatusBackend.ldap)"
                link
                type="info"
                @click="currentLoginBackend = 'ldap'"
              >
                LDAP
              </el-button>
              <!-- for call api by browser -->
              <form
                v-if="enabledSSOList.includes(DashboardSsoBackendStatusBackend.saml)"
                :action="samlLoginUrl"
                method="post"
                class="form-sso"
                enctype="multipart/form-data"
              >
                <input
                  v-show="false"
                  type="text"
                  name="backend"
                  id="backend"
                  required
                  v-model="samlBackend"
                />
                <input class="el-button el-button--info is-link" type="submit" value="SAML" />
              </form>
              <!-- for call api by browser -->
              <form
                v-if="enabledSSOList.includes(DashboardSsoBackendStatusBackend.oidc)"
                :action="oidcLoginUrl"
                method="post"
                class="form-sso"
                enctype="multipart/form-data"
                v-loading="isSSOSubmitting"
              >
                <input
                  v-show="false"
                  type="text"
                  name="backend"
                  id="backend"
                  required
                  v-model="oidcBackend"
                />
                <input
                  class="el-button el-button--info is-link"
                  type="submit"
                  value="OIDC"
                  @click="isSSOSubmitting = true"
                />
              </form>
            </div>
          </div>
        </div>
        <!-- LDAP Login -->
        <div v-else-if="currentLoginBackend === 'ldap'" class="login-wrapper ldap-login">
          <el-page-header :icon="ArrowLeft" @back="currentLoginBackend = 'local'"> </el-page-header>
          <div class="form-hd">
            <h1>{{ $t('Base.ldapLogin') }}</h1>
          </div>
          <el-form
            ref="FormCom"
            :model="ldapRecord"
            :rules="rules"
            hide-required-asterisk
            size="large"
            @keyup.enter="submit"
          >
            <el-form-item prop="username">
              <el-input
                v-model.trim="ldapRecord.username"
                :placeholder="$t('Base.username')"
                tabindex="1"
              />
            </el-form-item>
            <el-form-item class="small-mg-bt" prop="password">
              <el-input
                v-model="ldapRecord.password"
                type="password"
                :placeholder="$t('Base.password')"
                tabindex="2"
              />
            </el-form-item>
            <el-form-item>
              <el-button class="btn-login" type="primary" @click="submit" :loading="isSSOLoading">
                {{ $t('Base.login') }}
              </el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
    </el-row>
    <el-row v-else>
      <el-col :span="12" class="img-container">
        <img
          src="@/assets/img/img-change-default-pwd.png"
          alt="img-change-default-pwd"
          width="328"
        />
      </el-col>
      <el-col :span="12" class="col-new-pwd">
        <!-- Change default password -->
        <div class="form-container">
          <div class="form-hd">
            <h5 class="title-pwd">{{ $t('General.changePassword') }}</h5>
            <div class="tip default-pwd-tip">
              <p>{{ $t('Base.defaultPwdTip') }}</p>
              <ul>
                <li>{{ $t('General.passwordRequirement1') }}</li>
                <li>{{ $t('General.passwordRequirement2') }}</li>
              </ul>
            </div>
          </div>
          <el-form
            ref="PwdFormCom"
            hide-required-asterisk
            size="large"
            class="password-form"
            :model="newPasswordRecord"
            :rules="pwdRules"
            @keyup.enter="submitNewPwd"
          >
            <el-form-item prop="password">
              <el-input
                v-model.trim="newPasswordRecord.password"
                autofocus
                show-password
                tabindex="1"
                type="password"
                :placeholder="t('General.newPassword')"
              />
            </el-form-item>
            <el-form-item prop="passwordRepeat">
              <el-input
                v-model="newPasswordRecord.passwordRepeat"
                show-password
                tabindex="2"
                type="password"
                :placeholder="t('General.confirmPassword')"
              />
            </el-form-item>
            <el-button
              class="btn-submit"
              type="primary"
              @click="submitNewPwd"
              :loading="isSubmitting"
            >
              {{ $t('Base.confirm') }}
            </el-button>
            <div class="skip-wrap">
              <el-tooltip class="box-item" effect="dark" :content="$t('Base.skipTip')">
                <el-button class="btn-skip" type="primary" link @click="redirectToDashboard">
                  {{ $t('Base.skip') }}
                </el-button>
              </el-tooltip>
            </div>
          </el-form>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts" setup>
import { login as loginApi } from '@/api/common'
import { changePassword } from '@/api/function'
import { ADMIN_USERNAMES, DEFAULT_PWD, PASSWORD_REG } from '@/common/constants'
import useSSO from '@/hooks/SSO/useSSO'
import useDocLink from '@/hooks/useDocLink'
import useFormRules from '@/hooks/useFormRules'
import useUpdateBaseInfo from '@/hooks/useUpdateBaseInfo'
import useEditionConfigs from '@/hooks/useEditionConfigs'
import { toLogin } from '@/router'
import { PostLogin200 } from '@/types/schemas/dashboard.schemas'
import { DashboardSsoBackendStatusBackend } from '@/types/schemas/dashboardSingleSignOn.schemas'
import { ArrowLeft } from '@element-plus/icons-vue'
import { reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'

const { t } = useI18n()
const store = useStore()
const router = useRouter()
const route = useRoute()
const { loginTitle, loginBgBanner } = useEditionConfigs()

const { docMap } = useDocLink()

const {
  samlLoginUrl,
  samlBackend,
  oidcLoginUrl,
  oidcBackend,
  enabledSSOList,
  currentLoginBackend,
  isSSOLoading,
  ldapRecord,
  hasSSOEnabled,
  ldapLogin,
  getEnabledSSO,
} = useSSO()

getEnabledSSO()

const record = reactive({
  username: '',
  password: '',
})
const newPasswordRecord = reactive({
  password: '',
  passwordRepeat: '',
})
const isSubmitting = ref(false)

const isSSOSubmitting = ref(false)

const showChangePwdForm = ref(false)
const isUsingDefaultPwd = ref(false)
const rules = {
  username: [{ required: true, message: t('Base.unameRequired') }],
  password: [{ required: true, message: t('Base.passwordRequired') }],
}
const { createRequiredRule } = useFormRules()
const pwdMismatchMsg =
  t('General.passwordRequirement1') +
  t('General.semicolon') +
  t('General.passwordRequirement2').toLowerCase()
const pwdRules = {
  password: [
    ...createRequiredRule(t('General.password')),
    {
      pattern: PASSWORD_REG,
      message: pwdMismatchMsg,
      trigger: ['blur'],
    },
  ],
  passwordRepeat: [
    ...createRequiredRule(t('General.confirmPassword')),
    {
      validator: (rule: any, value: string) => {
        if (value !== newPasswordRecord.password) {
          return [new Error(t('General.confirmNotMatch'))]
        } else {
          return []
        }
      },
      trigger: ['blur'],
    },
  ],
}

const FormCom = ref()
const PwdFormCom = ref()

const { updateBaseInfo } = useUpdateBaseInfo()
const updateStoreInfo = (username: string, data: PostLogin200) =>
  updateBaseInfo(username, data, currentLoginBackend.value)

const queryLogin = async ({ username, password }: { username: string; password: string }) => {
  isSubmitting.value = true
  try {
    const res = await loginApi({ username, password })
    isUsingDefaultPwd.value = password === DEFAULT_PWD && ADMIN_USERNAMES.includes(username)
    updateStoreInfo(username, res)
    if (!isUsingDefaultPwd.value) {
      redirectToDashboard()
    } else {
      showChangePwdForm.value = true
    }
    return Promise.resolve({ username, response: res })
  } catch (error) {
    return Promise.reject(error)
  } finally {
    isSubmitting.value = false
  }
}

const login = async (auto = false) => {
  const { username, token } = (auto && store.state.user) || record
  if (auto && username && token) {
    redirectToDashboard()
  } else {
    toLogin()
  }
  if (!auto) {
    queryLogin(record)
  }
}

const redirectToDashboard = () => {
  router.replace({
    path: (route.query.to ?? '/dashboard').toString(),
  })
}

const submit = async () => {
  const isValidated = await FormCom.value.validate().catch(() => false)
  if (!isValidated) {
    return
  }
  switch (currentLoginBackend.value) {
    case 'local':
      login()
      break
    case 'ldap':
      ldapLogin()
        .then(({ username, response }) => {
          updateStoreInfo(username as string, response)
          redirectToDashboard()
        })
        .catch(() => {
          // ignore
        })
      break
    default:
      login()
      break
  }
}

const submitNewPwd = async () => {
  try {
    await PwdFormCom.value.validate()
    isSubmitting.value = true
    const { username, password: old_pwd } = record
    const { password: new_pwd } = newPasswordRecord
    await changePassword(username, { new_pwd, old_pwd })
    store.commit('UPDATE_USER_INFO', { logOut: true })
    queryLogin({ username, password: new_pwd })
  } catch (error) {
    //
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style lang="scss">
.login {
  background-color: var(--color-bg-content);
  width: 100vw;
  height: 100vh;
  h1 {
    margin-top: 0;
    margin-bottom: 0;
  }

  @mixin big-btn {
    width: 100%;
    height: 48px;
    line-height: 48px;
  }

  .title-pwd {
    margin-bottom: 16px;
    font-weight: bold;
    font-size: 22px;
    line-height: 31px;
  }

  .el-row {
    height: 100%;
    .el-col.intro {
      background-color: var(--color-bg);
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
      background-color: var(--color-bg-content);
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      .login-wrapper {
        width: 55%;
        max-width: 500px;
        .form-hd {
          height: 78px;
        }
        .el-form-item--large {
          &:first-child {
            margin-bottom: 32px;
          }
          &.small-mg-bt {
            margin-bottom: 8px;
          }
          .el-input--large .el-input__inner {
            height: 48px;
            line-height: 48px;
          }
        }
        .btn-login {
          @include big-btn();
        }
        .btn-container {
          display: flex;
          justify-content: flex-end;
          margin-bottom: 28px;
        }
        .forgot-btn {
          text-align: right;
        }
        &.ldap-login {
          .el-page-header__header {
            margin-bottom: 24px;
            color: var(--color-primary);
            .el-page-header__content,
            .el-divider.el-divider--vertical {
              display: none;
            }
          }
          .btn-login {
            margin-top: 24px;
          }
        }
      }
    }
    // for beautify the style when auto fill status
    .el-input__wrapper {
      padding: 1px;
      input {
        border-radius: var(--el-input-border-radius, var(--el-border-radius-base));
        padding: 1px 15px;
      }
    }
  }

  .other-login {
    text-align: center;
    margin-top: 24px;
    .el-button {
      text-decoration: underline;
    }
    p,
    .el-button {
      color: var(--color-text-footer);
    }
    p {
      margin-bottom: 6px;
    }
    .buttons-container {
      justify-content: center;
    }
  }

  .form-sso {
    .el-loading-spinner {
      transform: scale(0.3);
    }
  }

  .img-container {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-right: 130px;
    padding-bottom: 100px;
  }

  .col-new-pwd {
    display: flex;
    align-items: center;
    padding-left: 40px;
    padding-bottom: 100px;
    .form-container {
      width: 68%;
    }
    .btn-submit {
      @include big-btn();
      margin-bottom: 12px;
    }
    .btn-skip {
      padding: 0;
    }
  }

  .password-form {
    .el-form-item {
      margin-bottom: 30px;
    }
    .el-input__suffix {
      padding-right: 16px;
    }
  }

  .default-pwd-tip {
    margin-top: 20px;
    margin-bottom: 32px;
    line-height: 20px;
    color: var(--color-text-secondary);
    p {
      margin-top: 0;
      margin-bottom: 16px;
    }
    ul {
      padding-inline-start: 18px;
      margin: 0;
    }
  }
}
</style>
