<template>
  <component
    ref="FormComEl"
    :is="formCom"
    :type="sourceType"
    v-model="sourceRecord"
    v-bind="formComProps"
  />
</template>

<script lang="ts" setup>
import { customValidate } from '@/common/tools'
import useHandleSourceItem from '@/hooks/Rule/action/useHandleSourceItem'
import useI18nTl from '@/hooks/useI18nTl'
import { Source } from '@/types/rule'
import { ElMessage } from 'element-plus'
import { cloneDeep } from 'lodash'
import { computed, defineExpose, defineProps, ref } from 'vue'
import useSourceFormComponent from './useSourceFormComponent'

const props = defineProps<{
  type?: string
}>()

const { tl } = useI18nTl('RuleEngine')

const sourceType = computed(() => props.type || '')
const { formCom, formComProps } = useSourceFormComponent(sourceType)

const FormComEl = ref()

const sourceRecord = ref({})

const { addSource, isTesting, testConnectivity } = useHandleSourceItem()

const getDataForSubmit = (): Source =>
  ({ type: props.type, ...cloneDeep(sourceRecord.value) } as Source)

const testConnection = async () => {
  try {
    await customValidate(FormComEl.value)
    isTesting.value = true
    const data = await getDataForSubmit()
    await testConnectivity(data)
    ElMessage.success(tl('connectionSuccessful'))
    isTesting.value = false
    return Promise.resolve()
  } catch (error) {
    isTesting.value = false
    return Promise.reject()
  }
}

const submitNewSource = async () => {
  try {
    await customValidate(FormComEl.value)
    const { id } = await addSource(getDataForSubmit())
    return Promise.resolve(id)
  } catch (error) {
    console.error(error)
    return Promise.reject(error)
  }
}

defineExpose({ testConnection, submitNewSource, sourceRecord })
</script>

<style lang="scss">
@import '@/style/rule.scss';
</style>

<style lang="scss" scoped>
.el-col {
  margin-bottom: 16px;
}
</style>
