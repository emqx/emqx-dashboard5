import { SESSION_FIELDS } from '@/common/constants'
import { createRandomString, waitAMoment } from '@/common/tools'
import { isEmptyObj } from '@emqx/shared-ui-utils'
import ArrayEditorTable from '@/components/ArrayEditorTable.vue'
import CustomInputNumber from '@/components/CustomInputNumber.vue'
import InfoTooltip from '@/components/InfoTooltip.vue'
import InputSelect from '@/components/InputSelect.vue'
import MarkdownContent from '@/components/MarkdownContent.vue'
import Monaco from '@/components/Monaco.vue'
import CommonTLSConfig from '@/components/TLSConfig/CommonTLSConfig.vue'
import TextareaWithUploader from '@/components/TextareaWithUploader.vue'
import useItemLabelAndDesc from '@/hooks/Schema/useItemLabelAndDesc'
import useSchemaForm from '@/hooks/Schema/useSchemaForm'
import useSchemaRecord from '@/hooks/Schema/useSchemaRecord'
import useI18nTl from '@/hooks/useI18nTl'
import useSSL from '@/hooks/useSSL'
import { Properties, Property } from '@/types/schemaForm'
import { Setting } from '@element-plus/icons-vue'
import _ from 'lodash'
import { PropType, computed, defineComponent, ref, watch, watchEffect } from 'vue'
import { useStore } from 'vuex'
import AdvancedSettingContainer from './AdvancedSettingContainer.vue'
import ArrayEditor from './ArrayEditor.vue'
import ArrayEditorInput from './ArrayEditorInput.vue'
import InputWithUnit from './InputWithUnit.vue'
import ObjectArrayEditor from './ObjectArrayEditor.vue'
import Oneof from './Oneof.vue'
import OneofRefs from './OneofRefs.vue'
import TimeInputWithUnitSelect from './TimeInputWithUnitSelect.vue'

interface FormItemMeta {
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
    ArrayEditorInput,
    ArrayEditorTable,
    Oneof,
    Setting,
    CommonTLSConfig,
    InfoTooltip,
    Monaco,
    TextareaWithUploader,
    MarkdownContent,
    CustomInputNumber,
    InputSelect,
    AdvancedSettingContainer,
  },
  props: {
    accordingTo: {
      type: Object as PropType<{ path?: string; ref?: string | Array<string> }>,
      required: true,
    },
    form: {
      type: Object as PropType<Record<string, any>>,
      required: false,
    },
    recordLoading: {
      type: Boolean,
      default: false,
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
      default: 21,
    },
    // FIXME: remove this, use `dataHandler`
    /**
     * disable by path
     */
    propsDisabled: {
      type: Array as PropType<Array<string>>,
    },
    /**
     * sort prop by KEY
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
    needRules: {
      type: Boolean,
      default: true,
    },
    /**
     * bind function that does some customization of the form data and form rules after it has been generated according to the schema data
     */
    dataHandler: {
      type: Function,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    formProps: {
      type: Object as PropType<Record<string, any>>,
      default: () => ({}),
    },
    /**
     * Advanced configuration is collapsed by default
     * https://www.figma.com/file/NJrNmLEpcZfYkDv381iGNG/EMQX-Dashboard?node-id=6202%3A76959&mode=dev
     */
    advancedFields: {
      type: Array as PropType<Array<string>>,
    },
  },
  setup(props, ctx) {
    const store = useStore()
    const configForm = ref<{ [key: string]: any }>({})
    const schemaLoadPath = props.schemaFilePath || '/api/v5/schemas/hotconf'
    const { components, rules, setTypeForProperty, resetObjForGetComponent } = useSchemaForm(
      schemaLoadPath,
      props.accordingTo,
      props.needRules,
    )

    const { initRecordByComponents } = useSchemaRecord()

    let formEle: any = null

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

    const initCurrentGroup = () => {
      currentGroup.value = groups.value[0] || tl('basic')
    }

    const validate = () => {
      if (formCom.value?.validate) {
        return formCom.value.validate()
      }
      return Promise.resolve()
    }

    const clearValidate = () => formCom.value?.clearValidate?.()

    const replaceVarPath = (path: string) => {
      let _path = path
      if (/\$\w+/g.test(_path)) {
        // FIXME: default string value is only temporary.
        // Replace the variable characters in the path with real words, e.g. file_handle.$name -> file_handle.default
        _path = _path.replace(/\$\w+/g, 'default')
      }
      return _path
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

    const isComplexOneof = (prop: Property) =>
      prop.type === 'oneof' && prop.oneOf?.some(({ $ref, symbols }) => $ref || symbols)

    const { getText, getOptLabel } = useItemLabelAndDesc(props)
    const switchComponent = (property: Properties[string]): JSX.Element | undefined => {
      if (!property.path) return
      property.path = replaceVarPath(property.path)
      const { path, format, clearable } = property
      const isPropertyDisabled = confirmPropertyDisabled(property)

      /**
       * do not use v-model directly because there have some prop in second level
       * like the props under the connector field
       */
      const modelValue = _.get(configForm.value, path)
      const handleUpdateModelValue: any = { 'onUpdate:modelValue': handleModelValueUpdate(path) }
      const inputType = format === 'password' ? 'password' : 'text'
      const autocomplete = inputType === 'password' ? 'one-time-code' : ''
      const showPassword = inputType === 'password'
      const clearableValue = typeof clearable === 'boolean' ? clearable : true
      const customProps = property.componentProps || {}

      const stringInput = (
        <el-input
          disabled={isPropertyDisabled}
          placeholder={property.default?.toString()}
          modelValue={modelValue}
          type={inputType}
          autocomplete={autocomplete}
          showPassword={showPassword}
          {...handleUpdateModelValue}
          clearable
          {...customProps}
        />
      )
      // TODO: use SchemaFormItem
      switch (property.type) {
        case 'string':
          if (property.key === 'name' && property.symbols) {
            return (
              <InputSelect
                modelValue={modelValue}
                {...handleUpdateModelValue}
                options={property.symbols}
                {...customProps}
              />
            )
          }
          return stringInput
        case 'number':
          return (
            <CustomInputNumber
              disabled={isPropertyDisabled}
              modelValue={modelValue}
              {...handleUpdateModelValue}
              placeholder={property.default?.toString()}
              min={0}
              {...customProps}
            />
          )
        case 'enum':
          return (
            <el-select
              disabled={isPropertyDisabled}
              placeholder={property.default?.toString()}
              modelValue={modelValue}
              {...handleUpdateModelValue}
              clearable={clearableValue}
              {...customProps}
            >
              {property.symbols?.map((opt) => (
                <el-option value={opt} label={getOptLabel(opt)} />
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
            if (property.items.component === 'input') {
              return (
                <ArrayEditorInput
                  modelValue={modelValue}
                  {...handleUpdateModelValue}
                  disabled={isPropertyDisabled}
                  {...customProps}
                />
              )
            } else if (property.items.component === 'table') {
              return (
                <ArrayEditorTable
                  modelValue={modelValue}
                  {...handleUpdateModelValue}
                  disabled={isPropertyDisabled}
                  {...customProps}
                />
              )
            }
            return (
              <array-editor
                modelValue={modelValue}
                {...handleUpdateModelValue}
                disabled={isPropertyDisabled}
                type={property.items.type}
                default={property.default}
                {...customProps}
              />
            )
          } else if (property.items.path && property.items.properties) {
            const editMode = props.formProps?.labelPosition === 'right' ? 'list' : 'table'
            return (
              <ObjectArrayEditor
                modelValue={modelValue}
                {...handleUpdateModelValue}
                properties={property.items.properties}
                propKey={property.items.path}
                editMode={editMode}
                {...customProps}
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
              {...customProps}
            />
          )
        case 'byteSize':
          return (
            <input-with-unit
              disabled={isPropertyDisabled}
              modelValue={modelValue}
              {...handleUpdateModelValue}
              units={['MB', 'GB', 'KB']}
              {...customProps}
            />
          )
        case 'percent':
          return (
            <input-with-unit
              disabled={isPropertyDisabled}
              modelValue={modelValue}
              {...handleUpdateModelValue}
              units={['%']}
              {...customProps}
            />
          )
        case 'comma_separated_string':
          return stringInput
        case 'oneof': {
          const props = {
            modelValue,
            ...handleUpdateModelValue,
            items: property.oneOf,
            disabled: isPropertyDisabled,
          }
          return isComplexOneof(property) ? (
            <OneofRefs {...props} path={property.path} span={getColSpan(property)} />
          ) : (
            <oneof {...props} />
          )
        }
        case 'ssl':
          return (
            <CommonTLSConfig
              modelValue={modelValue}
              isEdit={!!props.form}
              {...handleUpdateModelValue}
              {...customProps}
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
        case 'file':
          return (
            <TextareaWithUploader
              modelValue={modelValue}
              {...handleUpdateModelValue}
              {...customProps}
            />
          )
        default:
          return stringInput
      }
    }

    const typesShowValueDirectly = [
      'string',
      'number',
      'duration',
      'byteSize',
      'percent',
      'comma_separated_string',
      'oneof',
      'file',
    ]
    const getEleForReadonly = (property: Properties[string]): JSX.Element | undefined => {
      if (!property.path) return
      property.path = replaceVarPath(property.path)
      const { path, type } = property

      /**
       * do not use v-model directly because there have some prop in second level
       * like the props under the connector field
       */
      const modelValue = _.get(configForm.value, path)
      if (typesShowValueDirectly.includes(type)) {
        return <p class="value">{modelValue}</p>
      }
      switch (type) {
        case 'enum':
          return <p class="value">{getOptLabel(modelValue)}</p>
        case 'boolean':
          return switchComponent({ ...property, readOnly: true })
        case 'sql':
          return switchComponent({ ...property, readOnly: true })
        case 'array': {
          const ele = switchComponent({ ...property })
          if (ele?.props) {
            ele.props.readonly = true
          }
          return ele
        }
        case 'ssl': {
          const ele = switchComponent({ ...property, readOnly: true })
          if (ele?.props) {
            ele.props.readonly = true
          }
          return ele
        }
        default:
          return <p class="value">{modelValue}</p>
      }
    }

    const setControl = (property: Properties[string]) => {
      if (!property.type) return
      const prop = setTypeForProperty(property)
      return !props.readonly ? switchComponent(prop) : getEleForReadonly(prop)
    }

    const getLabelSlot = (property: Property) => {
      const { label, desc } = getText(property)
      // if field is SQL-like field, tooltip can be wider for show SQL template.
      const popperClass = property.format === 'sql' ? 'is-wider' : ''
      // FIXME: remove popperClass hack
      const labelSlot: any = {
        label: () => (
          <>
            <span>{label}</span>
            {desc ? <InfoTooltip {...{ popperClass }} v-slots={tooltipSlots} /> : null}
          </>
        ),
      }
      const tooltipSlots = {
        content: () => <MarkdownContent content={desc} gutter={0} />,
      }
      return labelSlot
    }

    /**
     * if property with special col span, return it, else return undefined
     */
    const getColSpan = ({ path, format, type }: Property): number | undefined => {
      if ((path && SSL_PATH_REG.test(path)) || format === 'sql' || type === 'array') {
        return 24
      }
      return props.formItemSpan
    }

    const getColClass = ({ path }: Property) => {
      if (!props.customColClass || !path || !(path in props.customColClass)) {
        return ''
      }
      return props.customColClass[path]
    }

    const getColFormItem = (property: Properties[string], { levelName }: FormItemMeta = {}) => {
      const labelSlot = getLabelSlot(property)
      const colSpan = getColSpan(property)
      const colClass = getColClass(property)
      const bindProps = { label: property.label, prop: property.path }
      const formItemContent = setControl(property)

      /**
       * Because there may be several fields that need to be arranged in order,
       * there is no need to wrap them with el-col
       */
      const doNotNeedWrap = isComplexOneof(property)

      const colItem = doNotNeedWrap ? (
        formItemContent || <div></div>
      ) : (
        <el-col span={colSpan} class={colClass} key={property.path}>
          {property.readOnly ? (
            <el-tooltip
              popper-class="read-only-tooltip"
              content={tl('readOnlyTip')}
              placement="right"
              effect="dark"
            >
              <el-form-item v-slots={labelSlot} {...bindProps}>
                {formItemContent}
              </el-form-item>
            </el-tooltip>
          ) : (
            <el-form-item v-slots={labelSlot} {...bindProps}>
              {formItemContent}
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
              <el-col span={colSpan}>{ctx.slots['invite-node']?.()}</el-col>
            </>
          )
        }
      }
      if (levelName) {
        return (
          <>
            <el-col span={23}>
              <el-divider />
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

    const defaultFormProps = { class: 'configuration-form', labelPosition: 'right' }
    const getFormProps = () => ({ ...defaultFormProps, ...(props.formProps || {}) })
    const rowGutter = computed(() => (props.formItemSpan <= 12 ? 24 : 0))

    const renderLayout = (contents: JSX.Element[]) => {
      const btnStyles = store.getters.configPageBtnStyle

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
          <el-tabs v-model={currentGroup.value} class="group-tabs">
            {groupTabs}
          </el-tabs>
        )
      }

      return (
        <>
          {tabs}
          <el-form
            ref={formCom}
            {...getFormProps()}
            rules={rules.value}
            model={configForm.value}
            validate-on-rule-change={false}
          >
            <el-row gutter={rowGutter.value}>
              {contents}
              {props.needFooter ? (
                <el-col span={24} class="btn-col" style={btnStyles}>
                  <el-button type="primary" loading={props.btnLoading} onClick={save}>
                    {t('Base.saveChanges')}
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
      const walkData = (record: Record<string, any>) => {
        Object.keys(record).forEach((key) => {
          const propItem = record[key]
          if (typeof propItem === 'object') {
            if (key === SSL_KEY && 'enable' in propItem && propItem.enable === false) {
              record[key] = createSSLForm()
            } else {
              walkData(propItem)
            }
          }
        })
      }
      walkData(data)
      return data
    }

    const handleSSLRuleWhenUseConciseSSL = (rules: any) => {
      // Remove this after correct rule
      const walkRule = (rules: any) => {
        Object.keys(rules).forEach((key) => {
          const propItem = rules[key]
          if (typeof propItem === 'object') {
            if (key === SSL_KEY) {
              Reflect.deleteProperty(rules, key)
            } else {
              walkRule(propItem)
            }
          }
        })
      }
      walkRule(rules)
      return rules
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

    const generatePropertiesUsePathAsKey = (properties: Properties) => {
      return Object.keys(properties).reduce((obj, currentKey) => {
        const prop = properties[currentKey]
        const path = prop.path as string
        return { ...obj, [path]: prop }
      }, {})
    }

    const isSSLPropAndNeedConcise = (keyOrPath: string) =>
      SSL_PATH_REG.test(keyOrPath) && typesNeedConciseSSL.includes(props.type)
    const handlePropertyWhenUseConciseSSL = (property: Property) => {
      property.type = 'ssl'
      return property
    }

    const getAdvancedBlock = (elements: JSX.Element[]) => {
      return (
        <el-col span={24}>
          <AdvancedSettingContainer>
            <el-row gutter={rowGutter.value}>{elements}</el-row>
          </AdvancedSettingContainer>
        </el-col>
      )
    }
    // Get the components to render form by Properties
    const getComponents = (properties: Properties, meta: FormItemMeta = {}) => {
      let [levelName, oldLevelName] = [meta.levelName || '', '']
      const elements: JSX.Element[] = []
      /**
       * put props.advancedFields to this
       */
      const advancedFieldElement: JSX.Element[] = []
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
            const isSSLAndNeedConcise = isSSLPropAndNeedConcise(propItem?.path || '')
            if (isSSLAndNeedConcise) {
              handlePropertyWhenUseConciseSSL(propItem)
              _properties[propItem.path as string] = propItem
            } else if (propItem.properties) {
              _properties = {
                ..._properties,
                ...generatePropertiesUsePathAsKey(propItem.properties),
              }
            }
          }
        }
        if (!propItem.properties) {
          _properties[propItem.path as string] = propItem
        }
      }

      const setComponents = (properties: Properties) => {
        const propKeys = sortPropKeys(Object.keys(properties))
        propKeys.forEach((key) => {
          const property = properties[key]
          const propKey = property.key as string
          // for concise SSL
          // TODO: can delete it after check
          const isSSLAndNeedConcise = isSSLPropAndNeedConcise(propKey)
          if (isSSLAndNeedConcise) {
            handlePropertyWhenUseConciseSSL(property)
          }
          if (props.type === 'mqtt') {
            if (SESSION_FIELDS.includes(propKey)) {
              return
            }
          }
          if (props.type === 'session') {
            if (!SESSION_FIELDS.includes(propKey)) {
              return
            }
          }

          if (property.properties && !isSSLAndNeedConcise) {
            const { label, properties } = property
            levelName = label
            setComponents(properties)
          } else {
            let elFormItem = <></>
            if (levelName !== oldLevelName) {
              oldLevelName = levelName
              elFormItem = getColFormItem(property, { levelName })
            } else if (levelName === oldLevelName) {
              elFormItem = getColFormItem(property)
            }
            if (props.advancedFields?.length && props.advancedFields.includes(key)) {
              advancedFieldElement.push(elFormItem)
            } else {
              elements.push(elFormItem)
            }
          }
        })
        return elements
      }

      const ret = setComponents(_properties)
      if (advancedFieldElement.length) {
        ret.push(getAdvancedBlock(advancedFieldElement))
      }

      return ret
    }
    const renderSchemaForm = (properties: Properties) => {
      if (Object.keys(properties).length === 0) {
        // Initialize with an empty object, do not modify the loading variable at this point.
        formEle = null
      } else {
        formLoading.value = false
        ctx.emit('schema-loaded')
        formEle = renderLayout(getComponents(properties))
      }
      return formEle
    }

    const handleComponentsData = async () => {
      if (props.dataHandler && _.isFunction(props.dataHandler)) {
        const data = await props.dataHandler({ components: components.value, rules: rules.value })
        components.value = data.components
        rules.value = data.rules
      }
    }

    const getInitRecord = () => {
      let record = initRecordByComponents(components.value)
      if (typesNeedConciseSSL.includes(props.type)) {
        record = handleSSLDataWhenUseConciseSSL(record)
      }
      return record
    }

    const init = async () => {
      await handleComponentsData()
      initCurrentGroup()
      if (props.needRecord) {
        configForm.value = { ...getInitRecord(), ...(_.isObject(props.form) ? props.form : {}) }
        ctx.emit('init', configForm.value)
      }
      handleSSLRuleWhenUseConciseSSL(rules.value)
    }

    watch(
      () => props.form,
      (value) => {
        if (value && !_.isEqual(value, configForm.value)) {
          configForm.value = _.cloneDeep(value)
        }
      },
    )

    watch(components, init)

    watch(
      () => props.accordingTo,
      async (nVal, oVal) => {
        if (!_.isEqual(nVal, oVal)) {
          const oldComponent = _.cloneDeep(components.value)
          const oldRecord = _.cloneDeep(configForm.value)
          resetObjForGetComponent(nVal)
          // Wait until the init function is called, and then process the record
          await waitAMoment()
          // because change accordingTo will not reset parent component form value
          // so we need get new form and emit to parent for compare
          let newRecord = initRecordByComponents(components.value)
          if (typesNeedConciseSSL.includes(props.type)) {
            newRecord = handleSSLDataWhenUseConciseSSL(newRecord)
            handleSSLRuleWhenUseConciseSSL(rules.value)
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

    const formLoading = ref(true)
    const showSkeleton = computed(
      () => (formLoading.value || props.recordLoading) && props.type !== 'bridge',
    )
    const showLoading = computed(
      () => (formLoading.value || props.recordLoading) && props.type === 'bridge',
    )
    ;(() => {
      if (props.form && _.isObject(props.form) && !isEmptyObj(props.form)) {
        configForm.value = _.cloneDeep(props.form)
      }
      init()
    })()

    ctx.expose({ configForm, validate, clearValidate, getInitRecord })

    return () => {
      return (
        <div
          class={`schema-form ${showSkeleton.value || showLoading.value ? 'is-loading' : ''}`}
          v-loading={showLoading.value}
        >
          {showSkeleton.value ? <el-skeleton rows={12} animated={true} /> : null}
          {renderSchemaForm(components.value)}
        </div>
      )
    }
  },
})

export default SchemaForm
