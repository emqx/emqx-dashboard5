<template>
  <div class="authz-setting app-wrapper">
    <back-button back-url="/authorization">
      {{ $t("Auth.backAuthzList") }}
    </back-button>
    <div class="page-header-title">
      {{ $t("Auth.authzSetting") }}
    </div>
    <el-card shadow="never" class="app-card">
      <el-row>
        <el-col :span="12">
          <el-form :model="record" label-position="top">
            <div class="part-header">{{ $t("Auth.basicSettings") }}</div>
            <el-form-item label="No Match">
              <el-select v-model="record.no_match">
                <el-option value="allow"></el-option>
                <el-option value="deny"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="Deny Action">
              <el-select v-model="record.deny_action">
                <el-option value="ignore"></el-option>
                <el-option value="disconnect"></el-option>
              </el-select>
            </el-form-item>
            <div class="part-header">{{ $t("Auth.authzCache") }}</div>
            <el-form-item :label="$t('Auth.enableCache')">
              <el-select v-model="record.cache.enable">
                <el-option :value="true" :label="$t('Base.yes')"></el-option>
                <el-option :value="false" :label="$t('Base.no')"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('Auth.maxSize')">
              <el-input
                v-model.number="record.cache.max_size"
                placeholder="32"
              ></el-input>
            </el-form-item>
            <el-form-item :label="$t('Auth.ttl')">
              <el-input v-model.number="record.cache.ttl" placeholder="1">
                <template #append>
                  <el-select v-model="record.cache.unit">
                    <el-option value="s" :label="$t('Base.second')"></el-option>
                    <el-option value="m" :label="$t('Base.minute')"></el-option>
                    <el-option value="h" :label="$t('Base.hour')"></el-option>
                  </el-select>
                </template>
              </el-input>
            </el-form-item>
          </el-form>
          <el-button type="primary" @click="save" size="small">{{
            $t("Base.save")
          }}</el-button>
          <el-button @click="$router.push('/authorization')" size="small">
            {{ $t("Base.cancel") }}
          </el-button>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import { defineComponent, ref } from "vue";
import BackButton from "./components/BackButton.vue";
import { listAuthzSetting, updateAuthzSetting } from "@/api/auth";
import { ElMessage } from "element-plus";

export default defineComponent({
  name: "AuthzSetting",
  components: {
    BackButton,
  },
  setup() {
    const record = ref({
      cache: {},
    });
    const loadData = async () => {
      const res = await listAuthzSetting();
      if (res) {
        const {
          cache: { ttl },
        } = res;
        res.cache.ttl = ttl.replace(/[^0-9]/gi, "");
        res.cache.unit = ttl.replace(/[^a-z]+/gi, "");
        record.value = res;
      }
    };
    loadData();
    const save = async function () {
      await updateAuthzSetting(record.value);
      ElMessage.success(this.$t("Base.updateSuccess"));
      this.$router.push({ name: "authorization" });
    };
    return {
      record,
      save,
    };
  },
});
</script>
