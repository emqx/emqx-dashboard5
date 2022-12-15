import { SESSION_FIELDS } from '@/common/constants'
import { createRandomString, escapeCode, transLink, isEmptyObj } from '@/common/tools'
import InfoTooltip from '@/components/InfoTooltip.vue'
import Monaco from '@/components/Monaco.vue'
import CommonTLSConfig from '@/components/TLSConfig/CommonTLSConfig.vue'
import useSchemaForm from '@/hooks/Config/useSchemaForm'
import useI18nTl from '@/hooks/useI18nTl'
import useSchemaRecord from '@/hooks/useSchemaRecord'
import useSSL from '@/hooks/useSSL'
import { Properties, Property } from '@/types/schemaForm'
import { Setting } from '@element-plus/icons-vue'
import _ from 'lodash'
import { computed, defineComponent, onMounted, PropType, ref, watch, watchEffect } from 'vue'
import { useStore } from 'vuex'
import ArrayEditor from './ArrayEditor.vue'
import InputWithUnit from './InputWithUnit.vue'
import Oneof from './Oneof.vue'
import TimeInputWithUnitSelect from './TimeInputWithUnitSelect.vue'

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
    ArrayEditorTable,
    InfoTooltip: InfoTooltip as any,
    Monaco,
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
    formItemSpan: {
      type: Number,
      default: 16,
    },
    useTooltipShowDesc: {
      type: Boolean,
      default: false,
    },
    /**
     * disable by path
     */
    propsDisabled: {
      type: Array as PropType<Array<string>>,
    },
    /**
     * sort prop by KEY
     * FIXME: No consideration of level now
     */
    propsOrderMap: {
      type: Object as PropType<Record<string, number>>,
    },
    /**
     * set by path
     */
    customColClass: {
      type: Object as PropType<Record<string, string>>,
    },
    /**
     * set by path
     */
    customLabelMap: {
      type: Object as PropType<Record<string, string>>,
    },
    needRules: {
      type: Boolean,
      default: true,
    },
    arrayEditorType: {
      type: String as PropType<'select' | 'table'>,
      default: 'select',
    },
    /**
     * bind function that does some customization of the form data and form rules after it has been generated according to the schema data
     */
    dataHandler: {
      type: Function,
    },
  },
  setup(props, ctx) {
    const store = useStore()
    const configForm = ref<{ [key: string]: any }>({})
    const schemaLoadPath =
      props.schemaFilePath || `static/hot-config-schema-${store.state.lang}.json`
    const { components, rules, resetObjForGetComponent } = useSchemaForm(
      schemaLoadPath,
      props.accordingTo,
      props.needRules,
    )

    const { initRecordByComponents } = useSchemaRecord()

    const formCom = ref()

    const { t, tl } = useI18nTl('BasicConfig')

    // Record<string(type), Array<string>>
    const customGroups: Record<string, Array<string>> = {
      mqtt: ['mqtt'],
      session: ['mqtt'],
      sysmon: ['vm', 'os'],
    }
    const groups = computed(() => {
      let _groups: string[] = []
      if (typesDoNotNeedGroups.includes(props.type)) {
        return _groups
      }
      if (Object.keys(customGroups).includes(props.type)) {
        return customGroups[props.type]
      }
      const properties = _.cloneDeep(components.value)
      let hasBasicInfo = false
      Object.keys(properties).forEach((key) => {
        const prop = properties[key]
        if (prop.properties) {
          _groups.push(key)
        } else {
          hasBasicInfo = true
        }
      })
      if (hasBasicInfo) {
        _groups = [tl('basic'), ..._groups]
      }
      return _groups
    })

    const currentGroup = ref(groups.value[0] || tl('basic'))

    watch(
      () => props.form,
      (value) => {
        if (value && !_.isEqual(value, configForm.value)) {
          configForm.value = _.cloneDeep(value)
        }
      },
    )

    watch(components, (val) => {
      if ((!props.form || isEmptyObj(props.form)) && props.needRecord) {
        configForm.value = initRecordByComponents(val)
        if (typesNeedConciseSSL.includes(props.type)) {
          configForm.value = handleSSLDataWhenUseConciseSSL(configForm.value)
        }
      }
      handleComponentsData()
      initCurrentGroup()
    })

    watch(
      () => props.accordingTo,
      async (nVal, oVal) => {
        if (!_.isEqual(nVal, oVal)) {
          const oldComponent = _.cloneDeep(components.value)
          const oldRecord = _.cloneDeep(configForm.value)
          resetObjForGetComponent(nVal)

          // because change accordingTo will not reset parent component form value
          // so we need get new form and emit to parent for compare
          let newRecord = initRecordByComponents(components.value)
          if (typesNeedConciseSSL.includes(props.type)) {
            newRecord = handleSSLDataWhenUseConciseSSL(newRecord)
          }

          ctx.emit('component-change', {
            oldVal: { components: oldComponent, record: oldRecord },
            newVal: { components: components.value, record: newRecord },
          })
        }
      },
    )

    watchEffect(() => {
      ctx.emit('update', configForm.value)
    })

    const initCurrentGroup = () => {
      currentGroup.value = groups.value[0] || tl('basic')
    }

    const validate = () => {
      if (formCom.value?.validate) {
        return formCom.value.validate()
      }
      return Promise.resolve()
    }

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

    const confirmPropertyDisabled = (property: Property) => {
      const { readOnly, path } = property
      const { propsDisabled } = props
      return readOnly || (propsDisabled && path && propsDisabled.includes(path))
    }

    const switchComponent = (property: Properties[string]): JSX.Element | undefined => {
      if (!property.path) return
      property.path = replaceVarPath(property.path)
      const { path, format } = property
      const isPropertyDisabled = confirmPropertyDisabled(property)

      /**
       * do not use v-model directly because there have some prop in second level
       * like the props under the connector field
       */
      const modelValue = _.get(configForm.value, path)
      const handleUpdateModelValue: any = { 'onUpdate:modelValue': handleModelValueUpdate(path) }
      const inputType = format === 'password' ? 'password' : 'text'
      const autocomplete = inputType === 'password' ? 'one-time-code' : ''
      const stringInput = (
        <el-input
          disabled={isPropertyDisabled}
          placeholder={property.default?.toString()}
          modelValue={modelValue}
          type={inputType}
          autocomplete={autocomplete}
          {...handleUpdateModelValue}
          clearable
        />
      )
      // TODO: use SchemaFormItem
      switch (property.type) {
        case 'string':
          return stringInput
        case 'number':
          return (
            <el-input-number
              controls-position="right"
              disabled={isPropertyDisabled}
              modelValue={modelValue}
              {...handleUpdateModelValue}
              placeholder={property.default?.toString()}
              min={0}
            />
          )
        case 'enum':
          return (
            <el-select
              disabled={isPropertyDisabled}
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
              disabled={isPropertyDisabled}
              modelValue={modelValue}
              {...handleUpdateModelValue}
            />
          )
        case 'array':
          if (['number', 'string'].includes(property.items.type)) {
            if (props.arrayEditorType === 'select') {
              return (
                <array-editor
                  modelValue={modelValue}
                  {...handleUpdateModelValue}
                  disabled={isPropertyDisabled}
                  type={property.items.type}
                  default={property.default}
                />
              )
            }
            return (
              <ArrayEditorTable
                modelValue={modelValue}
                {...handleUpdateModelValue}
                disabled={isPropertyDisabled}
              />
            )
          }
          return <div></div>
        case 'duration':
          return (
            <time-input-with-unit-select
              disabled={isPropertyDisabled}
              modelValue={modelValue}
              {...handleUpdateModelValue}
            />
          )
        case 'byteSize':
          return (
            <input-with-unit
              disabled={isPropertyDisabled}
              modelValue={modelValue}
              {...handleUpdateModelValue}
              units={['MB', 'GB', 'KB']}
            />
          )
        case 'percent':
          return (
            <input-with-unit
              disabled={isPropertyDisabled}
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
              disabled={isPropertyDisabled}
            />
          )
        case 'ssl':
          return (
            <CommonTLSConfig
              modelValue={modelValue}
              isEdit={!!props.form}
              {...handleUpdateModelValue}
            />
          )
        case 'sql':
          return (
            <div class="monaco-container">
              <Monaco
                id={createRandomString()}
                modelValue={modelValue}
                {...handleUpdateModelValue}
                lang="sql"
                disabled={isPropertyDisabled}
              />
            </div>
          )
        default:
          return stringInput
      }
    }

    const setControl = (property: Properties[string]) => {
      if (property.oneOf && !property.type) {
        property.type = 'oneof'
      } else if (property.format === 'sql' && property.type === 'string') {
        property.type = 'sql'
      }
      if (!property.type) return
      return switchComponent(property)
    }

    const getLabel = ({ label, path }: Property) => {
      if (!props.customLabelMap || !path || !(path in props.customLabelMap)) {
        return label
      }
      return props.customLabelMap[path]
    }

    const getLabelSlotAndDescEle = (property: Property) => {
      const { description } = property
      const label = getLabel(property)

      const descContent = <p class="item-desc" v-html={escapeCode(transLink(description))}></p>

      const labelSlot: any = {}
      let descEle: any = null

      if (props.useTooltipShowDesc) {
        const tooltipSlots = {
          content: () => descContent,
        }

        // if field is SQL-like field, tooltip can be wider for show SQL template.
        const popperClass = property.format === 'sql' ? 'is-wider' : ''
        // FIXME: remove popperClass hack
        labelSlot.label = () => (
          <label>
            <span>{label}</span>
            <InfoTooltip {...{ popperClass }} v-slots={tooltipSlots} />
          </label>
        )
      } else {
        descEle = descContent
      }
      return {
        labelSlot,
        descEle,
      }
    }

    /**
     * if property with special col span, return it, else return undefined
     */
    const getColSpan = ({ path, format }: Property): number | undefined => {
      if (!path) {
        return
      }
      if (SSL_PATH_REG.test(path) || format === 'sql') {
        return 24
      }
      return
    }

    const getColClass = ({ path }: Property) => {
      if (!props.customColClass || !path || !(path in props.customColClass)) {
        return ''
      }
      return props.customColClass[path]
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

      const { labelSlot, descEle } = getLabelSlotAndDescEle(property)
      const colSpan = getColSpan(property) || col
      const colClass = getColClass(property)

      const colItem = (
        <el-col span={colSpan} class={colClass}>
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
              content={tl('readOnlyTip')}
              placement="right"
              effect="dark"
            >
              <el-form-item v-slots={labelSlot} label={property.label} prop={property.path}>
                {descEle}
                {setControl(property)}
              </el-form-item>
            </el-tooltip>
          ) : (
            <el-form-item v-slots={labelSlot} label={property.label} prop={property.path}>
              {descEle}
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

      let groupTabs = null
      let tabs: JSX.Element | null = null
      // do not show tabs when there are just one tab(i think, maybe) or is bridge
      if (!(typesDoNotNeedGroups.includes(props.type) || groups.value.length === 1)) {
        groupTabs = groups.value.map((group: string) => (
          // There is no content inside the tab pane, and the renderSchemaForm function
          // is retriggered after the tab switch to change the content
          <el-tab-pane label={tl(group)} name={group} />
        ))
        tabs = (
          <el-tabs type="card" v-model={currentGroup.value} class="group-tabs">
            {groupTabs}
          </el-tabs>
        )
      }
      return (
        <>
          {tabs}
          <el-form
            ref={formCom}
            label-position="top"
            rules={rules.value}
            model={configForm.value}
            validate-on-rule-change={false}
          >
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
    const handleSSLDataWhenUseConciseSSL = (data: Record<string, any>) => {
      const walk = (record: Record<string, any>) => {
        Object.keys(record).forEach((key) => {
          const propItem = record[key]
          if (typeof propItem === 'object') {
            if (key === SSL_KEY && 'enable' in propItem) {
              record[key] = createSSLForm()
            } else {
              walk(propItem)
            }
          }
        })
      }
      walk(data)
      return data
    }

    const sortPropKeys = (propKeys: Array<string>) => {
      if (!props.propsOrderMap) {
        return propKeys
      }
      const ret = propKeys
      const { propsOrderMap } = props

      // Sort roughly first, then sort finely
      const propsOrderList = Object.entries(propsOrderMap).sort(
        (item1, item2) => item1[1] - item2[1],
      )
      for (let index = 0; index < propsOrderList.length; index++) {
        const [key, order] = propsOrderList[index]
        const propOldIndex = propKeys.findIndex((k) => k === key)
        if (propOldIndex > -1) {
          ret.splice(propOldIndex, 1)
          ret.splice(order, 0, key)
        }
      }
      ret.sort((pre, next) => {
        if (pre in propsOrderMap && next in propsOrderMap) {
          return propsOrderMap[pre] - propsOrderMap[next]
        }
        return 0
      })
      return ret
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
          if (currentGroup.value === propItem.path) {
            // for hot configuration
            _properties = propItem?.properties
            break
          } else if (typesDoNotNeedGroups.includes(props.type)) {
            // for bridge
            const isSSLAndNeedConcise =
              SSL_PATH_REG.test(propItem?.path || '') && typesNeedConciseSSL.includes(props.type)
            if (isSSLAndNeedConcise) {
              Reflect.deleteProperty(propItem, 'properties')
              propItem.type = 'ssl'
            }
            _properties = { ..._properties, ...propItem.properties }
          }
        }
        if (!propItem.properties) {
          _properties[key] = propItem
        }
      }
      const setComponents = (properties: Properties) => {
        const propKeys = sortPropKeys(Object.keys(properties))
        propKeys.forEach((key) => {
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
      const schemaForm = renderLayout(getComponents(properties, { col: props.formItemSpan }))
      return schemaForm
    }

    const handleComponentsData = () => {
      if (props.dataHandler && _.isFunction(props.dataHandler)) {
        const data = props.dataHandler({ components: components.value, rules: rules.value })
        components.value = data.components
        rules.value = data.rules
      }
    }

    onMounted(() => {
      if (props.form && _.isObject(props.form) && !isEmptyObj(props.form)) {
        configForm.value = _.cloneDeep(props.form)
      }
      handleComponentsData()
    })

    ctx.expose({ configForm, validate })

    return () => <div class="schema-form">{renderSchemaForm(components.value)}</div>
  },
})

export default SchemaForm
