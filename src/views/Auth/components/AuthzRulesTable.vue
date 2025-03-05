<template>
  <el-table :data="data">
    <el-table-column :label="tl('action')" min-width="80px">
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
    <el-table-column prop="permission" :label="tl('permission')" min-width="80px">
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
    <el-table-column prop="topic" :label="t('Base.topic')">
      <template #default="{ row }">
        <el-input v-if="isEdit" v-model="row.topic" />
        <template v-else>{{ row.topic }}</template>
      </template>
    </el-table-column>
    <el-table-column prop="qos" label="QoS">
      <template #default="{ row }">
        <el-select v-if="isEdit" v-model="row.qos" multiple>
          <el-option v-for="item in QoSOptions" :key="item" :label="item" :value="item" />
        </el-select>
        <template v-else>{{ row.qos?.join?.(', ') }}</template>
      </template>
    </el-table-column>
    <el-table-column prop="retain" label="Retain">
      <template #default="{ row }">
        <el-select v-if="isEdit" v-model="row.retain">
          <el-option :value="true" label="true" />
          <el-option :value="false" label="false" />
          <el-option value="all" :label="retainAllLabel" />
        </el-select>
        <template v-else>{{ row.retain === 'all' ? retainAllLabel : row.retain }}</template>
      </template>
    </el-table-column>
    <el-table-column prop="clientid_re" :label="t('Clients.clientIdReg')">
      <template #default="{ row }">
        <el-input v-if="isEdit" v-model="row.clientid_re" />
        <template v-else>{{ row.clientid_re }}</template>
      </template>
    </el-table-column>
    <el-table-column prop="username_re" :label="t('Clients.usernameReg')">
      <template #default="{ row }">
        <el-input v-if="isEdit" v-model="row.username_re" />
        <template v-else>{{ row.username_re }}</template>
      </template>
    </el-table-column>
    <el-table-column prop="ipaddr" :label="t('Clients.ipAddressRange')">
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
import {} from 'vue'

defineProps<{
  data: Array<BuiltInDBRule>
  isEdit?: boolean
}>()

const { t, tl } = useI18nTl('Auth')

const actionOpts = [
  { value: 'publish', label: tl('publish') },
  { value: 'subscribe', label: tl('subscribe') },
  { value: 'all', label: tl('all') },
]

const permissionOpts = [
  { value: 'allow', label: t('Base.allow') },
  { value: 'deny', label: t('Base.deny') },
]

const retainAllLabel = t('Base.all')
</script>
