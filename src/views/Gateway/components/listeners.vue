<template>
  <div>
    <div class="section-header" v-if="!showIntegration">
      <div></div>
      <CreateButton @click="addListener">
        {{ tl('addListener') }}
      </CreateButton>
    </div>
    <el-table :data="listenerTable" v-loading="listenerLoading">
      <el-table-column :label="$t('Base.name')" prop="name" show-overflow-tooltip>
        <template #default="{ row, $index }">
          <p class="table-data-without-break">
            <a href="javascript:;" @click="editListener(row, $index)">{{ row.name }}</a>
          </p>
        </template>
      </el-table-column>
      <el-table-column :label="tl('lType')" prop="type" />
      <el-table-column :label="tl('lAddress')" prop="bind">
        <template #default="{ row }">
          {{ transPort(row.bind) }}
        </template>
      </el-table-column>
      <el-table-column :label="tl('lMaxConn')" prop="max_connections">
        <template #default="{ row }">
          {{
            typeof row.max_connections === 'string'
              ? _.startCase(row.max_connections)
              : row.max_connections
          }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('BasicConfig.acceptors')" prop="acceptors">
        <template #default="{ row }">
          <span>
            {{ row.acceptors === '' || row.acceptors === undefined ? '-' : row.acceptors }}
          </span>
        </template>
      </el-table-column>
    </el-table>
    <div class="not-standalone-btn" v-if="showIntegration">
      <CreateButton @click="addListener">
        {{ tl('addListener') }}
      </CreateButton>
    </div>

    <ListenerDrawer
      v-model="opListener"
      :listener="currentListener"
      :gatewayName="gName"
      :doNotSubmitToBackend="integration"
      @submitted="loadListenerData"
      @submit="submitListener"
      @delete="delListener($event)"
    />
  </div>
</template>

<script setup lang="ts">
import { getGatewayListeners, deleteGatewayListener } from '@/api/gateway'
import { ElMessage as M, ElMessageBox as MB } from 'element-plus'
import ListenerDrawer from '@/components/ListenerDrawer/ListenerDrawer.vue'
import { GatewayName } from '@/types/enum'
import { Listener } from '@/types/listener'

const props = defineProps({
  integration: {
    type: Boolean,
    required: false,
    default: false,
  },
  gatewayName: {
    type: String,
    required: false,
    default: '',
  },
  list: {
    type: Array as PropType<Listener[]>,
    required: false,
    default: () => [],
  },
})

const showIntegration = computed(() => props.integration)

const emit = defineEmits(['update:list'])

const route = useRoute()
const { t, tl } = useI18nTl('Gateway')
const name = (route.params.name || props.gatewayName) as string
const gName = name.toLowerCase() as GatewayName
const { normalizeStructure, deNormalizeStructure, transPort } = useListenerUtils(gName)

const opListener = ref(false)
const listenerTable = ref<Listener[]>([])
const listenerLoading = ref(false)
const currentListener = ref<Listener | undefined>(undefined)

let editPos = 0

const addListener = () => {
  currentListener.value = undefined
  opListener.value = true
}

const editListener = (listener: Listener, index: number) => {
  currentListener.value = listener
  editPos = index
  opListener.value = true
}

const loadListenerData = async function () {
  listenerLoading.value = true
  try {
    const res = await getGatewayListeners(gName)
    listenerTable.value = res.map((v: Listener) => deNormalizeStructure(v, gName))
  } catch (error) {
    //
  } finally {
    listenerLoading.value = false
  }
}

const submitListener = async function (data: Listener) {
  const isEdit = !!currentListener.value
  if (isEdit) {
    listenerTable.value.splice(editPos, 1, data)
  } else {
    listenerTable.value.push(data)
  }
}

const delListener = async function (row: Listener) {
  await MB.confirm(t('Base.confirmDelete'), {
    confirmButtonText: t('Base.confirm'),
    cancelButtonText: t('Base.cancel'),
    type: 'warning',
  })
  if (props.integration) {
    listenerTable.value.splice(listenerTable.value.indexOf(row as never), 1)
  } else {
    try {
      await deleteGatewayListener(gName, row.id)
      M.success(t('Base.deleteSuccess'))
      loadListenerData()
    } catch (error) {
      //
    }
  }
  if (opListener.value === true) {
    opListener.value = false
  }
}

watch(
  () => _.cloneDeep(listenerTable.value),
  (v) => {
    if (props.integration) {
      emit(
        'update:list',
        v.map((v) => normalizeStructure(v)),
      )
    }
  },
)

onMounted(() => {
  if (props.integration) {
    listenerTable.value = props.list.map((v) => deNormalizeStructure(v, gName))
  } else {
    loadListenerData()
  }
})
</script>

<style lang="scss" scoped>
.not-standalone-btn {
  margin-top: 40px;
  margin-bottom: 20px;
}

.el-input-group--append :deep(.el-input-group__append) {
  width: 70px;
}
</style>
