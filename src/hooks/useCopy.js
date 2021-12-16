import { onBeforeUnmount } from "vue";
import { ElMessage } from "element-plus";
import { useI18n } from "vue-i18n";

export default function useCopy(callback) {
  const { t } = useI18n()
  let copyShowTimeout = null;
  const copySuccess = function () {
    ElMessage.success(t("Base.copied"));
    clearTimeout(copyShowTimeout);
    copyShowTimeout = setTimeout(callback, 500);
  };
  onBeforeUnmount(() => {
    clearTimeout(copyShowTimeout);
  });
  return {
    copySuccess,
  };
}
