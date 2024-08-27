<template>
  <el-form
    label-position="left"
    label-width="0px"
    class="rule-filter-form"
    @keyup.enter="searchRule"
  >
    <el-row :gutter="20" class="" :class="{ 'multiple-rows': showMoreQuery }">
      <el-col v-bind="colProps">
        <el-form-item>
          <el-input
            type="text"
            v-model="filterParams.like_id"
            placeholder="ID"
            clearable
            @clear="searchRule"
          />
        </el-form-item>
      </el-col>
      <el-col v-bind="colProps">
        <el-form-item>
          <el-input
            type="text"
            v-model="filterParams[keyForSearchTopic]"
            :placeholder="$t('Base.topic')"
            clearable
            @clear="searchRule"
          >
            <template #prepend>
              <el-select class="select-topic-type" v-model="keyForSearchTopic">
                <el-option
                  v-for="{ label, value } in KEYS_FOR_SEARCH_TOPIC"
                  :key="value"
                  :label="label"
                  :value="value"
                />
              </el-select>
            </template>
          </el-input>
        </el-form-item>
      </el-col>
      <el-col v-bind="colProps">
        <el-form-item>
          <el-select
            class="select-status"
            v-model="filterParams.enable"
            clearable
            @clear="searchRule"
            :placeholder="$t('Base.isEnabled')"
          >
            <el-option :label="$t('Base.enabled')" :value="true" />
            <el-option :label="$t('Base.disabled')" :value="false" />
          </el-select>
        </el-form-item>
      </el-col>
      <template v-if="showMoreQuery">
        <el-col v-bind="colProps">
          <el-form-item>
            <el-input
              type="text"
              v-model="filterParams.like_description"
              clearable
              @clear="searchRule"
              :placeholder="tl('note')"
            />
          </el-form-item>
        </el-col>
        <el-col v-bind="colProps">
          <el-form-item>
            <div
              class="
                el-input el-input-group el-input-group--prepend
                el-input--suffix
                input-target-value
              "
            >
              <div class="el-input-group__prepend">
                <el-select class="select-topic-type" v-model="keyForFilterActionOrSource">
                  <el-option
                    v-for="{ label, value } in FILTER_ACTION_OR_SOURCE_OPTIONS"
                    :key="value"
                    :label="label"
                    :value="value"
                  />
                </el-select>
              </div>
              <div class="el-input__wrapper mock-wrapper">
                <el-select
                  type="text"
                  v-model="filterParams[keyForFilterActionOrSource]"
                  clearable
                  @clear="searchRule"
                >
                  <el-option
                    v-for="{ name, type, id } in endpointOpts"
                    class="space-between"
                    :key="id"
                    :value="id"
                    :label="name"
                  >
                    <span>{{ name }}</span>
                    <p class="tip">{{ getGeneralTypeLabel(type) }}</p>
                  </el-option>
                </el-select>
              </div>
            </div>
          </el-form-item>
        </el-col>
        <el-col :sm="12" :md="12" :lg="12" />
      </template>
      <el-col v-bind="colProps" class="col-oper">
        <el-button plain type="primary" :icon="Search" @click="searchRule">
          {{ $t('Base.search') }}
        </el-button>
        <el-button :icon="RefreshLeft" @click="handleReset">
          {{ $t('Base.reset') }}
        </el-button>
        <el-tooltip
          :content="!showMoreQuery ? $t('Base.showMore') : $t('Base.lessMore')"
          placement="top"
        >
          <el-button
            class="icon-button"
            plain
            :icon="showMoreQuery ? ArrowUp : ArrowDown"
            @click="showMoreQuery = !showMoreQuery"
          >
          </el-button>
        </el-tooltip>
      </el-col>
    </el-row>
  </el-form>
</template>

<script setup lang="ts">
import { SEARCH_FORM_RES_PROPS as colProps } from '@/common/constants'
import useActionList from '@/hooks/Rule/action/useActionList'
import useSourceList from '@/hooks/Rule/action/useSourceList'
import useBridgeTypeValue from '@/hooks/Rule/bridge/useBridgeTypeValue'
import useI18nTl from '@/hooks/useI18nTl'
import { FilterParamsForQueryRules } from '@/types/rule'
import { ArrowDown, ArrowUp, RefreshLeft, Search } from '@element-plus/icons-vue'
import { omit } from 'lodash'
import type { Ref } from 'vue'
import { computed, defineEmits, defineProps, ref } from 'vue'

const props = defineProps({
  initialValue: {
    type: Object,
    default: () => ({}),
  },
})

const createRawFilterParams = () => ({
  like_id: undefined,

  like_from: undefined,
  match_from: undefined,

  enable: undefined,
  like_description: undefined,

  source: undefined,
  action: undefined,
})
const { tl, t } = useI18nTl('RuleEngine')
const KEYS_FOR_SEARCH_TOPIC: Array<{ value: 'like_from' | 'match_from'; label: string }> = [
  { value: 'like_from', label: t('Base.topic') },
  { value: 'match_from', label: t('Clients.wildcard') },
]

const enum Endpoint {
  Source = 'source',
  Action = 'action',
}
const FILTER_ACTION_OR_SOURCE_OPTIONS: Array<{ value: Endpoint; label: string }> = [
  { value: Endpoint.Action, label: tl('action') },
  { value: Endpoint.Source, label: 'Source' },
]

const emit = defineEmits(['search', 'refresh'])

const showMoreQuery = ref(false)

const filterParams: Ref<FilterParamsForQueryRules> = ref(createRawFilterParams())
const keyForSearchTopic: Ref<'like_from' | 'match_from'> = ref(KEYS_FOR_SEARCH_TOPIC[0].value)
const keyForFilterActionOrSource: Ref<Endpoint> = ref(FILTER_ACTION_OR_SOURCE_OPTIONS[0].value)

/**
 * all created action list
 */
const actionList = ref<Array<any>>([])
const { getActionList } = useActionList()
;(async () => (actionList.value = await getActionList()))()

const sourceList = ref<Array<any>>([])
const { getSourceList } = useSourceList()
;(async () => (sourceList.value = await getSourceList()))()

const { getGeneralTypeLabel } = useBridgeTypeValue()

const endpointOpts = computed(() =>
  keyForFilterActionOrSource.value === Endpoint.Source ? sourceList.value : actionList.value,
)

const handleInitialValue = () => {
  filterParams.value = { ...filterParams.value, ...props.initialValue }
  if (filterParams.value.like_from || filterParams.value.match_from) {
    keyForSearchTopic.value = filterParams.value.like_from ? 'like_from' : 'match_from'
  }
  if (filterParams.value.action || filterParams.value.source) {
    keyForFilterActionOrSource.value = filterParams.value.source ? Endpoint.Source : Endpoint.Action
    showMoreQuery.value = true
  }
  if (filterParams.value.like_description) {
    showMoreQuery.value = true
  }
}
handleInitialValue()

const getFilterParams = () => {
  const filterParamsData = omit(filterParams.value, [
    'like_from',
    'match_from',
    Endpoint.Source,
    Endpoint.Action,
  ])
  const ret: FilterParamsForQueryRules = (
    Object.keys(filterParamsData) as Array<keyof typeof filterParamsData>
  ).reduce((obj, currentKey) => {
    const currentVal = filterParamsData[currentKey]
    if (currentVal !== undefined && currentVal !== '') {
      return { ...obj, [currentKey]: currentVal }
    }
    return obj
  }, {})
  if (filterParams.value[keyForSearchTopic.value]) {
    ret[keyForSearchTopic.value] = filterParams.value[keyForSearchTopic.value]
  }
  if (filterParams.value[keyForFilterActionOrSource.value]) {
    ret[keyForFilterActionOrSource.value] = filterParams.value[keyForFilterActionOrSource.value]
  }
  return ret
}

const searchRule = () => {
  emit('search', getFilterParams())
}

const handleReset = () => {
  filterParams.value = createRawFilterParams()
  searchRule()
}
</script>

<style lang="scss">
@import '~@/style/management.scss';
.rule-filter-form {
  margin-top: -12px;
  .col-oper {
    float: right;
  }
  // when show more query
  .el-col-24 {
    margin-top: 16px;
  }
  .el-form-item {
    margin-bottom: 0;
  }
  .select-topic-type {
    .el-input {
      width: 100%;
    }
  }
  .mock-wrapper {
    padding: 0;
    .el-input,
    .el-select {
      margin-right: 0;
    }
    .el-input__wrapper {
      box-shadow: none;
      background-color: transparent;
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
    }
  }
}
</style>
