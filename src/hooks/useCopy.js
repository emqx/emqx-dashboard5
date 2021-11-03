import { onBeforeUnmount } from "vue";

export default function useCopy(callback) {
  let copyShowTimeout = null;
  const copySuccess = function () {
    this.$message.success(this.$t("Base.copied"));
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
