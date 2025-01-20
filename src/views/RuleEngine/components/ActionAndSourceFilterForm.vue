<template>
  <el-form
    label-position="left"
    label-width="0px"
    class="search-wrapper without-padding-top action-filter-form"
    @keyup.enter="search"
  >
    <el-row :gutter="20" :class="{ 'multiple-rows': showMoreQuery }">
      <el-col v-bind="colProps">
        <el-form-item>
          <el-input
            v-model="filterParams.name"
            :placeholder="t('Base.name')"
            clearable
            @clear="search"
          >
            <template #prepend>
              <el-select v-model="filterParams.type">
                <el-option
                  v-for="{ value, label } in typeOptList"
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
          <el-select class="select-topic-type" v-model="filterParams.status">
            <el-option
              v-for="{ label, value } in statusOptList"
              :key="value"
              :label="label"
              :value="value"
            />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col v-bind="colProps">
        <el-form-item>
          <el-select
            class="select-status"
            v-model="filterParams.enable"
            clearable
            @clear="search"
            :placeholder="t('Base.isEnabled')"
          >
            <el-option :label="t('Base.enabled')" :value="true" />
            <el-option :label="t('Base.disabled')" :value="false" />
          </el-select>
        </el-form-item>
      </el-col>
      <template v-if="showMoreQuery">
        <el-col v-bind="colProps">
          <el-form-item>
            <el-input
              type="text"
              v-model="filterParams.rule"
              clearable
              :placeholder="`${titleCase(tl('rule'))} ID`"
              @clear="search"
            />
          </el-form-item>
        </el-col>
        <el-col :span="24" />
      </template>
      <el-col v-bind="colProps" class="col-oper">
        <SearchButton @click="search" />
        <ResetButton @click="handleReset" />
        <ShowMoreButton v-model="showMoreQuery" />
      </el-col>
    </el-row>
  </el-form>
</template>

<script setup lang="ts">
import { SEARCH_FORM_RES_PROPS as colProps } from '@/common/constants'
import { titleCase } from '@/common/tools'
import useBridgeTypeValue from '@/hooks/Rule/bridge/useBridgeTypeValue'
import useActionAndSourceStatus from '@/hooks/Rule/useActionAndSourceStatus'
import useI18nTl from '@/hooks/useI18nTl'
import { ConnectionStatus } from '@/types/enum'
import type { Ref } from 'vue'
import { computed, defineEmits, defineProps, ref } from 'vue'

interface ActionAndSourceFilterParams {
  type?: string
  name?: string
  status?: ConnectionStatus
  rule?: string
  enable?: boolean
}

const props = defineProps<{
  type: 'action' | 'source'
}>()

const NOT_SPECIFIC_TYPE = 'not_specific'
const createRawFilterParams = (): ActionAndSourceFilterParams => ({
  type: NOT_SPECIFIC_TYPE,
  name: undefined,
  status: undefined,
  rule: undefined,
  enable: undefined,
})
const { tl, t } = useI18nTl('RuleEngine')

const emit = defineEmits(['search', 'refresh'])

const showMoreQuery = ref(false)

const filterParams: Ref<ActionAndSourceFilterParams> = ref(createRawFilterParams())

const { egressBridgeTypeList: actionTypeList } = useBridgeTypeValue()
const typeOptList = computed(() => {
  return props.type === 'action' ? actionTypeList : []
})
const { statusOptList } = useActionAndSourceStatus()

const getFilterParams = () => {
  const ret = {}
  return ret
}

const search = () => {
  emit('search', getFilterParams())
}

const handleReset = () => {
  filterParams.value = createRawFilterParams()
  search()
}
</script>

<style lang="scss">
@import '~@/style/management.scss';
.action-filter-form {
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
.el-select-dropdown__item {
  &.space-between {
    max-width: 90vw;
  }
  .endpoint-name {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .endpoint-type {
    margin-left: 12px;
  }
}
</style>
