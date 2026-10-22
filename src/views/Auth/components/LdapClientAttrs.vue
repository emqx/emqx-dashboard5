<template>
  <section class="ldap-client-attrs">
    <div class="mapping-label">
      <FormItemLabel :label="tl('ldapClientAttrs')" :desc="tl('ldapClientAttrsDesc')" desc-marked />
    </div>
    <div v-for="(mapping, index) in mappings" :key="index" class="mapping-row">
      <div class="mapping">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item :prop="`client_attrs.${index}.attribute`" :rules="attributeRules">
              <template #label>
                <FormItemLabel
                  :label="tl('ldapDirectoryAttribute')"
                  :desc="tl('ldapDirectoryAttributeDesc')"
                />
              </template>
              <el-input v-model="mapping.attribute" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :prop="`client_attrs.${index}.set_as_attr`" :rules="nameRules">
              <template #label>
                <FormItemLabel
                  :label="tl('ldapClientAttributeName')"
                  :desc="tl('ldapClientAttributeNameDesc')"
                />
              </template>
              <el-input v-model="mapping.set_as_attr" />
            </el-form-item>
          </el-col>
          <el-col
            :span="12"
            :class="{ 'mapping-last-row': mapping.extract !== LDAPClientAttrExtract.Literal }"
          >
            <el-form-item :prop="`client_attrs.${index}.select`" :rules="selectRules">
              <template #label>
                <FormItemLabel
                  :label="tl('ldapSelectPatterns')"
                  :desc="tl('ldapSelectPatternsDesc')"
                  desc-marked
                />
              </template>
              <el-input-tag
                v-model="mapping.select"
                class="patterns"
                draggable
                :disabled="!$hasPermission('post') || !$hasPermission('delete')"
                @input="patternInputs.set(mapping, $event)"
                @add-tag="preservePatternInput(mapping)"
              >
                <template #tag="{ value }">
                  <span class="pattern-value" :title="value || tl('ldapEmptyPattern')">
                    {{ value || tl('ldapEmptyPattern') }}
                  </span>
                </template>
              </el-input-tag>
            </el-form-item>
          </el-col>
          <el-col
            :span="12"
            :class="{ 'mapping-last-row': mapping.extract !== LDAPClientAttrExtract.Literal }"
          >
            <el-form-item :prop="`client_attrs.${index}.extract`">
              <template #label>
                <FormItemLabel
                  :label="tl('ldapExtract')"
                  :desc="tl('ldapExtractDesc')"
                  desc-marked
                />
              </template>
              <el-select v-model="mapping.extract" @change="changeExtract(mapping)">
                <el-option
                  v-for="mode in LDAPClientAttrExtract"
                  :key="mode"
                  :value="mode"
                  :label="mode"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col
            v-if="mapping.extract === LDAPClientAttrExtract.Literal"
            :span="12"
            class="mapping-last-row"
          >
            <el-form-item
              :label="tl('ldapLiteral')"
              :prop="`client_attrs.${index}.literal`"
              :rules="literalRules"
            >
              <el-input v-model="mapping.literal" />
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <el-tooltip :content="$t('Base.delete')" placement="top">
        <el-button
          class="mapping-delete"
          :aria-label="$t('Base.delete')"
          :disabled="!$hasPermission('delete')"
          @click="removeMapping(index)"
        >
          <Trash2 class="w-4 h-4" />
        </el-button>
      </el-tooltip>
    </div>
    <el-button class="mb-4" :disabled="!$hasPermission('post')" @click="addMapping">
      {{ tl('ldapAddMapping') }}
    </el-button>
    <el-form-item prop="require_client_attrs" :rules="requireRules">
      <template #label>
        <FormItemLabel
          :label="tl('ldapRequireClientAttrs')"
          :desc="tl('ldapRequireClientAttrsDesc')"
        />
      </template>
      <el-switch v-model="config.require_client_attrs" />
    </el-form-item>
  </section>
</template>

<script setup lang="ts">
import { isLDAPAttributeName, isLDAPClientAttributeName } from '@/common/ldapAuthn'
import { LDAPClientAttrExtract } from '@/types/enum'
import type { AuthnClientAttr, AuthnLdap } from '@/types/schemas/authentication.schemas'
import { formContextKey } from 'element-plus'
import type { FormItemRule } from 'element-plus'
import { Trash2 } from 'lucide-vue-next'

const props = defineProps<{ config: Pick<AuthnLdap, 'client_attrs' | 'require_client_attrs'> }>()
const config = computed(() => props.config)
const { tl } = useI18nTl('Auth')
const form = inject(formContextKey, undefined)
const mappings = computed(() => config.value.client_attrs ?? [])
const patternInputs = new WeakMap<AuthnClientAttr, string>()
const attributeRules: FormItemRule[] = [
  {
    required: true,
    validator: (_rule, value, callback) =>
      callback(
        isLDAPAttributeName(value ?? '')
          ? undefined
          : new Error(tl('ldapInvalidDirectoryAttribute')),
      ),
    trigger: 'blur',
  },
]
const nameRules: FormItemRule[] = [
  {
    required: true,
    validator: (_rule, value, callback) =>
      callback(
        isLDAPClientAttributeName(value ?? '')
          ? undefined
          : new Error(tl('ldapInvalidClientAttributeName')),
      ),
    trigger: 'blur',
  },
]
const selectRules: FormItemRule[] = [
  { type: 'array', required: true, min: 1, message: tl('ldapEmptyPatterns'), trigger: 'change' },
]
// Whitespace is a valid literal; only an absent or zero-length string is invalid.
const literalRules: FormItemRule[] = [
  { required: true, message: tl('ldapMissingLiteral'), trigger: 'blur' },
]
const requireRules: FormItemRule[] = [
  {
    validator: (_rule, value, callback) =>
      callback(
        value && !mappings.value.length ? new Error(tl('ldapRequireWithoutMappings')) : undefined,
      ),
    trigger: 'change',
  },
]

const clearMappingValidation = () => {
  const paths = mappings.value.flatMap((_, index) =>
    ['attribute', 'set_as_attr', 'select', 'literal'].map(
      (field) => `client_attrs.${index}.${field}`,
    ),
  )
  form?.clearValidate(paths)
}
const validateRequired = () => form?.validateField('require_client_attrs').catch(() => false)
const addMapping = () => {
  config.value.client_attrs ??= []
  config.value.client_attrs.push({
    attribute: '',
    set_as_attr: '',
    select: [],
    extract: LDAPClientAttrExtract.Value,
  })
  validateRequired()
}
const removeMapping = (index: number) => {
  clearMappingValidation()
  mappings.value.splice(index, 1)
  validateRequired()
}
const preservePatternInput = (mapping: AuthnClientAttr) => {
  // ElInputTag trims new tags; preserve spaces that are part of the regular expression.
  const input = patternInputs.get(mapping)
  if (input !== undefined) mapping.select[mapping.select.length - 1] = input
  patternInputs.delete(mapping)
}
const changeExtract = (mapping: AuthnClientAttr) => {
  if (mapping.extract !== LDAPClientAttrExtract.Literal) delete mapping.literal
}
</script>

<style scoped lang="scss">
.ldap-client-attrs {
  margin-bottom: 24px;
}
.mapping-label {
  margin-bottom: 16px;
}
.mapping-row {
  position: relative;
  margin: 16px 0;
}
.mapping {
  min-width: 0;
  padding: 16px;
  border: 1px solid var(--el-border-color);
  border-radius: 4px;
}
.mapping-delete {
  position: absolute;
  top: 0;
  left: calc(100% + 16px);
}
.mapping-last-row :deep(.el-form-item) {
  margin-bottom: 4px;
}
.patterns {
  width: 100%;
}
.pattern-value {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: pre;
}
</style>
