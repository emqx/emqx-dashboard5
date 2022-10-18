import { createRandomString } from '@/common/tools'
import Monaco from '@/components/Monaco.vue'
import CommonTLSConfig from '@/components/TLSConfig/CommonTLSConfig.vue'
import { computed, PropType, SetupContext, defineComponent } from 'vue'
import ArrayEditor from './ArrayEditor.vue'
import InputWithUnit from './InputWithUnit.vue'
import OneOf from './Oneof.vue'
import TimeInputWithUnitSelect from './TimeInputWithUnitSelect.vue'
import { Properties } from '@/types/schemaForm'

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

export default defineComponent({
  components: {
    TimeInputWithUnitSelect,
    InputWithUnit,
    ArrayEditor,
    OneOf,
    CommonTLSConfig,
    Monaco,
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
      type: String as PropType<'text' | 'password'>,
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
      const stringInput = (
        <el-input
          disabled={isDisabled}
          placeholder={props.placeholder}
          v-model={formItemValue.value}
          type={inputType}
          autocomplete={autocomplete}
          clearable
        />
      )
      switch (props.type) {
        case 'string':
          return stringInput
        case 'number':
          return (
            <el-input-number
              controls-position="right"
              disabled={isDisabled}
              v-model={formItemValue.value}
              placeholder={props.placeholder}
              min={0}
            />
          )
        case 'enum':
          return (
            <el-select
              disabled={isDisabled}
              placeholder={props.placeholder}
              v-model={formItemValue.value}
              clearable
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
              units={['MB', 'GB', 'KB']}
            />
          )
        case 'percent':
          return (
            <input-with-unit disabled={isDisabled} v-model={formItemValue.value} units={['%']} />
          )
        case 'comma_separated_string':
          return stringInput
        case 'oneof':
          return (
            // ... TODO: why use v-model here the ts will throw error about there is not modelValue
            <one-of items={props.oneOf} disabled={isDisabled} v-model={formItemValue.value} />
          )
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
        default:
          return stringInput
      }
    }

    return () => getFormItem()
  },
})
