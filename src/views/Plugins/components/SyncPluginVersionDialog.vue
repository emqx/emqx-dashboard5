<template>
  <el-dialog
    v-model="showDialog"
    class="common-dialog sync-plugin-version-dialog"
    :title="tl('syncToNodes')"
    :width="520"
    :z-index="2000"
  >
    <div>
      <p class="sync-desc">
        {{
          tl('confirmSyncPluginVersion', {
            name: props.pluginInfo.name,
            currentVersion: props.pluginInfo.version,
          })
        }}
      </p>
      <el-table :data="otherNodesTable">
        <el-table-column prop="node" :label="t('Base.node')" />
        <el-table-column prop="versions" :label="tl('currentVersion')">
          <template #default="{ row }">
            {{ row.versions?.join?.(', ') }}
          </template>
        </el-table-column>
      </el-table>
      <TipContainer :content="tl('restartPluginTip')" />
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="showDialog = false">
          {{ $t('Base.cancel') }}
        </el-button>
        <el-button type="danger" plain @click="submit" :loading="isSubmitting">
          {{ $t('Base.confirm') }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { syncPluginVersion } from '@/api/plugins'

const props = defineProps<{
  modelValue: boolean
  pluginInfo: { name: string; version: string }
  pluginNodeVersionInfo: Array<{ version: string; nodes: string[] }>
}>()
const emit = defineEmits(['update:modelValue', 'submitted'])

const { t, tl } = useI18nTl('Plugins')

const showDialog = computed({
  get: () => props.modelValue,
  set: (val: boolean) => {
    emit('update:modelValue', val)
  },
})

const otherNodesTable = computed(() => {
  const nodeVersionsMap = props.pluginNodeVersionInfo.reduce(
    (map: Map<string, Array<string>>, { nodes, version }) => {
      nodes.forEach((node) => {
        if (map.has(node)) {
          map.get(node)?.push(version)
        } else {
          map.set(node, [version])
        }
      })
      return map
    },
    new Map(),
  )
  return Array.from(nodeVersionsMap.entries()).map(([node, versions]) => ({
    node,
    versions,
  }))
})

const isSubmitting = ref(false)
const getPluginId = (name: string, version: string) => `${name}-${version}`
const submit = async () => {
  isSubmitting.value = true
  try {
    await syncPluginVersion({
      name: getPluginId(props.pluginInfo.name, props.pluginInfo.version),
      node: otherNodesTable.value[0].node,
    })
    ElMessage.success(tl('syncSuccess'))
    emit('submitted')
    showDialog.value = false
  } catch (error) {
    console.error(error)
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style lang="scss">
.sync-plugin-version-dialog {
  .sync-desc {
    margin-bottom: 20px;
    line-height: 1.5;
  }
  .el-table {
    margin-bottom: 16px;
  }
  .el-table .el-table__cell {
    padding-top: 12px;
    padding-bottom: 12px;
  }
  .tip-container {
    margin-bottom: 0;
  }
}
</style>
