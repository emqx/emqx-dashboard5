<template>
  <el-drawer
    :title="isEdit ? tl('editBridge') : tl('createBridge')"
    v-model="showDrawer"
    :lock-scroll="false"
    size="50%"
    :close-on-click-modal="false"
    destroy-on-close
    @close="cancel"
  >
    <BridgeCreate v-if="!isEdit" ref="BridgeCreateRef" />
    <BridgeDetail v-else :bridge-id="bridgeId" ref="BridgeDetailRef" />
    <template #footer>
      <el-button @click="cancel()">
        {{ $t('Base.cancel') }}
      </el-button>
      <el-button
        v-if="showTestBtn"
        @click="testConnector"
        :loading="testLoading"
        type="primary"
        plain
      >
        {{ tl('testTheConnection') }}
      </el-button>
      <el-button type="primary" @click="submit" :loading="isLoading">
        {{ isEdit ? $t('Base.update') : $t('Base.add') }}
      </el-button>
    </template>
  </el-drawer>
</template>

<script lang="ts">
import useI18nTl from '@/hooks/useI18nTl'
import { defineComponent, defineEmits, ref, defineProps, computed } from 'vue'
import BridgeCreate from '../Bridge/BridgeCreate.vue'
import BridgeDetail from '../Bridge/BridgeDetail.vue'

export default defineComponent({
  name: 'AddBridgeOnRule',
})
</script>

<script setup lang="ts">
const emits = defineEmits(['update:modelValue', 'close', 'added'])
const props = defineProps({
  modelValue: {
    type: Boolean,
  },
  bridgeId: {
    type: String,
    default: '',
  },
})
const BridgeCreateRef = ref()
const BridgeDetailRef = ref()
const showDrawer = computed<boolean>({
  get() {
    return props.modelValue
  },
  set(val) {
    emits('update:modelValue', val)
  },
})
const showTestBtn = computed(() => {
  return BridgeCreateRef.value?.canTest
})
const isEdit = computed(() => {
  return props.bridgeId !== ''
})
const isLoading = ref(false)
const testLoading = ref(false)
const { tl } = useI18nTl('RuleEngine')
const cancel = () => {
  emits('close')
}
const testConnector = async () => {
  testLoading.value = true
  try {
    await BridgeCreateRef.value.testTheConnection()
  } catch (error) {
    // ignore error
  } finally {
    testLoading.value = false
  }
}
const submit = async () => {
  isLoading.value = true
  try {
    if (!isEdit.value) {
      const bridgeId = await BridgeCreateRef.value.submitCreateBridge()
      emits('added', bridgeId)
    } else {
      await BridgeDetailRef.value.updateBridgeInfo()
      emits('close')
    }
  } catch (error) {
    // ignore error
  } finally {
    isLoading.value = false
  }
}
</script>

<style lang="scss" scoped></style>
