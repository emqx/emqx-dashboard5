import vueInstance from "@/main";
import Clipboard from "clipboard";
import { ElMessage } from "element-plus";
import store from "@/store";

export const checkStringWithUnit = (str: string, units: Array<string>): boolean => {
  const reg = new RegExp(`^\\d+(.\\d+)?(${units.join("|")})$`);
  return reg.test(str);
};

export const checkInRange = (val: number, min: number, max: number): boolean => val >= min && val <= max;

export const createClipboardEleWithTargetText = (
  btn: HTMLElement,
  text: string,
  sucHandler?: () => void,
  errorHandler?: () => void
) => {
  const t = vueInstance.$t;
  const clipboard = new Clipboard(btn, { text: () => text });
  const sucFunc = sucHandler ?? (() => ElMessage.success(t("Base.copied")));
  const errorFunc = errorHandler ?? (() => ElMessage.error(t("Base.opErr")));
  clipboard.on("success", sucFunc);
  clipboard.on("error", errorFunc);
  return clipboard;
};

export const createURLWithAuth = (rawURL: string) => {
  const { protocol, host, pathname } = window.location;
  const { password, username } = store.state.user;
  return `${protocol}//${username}:${password}@${host}${rawURL}`;
};
