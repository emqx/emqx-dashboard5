<template>
  <el-dialog
    v-model="showDialog"
    :width="600"
    custom-class="API-key-dialog"
    :title="dialogTitle"
    :z-index="2000"
  >
    <el-form
      ref="formCom"
      label-position="top"
      size="small"
      :model="formData"
      :rules="rules"
      :class="{ 'is-view': operationType === 'view' }"
    >
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item :label="tl('keyName')" prop="name" required>
            <el-input
              v-model="formData.name"
              :disabled="operationType !== 'create'"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="tl('expireAt')" prop="expired_at">
            <el-date-picker
              v-model="formData.expired_at"
              :disabled="operationType === 'view'"
              :disabledDate="isItEarlierThanToday"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="tl('isEnable')" prop="enable">
            <el-select
              v-model="formData.enable"
              :disabled="operationType === 'view'"
            >
              <el-option
                v-for="{ label, value } in isEnableOptions"
                :key="label"
                :label="label"
                :value="value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24" v-if="operationType === 'view'">
          <el-form-item label="API Key">
            <el-row :gutter="12">
              <el-col :span="21">
                <el-input v-model="formData.api_key" disabled />
              </el-col>
              <el-col :span="3">
                <el-button ref="btnCopyAPIKey">{{
                  tl("copy", "Base")
                }}</el-button>
              </el-col>
            </el-row>
          </el-form-item>
        </el-col>
        <el-col :span="24" v-if="operationType === 'view'">
          <el-form-item label="Secret Key">
            <el-row :gutter="12">
              <el-col :span="18">
                <el-input
                  v-model="formData.api_secret"
                  :type="!showSecret ? 'password' : 'text'"
                  disabled
                />
              </el-col>
              <el-col :span="3">
                <el-button @click="showSecret = !showSecret">{{
                  tl("show")
                }}</el-button>
              </el-col>
              <el-col :span="3">
                <el-button ref="btnCopySecretKey">{{
                  tl("copy", "Base")
                }}</el-button>
              </el-col>
            </el-row>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item :label="tl('desc')" prop="description">
            <el-input
              type="textarea"
              v-model="formData.desc"
              :disabled="operationType === 'view'"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button size="small" @click="showDialog = false">{{
          operationType === "view" ? tl("close") : $t("Base.cancel")
        }}</el-button>
        <el-button
          type="primary"
          size="small"
          @click="submit"
          :loading="isSubmitting"
          v-if="operationType !== 'view'"
        >
          {{ $t("Base.confirm") }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import {
  computed,
  defineProps,
  defineEmits,
  ref,
  PropType,
  Ref,
  watch,
  nextTick,
} from "vue";
import { ElDialog, ElMessage } from "element-plus";
import { useI18n } from "vue-i18n";
import {
  APIKeyFormWhenCreating,
  APIKey,
  APIKeyFormWhenEditing,
} from "@/types/systemModule";
import { createAPIKey, updateAPIKey } from "@/api/systemModule";
import { ElInput } from "element-plus";
import Clipboard from "clipboard";

export type OperationType = "create" | "view" | "edit";

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  operationType: {
    type: String as PropType<OperationType>,
    required: true,
  },
  APIKeyData: {
    type: Object as PropType<APIKey>,
  },
});

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
  (e: "submitted"): void;
}>();

const { t } = useI18n();
const tl = (key: string, collection = "APIKey") => {
  return t(collection + "." + key);
};

const createRawFormData = () => ({
  name: "",
  expired_at: "",
  desc: "",
  enable: true,
});

const formCom = ref();
const formData: Ref<APIKeyFormWhenCreating | APIKey> = ref(createRawFormData());
const rules = {
  name: [
    {
      required: true,
      message: tl("keyNameRequired"),
    },
  ],
};
const isEnableOptions = [
  {
    label: tl("disable"),
    value: false,
  },
  {
    label: tl("enable"),
    value: true,
  },
];
const isSubmitting = ref(false);

const btnCopyAPIKey = ref();
const btnCopySecretKey = ref();
let APIKeyClipboardInstance: undefined | Clipboard = undefined;
let secretKeyClipboardInstance: undefined | Clipboard = undefined;

const showSecret = ref(false);

const showDialog = computed({
  get: () => props.modelValue,
  set: (val: boolean) => {
    emit("update:modelValue", val);
  },
});

const dialogTitle = computed(
  () =>
    ({
      create: `${tl("create", "Base")}  ${tl("APIKey", "components")}`,
      view: `${tl("edit", "Base")}  ${tl("APIKey", "components")}`,
      edit: tl("apiKeyDetail"),
    }[props.operationType])
);

watch(showDialog, async (val) => {
  if (val) {
    if (props.operationType !== "create") {
      formData.value = { ...(props.APIKeyData as APIKey) };
      if (props.operationType === "view") {
        await nextTick();
        initCopyTool();
      }
    } else {
      formData.value = createRawFormData();
      await nextTick();
      formCom.value.clearValidate();
    }
  }
});

const initCopyTool = () => {
  const initItem = (btn: HTMLElement, text: string) => {
    const clipboard = new Clipboard(btn, { text: () => text });
    clipboard.on("success", () => ElMessage.success(t("Base.copied")));
    clipboard.on("error", () => ElMessage.error(t("Base.opErr")));
    return clipboard;
  };
  APIKeyClipboardInstance && APIKeyClipboardInstance?.destroy();
  secretKeyClipboardInstance && secretKeyClipboardInstance?.destroy();
  APIKeyClipboardInstance = initItem(
    btnCopyAPIKey.value.$el,
    (formData.value as APIKey).api_key
  );
  secretKeyClipboardInstance = initItem(
    btnCopySecretKey.value.$el,
    (formData.value as APIKey).api_secret
  );
};

const todayStartTime = new Date().setHours(0, 0, 0, 0);
const isItEarlierThanToday = (date: Date) => date.getTime() < todayStartTime;

const submitAddedData = () => createAPIKey(formData.value);

const submitUpdatedData = () => {
  const { name, ...data } = formData.value as APIKeyFormWhenEditing;
  return updateAPIKey(name, data);
};

const submit = async () => {
  try {
    await formCom.value.validate();
    isSubmitting.value = true;
    if (props.operationType === "create") {
      await submitAddedData();
    } else if (props.operationType === "edit") {
      await submitUpdatedData();
    }
    emit("submitted");
    showDialog.value = false;
  } catch (error) {
    //
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style lang="scss">
.API-key-dialog {
  .el-col {
    .el-button {
      width: 100%;
    }
  }
  .is-view {
    .el-input.is-disabled .el-input__inner,
    .el-textarea.is-disabled .el-textarea__inner {
      background-color: var(--el-input-background-color, var(--el-color-white));
      border-color: var(--el-border-color-base);
      color: var(--el-input-font-color, var(--el-text-color-regular));
    }
  }
}
</style>
