<template>
  <el-form
    ref="FormCom"
    label-width="180px"
    class="webhook-form"
    require-asterisk-position="right"
    :rules="rules"
    :model="formData"
  >
    <el-form-item prop="name" :label="tl('name')">
      <el-input v-model="formData.name" :disabled="isEdit" />
    </el-form-item>
    <el-form-item prop="rule.description" :label="tl('note')">
      <el-input v-model="formData.rule.description" />
    </el-form-item>
    <el-form-item prop="rule.sql" :label="tl('trigger')" class="item-trigger">
      <Trigger v-model="formData.rule.sql" />
    </el-form-item>
    <el-form-item :label="tl('method')" prop="bridge.method">
      <el-select v-model="formData.bridge.method">
        <el-option
          v-for="item in ['post', 'get', 'put', 'delete']"
          :value="item"
          :label="String(item).toUpperCase()"
          :key="item"
        />
      </el-select>
    </el-form-item>
    <el-form-item :label="'URL'" prop="bridge.url">
      <template #label>
        <label>URL</label>
        <InfoTooltip :content="tl('httpBridgeURLFieldDesc')" />
      </template>
      <el-input v-model="formData.bridge.url" />
      <!-- TODO:test -->
    </el-form-item>
    <el-form-item :label="tl('headers')" class="item-headers">
      <!-- TODO:key value editor -->
    </el-form-item>
    <el-collapse-transition>
      <div v-if="isAdvancedShow">
        <BridgeResourceOpt v-model="formData.bridge.resource_opts" :col-span="24" />
        <CommonTLSConfig class="tls-config-form" v-model="formData.bridge.ssl" :is-edit="isEdit" />
        <el-form-item :label="tl('connTimeout')">
          <TimeInputWithUnitSelect
            v-model="formData.bridge.connect_timeout"
            :enabled-units="['s']"
          />
        </el-form-item>
        <el-form-item :label="tl('connectionPoolSize')" required prop="pool_size">
          <el-input v-model.number="formData.bridge.pool_size" />
        </el-form-item>
        <el-form-item :label="tl('poolType')" prop="pool_type">
          <el-select v-model="formData.bridge.pool_type">
            <el-option v-for="item in ['random', 'hash']" :key="item" :value="item" :label="item" />
          </el-select>
        </el-form-item>
        <el-form-item :label="tl('httpPipeline')">
          <CustomInputNumber
            v-model="formData.bridge.enable_pipelining"
            controls-position="right"
          />
        </el-form-item>
      </div>
    </el-collapse-transition>

    <el-button class="btn-skip" type="primary" link @click="toggleAdvancedShow">
      {{ tl('advancedSettings') }}
    </el-button>
  </el-form>
</template>

<script setup lang="ts">
import CustomInputNumber from '@/components/CustomInputNumber.vue'
import InfoTooltip from '@/components/InfoTooltip.vue'
import CommonTLSConfig from '@/components/TLSConfig/CommonTLSConfig.vue'
import TimeInputWithUnitSelect from '@/components/TimeInputWithUnitSelect.vue'
import useI18nTl from '@/hooks/useI18nTl'
import { WebhookForm, WebhookItem } from '@/types/webhook'
import BridgeResourceOpt from '@/views/RuleEngine/Bridge/Components/BridgeConfig/BridgeResourceOpt.vue'
import { PropType, WritableComputedRef, computed, defineEmits, defineProps, ref } from 'vue'
import Trigger from './Trigger.vue'

const props = defineProps({
  modelValue: {
    type: Object as PropType<WebhookForm | WebhookItem>,
    required: true,
  },
  isEdit: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue'])

const { tl } = useI18nTl('RuleEngine')

const isAdvancedShow = ref(false)
const toggleAdvancedShow = () => (isAdvancedShow.value = !isAdvancedShow.value)

const formData: WritableComputedRef<WebhookForm | WebhookItem> = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  },
})

const rules = {}
</script>

<style lang="scss">
.webhook-form {
  .el-form-item {
    width: 40%;
    &.item-trigger {
      width: 100%;
    }
    &.item-headers {
      width: 50%;
    }
  }
  .webhook-trigger {
    width: 100%;
  }
}
</style>
