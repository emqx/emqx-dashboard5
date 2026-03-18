<template>
  <el-card>
    <div class="basic-info" v-loading="infoLoading">
      <GatewayForm ref="form" :name="name" v-model:value="basicData" :key="iKey" is-edit />
      <el-button
        type="primary"
        :loading="updateLoading"
        @click="updateGatewayInfo()"
        :disabled="basicData.status === 'unloaded' || !$hasPermission('put')"
      >
        {{ $t('Base.update') }}
      </el-button>
    </div>
  </el-card>
</template>
<script lang="ts" setup>
import { getGateway, updateGateway } from '@/api/gateway'
import { GatewayName } from '@/types/enum'
import GatewayForm from './gatewayForm.vue'

const basicData = ref<any>({})
const infoLoading = ref(false)
const updateLoading = ref(false)
const { t } = useI18n()
const iKey = ref(0)
const route = useRoute()
const name = String(route.params.name).toLowerCase() as GatewayName

const loadGatewayInfo = async () => {
  infoLoading.value = true
  if (!name) return
  try {
    basicData.value = await getGateway(name)
    ++iKey.value
  } catch (error) {
    //
  } finally {
    infoLoading.value = false
  }
}

const formRef = useTemplateRef('form')
const namesNeedValidation = [GatewayName.NATS, GatewayName.JT808]
const { handleExprotoData } = useHandleGatewayData()
const updateGatewayInfo = async () => {
  try {
    if (namesNeedValidation.includes(name)) {
      await formRef.value?.validate()
    }
  } catch (error) {
    return
  }
  updateLoading.value = true
  infoLoading.value = true
  const removedFields = [
    'listeners',
    'created_at',
    'started_at',
    'status',
    'name',
    'authentication',
  ]
  removedFields.forEach((field) => {
    delete basicData.value[field]
  })
  try {
    let dataToSubmit = basicData.value
    if (name === GatewayName.ExProto) {
      dataToSubmit = handleExprotoData(dataToSubmit)
    }
    const needDeleteFields = ['stopped_at']
    needDeleteFields.forEach((field) => {
      if (dataToSubmit[field]) {
        delete dataToSubmit[field]
      }
    })
    await updateGateway(name, dataToSubmit)
    ElMessage.success(t('Base.updateSuccess'))
    loadGatewayInfo()
  } catch (error) {
    //
  } finally {
    updateLoading.value = false
    infoLoading.value = false
  }
}

onMounted(() => {
  loadGatewayInfo()
})
</script>

<style lang="scss" scoped>
.basic-info {
  width: 75%;
  margin: 10px;
}
</style>
