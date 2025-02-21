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
        <!-- Login -->
        <div class="login-wrapper">
          <div class="form-hd">
            <h1>{{ loginTitle }}</h1>
          </div>
          <el-form
            ref="FormCom"
            :model="record"
            :rules="rules"
            hide-required-asterisk
            size="large"
            @keyup.enter="nativeLogin"
          >
            <el-form-item prop="username">
              <el-input
                v-model.trim="record.username"
                :placeholder="$t('Base.username')"
                tabindex="1"
                autocomplete="username"
              />
            </el-form-item>
            <el-form-item prop="password">
              <el-input
                v-model="record.password"
                type="password"
                :placeholder="$t('Base.password')"
                tabindex="2"
                autocomplete="current-password"
              />
            </el-form-item>
            <el-form-item>
              <div class="oper-wrapper">
                <el-button type="primary" @click="nativeLogin" :loading="isSubmitting">
                  {{ $t('Base.login') }}
                </el-button>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  class="forgot-btn"
                  :href="docMap.resetPassword"
                >
                  {{ $t('Base.forgetPassword') }}
                </a>
              </div>
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
              <p>{{ isUsingDefaultPwd ? t('Base.defaultPwdTip') : t('Base.expiredPwdTip') }}</p>
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
            <el-input class="username-placeholder" v-model.trim="record.username" />
            <el-form-item prop="password">
              <el-input
                v-model.trim="newPasswordRecord.password"
                autofocus
                show-password
                tabindex="1"
                type="password"
                autocomplete="new-password"
                :placeholder="t('General.newPassword')"
              />
            </el-form-item>
            <el-form-item prop="passwordRepeat">
              <el-input
                v-model="newPasswordRecord.passwordRepeat"
                show-password
                tabindex="2"
                type="password"
                autocomplete="new-password"
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
                <el-button class="btn-skip" type="primary" link @click="redirect">
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
import useDocLink from '@/hooks/useDocLink'
import useFormRules from '@/hooks/useFormRules'
import useEditionConfigs from '@/hooks/useEditionConfigs'
import { toLogin } from '@/router'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const store = useStore()
const router = useRouter()
const route = useRoute()
const { loginTitle, loginBgBanner } = useEditionConfigs()

const { docMap } = useDocLink()

const record = reactive({
  username: '',
  password: '',
})
const newPasswordRecord = reactive({
  password: '',
  passwordRepeat: '',
})
const isSubmitting = ref(false)

const showChangePwdForm = ref(false)
const isUsingDefaultPwd = ref(false)
/**
 * if value is negative, it means the password is expired
 */
const pwdValidSeconds = ref(Number.MAX_SAFE_INTEGER)
const isPwdExpired = computed(() => pwdValidSeconds.value < 0)

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
    {
      validator(rules: unknown, value: string, callback: (error?: string) => void) {
        if (isPwdExpired.value && value === record.password) {
          callback(t('General.noSameNewPwd'))
        } else {
          callback()
        }
      },
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

const queryLogin = async ({ username, password }: { username: string; password: string }) => {
  isSubmitting.value = true
  try {
    const res = await loginApi({ username, password })
    isUsingDefaultPwd.value = password === DEFAULT_PWD && ADMIN_USERNAMES.includes(username)
    pwdValidSeconds.value = res.password_expire_in_seconds
    store.commit('UPDATE_USER_INFO', { token: res.token, username })
    store.commit('UPDATE_EDITION', res.license?.edition)
    if (!isUsingDefaultPwd.value && !isPwdExpired.value) {
      redirect()
    } else {
      showChangePwdForm.value = true
    }
    isSubmitting.value = false
    return Promise.resolve()
  } catch (error) {
    isSubmitting.value = false
    return Promise.reject(error)
  }
}

const login = async (auto = false) => {
  const { username, token } = (auto && store.state.user) || record
  if (auto && username && token) {
    redirect()
  } else {
    toLogin()
  }
  if (!auto) {
    queryLogin(record)
  }
}

const redirect = () => {
  router.replace({
    path: (route.query.to ?? '/dashboard').toString(),
  })
}

const nativeLogin = async () => {
  ;(await FormCom.value.validate().catch(() => {
    /**/
  })) && login()
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
          margin-bottom: 32px;
          .el-input--large .el-input__inner {
            height: 48px;
            line-height: 48px;
          }
        }
        .el-button {
          @include big-btn();
        }
        .oper-wrapper {
          position: relative;
          flex-grow: 1;
          padding-bottom: 48px;
          .forgot-btn {
            position: absolute;
            bottom: 0;
            right: 0;
            display: block;
            width: 100%;
            text-align: right;
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

  .username-placeholder {
    display: none;
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
