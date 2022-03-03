import { defineComponent, Ref } from 'vue'
import useSchemaForm from '@/hooks/Config/useSchemaForm'
import { Properties } from '@/types/schemaForm'
import TimeInputWithUnitSelect from '@/components/TimeInputWithUnitSelect.vue'
import InputWithUnit from '@/components/InputWithUnit.vue'
import InputArray from '@/components/InputArray.vue'
import '@/style/schemaForm.scss'
import { useI18n } from 'vue-i18n'

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
  },
  setup(props) {
    const { t } = useI18n()
    const { components }: { components: Ref<Properties> } = useSchemaForm(props.path)
    const switchComponent = (property: Properties[string]) => {
      const stringInput = <el-input placeholder={property.default}></el-input>
      switch (property.type) {
        case 'string':
          return stringInput
        case 'number':
          return <el-input type="number" placeholder={property.default.toString()}></el-input>
        case 'enum':
          return (
            <el-select placeholder={property.default}>
              {property.symbols?.map((opt) => (
                <el-option value={opt} label={opt}></el-option>
              ))}
            </el-select>
          )
        case 'boolean':
          return <el-switch></el-switch>
        case 'array':
          return <input-array></input-array>
        case 'duration':
          return <time-input-with-unit-select></time-input-with-unit-select>
        case 'byteSize':
          return <input-with-unit units={['MB', 'G', 'KB']}></input-with-unit>
        case 'percent':
          return <input-with-unit units={['%']}></input-with-unit>
        case 'comma_separated_string':
          return stringInput
        default:
          return stringInput
      }
    }
    const setControl = (property: Properties[string]) => {
      if (property.type) {
        return switchComponent(property)
      } else if (property.oneOf) {
        const oneofs = property.oneOf.map((item: Properties[string]) => {
          return switchComponent(item)
        })
        return <div class="oneof-item">{oneofs}</div>
      }
    }

    const getColFormItem = (property: Properties[string], groupName?: string) => {
      const colItem = (
        <el-col span={16}>
          <el-form-item label={property.label}>
            <p class="item-desc" v-html={property.description}></p>
            {setControl(property)}
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

    const renderLayout = (contents: JSX.Element[]) => (
      <el-form label-position="top">
        <el-row>{contents}</el-row>
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
              elFormItem = getColFormItem(property, groupName)
            } else if (groupName === oldGroupName) {
              elFormItem = getColFormItem(property)
            }
            elements.push(elFormItem)
          }
        })
        return elements
      }
      return setComponents(properties)
    }

    const renderSchemaForm = (properties: Properties) => {
      const schemaForm = renderLayout(getComponents(properties))
      return schemaForm
    }
    return () => <div class="schema-form">{renderSchemaForm(components.value)}</div>
  },
})

export default SchemaForm
