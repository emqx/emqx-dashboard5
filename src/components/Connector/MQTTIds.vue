<!-- Component for mqtt connector `static_clientids` `ids` -->
<template>
  <div class="object-array-editor">
    <ul class="obj-list" v-if="inputValue && inputValue.length">
      <li class="obj-item" v-for="(item, $index) in inputValue" :key="keyArr[$index]">
        <div class="obj-item-bd">
          <div v-if="!getSwitchProxy($index)" class="vertical-align-center switch-container">
            <span class="switch-label">{{ t('RuleEngine.specifyUsernameAndPassword') }}</span>
            <el-switch
              :model-value="getSwitchProxy($index)"
              @update:model-value="setSwitchProxy($index, $event as boolean)"
            />
          </div>
          <el-input
            v-if="!getSwitchProxy($index)"
            v-model="inputValue[$index]"
            v-bind="$attrs"
            :placeholder="t('Clients.clientid')"
          />
          <div class="inputs-container" v-else>
            <el-input
              v-model="(inputValue[$index] as MQTTIds).clientid"
              v-bind="$attrs"
              :placeholder="t('Clients.clientid')"
            />
            <el-input
              v-model="(inputValue[$index] as MQTTIds).username"
              v-bind="$attrs"
              :placeholder="t('Base.username')"
            />
            <CustomInputPassword
              v-model="(inputValue[$index] as MQTTIds).password"
              v-bind="$attrs"
              :placeholder="t('Base.password')"
            />
          </div>
        </div>
        <el-button v-if="!readonly && !disabled" link @click="deleteItem($index)">
          <el-icon :size="16" class="icon-del"><Delete /></el-icon>
        </el-button>
      </li>
    </ul>
    <el-button v-if="!readonly && !disabled" link type="primary" :icon="Plus" @click="addItem">
      {{ tl('add') }}
    </el-button>
  </div>
</template>

<script setup lang="ts">
import { Delete, Plus } from '@element-plus/icons-vue'
import {} from 'vue'

interface MQTTIds {
  clientid?: string
  username?: string
  password?: string
}
type MQTTIdsValue = Array<string | MQTTIds>

const props = defineProps<{
  modelValue?: MQTTIdsValue
  disabled?: boolean
  readonly?: boolean
}>()
const emit = defineEmits<{
  (e: 'update:modelValue', value: MQTTIdsValue): void
}>()

const { t, tl } = useI18nTl('Base')

const inputValue = computed({
  get() {
    return props.modelValue ?? []
  },
  set(value) {
    if (value) {
      emit('update:modelValue', value)
    }
  },
})
const keyArr = computed(() =>
  Array.from({ length: inputValue.value.length }, () => createRandomString()),
)

const getSwitchProxy = (index: number) => {
  return typeof inputValue.value[index] === 'object'
}

const setSwitchProxy = (index: number, value: boolean) => {
  if (value && typeof inputValue.value[index] !== 'object') {
    inputValue.value[index] = {
      clientid: '',
    }
  } else if (!value && typeof inputValue.value[index] === 'object') {
    inputValue.value[index] = ''
  }
}

const addItem = () => {
  inputValue.value.push({ clientid: '' })
}

const deleteItem = (index: number) => {
  inputValue.value.splice(index, 1)
}
</script>

<style lang="scss" scoped>
.obj-list {
  .obj-item-bd {
    flex-grow: 1;
    margin-right: 8px;
  }
  .switch-label {
    margin-right: 8px;
  }
  .switch-container {
    margin-bottom: 4px;
  }
  .inputs-container {
    .el-input:not(:last-child) {
      margin-bottom: 8px;
    }
  }
  .obj-item-bd {
    background-color: transparent;
    border: 1px solid var(--color-border-card);
  }
}
</style>
