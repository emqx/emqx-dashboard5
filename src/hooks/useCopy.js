import { onBeforeUnmount } from "vue";
import { ElMessage } from "element-plus";

export default function useCopy(callback) {
  let copyShowTimeout = null;
  const copySuccess = function () {
    ElMessage.success(this.$t("Base.copied"));
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
