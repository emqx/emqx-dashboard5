import { computed, onMounted, Ref, watch, ComputedRef } from 'vue'
import { useStore } from 'vuex'
import { ElMessageBox } from 'element-plus'
import { useRouter, useRoute } from 'vue-router'
import { User } from '@/types/systemModule'
import useI18nTl from './useI18nTl'

export default (): void => {
  const store = useStore()
  const router = useRouter()
  const { tl } = useI18nTl('Base')

  const isUsingDefaultPwd = computed(() => {
    return store.state.user.isUsingDefaultPwd
  })

  const popupMessageBox = () => {
    ElMessageBox({
      type: 'info',
      message: tl('defaultPwdTip'),
      confirmButtonText: 'OK',
      customClass: 'default-pwd-tip',
      callback: () => {
        router.push({
          name: 'users',
          params: {
            forChangeDefaultPwd: 'true',
          },
        })
      },
      showClose: false,
    })
  }

  onMounted(() => {
    if (isUsingDefaultPwd.value) {
      popupMessageBox()
    }
  })
}

interface UserCtx {
  showDialog: (type: 'create' | 'edit' | 'chPass', item: any) => void
  tableData: Ref<Array<User>>
}

export const useHandlersInUsersPage = (
  ctx: UserCtx,
): {
  isForChangeDefaultPwd: ComputedRef<boolean>
  confirmForChangeDefaultPwdParam: () => void
} => {
  const route = useRoute()
  const store = useStore()

  const isForChangeDefaultPwd = computed(() => {
    return !!route.params.forChangeDefaultPwd
  })

  const currentUserName = computed(() => {
    return store.state.user.username
  })

  const openChangePwdDialog = () => {
    try {
      const user = ctx.tableData.value.find(({ username }) => username === currentUserName.value)
      if (!user) {
        throw new Error('User not found')
      }
      ctx.showDialog('chPass', user)
    } catch (error) {
      console.error(error)
    }
  }

  const confirmForChangeDefaultPwdParam = () => {
    if (isForChangeDefaultPwd.value) {
      openChangePwdDialog()
    }
  }

  /**
   * for the first page is user
   */
  watch(isForChangeDefaultPwd, (val) => {
    if (val) {
      openChangePwdDialog()
    }
  })

  return {
    isForChangeDefaultPwd,
    confirmForChangeDefaultPwdParam,
  }
}
