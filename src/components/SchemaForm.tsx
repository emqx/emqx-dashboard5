import { SESSION_FIELDS } from '@/common/constants'
import CommonTLSConfig from '@/components/TLSConfig/CommonTLSConfig.vue'
import useSchemaForm from '@/hooks/Config/useSchemaForm'
import useSchemaRecord from '@/hooks/useSchemaRecord'
import '@/style/schemaForm.scss'
import { Properties } from '@/types/schemaForm'
import { Setting } from '@element-plus/icons-vue'
import _ from 'lodash'
import { computed, defineComponent, onMounted, PropType, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import ArrayEditor from './ArrayEditor.vue'
import InputWithUnit from './InputWithUnit.vue'
import Oneof from './Oneof.vue'
import TimeInputWithUnitSelect from './TimeInputWithUnitSelect.vue'
import useSSL from '@/hooks/useSSL'

interface FormItemMeta {
  col: number
  levelName?: string
}

const typesDoNotNeedGroups = ['bridge']
const typesNeedConciseSSL = ['bridge']
const SSL_PATH_REG = /^(.+\.)?ssl$/i
const SSL_KEY = 'ssl'

const SchemaForm = defineComponent({
  name: 'SchemaForm',
  components: {
    TimeInputWithUnitSelect,
    InputWithUnit,
    ArrayEditor,
    Oneof,
    Setting,
    CommonTLSConfig,
  },
  props: {
    accordingTo: {
      type: Object as PropType<{ path?: string; ref?: string }>,
      required: true,
    },
    form: {
      type: Object as PropType<Record<string, any>>,
      required: false,
    },
    /**
     * when this prop is set to true, the component will init record by schema
     */
    needRecord: {
      type: Boolean,
      default: false,
    },
    btnLoading: {
      type: Boolean,
      default: false,
    },
    canRemoveConfig: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      required: false,
      default: '',
    },
    schemaFilePath: {
      type: String,
    },
    needFooter: {
      type: Boolean,
      default: true,
    },
  },
  setup(props, ctx) {
    const store = useStore()
    const configForm = ref<{ [key: string]: any }>({})
    const schemaLoadPath =
      props.schemaFilePath || `static/hot-config-schema-${store.state.lang}.json`
    const { components } = useSchemaForm(schemaLoadPath, props.accordingTo)
    const { initRecordByComponents } = useSchemaRecord()

    ctx.expose({ configForm })

    const { t } = useI18n()
    const groups = computed(() => {
      let _groups: string[] = []
      if (!typesDoNotNeedGroups.includes(props.type)) {
        const properties = _.cloneDeep(components.value)
        let hasBasicInfo = false
        Object.keys(properties).forEach((key) => {
          const prop = properties[key]
          if (prop.properties) {
            _groups.push(prop.label)
          } else {
            hasBasicInfo = true
          }
        })
        if (hasBasicInfo) {
          _groups = [t('BasicConfig.basic'), ..._groups]
        }
      }
      return _groups
    })
    const currentGroup = ref(groups.value[0] || t('BasicConfig.basic'))

    watch(
      () => props.form,
      (value) => {
        if (value) {
          configForm.value = _.cloneDeep(value)
        }
      },
    )

    watch(components, (val) => {
      if (!props.form && props.needRecord) {
        configForm.value = initRecordByComponents(val)
        handleSSLDataWhenUseConciseSSL()
      }
    })

    const replaceVarPath = (path: string) => {
      let _path = path
      if (/\$\w+/g.test(_path)) {
        // FIXME: default string value is only temporary.
        // Replace the variable characters in the path with real words, e.g. file_handle.$name -> file_handle.default
        _path = _path.replace(/\$\w+/g, 'default')
      }
      return _path
    }
    const resetValue = (property: Properties[string]) => {
      if (!property.path) return
      if (property.default !== undefined && property.default !== null) {
        configForm.value[property.path] = property.default
      }
    }
    const removeValue = (property: Properties[string]) => {
      if (!property.path) return
      Reflect.deleteProperty(configForm.value, property.path)
    }
    const handleModelValueUpdate = (path: string) => {
      const _path = path
      return (event: any) => {
        _.set(configForm.value, _path, event)
      }
    }
    const switchComponent = (property: Properties[string]): JSX.Element | undefined => {
      if (!property.path) return
      property.path = replaceVarPath(property.path)
      const { path } = property

      /**
       * do not use v-model directly because there have some prop in second level
       * like the props under the connector field
       */
      const modelValue = _.get(configForm.value, path)
      const handleUpdateModelValue: any = { 'onUpdate:modelValue': handleModelValueUpdate(path) }
      const stringInput = (
        <el-input
          disabled={property.readOnly}
          placeholder={property.default?.toString()}
          modelValue={modelValue}
          {...handleUpdateModelValue}
          clearable
        ></el-input>
      )
      switch (property.type) {
        case 'string':
          return stringInput
        case 'number':
          return (
            <el-input-number
              controls-position="right"
              disabled={property.readOnly}
              modelValue={modelValue}
              {...handleUpdateModelValue}
              placeholder={property.default?.toString()}
              min={0}
            />
          )
        case 'enum':
          return (
            <el-select
              disabled={property.readOnly}
              placeholder={property.default?.toString()}
              modelValue={modelValue}
              {...handleUpdateModelValue}
              clearable
            >
              {property.symbols?.map((opt) => (
                <el-option value={opt} label={opt} />
              ))}
            </el-select>
          )
        case 'boolean':
          return (
            <el-switch
              disabled={property.readOnly}
              modelValue={modelValue}
              {...handleUpdateModelValue}
            />
          )
        case 'array':
          if (['number', 'string'].includes(property.items.type)) {
            return (
              <array-editor
                modelValue={modelValue}
                {...handleUpdateModelValue}
                disabled={property.readOnly}
                type={property.items.type}
                default={property.default}
              />
            )
          }
          return <div></div>
        case 'duration':
          return (
            <time-input-with-unit-select
              disabled={property.readOnly}
              modelValue={modelValue}
              {...handleUpdateModelValue}
            />
          )
        case 'byteSize':
          return (
            <input-with-unit
              disabled={property.readOnly}
              modelValue={modelValue}
              {...handleUpdateModelValue}
              units={['MB', 'GB', 'KB']}
            />
          )
        case 'percent':
          return (
            <input-with-unit
              disabled={property.readOnly}
              modelValue={modelValue}
              {...handleUpdateModelValue}
              units={['%']}
            />
          )
        case 'comma_separated_string':
          return stringInput
        case 'oneof':
          return (
            <oneof
              modelValue={modelValue}
              {...handleUpdateModelValue}
              items={property.oneOf}
              disabled={property.readOnly}
            />
          )
        case 'ssl':
          return <CommonTLSConfig modelValue={modelValue} {...handleUpdateModelValue} />
        default:
          return stringInput
      }
    }
    const setControl = (property: Properties[string]) => {
      if (property.oneOf && !property.type) {
        property.type = 'oneof'
      }
      if (!property.type) return
      return switchComponent(property)
    }

    const getColFormItem = (property: Properties[string], { col, levelName }: FormItemMeta) => {
      const handleCommand = (command: string) => {
        if (command === 'reset') {
          resetValue(property)
        } else if (command === 'remove') {
          removeValue(property)
        }
      }
      const slots = {
        dropdown: () => (
          <el-dropdown-menu>
            <el-dropdown-item
              command="reset"
              disabled={property.default === undefined || property.readOnly}
            >
              {t('Base.reset')}
            </el-dropdown-item>
            {props.canRemoveConfig ? (
              <el-dropdown-item command="remove">{t('Base.remove')}</el-dropdown-item>
            ) : null}
          </el-dropdown-menu>
        ),
      }
      const colItem = (
        <el-col span={col}>
          {['mqtt', 'session'].includes(props.type) ? null : (
            <el-dropdown
              class="schema-col-setting"
              trigger="click"
              v-slots={slots}
              onCommand={handleCommand}
            >
              <a class="setting-btn">
                <el-icon>
                  <Setting />
                </el-icon>
              </a>
            </el-dropdown>
          )}
          {property.readOnly ? (
            <el-tooltip
              popper-class="read-only-tooltip"
              content={t('BasicConfig.readOnlyTip')}
              placement="right"
              effect="dark"
            >
              <el-form-item label={property.label} prop={property.path}>
                <p class="item-desc" v-html={property.description}></p>
                {setControl(property)}
              </el-form-item>
            </el-tooltip>
          ) : (
            <el-form-item label={property.label} prop={property.path}>
              <p class="item-desc" v-html={property.description}></p>
              {setControl(property)}
            </el-form-item>
          )}
        </el-col>
      )
      // Cluster form add Invite Node component
      if (props.type === 'cluster' && property.path === 'discovery_strategy') {
        const isManualCluster = configForm.value[property.path] === 'manual'
        if (isManualCluster) {
          return (
            <>
              {colItem}
              <el-col span={col}>{ctx.slots['invite-node']?.()}</el-col>
            </>
          )
        }
      }
      if (levelName) {
        return (
          <>
            <el-col span={16}>
              <div class="group-title">{levelName}</div>
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

    const renderLayout = (contents: JSX.Element[]) => {
      const btnStyles = {
        left: store.state.leftBarCollapse ? '104px' : '224px',
      }
      const groupTabs = groups.value.map((group: string) => (
        <el-tab-pane label={group} name={group} />
      ))
      let tabs: JSX.Element | null = (
        <el-tabs type="card" v-model={currentGroup.value} class="group-tabs">
          {groupTabs}
        </el-tabs>
      )
      // FIXME: for MQTT page
      if (['mqtt', 'session'].includes(props.type)) {
        tabs = null
        currentGroup.value = 'mqtt'
      } else if (typesDoNotNeedGroups.includes(props.type)) {
        // for bridge
        tabs = null
      }
      if (props.type === 'log' && currentGroup.value === t('BasicConfig.basic')) {
        currentGroup.value = 'Console Handler'
      }
      return (
        <>
          {tabs}
          <el-form label-position="top">
            <el-row>
              {contents}
              {props.needFooter ? (
                <el-col span={24} class="btn-col" style={btnStyles}>
                  <el-button type="primary" loading={props.btnLoading} onClick={save}>
                    {t('Base.save')}
                  </el-button>
                </el-col>
              ) : (
                ''
              )}
            </el-row>
          </el-form>
        </>
      )
    }

    /**
     * called after init record
     */
    const { createSSLForm } = useSSL()
    const SSLDataNeedKeys = Object.keys(createSSLForm())
    const handleSSLDataWhenUseConciseSSL = () => {
      if (!typesNeedConciseSSL.includes(props.type)) {
        return
      }
      const walk = (record: Record<string, any>) => {
        Object.keys(record).forEach((key) => {
          const propItem = record[key]
          if (typeof propItem === 'object') {
            if (key === SSL_KEY && 'enable' in propItem) {
              record[key] = _.pick(propItem, SSLDataNeedKeys)
            } else {
              walk(propItem)
            }
          }
        })
      }
      walk(configForm.value)
    }

    // Get the components to render form by Propoerties
    const getComponents = (properties: Properties, meta: FormItemMeta) => {
      let [levelName, oldLevelName] = [meta.levelName || '', '']
      const elements: JSX.Element[] = []
      let _properties: Properties = {}
      // Filter the current Group properties
      for (const key in properties) {
        const propItem = properties[key]
        if (propItem.properties) {
          if (currentGroup.value === propItem.label) {
            // for hot configuration
            _properties = propItem?.properties
            break
          } else if (typesDoNotNeedGroups.includes(props.type)) {
            // for bridge
            _properties = { ..._properties, ...propItem?.properties }
          }
        }
        if (!propItem.properties) {
          _properties[key] = propItem
        }
      }
      const setComponents = (properties: Properties) => {
        Object.keys(properties).forEach((key) => {
          const property = properties[key]
          // for concise SSL
          const isSSLAndNeedConcise =
            SSL_PATH_REG.test(key) && typesNeedConciseSSL.includes(props.type)
          if (isSSLAndNeedConcise) {
            Reflect.deleteProperty(property, 'properties')
            property.type = 'ssl'
          }
          if (props.type === 'mqtt') {
            if (SESSION_FIELDS.includes(key)) {
              return
            }
          }
          if (props.type === 'session') {
            if (!SESSION_FIELDS.includes(key)) {
              return
            }
          }
          if (property.properties) {
            const { label, properties } = property
            levelName = label
            setComponents(properties)
          } else {
            let elFormItem = <></>
            if (levelName !== oldLevelName) {
              oldLevelName = levelName
              elFormItem = getColFormItem(property, { levelName, col: meta.col })
            } else if (levelName === oldLevelName) {
              elFormItem = getColFormItem(property, { col: meta.col })
            }
            elements.push(elFormItem)
          }
        })
        return elements
      }
      return setComponents(_properties)
    }
    const renderSchemaForm = (properties: Properties) => {
      const schemaForm = renderLayout(getComponents(properties, { col: 16 }))
      return schemaForm
    }

    onMounted(() => {
      if (props.form) {
        configForm.value = _.cloneDeep(props.form)
      }
    })

    return () => <div class="schema-form">{renderSchemaForm(components.value)}</div>
  },
})

export default SchemaForm
