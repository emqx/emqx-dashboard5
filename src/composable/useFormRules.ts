import i18n from "@/i18n";
import { checkStringWithUnit, checkInRange } from "@/common/tools";
import { RuleInValidatorParam } from "@/types/common";

export default () => {
  const { t } = i18n.global;
  const createRequiredRule = (name) => {
    return [
      {
        required: true,
        message: t("Rule.inputFieldRequiredError", { name }),
      },
    ];
  };
  const createIntFieldRule = (min?: number, max?: number) => {
    const ret = [
      {
        validator(rule: RuleInValidatorParam, val: string) {
          if (!/^-?\d*$/.test(val)) {
            return [new Error(t("Rule.errorType", { type: t("Rule.int") }))];
          }
          return [];
        },
      },
    ];
    if (min !== undefined && max !== undefined) {
      ret.push({
        validator(rule: RuleInValidatorParam, val: string) {
          if (!checkInRange(Number(val), min, max)) {
            return [new Error(t("Rule.errorRange", { min, max }))];
          }
          return [];
        },
      });
    }
    return ret;
  };
  const createStringWithUnitFieldRule = (units: Array<string>, min?: number, max: ?number) => {
    const ret = [
      {
        validator(rule: RuleInValidatorParam, val: string) {
          if (!checkStringWithUnit(val, units)) {
            return new Error(t("Rule.formatError"));
          }
          return [];
        },
        trigger: "blur",
      },
    ];
    if (min !== undefined && max !== undefined) {
      ret.push({
        validator(rule: RuleInValidatorParam, val: string) {
          if (!checkInRange(parseFloat(val), min, max)) {
            return [new Error(t("Rule.errorRange", { min, max }))];
          }
          return [];
        },
      });
    }
    return ret;
  };

  return {
    createRequiredRule,
    createIntFieldRule,
    createStringWithUnitFieldRule,
  };
};
