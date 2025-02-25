import { createRandomString } from '@/common/tools'
import Monaco from '@/components/Monaco.vue'
import CommonTLSConfig from '@/components/TLSConfig/CommonTLSConfig.vue'
import { Properties } from '@/types/schemaForm'
import ArrayEditor from './ArrayEditor.vue'
import CustomInputNumber from './CustomInputNumber.vue'
import InputWithPlaceholderSelect from './InputWithPlaceholderSelect.vue'
import InputWithUnit from './InputWithUnit.vue'
import KeyAndValueEditor from './KeyAndValueEditor.vue'
import OneOf from './Oneof.vue'
import TimeInputWithUnitSelect from './TimeInputWithUnitSelect.vue'
import CustomInputPassword from './CustomInputPassword.vue'
import { SetupContext } from 'vue'

type FormItemType =
  | 'string'
  | 'number'
  | 'enum'
  | 'boolean'
  | 'array'
  | 'duration'
  | 'byteSize'
  | 'percent'
  | 'comma_separated_string'
  | 'oneof'
  | 'ssl'
  | 'sql'
  | 'object'

export default defineComponent({
  components: {
    TimeInputWithUnitSelect,
    InputWithUnit,
    ArrayEditor,
    OneOf,
    CommonTLSConfig,
    Monaco,
    CustomInputNumber,
    InputWithPlaceholderSelect,
  },
  props: {
    modelValue: {
      type: [String, Number, Boolean, Array, Object] as PropType<any>,
    },
    type: {
      type: String as PropType<FormItemType>,
    },
    placeholder: {
      type: String,
    },
    disabled: {
      type: Boolean,
    },
    /**
     * for type string,
     */
    format: {
      type: String as PropType<'text' | 'password' | 'sql'>,
    },
    /**
     * for type enum
     */
    symbols: {
      type: Array as PropType<Array<string> | Array<number>>,
      default: () => [],
    },
    /**
     * for array
     */
    items: {
      type: Object as PropType<{ type: string }>,
      default: () => ({}),
    },
    /**
     * for array now
     */
    defaultValue: {
      type: [Array, String, Boolean, Number],
    },
    /**
     * for array
     */
    oneOf: {
      type: Array as PropType<Array<Properties[string]>>,
      default: () => [],
    },
    /**
     * now for TLS, maybe will be used in other component future
     */
    isEdit: {
      type: Boolean,
    },
    customProps: {
      type: Object,
    },
    property: {
      type: Object,
    },
  },
  setup(props, ctx: SetupContext) {
    const formItemValue = computed({
      get() {
        return props.modelValue
      },
      set(val) {
        ctx.emit('update:modelValue', val)
      },
    })

    const getFormItem = () => {
      const format = props.format
      const isDisabled = props.disabled

      /**
       * do not use v-model directly because there have some prop in second level
       * like the props under the connector field
       */
      const inputType = format === 'password' ? 'password' : 'text'
      const autocomplete = inputType === 'password' ? 'one-time-code' : ''
      const showPassword = inputType === 'password'
      const customProps = props.customProps || {}
      const isTemplate = !!props.property?.is_template

      const stringInput = (
        <el-input
          disabled={isDisabled}
          placeholder={props.placeholder}
          v-model={formItemValue.value}
          type={inputType}
          autocomplete={autocomplete}
          showPassword={showPassword}
          {...customProps}
          clearable
        />
      )
      switch (props.type) {
        case 'string': {
          if (props.format === 'sql') {
            return (
              <div class="monaco-container">
                <monaco
                  id={createRandomString()}
                  v-model={formItemValue.value}
                  lang="sql"
                  disabled={isDisabled}
                  {...customProps}
                />
              </div>
            )
          } else if (isTemplate) {
            return (
              <InputWithPlaceholderSelect
                v-model={formItemValue.value}
                disabled={isDisabled}
                type={inputType}
                clearable
                oneOf={props.property?.oneOf}
                {...customProps}
              />
            )
          } else if (props.format === 'password') {
            return (
              <CustomInputPassword
                disabled={isDisabled}
                placeholder={props.placeholder}
                v-model={formItemValue.value}
                clearable
                {...customProps}
              />
            )
          }
          return stringInput
        }
        case 'number':
          return (
            <CustomInputNumber
              disabled={isDisabled}
              v-model={formItemValue.value}
              placeholder={props.placeholder}
              min={0}
              {...customProps}
            />
          )
        case 'enum':
          if (isTemplate) {
            return (
              <InputWithPlaceholderSelect
                v-model={formItemValue.value}
                disabled={isDisabled}
                type={inputType}
                clearable
                {...customProps}
                options={props.symbols}
                oneOf={props.property?.oneOf}
              />
            )
          }
          return (
            <el-select
              disabled={isDisabled}
              placeholder={props.placeholder}
              v-model={formItemValue.value}
              clearable
              {...customProps}
            >
              {(props.symbols as any)?.map((opt: any) => (
                <el-option value={opt} label={opt} />
              ))}
            </el-select>
          )
        case 'boolean':
          return <el-switch disabled={isDisabled} v-model={formItemValue.value} />
        case 'array':
          if (['number', 'string'].includes(props.items.type)) {
            return (
              <array-editor
                v-model={formItemValue.value}
                disabled={isDisabled}
                type={props.items.type}
                default={props.defaultValue as any}
              />
            )
          }
          return <div></div>
        case 'duration':
          return <time-input-with-unit-select disabled={isDisabled} v-model={formItemValue.value} />
        case 'byteSize':
          return (
            <input-with-unit
              disabled={isDisabled}
              v-model={formItemValue.value}
              units={['MB', 'GB', 'KB', 'B']}
            />
          )
        case 'percent':
          return (
            <input-with-unit disabled={isDisabled} v-model={formItemValue.value} units={['%']} />
          )
        case 'comma_separated_string':
          return stringInput
        case 'oneof':
          return <one-of items={props.oneOf} disabled={isDisabled} v-model={formItemValue.value} />
        case 'ssl':
          return <common-tls-config v-model={formItemValue.value} isEdit={!!props.isEdit} />
        case 'sql':
          return (
            <div class="monaco-container">
              <monaco
                id={createRandomString()}
                v-model={formItemValue.value}
                lang="sql"
                disabled={isDisabled}
              />
            </div>
          )
        case 'object':
          return <KeyAndValueEditor v-model={formItemValue.value} {...customProps} />
        default:
          return stringInput
      }
    }

    return () => getFormItem()
  },
})
