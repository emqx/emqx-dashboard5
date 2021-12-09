import Clipboard from "clipboard";
import { ElMessage } from "element-plus";
import i18n from "@/i18n";

export const checkStringWithUnit = (str: string, units: Array<string>): boolean => {
  const reg = new RegExp(`^\\d+(.\\d+)?(${units.join("|")})$`);
  return reg.test(str);
};

export const checkInRange = (val: number, min: number, max: number): boolean => val >= min && val <= max;

export const createClipboardEleWithTargetText = (btn: HTMLElement, text: string) => {
  const clipboard = new Clipboard(btn, { text: () => text });
  clipboard.on("success", () =>
    ElMessage.success(i18n.global.t("Base.copied"))
  );
  clipboard.on("error", () => ElMessage.error(i18n.global.t("Base.opErr")));
  return clipboard;
};
