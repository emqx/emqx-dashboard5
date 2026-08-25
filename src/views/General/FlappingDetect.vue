<template>
  <div class="flapping-detect app-wrapper with-padding-top">
    <el-card class="allow-overflow">
      <el-skeleton v-if="configLoading" :rows="12" animated />
      <div v-else class="schema-form flapping-detect-form" @keyup.enter="updateConfigData()">
        <template v-for="(dimension, index) in dimensions" :key="dimension.key">
          <el-form
            class="configuration-form dimension-switch-form"
            label-position="right"
            require-asterisk-position="left"
            hide-required-asterisk
            :label-width="labelWidth"
            :model="dimensionConfig[dimension.key]"
            :validate-on-rule-change="false"
          >
            <el-row>
              <el-col :span="21" class="custom-col">
                <el-form-item prop="enabled">
                  <template #label>
                    <FormItemLabel :label="tl(dimension.label)" :desc="tl(dimension.desc)" />
                  </template>
                  <el-switch v-model="dimensionConfig[dimension.key].enabled" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <schema-form
            v-if="dimensionConfig[dimension.key].enabled"
            :ref="(form) => setPolicyFormRef(dimension.key, form)"
            class="dimension-policy-form"
            type="flapping_detect"
            :according-to="policySchemaRef"
            :form="dimensionConfig[dimension.key].policy"
            :form-props="{ labelWidth }"
            :form-item-span="21"
            :need-record="dimensionConfig[dimension.key].initWithDefaults"
            :need-footer="false"
            @update="(policy) => updateDimensionPolicy(dimension.key, policy)"
          />
          <el-divider v-if="index < dimensions.length - 1" class="!my-1" />
        </template>
        <el-row>
          <el-col :span="24" class="btn-col">
            <el-button
              type="primary"
              :disabled="!$hasPermission('put')"
              :loading="saveLoading"
              @click="updateConfigData()"
            >
              {{ $t('Base.saveChanges') }}
            </el-button>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { getDefaultZoneConfigs, updateDefaultZoneConfigs } from '@/api/config'
import { FlappingDetect, FlappingDetectPolicy, Zone } from '@/types/config'
import { usePerms } from '@/plugins/permissionsPlugin'

const dimensions = [
  {
    key: 'by_clientid',
    label: 'flappingByClientId',
    desc: 'flappingByClientIdDesc',
  },
  {
    key: 'by_username',
    label: 'flappingByUsername',
    desc: 'flappingByUsernameDesc',
  },
  {
    key: 'by_peerhost',
    label: 'flappingByPeerhost',
    desc: 'flappingByPeerhostDesc',
  },
] as const

type DimensionKey = (typeof dimensions)[number]['key']
type PolicyFormInstance = {
  configForm: PolicyFormRecord
  validate: () => Promise<void>
}
type PolicyFormRecord = FlappingDetectPolicy & Record<string, any>
type DimensionFormState = {
  enabled: boolean
  policy: PolicyFormRecord
  initWithDefaults: boolean
}

const { hasPermission } = usePerms()
const { t, tl } = useI18nTl('General')

const configLoading = ref(false)
const saveLoading = ref(false)
const store = useStore()
const labelWidth = computed(() => (store.state.lang === 'zh' ? 170 : 230))
const policySchemaRef = { ref: '#/components/schemas/emqx.flapping_detect_dimension' }
const policyFormRefs: Partial<Record<DimensionKey, PolicyFormInstance>> = {}
const dimensionConfig = reactive<Record<DimensionKey, DimensionFormState>>({
  by_clientid: { enabled: false, policy: {}, initWithDefaults: true },
  by_username: { enabled: false, policy: {}, initWithDefaults: true },
  by_peerhost: { enabled: false, policy: {}, initWithDefaults: true },
})

const setPolicyFormRef = (key: DimensionKey, form: unknown) => {
  if (form) {
    policyFormRefs[key] = form as PolicyFormInstance
  } else {
    delete policyFormRefs[key]
  }
}

const updateDimensionPolicy = (key: DimensionKey, policy: FlappingDetectPolicy) => {
  if (Object.keys(policy).length > 0) {
    dimensionConfig[key].policy = cloneDeep(policy) as PolicyFormRecord
    dimensionConfig[key].initWithDefaults = false
  }
}

const setDimensionConfig = (config: FlappingDetect) => {
  dimensions.forEach(({ key }) => {
    const value = config[key]
    if (value !== undefined && value !== 'none') {
      dimensionConfig[key].enabled = true
      dimensionConfig[key].policy = cloneDeep(value) as PolicyFormRecord
      dimensionConfig[key].initWithDefaults = true
    } else {
      dimensionConfig[key].enabled = false
      dimensionConfig[key].policy = {}
      dimensionConfig[key].initWithDefaults = true
    }
  })
}

const getFlappingDetectConfig = (): FlappingDetect =>
  dimensions.reduce<FlappingDetect>((config, { key }) => {
    const { enabled, policy } = dimensionConfig[key]
    const currentPolicy = policyFormRefs[key]?.configForm ?? policy
    config[key] = enabled ? cloneDeep(currentPolicy) : 'none'
    return config
  }, {})

const loadData = async () => {
  try {
    configLoading.value = true
    const res = await getDefaultZoneConfigs()
    setDimensionConfig(res.flapping_detect)
  } catch (error) {
    //
  } finally {
    configLoading.value = false
  }
}

const handleDataForSubmitting = (data: any) => {
  const ret = checkNOmitFromObj(data)
  for (const block in ret) {
    if (_.isPlainObject(ret[block])) {
      ret[block] = _.omitBy(ret[block], _.isNull)
    }
  }
  return ret
}

const updateConfigData = async () => {
  if (!hasPermission('put')) {
    return
  }
  try {
    for (const { key } of dimensions) {
      if (dimensionConfig[key].enabled && policyFormRefs[key]) {
        await customValidate(policyFormRefs[key])
      }
    }
    saveLoading.value = true
    const zoneData: Zone = await getDefaultZoneConfigs()
    zoneData.flapping_detect = handleDataForSubmitting(getFlappingDetectConfig())
    await updateDefaultZoneConfigs(zoneData)
    ElMessage.success(t('Base.updateSuccess'))
    await loadData()
  } catch (error) {
    //
  } finally {
    saveLoading.value = false
  }
}

const { addObserverToFooter } = useConfFooterStyle()
watch(configLoading, async (isConfigLoading) => {
  if (!isConfigLoading) {
    await nextTick()
    addObserverToFooter()
  }
})
// Fetch data
onMounted(async () => {
  await loadData()
})
</script>
