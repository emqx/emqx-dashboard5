<template>
  <div class="no-tab-wrapper">
    <div class="title-desc">{{ translate("eventTitleDesc") }}</div>
    <div class="section-header">
      <div>{{ translate("configMsg") }}</div>
    </div>
    <div>
      <el-row v-for="(item, key) in eventMsg" :key="key">
        <el-col :span="15">
          <div class="item-title">{{ `$event/${key}` }}</div>
          <div class="item-desc">{{ translate(key) }}</div>
        </el-col>
        <el-col :span="5" class="item-switch">
          <el-switch
            v-model="eventMsg[key]"
            v-loading="operationPending"
            @change="updateEventMsg()"
          ></el-switch>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { defineComponent, onMounted, reactive, ref } from "vue";
import { getEventMsg, editEventMsg } from "@/api/advanced";
import { ElMessage } from "element-plus";
import { useI18n } from "vue-i18n";

export default defineComponent({
  name: "Message",
  setup() {
    const { t } = useI18n();
    const translate = function (key, collection = "Advanced") {
      return t(collection + "." + key);
    };

    let eventMsg = reactive({
      client_connected: false,
      client_disconnected: false,
      client_subscribed: false,
      client_unsubscribed: false,
      message_delivered: false,
      message_dropped: false,
      message_acked: false,
    });
    let operationPending = ref(true);

    const loadData = async function () {
      operationPending.value = true;

      let res = await getEventMsg().catch(() => {});
      if (res) {
        Object.keys(res).forEach((k) => {
          let alignKey = k.match(/\$event\/(\w+)/)[1];
          eventMsg[alignKey] = res[k];
        });
      } else {
        //todo
      }
      operationPending.value = false;
    };

    const updateEventMsg = async function () {
      operationPending.value = true;
      let pendingEventMsg = {};
      Object.keys(eventMsg).forEach((key) => {
        pendingEventMsg["$event/" + key] = eventMsg[key];
      });
      let res = await editEventMsg(pendingEventMsg).catch(() => {});
      if (res) {
        ElMessage({
          type: "success",
          message: t("Base.editSuccess"),
        });
      } else {
        loadData();
      }
      operationPending.value = false;
    };

    onMounted(loadData);

    const reloading = () => {
      loadData();
    };

    return {
      eventMsg,
      operationPending,
      translate,
      updateEventMsg,
      reloading,
    };
  },
});
</script>
<style lang="scss" scoped>
.title-desc {
  color: #8d96a2;
}
.item-title {
  font-size: 14px;
  font-weight: 700;
  line-height: 24px;
}
.item-desc {
  font-size: 14px;
  color: #5b5b5b;
  line-height: 28px;
}
.el-row {
  padding: 20px;
  border: 1px solid #eeeef7;
}
.el-row:not(:first-of-type) {
  border-top: none;
}
.item-switch > .el-switch {
  height: 50px;
}
</style>
