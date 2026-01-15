<template>
  <div class="TLS-enable-config">
    <el-form-item v-if="!hideVerify" :label="verifyLabel || t('Base.tlsVerify')">
      <el-switch
        v-model="record.verify"
        :disabled="readonly || disabledVerify"
        :active-value="SSL_VERIFY_VALUE_MAP.get(true)"
        :inactive-value="SSL_VERIFY_VALUE_MAP.get(false)"
        @change="handleVerifyChange"
      />
    </el-form-item>
    <el-form-item v-if="showMiddleboxCompMode" :prop="getFormItemProp(`middlebox_comp_mode`)">
      <template #label>
        <FormItemLabel
          :label="t('Base.middleboxCompMode')"
          :desc="t('Base.middleboxCompModeDesc')"
          desc-marked
        />
      </template>
      <el-switch v-model="record.middlebox_comp_mode" :disabled="readonly" />
    </el-form-item>
    <el-row v-if="isServer && !noSessionResumption" :gutter="20" class="session-resumption-row">
      <el-col :span="12">
        <el-form-item :prop="getFormItemProp(`session_tickets`)">
          <template #label>
            <FormItemLabel
              :label="t('Base.sessionTickets')"
              :desc="t('Base.sessionTicketsDesc')"
              desc-marked
            />
          </template>
          <el-select
            v-model="record.session_tickets"
            class="TLS-input session-tickets"
            :disabled="readonly"
          >
            <el-option
              v-for="item in sessionTicketOptions"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item :prop="getFormItemProp(`image.png`)">
          <template #label>
            <FormItemLabel
              :label="t('Base.reuseSessions')"
              :desc="t('Base.reuseSessionsDesc')"
              desc-marked
            />
          </template>
          <el-switch
            v-model="record.reuse_sessions"
            class="TLS-input session-tickets"
            :disabled="readonly"
          />
        </el-form-item>
      </el-col>
    </el-row>

    <CustomFormItem
      v-if="showSni"
      :readonly="readonly"
      :prop="getFormItemProp(`server_name_indication`)"
    >
      <template #label>
        <span v-if="!$attrs.content">SNI</span>
        <FormItemLabel
          v-else
          label="SNI"
          :desc="($attrs as any).content"
          v-bind="$attrs"
          desc-marked
        />
      </template>
      <el-input class="TLS-input" v-model="record.server_name_indication" />
    </CustomFormItem>
    <el-form-item :prop="getFormItemProp(`certfile`)">
      <template #label>
        <span>TLS Cert</span>
        <InfoTooltip :content="t('Base.tlsConfigItemDesc', { file: 'TLS Cert' })" />
      </template>
      <!-- TODO: use CertFileInput.vue -->
      <template v-if="!readonly">
        <TextareaWithUploader
          v-if="!isEdit || !record.certfile || openResetMap.certfile"
          class="TLS-input"
          v-model="record.certfile"
          :accept="CER_FILE_ACCEPTS"
          :placeholder="t('Base.certPlaceholder')"
          @vue:mounted="editConfigItem('certfile')"
        />
        <ConfigItemDataLook
          v-else
          class="TLS-input"
          :value="record.certfile"
          @reset="editConfigItem('certfile')"
        />
      </template>
      <p class="value" v-else>{{ record.certfile }}</p>
    </el-form-item>
    <el-form-item :prop="getFormItemProp(`keyfile`)">
      <template #label>
        <span>TLS Key</span>
        <InfoTooltip :content="t('Base.tlsConfigItemDesc', { file: 'TLS Key' })" />
      </template>
      <template v-if="!readonly">
        <TextareaWithUploader
          v-if="!isEdit || !record.keyfile || openResetMap.keyfile"
          class="TLS-input"
          v-model="record.keyfile"
          :accept="CER_FILE_ACCEPTS"
          :placeholder="t('Base.keyFilePlaceholder')"
          @vue:mounted="editConfigItem('keyfile')"
        />
        <ConfigItemDataLook
          v-else
          class="TLS-input"
          :value="record.keyfile"
          @reset="editConfigItem('keyfile')"
        />
      </template>
      <p class="value" v-else>{{ record.keyfile }}</p>
    </el-form-item>
    <!-- Displayed when verify is undefined(for confluent connector) or true -->
    <el-form-item
      :prop="getFormItemProp(`cacertfile`)"
      v-if="record.verify !== SSL_VERIFY_VALUE_MAP.get(false)"
    >
      <template #label>
        <span>CA Cert</span>
        <InfoTooltip :content="t('Base.tlsConfigItemDesc', { file: 'CA Cert' })" />
      </template>
      <template v-if="!readonly">
        <TextareaWithUploader
          v-if="!isEdit || !record.cacertfile || openResetMap.cacertfile"
          class="TLS-input"
          v-model="record.cacertfile"
          :accept="CER_FILE_ACCEPTS"
          :placeholder="t('Base.certPlaceholder')"
          @vue:mounted="editConfigItem('cacertfile')"
        />
        <ConfigItemDataLook
          v-else
          class="TLS-input"
          :value="record.cacertfile"
          @reset="editConfigItem('cacertfile')"
        />
      </template>
      <p class="value" v-else>{{ record.cacertfile }}</p>
    </el-form-item>
  </div>
</template>

<script lang="ts">
export default defineComponent({
  name: 'CreateTLSEnableConfig',
})
</script>

<script setup lang="ts">
import { SSL } from '@/types/common'
import { SSLSessionTickets } from '@/types/typeAlias'
import CustomFormItem from '../CustomFormItem.vue'
import TextareaWithUploader from '../TextareaWithUploader.vue'
import ConfigItemDataLook from './ConfigItemDataLook.vue'
import FormItemLabel from '../FormItemLabel.vue'

type ConfigItemKey = 'certfile' | 'keyfile' | 'cacertfile'

const props = defineProps({
  modelValue: {
    type: Object as PropType<SSL>,
    default: () => ({}),
  },
  isEdit: {
    type: Boolean,
  },
  showSni: {
    type: Boolean,
    default: true,
  },
  showMiddleboxCompMode: {
    type: Boolean,
    default: true,
  },
  /**
   * for prop in form item when need validate form
   */
  basePath: {
    type: String,
  },
  verifyLabel: {
    type: String,
    default: function () {
      try {
        return useI18nTl('Base').tl('tlsVerify')
      } catch (error) {
        console.error(error)
        return undefined
      }
    },
  },
  readonly: {
    type: Boolean,
    default: false,
  },
  disabledVerify: {
    type: Boolean,
    default: false,
  },
  hideVerify: {
    type: Boolean,
    default: false,
  },
  /**
   * is TLS config for server
   */
  isServer: {
    type: Boolean,
  },
  noSessionResumption: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue', 'verifyChange'])

const { t } = useI18nTl('Auth')

const record = computed<SSL>({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  },
})

const sessionTicketOptions = [
  SSLSessionTickets.disabled,
  SSLSessionTickets.stateless,
  SSLSessionTickets.stateless_with_cert,
]

const openResetMap = ref<Record<ConfigItemKey, boolean>>({
  certfile: false,
  keyfile: false,
  cacertfile: false,
})

const editConfigItem = (key: ConfigItemKey) => {
  record.value[key] = ''
  openResetMap.value[key] = true
}

const getFormItemProp = (key: string) => {
  if (props.basePath) {
    return `${props.basePath}.${key}`
  }
  return undefined
}

const handleVerifyChange = (val: string | number | boolean) => {
  emit('verifyChange', val)
}
</script>

<style lang="scss">
.TLS-input {
  width: 100%;
}
</style>
