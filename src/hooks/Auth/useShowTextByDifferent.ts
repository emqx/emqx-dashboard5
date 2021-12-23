import { ref, computed } from "vue";
import { SHOW_PAYLOAD_BY_WHICH_OPTION_LIST } from "@/common/constants";
import { encode, decode } from "js-base64";
import { PayloadShowByType } from "@/types/enum";

export default () => {
  const rawText = ref();
  const payloadShowBy = ref(SHOW_PAYLOAD_BY_WHICH_OPTION_LIST[0]);
  const payloadShowByOptions = SHOW_PAYLOAD_BY_WHICH_OPTION_LIST;

  const setRawText = (base64Text: string): void => {
    rawText.value = base64Text;
  };

  const base64ToPlaintext = (base64Text: string): string => {
    try {
      return decode(base64Text);
    } catch (error) {
      return base64Text;
    }
  };

  const payloadForShow = computed(() => {
    switch (payloadShowBy.value) {
      case PayloadShowByType.Plaintext:
        return base64ToPlaintext(rawText.value);
        break;
      case PayloadShowByType.Base64:
        return rawText.value;
        break;
      default:
        return rawText.value;
        break;
    }
  });

  return {
    payloadForShow,
    payloadShowBy,
    payloadShowByOptions,
    setRawText,
  };
};
