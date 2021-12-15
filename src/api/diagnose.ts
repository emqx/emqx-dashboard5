import http from "@/common/http";
import { ListDataWithPagination } from "@/types/common";
import { SlowSubConfig, SlowSubStatistic } from "@/types/diagnose";

export const querySlowSubConfig = (): Promise<SlowSubConfig> => {
  return http.get("/slow_subscriptions/settings");
};

export const updateSlowSubConfig = (data: SlowSubConfig) => {
  return http.put("/slow_subscriptions/settings", data);
};

export const clearSlowSubData = () => {
  return http.delete("/slow_subscriptions");
};

export const querySlowSubStatistics = (): Promise<ListDataWithPagination<SlowSubStatistic>> => {
  return http.get("/slow_subscriptions");
};
