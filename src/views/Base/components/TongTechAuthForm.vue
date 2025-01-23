<template>
  <div class="tong-tech-auth">
    <p class="placeholder">{{ t('Base.jumping') }}</p>
    <form
      v-show="false"
      :action="tongTechLoginUrl"
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
        v-model="tongTechBackend"
      />
      <input
        ref="SubmitButton"
        class="el-button el-button--info is-link"
        type="submit"
        value="TongTech"
      />
    </form>
  </div>
</template>

<script setup lang="ts">
import { waitAMoment } from '@/common/tools'
import useSSO from '@/hooks/SSO/useSSO'
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const { tongTechBackend, tongTechLoginUrl } = useSSO()

const SubmitButton = ref()
onMounted(async () => {
  await waitAMoment(500)
  SubmitButton.value.click()
})
</script>

<style lang="scss">
.tong-tech-auth {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
