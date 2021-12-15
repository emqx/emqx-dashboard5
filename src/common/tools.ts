import { useI18n } from "vue-i18n";
import Clipboard from "clipboard";
import { ElMessage } from "element-plus";

export const checkStringWithUnit = (str: string, units: Array<string>): boolean => {
  const reg = new RegExp(`^\\d+(.\\d+)?(${units.join("|")})$`);
  return reg.test(str);
};

export const checkInRange = (val: number, min: number, max: number): boolean => val >= min && val <= max;

export const createClipboardEleWithTargetText = (btn: HTMLElement, text: string) => {
  const { t } = useI18n();
  const clipboard = new Clipboard(btn, { text: () => text });
  clipboard.on("success", () => ElMessage.success(t("Base.copied")));
  clipboard.on("error", () => ElMessage.error(t("Base.opErr")));
  return clipboard;
};
