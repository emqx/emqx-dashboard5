import { defineComponent, ref, Ref, watch } from 'vue'
import useSchemaForm from '@/hooks/Config/useSchemaForm'
import { Properties } from '@/types/schemaForm'
import TimeInputWithUnitSelect from '@/components/TimeInputWithUnitSelect.vue'
import InputWithUnit from '@/components/InputWithUnit.vue'
import InputArray from '@/components/InputArray.vue'
import { useI18n } from 'vue-i18n'
import _ from 'lodash'
import '@/style/schemaForm.scss'

const SchemaForm = defineComponent({
  name: 'SchemaForm',
  components: {
    TimeInputWithUnitSelect,
    InputWithUnit,
    InputArray,
  },
  props: {
    path: {
      type: String,
      required: true,
    },
    form: {
      type: Object,
      required: true,
    },
    btnLoading: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, ctx) {
    const configForm = ref<{ [key: string]: any }>({})
    watch(
      () => props.form,
      (value) => {
        configForm.value = _.cloneDeep(value)
      },
    )
    const { t } = useI18n()
    const { components }: { components: Ref<Properties> } = useSchemaForm(props.path)
    const switchComponent = (property: Properties[string], key: string) => {
      const stringInput = (
        <el-input
          disabled={property.readOnly}
          placeholder={property.default}
          v-model={configForm.value[key]}
        ></el-input>
      )
      switch (property.type) {
        case 'string':
          return stringInput
        case 'number':
          return (
            <el-input
              type="number"
              disabled={property.readOnly}
              v-model={configForm.value[key]}
              placeholder={property.default.toString()}
            ></el-input>
          )
        case 'enum':
          return (
            <el-select
              disabled={property.readOnly}
              placeholder={property.default}
              v-model={configForm.value[key]}
            >
              {property.symbols?.map((opt) => (
                <el-option value={opt} label={opt}></el-option>
              ))}
            </el-select>
          )
        case 'boolean':
          return (
            <el-switch disabled={property.readOnly} v-model={configForm.value[key]}></el-switch>
          )
        case 'array':
          return (
            <input-array disabled={property.readOnly} v-model={configForm.value[key]}></input-array>
          )
        case 'duration':
          return (
            <time-input-with-unit-select
              disabled={property.readOnly}
              v-model={configForm.value[key]}
            ></time-input-with-unit-select>
          )
        case 'byteSize':
          return (
            <input-with-unit
              disabled={property.readOnly}
              v-model={configForm.value[key]}
              units={['MB', 'G', 'KB']}
            ></input-with-unit>
          )
        case 'percent':
          return (
            <input-with-unit
              disabled={property.readOnly}
              v-model={configForm.value[key]}
              units={['%']}
            ></input-with-unit>
          )
        case 'comma_separated_string':
          return stringInput
        default:
          return stringInput
      }
    }
    const setControl = (property: Properties[string], key: string) => {
      if (property.type) {
        return switchComponent(property, key)
      } else if (property.oneOf) {
        const oneofs = property.oneOf.map((item: Properties[string]) => {
          return switchComponent(item, key)
        })
        return <div class="oneof-item">{oneofs}</div>
      }
    }

    const getColFormItem = (key: string, property: Properties[string], groupName?: string) => {
      const colItem = (
        <el-col span={16}>
          <el-form-item label={property.label} prop={key}>
            <p class="item-desc" v-html={property.description}></p>
            {setControl(property, key)}
          </el-form-item>
        </el-col>
      )
      if (groupName) {
        return (
          <>
            <el-col span={24}>
              <div class="group-title">{groupName}</div>
            </el-col>
            {colItem}
          </>
        )
      }
      return colItem
    }

    const save = () => {
      ctx.emit('save', configForm.value)
    }

    const renderLayout = (contents: JSX.Element[]) => (
      <el-form label-position="top">
        <el-row>
          {contents}
          <el-col span={24} class="btn-col">
            <el-button type="primary" loading={props.btnLoading} onClick={save}>
              {t('Base.save')}
            </el-button>
          </el-col>
        </el-row>
      </el-form>
    )

    const getComponents = (properties: Properties) => {
      let [groupName, oldGroupName] = [t('Clients.basicInfo'), '']
      const elements: JSX.Element[] = []
      const setComponents = (properties: Properties) => {
        Object.keys(properties).forEach((key) => {
          const property = properties[key]
          if (property.properties) {
            const { label, properties } = property
            groupName = label
            setComponents(properties)
          } else {
            let elFormItem = <></>
            if (groupName !== oldGroupName) {
              oldGroupName = groupName
              elFormItem = getColFormItem(key, property, groupName)
            } else if (groupName === oldGroupName) {
              elFormItem = getColFormItem(key, property)
            }
            elements.push(elFormItem)
          }
        })
        return elements
      }
      return setComponents(properties)
    }

    const renderSchemaForm = (properties: Properties) => {
      console.log(properties)
      const schemaForm = renderLayout(getComponents(properties))
      return schemaForm
    }
    return () => <div class="schema-form">{renderSchemaForm(components.value)}</div>
  },
})

export default SchemaForm
