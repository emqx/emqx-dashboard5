<template>
  <el-form
    label-position="left"
    label-width="0px"
    class="rule-filter-form"
    @keyup.enter="searchRule"
  >
    <el-row :gutter="32" :class="{ 'multiple-rows': showMoreQuery }">
      <el-col :span="6">
        <el-form-item>
          <el-input type="text" v-model="filterParams.like_id" placeholder="ID" />
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item>
          <el-input
            type="text"
            v-model="filterParams[keyForSearchTopic]"
            :placeholder="$t('Base.topic')"
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
      <el-col :span="6">
        <el-form-item>
          <el-select
            class="select-status"
            v-model="filterParams.enable"
            clearable
            :placeholder="$t('Base.isEnabled')"
          >
            <el-option :label="$t('Base.enable')" :value="true" />
            <el-option :label="$t('Base.disable')" :value="false" />
          </el-select>
        </el-form-item>
      </el-col>
      <template v-if="showMoreQuery">
        <el-col :span="6">
          <el-form-item>
            <el-input
              type="text"
              v-model="filterParams.like_description"
              :placeholder="tl('note')"
            />
          </el-form-item>
        </el-col>
      </template>

      <el-col :span="showMoreQuery ? 24 : 6">
        <div class="col-oper">
          <el-button type="primary" plain @click="searchRule">
            {{ $t('Base.search') }}
          </el-button>
          <el-button plain @click="resetFilterParams()">
            {{ $t('Clients.reset') }}
          </el-button>
          <el-button link class="btn-show-more" @click="showMoreQuery = !showMoreQuery">
            {{ showMoreQuery ? $t('Clients.collapse') : $t('Clients.expand') }}
            <el-icon :class="{ 'is-rotate': showMoreQuery }"><ArrowDown /></el-icon>
          </el-button>
        </div>
      </el-col>
    </el-row>
  </el-form>
</template>

<script setup lang="ts">
import useI18nTl from '@/hooks/useI18nTl'
import { FilterParamsForQueryRules } from '@/types/rule'
import { ArrowDown } from '@element-plus/icons-vue'
import { omit } from 'lodash'
import { defineEmits, ref, Ref } from 'vue'

const createRawFilterParams = () => ({
  like_id: undefined,

  like_from: undefined,
  match_from: undefined,

  enable: undefined,
  like_description: undefined,
})
const { tl, t } = useI18nTl('RuleEngine')
const KEYS_FOR_SEARCH_TOPIC: Array<{ value: 'like_from' | 'match_from'; label: string }> = [
  { value: 'like_from', label: t('Base.topic') },
  { value: 'match_from', label: t('Clients.wildcard') },
]

const emit = defineEmits(['update:modelValue', 'search'])

const showMoreQuery = ref(false)

const filterParams: Ref<FilterParamsForQueryRules> = ref(createRawFilterParams())
const keyForSearchTopic: Ref<'like_from' | 'match_from'> = ref(KEYS_FOR_SEARCH_TOPIC[0].value)

const getFilterParams = () => {
  const filterParamsData = omit(filterParams.value, ['like_from', 'match_from'])
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
  return ret
}

const searchRule = () => {
  emit('search', getFilterParams())
}

const resetFilterParams = () => {
  filterParams.value = createRawFilterParams()
  searchRule()
}
</script>

<style lang="scss">
.rule-filter-form {
  .col-oper {
    float: right;
  }
  .btn-show-more {
    .el-icon {
      margin-left: 8px;
    }
  }
  .select-topic-type {
    .el-input {
      width: 100px;
    }
  }
}
</style>
