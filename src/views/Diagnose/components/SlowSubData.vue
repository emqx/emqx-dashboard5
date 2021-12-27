<template>
  <div class="slow-sub-data">
    <div class="slow-sub-data-bar">
      <el-radio-group v-model="slowReasonFilter" size="medium">
        <el-radio-button v-for="{ label, value } in slowReasonFilterOptions" :key="value" :label="value">
          {{ label }}
        </el-radio-button>
      </el-radio-group>
      <div>
        <el-button size="small" class="link-btn">
          <router-link :to="{ name: 'slow-sub-config' }">
            <i class="el-icon-s-tools" />
            <span>
              {{ $t("Base.setting") }}
            </span>
          </router-link>
        </el-button>
        <el-button type="danger" @click="clearData" size="small">
          {{ $t("SlowSub.clearData") }}
        </el-button>
      </div>
    </div>
    <el-table :data="tableData">
      <el-table-column prop="clientid" label="Client ID">
        <template #default="{ row }">
          <router-link
            :to="{
              name: 'clients-detail',
              params: { clientId: row.clientid },
            }"
          >
            {{ row.clientid }}
          </router-link>
        </template>
      </el-table-column>
      <el-table-column>
        <template #header>
          <span>{{ $t("General.reason") }}</span>
          <el-popover placement="top-start" width="320" trigger="hover">
            <div>
              <b>{{ $t("SlowSub.messageBacklog") }}</b>
              {{ ": " + $t("SlowSub.messageBacklogDesc") }}
              <br />
              <b>{{ $t("SlowSub.highAverageTime") }}</b>
              {{ ": " + $t("SlowSub.highAverageTimeDesc") }}
            </div>
            <template #reference>
              <i class="iconfont kongxinwenhao" />
            </template>
          </el-popover>
        </template>
        <template #default="{ row }">
          {{ reasonText(row.type) }}
        </template>
      </el-table-column>
      <el-table-column prop="latency" :label="$t('SlowSub.latencyTime')" sortable>
        <template #default="{ row }"> {{ formatTime(row.latency) }} </template>
      </el-table-column>
      <el-table-column prop="last_update_time" :label="$t('SlowSub.updated')">
        <template #default="{ row }">
          {{ moment(row.last_update_time).format("YYYY-MM-DD HH:mm:ss") }}
        </template>
      </el-table-column>
    </el-table>
    <div class="emq-table-footer">
      <commonPagination :meta-data="pageController" @load-page="reloadStatistics" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "SlowSubData",
});
</script>

<script setup lang="ts">
import { ref, Ref, computed } from "vue";
import { ElMessageBox, ElMessage } from "element-plus";
import commonPagination from "@/components/commonPagination.vue";
import usePageController from "@/hooks/usePagination";
import { SlowSubStatistic } from "@/types/diagnose";
import { clearSlowSubData, querySlowSubStatistics } from "@/api/diagnose";
import moment from "moment";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const statistics: Ref<Array<SlowSubStatistic>> = ref([]);
const { page, limit, count } = usePageController();
const pageController = computed(() => ({ page: page.value, limit: limit.value, count: count.value }));

const VALUE_FOR_NOT_FILTER = "all";
const slowReasonFilter = ref(VALUE_FOR_NOT_FILTER);
const slowReasonFilterOptions = [
  {
    label: t("Base.all"),
    value: VALUE_FOR_NOT_FILTER,
  },
  {
    label: t("SlowSub.timeConsuming"),
    value: "average",
  },
  {
    label: t("SlowSub.messageBacklog"),
    value: "expire",
  },
];

const tableData = computed(() => {
  return slowReasonFilter.value === VALUE_FOR_NOT_FILTER
    ? statistics.value
    : statistics.value.filter(({ type }) => type === slowReasonFilter.value);
});

const getStatistics = async () => {
  try {
    const { data = [], meta } = await querySlowSubStatistics({
      page: page.value,
      limit: limit.value,
      count: count.value,
    });
    statistics.value = data;
    count.value = meta.count || 0;
  } catch (error) {
    //
  }
};

const reloadStatistics = (pageData: { page: number; limit: number }) => {
  page.value = pageData.page;
  limit.value = pageData.limit;
  getStatistics();
};

const clearData = async () => {
  try {
    await ElMessageBox.confirm(t("SlowSub.confirmClearData"), {
      confirmButtonText: t("Base.confirm"),
      cancelButtonText: t("Base.cancel"),
      type: "warning",
    });
    await clearSlowSubData();
    ElMessage.success(t("Base.operateSuccess"));
    getStatistics();
  } catch (error) {
    //
  }
};

const reasonText = (reason: "average" | "expire") => {
  return (
    {
      average: t("SlowSub.highAverageTime"),
      expire: t("SlowSub.messageBacklog"),
    }[reason] || ""
  );
};

const formatTime = (time: number) => {
  if (time < 1000) {
    return `${time}ms`;
  }
  return `${time / 1000}s`;
};

getStatistics();
</script>

<style lang="scss" scoped>
.slow-sub-data {
  .slow-sub-data-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 40px;
  }
  .el-icon-s-tools {
    transform: scale(1.2);
  }
  :deep .el-radio-button__original-radio:checked + .el-radio-button__inner {
    background: rgba(0, 178, 153, 0.05);
    color: #00b299;
  }
}
</style>
