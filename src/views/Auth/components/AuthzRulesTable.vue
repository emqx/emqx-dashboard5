<template>
  <el-table :data="data">
    <el-table-column :label="tl('action')" :min-width="isEdit ? 124 : 80">
      <template #header v-if="isEdit">
        <label class="custom-required">
          {{ tl('action') }}
        </label>
      </template>
      <template #default="{ row }">
        <el-select v-if="isEdit" v-model="row.action">
          <el-option
            v-for="{ label, value } in actionOpts"
            :key="value"
            :value="value"
            :label="label"
          />
        </el-select>
        <template v-else>{{ getLabelFromValueInOptionList(row.action, actionOpts) }}</template>
      </template>
    </el-table-column>
    <el-table-column prop="permission" :label="tl('permission')" min-width="104">
      <template #header v-if="isEdit">
        <label class="custom-required">
          {{ tl('permission') }}
        </label>
      </template>
      <template #default="{ row }">
        <el-select v-if="isEdit" v-model="row.permission">
          <el-option
            v-for="{ label, value } in permissionOpts"
            :key="value"
            :value="value"
            :label="label"
          />
        </el-select>
        <template v-else>
          {{ getLabelFromValueInOptionList(row.permission, permissionOpts) }}
        </template>
      </template>
    </el-table-column>
    <el-table-column
      prop="topic"
      :label="t('Base.topic')"
      min-width="80"
      class-name="overflow-visible"
    >
      <template #header v-if="isEdit">
        <label class="custom-required">
          {{ t('Base.topic') }}
        </label>
      </template>
      <template #default="{ row, $index }">
        <el-form-item v-if="isEdit" :prop="`rules.${$index}.topic`" :rules="topicRules">
          <el-input v-model="row.topic" />
        </el-form-item>
        <template v-else>{{ row.topic }}</template>
      </template>
    </el-table-column>
    <el-table-column prop="qos" label="QoS" :min-width="isEdit ? 210 : 70">
      <template #default="{ row }">
        <el-select v-if="isEdit" v-model="row.qos" multiple>
          <el-option v-for="item in QoSOptions" :key="item" :label="item" :value="item" />
        </el-select>
        <template v-else>{{ row.qos?.join?.(', ') }}</template>
      </template>
    </el-table-column>
    <el-table-column prop="retain" label="Retain" min-width="80">
      <template #default="{ row }">
        <el-select v-if="isEdit" v-model="row.retain">
          <el-option :value="true" label="true" />
          <el-option :value="false" label="false" />
          <el-option value="all" :label="retainAllLabel" />
        </el-select>
        <template v-else>{{ row.retain === 'all' ? retainAllLabel : row.retain }}</template>
      </template>
    </el-table-column>
    <el-table-column
      v-if="type !== BuiltInDBType.Client"
      prop="clientid_re"
      :label="t('Clients.clientIdReg')"
      min-width="136"
    >
      <template #default="{ row }">
        <el-input v-if="isEdit" v-model="row.clientid_re" />
        <template v-else>{{ row.clientid_re }}</template>
      </template>
    </el-table-column>
    <el-table-column
      v-if="type !== BuiltInDBType.User"
      prop="username_re"
      :label="t('Clients.usernameReg')"
      min-width="148"
    >
      <template #default="{ row }">
        <el-input v-if="isEdit" v-model="row.username_re" />
        <template v-else>{{ row.username_re }}</template>
      </template>
    </el-table-column>
    <el-table-column prop="ipaddr" :label="t('Clients.ipAddressRange')" min-width="148">
      <template #default="{ row }">
        <el-input v-if="isEdit" v-model="row.ipaddr" />
        <template v-else>{{ row.ipaddr }}</template>
      </template>
    </el-table-column>
    <slot name="operation-column" />
  </el-table>
</template>

<script setup lang="ts">
import { BuiltInDBRule } from '@/types/auth'
import { BuiltInDBType } from '@/types/enum'

withDefaults(
  defineProps<{
    data: Array<BuiltInDBRule>
    isEdit?: boolean
    type?: BuiltInDBType
  }>(),
  {
    type: BuiltInDBType.All,
  },
)

const { t, tl } = useI18nTl('Auth')

const { actionOpts, permissionOpts } = useAuthzManager()

const retainAllLabel = t('Base.all')

const { createRequiredRule } = useFormRules()
const topicRules = createRequiredRule(t('Base.topic'))
</script>
