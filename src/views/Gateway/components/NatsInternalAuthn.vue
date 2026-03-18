<template>
  <el-form
    ref="formRef"
    label-position="top"
    :rules="rules"
    :model="formEntries"
    :validate-on-rule-change="false"
  >
    <el-divider>
      <span>{{ tl('internalAuthn') }}</span>
      <InfoTooltip :content="tl('internalAuthnDesc')" />
    </el-divider>
    <div ref="listRef">
      <div
        v-for="(entry, index) in formEntries"
        :key="entry._id"
        class="flex items-start gap-4 mb-4"
      >
        <el-card class="grow">
          <el-row :gutter="30">
            <el-col :span="12">
              <el-form-item :prop="`[${index}].type`" :rules="rules[`[${index}].type`]">
                <template #label>
                  <FormItemLabel :label="tl('internalAuthnType')" />
                </template>
                <el-select v-model="entry.type" @change="onTypeChange(index)">
                  <el-option label="Token" value="token" />
                  <el-option label="NKey" value="nkey" />
                  <el-option label="JWT" value="jwt" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12" v-if="entry.type === 'token'">
              <el-form-item :prop="`[${index}].token`" :rules="rules[`[${index}].token`]">
                <template #label>
                  <FormItemLabel label="Token" :desc="tl('tokenDesc')" />
                </template>
                <el-input v-model="entry.token" />
              </el-form-item>
            </el-col>
            <el-col :span="24" v-if="entry.type === 'nkey'">
              <el-form-item :prop="`[${index}].nkeys`" :rules="rules[`[${index}].nkeys`]">
                <template #label>
                  <FormItemLabel :label="tl('nkeys')" :desc="tl('nkeysDesc')" />
                </template>
                <ArrayEditorTable v-model="entry.nkeys" :column-label="t('Gateway.nkey')" />
              </el-form-item>
            </el-col>
            <template v-if="entry.type === 'jwt'">
              <el-col :span="24">
                <el-form-item
                  :prop="`[${index}].trusted_operators`"
                  :rules="rules[`[${index}].trusted_operators`]"
                >
                  <template #label>
                    <FormItemLabel
                      :label="tl('trustedOperators')"
                      :desc="tl('trustedOperatorsDesc')"
                    />
                  </template>
                  <ArrayEditorTable
                    v-model="entry.trusted_operators"
                    :column-label="t('Gateway.operatorPublicKey')"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item>
                  <template #label>
                    <FormItemLabel :label="tl('resolverType')" />
                  </template>
                  <el-select v-model="entry.resolver.type">
                    <el-option label="Memory" value="memory" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item
                  :prop="`[${index}].resolver.resolver_preload`"
                  :rules="rules[`[${index}].resolver.resolver_preload`]"
                >
                  <template #label>
                    <FormItemLabel
                      :label="tl('resolverPreload')"
                      :desc="tl('resolverPreloadDesc')"
                    />
                  </template>
                  <ObjectArrayEditor
                    v-model="entry.resolver.resolver_preload"
                    :prop-key="resolverPreloadPropKey"
                    :properties="resolverPreloadProperties"
                  />
                </el-form-item>
              </el-col>
            </template>
          </el-row>
        </el-card>
        <div class="flex items-start">
          <el-button class="drag-handle cursor-grab" :disabled="formEntries.length === 1">
            <GripVertical class="w-5 h-5" />
          </el-button>
          <el-button @click="removeEntry(index)">
            <Trash2 class="w-4 h-4" />
          </el-button>
        </div>
      </div>
    </div>
    <el-button @click="addEntry">{{ tl('addAuthn') }}</el-button>
  </el-form>
</template>

<script setup lang="ts">
import Sortable, { type SortableEvent } from 'sortablejs'
import { GripVertical, Trash2 } from 'lucide-vue-next'
import type { Properties } from '@/types/schemaForm'
import { FormRules } from '@/types/common'

type AuthnFormEntry = {
  _id: number
  type: string
  token: string
  nkeys: string[]
  trusted_operators: string[]
  resolver: {
    type: string
    resolver_preload: Array<{ jwt: string; pubkey: string }>
  }
}

const modelValue = defineModel<any[]>({ default: () => [] })

const { t, tl } = useI18nTl('Gateway')
const { createRequiredRule } = useFormRules()

const resolverPreloadPropKey = 'resolver_preload'
const resolverPreloadProperties: Properties = {
  jwt: {
    type: 'string',
    label: tl('jwtToken'),
    description: '',
    deprecated: false,
    default: '',
    items: {} as any,
    component: 'input',
    clearable: false,
    path: `${resolverPreloadPropKey}.jwt`,
    componentProps: {},
  },
  pubkey: {
    type: 'string',
    label: tl('pubkey'),
    description: '',
    deprecated: false,
    default: '',
    items: {} as any,
    component: 'input',
    clearable: false,
    path: `${resolverPreloadPropKey}.pubkey`,
    componentProps: {},
  },
}

const defaultResolver = () => ({
  type: 'memory',
  resolver_preload: [] as Array<{ jwt: string; pubkey: string }>,
})

let _idCounter = 0
const createEmptyEntry = (): AuthnFormEntry => ({
  _id: ++_idCounter,
  type: '',
  token: '',
  nkeys: [],
  trusted_operators: [],
  resolver: defaultResolver(),
})

const deserializeEntry = (raw: Record<string, any>): AuthnFormEntry => {
  const rawResolver = raw.resolver
  const resolver = defaultResolver()
  if (rawResolver && typeof rawResolver === 'object') {
    resolver.type = rawResolver.type ?? 'memory'
    resolver.resolver_preload = rawResolver.resolver_preload ?? []
  }
  return {
    _id: ++_idCounter,
    type: raw.type ?? '',
    token: raw.token ?? '',
    nkeys: raw.nkeys ?? [],
    trusted_operators: raw.trusted_operators ?? [],
    resolver,
  }
}

const serializeEntry = (entry: AuthnFormEntry): Record<string, any> | null => {
  if (!entry.type) return null
  if (entry.type === 'token') return { type: 'token', token: entry.token }
  if (entry.type === 'nkey') return { type: 'nkey', nkeys: entry.nkeys }
  if (entry.type === 'jwt') {
    const result: Record<string, any> = { type: 'jwt' }
    if (entry.trusted_operators.length) {
      result.trusted_operators = entry.trusted_operators
    }
    const resolver: Record<string, any> = { type: entry.resolver.type }
    if (entry.resolver.resolver_preload.length) {
      resolver.resolver_preload = entry.resolver.resolver_preload
    }
    if (entry.resolver.resolver_preload.length) {
      result.resolver = resolver
    }
    return result
  }
  return null
}

const formEntries = ref<AuthnFormEntry[]>([])

const typeRuleCreatorMap = new Map<string, (i: string) => FormRules>([
  [
    'token',
    (i: string) => ({
      [`[${i}].token`]: createRequiredRule('Token'),
    }),
  ],
  [
    'nkey',
    (i: string) => ({
      [`[${i}].nkeys`]: [
        {
          validator: (rule: any, value: any, callback: any) => {
            if (value.length === 0) {
              callback(new Error(tl('nkeysRequired')))
            }
            callback()
          },
        },
      ],
    }),
  ],
  [
    'jwt',
    (i: string) => ({
      [`[${i}].trusted_operators`]: [
        {
          validator: (rule: any, value: any, callback: any) => {
            if (value.length === 0) {
              callback(new Error(tl('trustedOperatorsRequired')))
            }
            callback()
          },
        },
      ],
      [`[${i}].resolver.resolver_preload`]: [
        {
          validator: (rule: any, value: any, callback: any) => {
            if (value.length === 0) {
              callback(new Error(tl('resolverPreloadRequired')))
            }
            callback()
          },
        },
      ],
    }),
  ],
])

const rules = computed(() => {
  const result: Record<string, any> = {}
  formEntries.value.forEach((entry, i) => {
    result[`[${i}].type`] = createRequiredRule(tl('internalAuthnType'), 'select')
    const otherRulesCreator = typeRuleCreatorMap.get(entry.type)
    if (otherRulesCreator) {
      Object.assign(result, otherRulesCreator(i.toString()))
    }
  })
  return result
})

const onTypeChange = (index: number) => {
  const entry = formEntries.value[index]
  entry.token = ''
  entry.nkeys = []
  entry.trusted_operators = []
  entry.resolver = defaultResolver()
}

const addEntry = () => {
  formEntries.value.push(createEmptyEntry())
}

const removeEntry = (index: number) => {
  formEntries.value.splice(index, 1)
}

watch(
  formEntries,
  () => {
    modelValue.value = formEntries.value
      .map(serializeEntry)
      .filter((e): e is Record<string, any> => e !== null)
  },
  { deep: true },
)

// Sortable
const listRef = ref<HTMLElement>()
let sortable: Sortable | undefined

const initSortable = () => {
  sortable?.destroy()
  if (!listRef.value) return
  sortable = new Sortable(listRef.value, {
    handle: '.drag-handle',
    animation: 150,
    onEnd: (evt: SortableEvent) => {
      const { newIndex, oldIndex } = evt
      if (newIndex === undefined || oldIndex === undefined || newIndex === oldIndex) return
      const moved = formEntries.value.splice(oldIndex, 1)[0]
      formEntries.value.splice(newIndex, 0, moved)
    },
  })
}

watch(
  () => formEntries.value.length,
  async () => {
    await nextTick()
    initSortable()
  },
)

onMounted(async () => {
  formEntries.value = modelValue.value.map(deserializeEntry)
  await nextTick()
  initSortable()
})

onUnmounted(() => {
  sortable?.destroy()
})

const formRef = ref()
defineExpose({ validate: () => formRef.value?.validate?.() })
</script>
