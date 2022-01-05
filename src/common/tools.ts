import vueInstance from "@/main";
import Clipboard from "clipboard";
import { ElMessage } from "element-plus";

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

export const downloadBlobData = (blobRes: {
  data: Blob;
  headers: { "content-disposition": string; "content-type": string };
}) => {
  const { data, headers } = blobRes;
  if (!(data instanceof Blob)) {
    return;
  }
  const fileName = headers["content-disposition"]?.replace(/\w+; filename=(.*)/, "$1") || "file";
  const blob = new Blob([data], { type: headers["content-type"] });
  const DOM = document.createElement("a");
  const url = window.URL.createObjectURL(blob);
  DOM.href = url;
  DOM.download = decodeURI(fileName);
  DOM.style.display = "none";
  document.body.appendChild(DOM);
  DOM.click();
  DOM.parentNode?.removeChild(DOM);
  window.URL.revokeObjectURL(url);
};

export const parseJSONSafely = (str: string) => {
  try {
    return JSON.parse(str);
  } catch (error) {
    console.error("An error occurred while parsing the JSON string");
  }
};
