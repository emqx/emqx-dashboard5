<template>
  <span class="namespace-create-button inline-flex">
    <el-dropdown
      v-if="canSelectNamespace"
      split-button
      type="primary"
      :disabled="!hasPermission('post')"
      @click="create()"
      @command="openNamespaceDialog"
    >
      <Plus class="mr-2" />
      <slot>{{ t('Base.create') }}</slot>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item command="namespace" :disabled="!hasPermission('post')">
            {{ namespaceCreateLabel }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    <CreateButton v-else @click="create()">
      <slot>{{ t('Base.create') }}</slot>
    </CreateButton>

    <el-dialog
      v-model="showNamespaceDialog"
      :title="namespaceCreateLabel"
      width="440px"
      append-to-body
      @closed="resetNamespace"
    >
      <el-form ref="FormCom" :model="record" label-position="top">
        <el-form-item
          prop="namespace"
          :label="t('BasicConfig.namespace')"
          :rules="createRequiredRule(t('BasicConfig.namespace'), 'select')"
        >
          <NamespaceSelect
            :model-value="record.namespace"
            :global="{ enable: false }"
            :clearable="false"
            @update:model-value="record.namespace = typeof $event === 'string' ? $event : undefined"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <CancelButton @click="showNamespaceDialog = false" />
        <el-button
          type="primary"
          :disabled="!canSelectNamespace || !hasPermission('post')"
          @click="createInNamespace"
        >
          {{ t('Base.create') }}
        </el-button>
      </template>
    </el-dialog>
  </span>
</template>

<script setup lang="ts">
import useMultiTenancyEnabled from '@/hooks/Config/useMultiTenancyEnabled'
import { usePerms } from '@/plugins/permissionsPlugin'
import { UserRole } from '@/types/enum'
import type { FormInstance } from 'element-plus'
import { Plus } from 'lucide-vue-next'

const props = defineProps<{ resource: 'connector' | 'rule' | 'flow' }>()
const emit = defineEmits<{ (e: 'create', namespace?: string): void }>()
const { t } = useI18n()
const store = useStore()
const { hasPermission } = usePerms()
const isMultiTenancyEnabled = useMultiTenancyEnabled()
const canSelectNamespace = computed(
  () =>
    isMultiTenancyEnabled.value &&
    !store.getters.isNamespaceUser &&
    store.state.user.role === UserRole.Admin,
)
const namespaceCreateLabel = computed(() =>
  t(
    {
      connector: 'RuleEngine.createNamespaceConnector',
      rule: 'RuleEngine.createNamespaceRule',
      flow: 'Flow.createNamespaceFlow',
    }[props.resource],
  ),
)

const create = (namespace = store.getters.userNamespace) => {
  if (hasPermission('post')) {
    emit('create', namespace)
  }
}

const showNamespaceDialog = ref(false)
const record = reactive<{ namespace?: string }>({})
const FormCom = ref<FormInstance>()
const { createRequiredRule } = useFormRules()
const resetNamespace = () => {
  record.namespace = undefined
  FormCom.value?.clearValidate()
}
const openNamespaceDialog = () => {
  if (canSelectNamespace.value && hasPermission('post')) {
    resetNamespace()
    showNamespaceDialog.value = true
  }
}
const createInNamespace = async () => {
  if (!canSelectNamespace.value || !hasPermission('post')) {
    return
  }
  try {
    await FormCom.value?.validate()
    if (!record.namespace) {
      return
    }
    create(record.namespace)
    showNamespaceDialog.value = false
  } catch {
    // Field validation displays the required namespace message.
  }
}
</script>
