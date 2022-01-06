<template>
  <div class="exhook-create app-wrapper">
    <router-link class="back-button" :to="{ name: 'exhook' }">
      {{ tl("backList") }}
    </router-link>
    <div class="page-header-title">{{ tl("addExhook") }}</div>
    <el-card shadow="never" class="app-card exhook-create-card">
      <ExhookForm ref="formCom" v-model="formData" />
      <div class="exhook-create-ft">
        <el-button size="small" type="primary" :loading="isSubmitting" @click="submit">
          {{ $t("Base.create") }}
        </el-button>
        <el-button size="small" @click="cancel">
          {{ $t("Base.cancel") }}
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, Ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import ExhookForm from "./components/ExhookForm.vue";
import { Exhook } from "@/types/systemModule";

const router = useRouter();
const { t } = useI18n();
const tl = (key: string, moduleName = "Exhook") => t(`${moduleName}.${key}`);

const formCom = ref();
const formData: Ref<Exhook> = ref({ ssl: {} } as Exhook);
const isSubmitting = ref(false);

const cancel = () => router.push({ name: "exhook" });

const submit = async () => {
  try {
    isSubmitting.value = true;
    await formCom.value.validate();
    // TODO:
    ElMessage.success(tl("createSuccess", "Base"));
    router.push({ name: "exhook" });
  } catch (error) {
    //
  } finally {
    isSubmitting.value = false;
  }
  // TODO:
};
</script>

<style lang="scss" scoped>
.exhook-create-form {
  width: 70%;
  margin-bottom: 36px;
}
.form-sub-block-title {
  margin-top: 0;
  margin-bottom: 8px;
  color: #000000;
  font-weight: bold;
  line-height: 20px;
}
.form-sub-block {
  margin-bottom: 8px;
}
</style>
