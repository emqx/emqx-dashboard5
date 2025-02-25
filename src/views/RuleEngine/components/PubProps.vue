<template>
  <el-row :gutter="26" class="pub-props">
    <el-col :span="span">
      <CustomFormItem
        :label="tl('payloadFormatIndicator')"
        :prop="getFormItemProp('Payload-Format-Indicator')"
        :readonly="readonly"
      >
        <el-select
          v-if="isRepub"
          v-model="record['Payload-Format-Indicator']"
          :placeholder="tl('selectOrInput')"
          filterable
          allow-create
          clearable
        >
          <el-option label="true" value="true">
            <span class="option-label">true</span>
            <span class="option-description"> {{ tl('utf8EncodedCharacterData') }} </span>
          </el-option>
          <el-option label="false" value="false">
            <span class="option-label">false</span>
            <span class="option-description"> {{ tl('unspecifiedByteStream') }} </span>
          </el-option>
        </el-select>
        <el-switch
          v-else
          active-value="true"
          inactive-value="false"
          v-model="record['Payload-Format-Indicator']"
        />
      </CustomFormItem>
    </el-col>
    <el-col :span="span">
      <CustomFormItem
        :label="tl('messageExpiryInterval')"
        :prop="getFormItemProp('Message-Expiry-Interval')"
        :readonly="readonly"
      >
        <el-input v-model="record['Message-Expiry-Interval']" />
      </CustomFormItem>
    </el-col>
    <el-col :span="span" v-if="!isRepub">
      <CustomFormItem
        :label="tl('topicAlias')"
        :prop="getFormItemProp('Topic-Alias')"
        :readonly="readonly"
      >
        <el-input v-model="record['Topic-Alias']" />
      </CustomFormItem>
    </el-col>
    <el-col :span="span">
      <CustomFormItem
        :label="tl('contentType')"
        :prop="getFormItemProp('Content-Type')"
        :readonly="readonly"
      >
        <el-input v-model="record['Content-Type']" />
      </CustomFormItem>
    </el-col>
    <el-col :span="span">
      <CustomFormItem
        :label="tl('responseTopic')"
        :prop="getFormItemProp('Response-Topic')"
        :readonly="readonly"
      >
        <el-input v-model="record['Response-Topic']" />
      </CustomFormItem>
    </el-col>
    <el-col :span="span">
      <CustomFormItem
        :label="tl('correlationData')"
        :prop="getFormItemProp('Correlation-Data')"
        :readonly="readonly"
      >
        <el-input v-model="record['Correlation-Data']" />
      </CustomFormItem>
    </el-col>
    <el-col :span="span" v-if="!isRepub">
      <CustomFormItem
        :label="tl('subIdentifier')"
        :prop="getFormItemProp('Subscription-Identifier')"
        :readonly="readonly"
      >
        <el-input v-model="record['Subscription-Identifier']" />
      </CustomFormItem>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import CustomFormItem from '@/components/CustomFormItem.vue'
import useI18nTl from '@/hooks/useI18nTl'

type PubProps = { 'User-Property': Record<string, string> } & Record<string, string>
const props = defineProps<{
  modelValue: PubProps
  span?: number
  readonly?: boolean
  path?: string
  isRepub?: boolean
}>()
const emit = defineEmits<{
  (e: 'update:modelValue', v: PubProps): void
}>()

const record = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  },
})

const { tl } = useI18nTl('RuleEngine')

const getFormItemProp = (key: string) => (props.path ? `${props.path}.${key}` : key)
</script>

<style lang="scss">
.pub-props {
  .el-table {
    margin-bottom: 16px;
  }
  .option-label {
    float: left;
  }
  .option-description {
    float: right;
    color: var(--color-text-secondary);
    font-size: 13px;
  }
}
</style>
