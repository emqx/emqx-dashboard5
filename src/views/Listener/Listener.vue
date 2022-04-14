<template>
  <div class="listener app-wrapper">
    <div class="section-header">
      <div></div>
      <el-button type="primary" :icon="Plus" @click="addListener()">
        {{ tl('addListener') }}
      </el-button>
    </div>
    <el-table :data="listenerTable" v-loading="isTableLoading">
      <el-table-column :label="'ID'" sortable prop="id" />
      <el-table-column :label="tl('lType')" sortable prop="type" />
      <el-table-column :label="tl('lAddress')" sortable prop="bind" />
      <el-table-column label="Acceptors" sortable prop="acceptors">
        <template #default="{ row }">
          <span>{{ row.acceptors === '' ? '-' : row.acceptors }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="tl('lMaxConn')" sortable prop="max_connections" />
      <el-table-column :label="$t('Base.operation')">
        <template #default="{ row, $index }">
          <el-button size="small" @click="editListener(row, $index)">
            {{ $t('Base.edit') }}
          </el-button>
          <el-button size="small" type="danger" @click="deleteListener(row)">
            {{ $t('Base.delete') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import useI18nTl from '@/hooks/useI18nTl'
import { Plus } from '@element-plus/icons-vue'

const { t, tl } = useI18nTl('Gateway')

const isTableLoading = ref(false)
const listenerTable = ref([])

const addListener = () => {
  //
}

const editListener = (listener, index) => {
  //
}

const deleteListener = (listener) => {
  //
}
</script>

<style lang="scss"></style>
