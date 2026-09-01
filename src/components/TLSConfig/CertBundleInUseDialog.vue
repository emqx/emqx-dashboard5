<template>
  <el-dialog
    v-model="isVisible"
    :title="tl('certBundleInUseTitle')"
    width="540px"
    append-to-body
    destroy-on-close
    class="cert-bundle-in-use-dialog"
  >
    <div class="el-message-box__container">
      <i class="el-icon el-message-box__status el-message-box-icon--warning">
        <WarningFilled />
      </i>
      <div class="el-message-box__message">
        {{ tl(isCertFile ? 'certBundleFileInUseDesc' : 'certBundleInUseDesc') }}
      </div>
    </div>
    <ul class="ref-config-list">
      <li v-for="group in moduleGroups" :key="group.key" class="ref-config-item">
        <div class="ref-config-left">
          <span class="ref-config-label">{{ group.label }}</span>
          <el-tag size="small" type="info">{{ tl('refItemCount', { count: group.count }) }}</el-tag>
        </div>
        <router-link class="ref-config-link" :to="group.to" target="_blank">
          {{ tl('viewPage') }}
          <el-icon><Right /></el-icon>
        </router-link>
      </li>
    </ul>
    <template #footer>
      <CancelButton @click="isVisible = false" />
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { Right, WarningFilled } from '@element-plus/icons-vue'
import type { ReferencingConfigs } from '@/hooks/useCertBundle'
import type { RouteLocationRaw } from 'vue-router'

export type { ReferencingConfigs }

interface RefGroup {
  key: string
  label: string
  count: number
  to: RouteLocationRaw
}

const props = defineProps<{
  modelValue: boolean
  referencingConfigs?: ReferencingConfigs
  isCertFile?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const { tl } = useI18nTl('BasicConfig')
const { locale } = useI18n()

const isVisible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})

const moduleToPath: Record<string, string> = {
  gateway: '/gateway',
  exhook: '/exhook',
  connectors: '/connector',
  cluster_linking: '/cluster-linking',
  schema_registry: '/schema/external',
  listeners: '/listener',
  sso: '/sso',
  authorization: '/authorization',
  authentication: '/authentication',
  file_transfer: '/file-transfer',
  opentelemetry: '/monitoring/integration',
}

// Modules where the second array element represents an object type
const modulesWithType = new Set(['gateway', 'connectors', 'listeners'])

const labelKeyMap: Record<string, string> = {
  gateway: 'refModuleGateway',
  exhook: 'refModuleExhook',
  connectors: 'refModuleConnector',
  cluster_linking: 'refModuleClusterLinking',
  schema_registry: 'refModuleSchemaRegistry',
  listeners: 'refModuleListener',
  sso: 'refModuleSSO',
  authorization: 'refModuleAuthorization',
  authentication: 'refModuleAuthentication',
  file_transfer: 'refModuleFileTransfer',
  opentelemetry: 'refModuleOpenTelemetry',
}

const getModuleLabel = (module: string, types: string[]): string => {
  const key = labelKeyMap[module]
  const baseLabel = key ? tl(key) : module
  if (types.length === 0) return baseLabel
  const isChinese = locale.value.startsWith('zh')
  const separator = isChinese ? '、' : ', '
  const [open, close] = isChinese ? ['（', '）'] : [' (', ')']
  return `${baseLabel}${open}${types.join(separator)}${close}`
}

const getModule = (path: (string | number)[]) => {
  let m = String(path[0])
  if (m === 'dashboard') {
    m = String(path[1])
  } else if (m === 'cluster' && path[1] === 'links') {
    m = 'cluster_linking'
  }
  return m
}

const getRouteLocation = (path: string, namespace: string): RouteLocationRaw => {
  if (namespace === GLOBAL_NAMESPACE) {
    return path
  }
  return { path, query: { ns: namespace } }
}

const moduleGroups = computed((): RefGroup[] => {
  const entries = Object.entries(props.referencingConfigs ?? {}).flatMap(([namespace, paths]) =>
    (paths ?? []).map((path) => ({ namespace, path })),
  )
  const data = new Map<
    string,
    {
      count: number
      types: Set<string>
      path: string
      moduleKey: string
      namespace: string
      labelSuffix?: string
    }
  >()

  for (const { namespace, path: entry } of entries) {
    const m = getModule(entry)
    const second = typeof entry[1] === 'string' ? entry[1] : undefined

    let groupKey: string
    let path: string
    let labelSuffix: string | undefined

    if (m === 'gateway' && second) {
      const isListeners = entry[2] === 'listeners'
      // Group key includes sub-type so listener and settings entries are separate rows
      groupKey = isListeners
        ? `${namespace}:gateway:${second}:listeners`
        : `${namespace}:gateway:${second}`
      path = isListeners
        ? `/gateway/detail/${second}/listeners`
        : `/gateway/detail/${second}/settings`
      labelSuffix = isListeners ? tl('refModuleListener') : undefined
    } else {
      groupKey = `${namespace}:${m}`
      path = moduleToPath[m] ?? '/'
    }

    const showType = modulesWithType.has(m) && typeof second === 'string'
    const type = showType ? second.toUpperCase() : undefined

    const existing = data.get(groupKey)
    if (existing) {
      existing.count++
      if (type) existing.types.add(type)
    } else {
      data.set(groupKey, {
        count: 1,
        types: new Set(type ? [type] : []),
        path,
        moduleKey: m,
        namespace,
        labelSuffix,
      })
    }
  }

  return Array.from(data.entries()).map(
    ([groupKey, { count, types, path, moduleKey, namespace, labelSuffix }]) => {
      const base = getModuleLabel(moduleKey, Array.from(types))
      const moduleLabel = labelSuffix ? `${base} · ${labelSuffix}` : base
      return {
        key: groupKey,
        label: namespace === GLOBAL_NAMESPACE ? moduleLabel : `${moduleLabel} · ${namespace}`,
        count,
        to: getRouteLocation(path, namespace),
      }
    },
  )
})
</script>

<style lang="scss">
.cert-bundle-in-use-dialog {
  .el-message-box__container {
    margin-bottom: 16px;
  }

  .ref-config-list {
    list-style: none;
    padding: 0;
    margin: 0;

    .ref-config-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 0;
      border-bottom: 1px solid var(--el-border-color-lighter);

      &:last-child {
        border-bottom: none;
      }

      .ref-config-left {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .ref-config-link {
        display: flex;
        align-items: center;
        gap: 2px;
        color: var(--el-color-primary);
        font-size: 13px;
        text-decoration: none;
        white-space: nowrap;

        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
}
</style>
