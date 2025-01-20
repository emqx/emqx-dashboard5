import { INTEGRATION_SCHEMA_TYPES, SESSION_FIELDS } from '@/common/constants'
import { createRandomString, getAPIPath, waitAMoment } from '@/common/tools'
import { isEmptyObj } from '@emqx/shared-ui-utils'
import ArrayEditorTable from '@/components/ArrayEditorTable.vue'
import CustomInputNumber from '@/components/CustomInputNumber.vue'
import InfoTooltip from '@/components/InfoTooltip.vue'
import MarkdownContent from '@/components/MarkdownContent.vue'
import Monaco from '@/components/Monaco.vue'
import CommonTLSConfig from '@/components/TLSConfig/CommonTLSConfig.vue'
import TLSEnableConfig from '@/components/TLSConfig/TLSEnableConfig.vue'
import TextareaWithUploader from '@/components/TextareaWithUploader.vue'
import useItemLabelAndDesc from '@/hooks/Schema/useItemLabelAndDesc'
import useSchemaForm from '@/hooks/Schema/useSchemaForm'
import useSchemaRecord from '@/hooks/Schema/useSchemaRecord'
import useConfFooterStyle from '@/hooks/useConfFooterStyle'
import useI18nTl from '@/hooks/useI18nTl'
import { Properties, Property } from '@/types/schemaForm'
import ConnectorSelect from '@/views/RuleEngine/Bridge/Components/ConnectorSelect.vue'
import { Setting } from '@element-plus/icons-vue'
import _ from 'lodash'
import { PropType, computed, defineComponent, ref, watch, watchEffect } from 'vue'
import AdvancedSettingContainer from './AdvancedSettingContainer.vue'
import ArrayEditor from './ArrayEditor.vue'
import ArrayEditorInput from './ArrayEditorInput.vue'
import InputWithPlaceholderSelect from './InputWithPlaceholderSelect.vue'
import InputWithUnit from './InputWithUnit.vue'
import KeyAndValueEditorVue from './KeyAndValueEditor.vue'
import ObjectArrayEditor from './ObjectArrayEditor.vue'
import Oneof from './Oneof.vue'
import OneofRefs from './OneofRefs.vue'
import OneofRefsSelect from './OneofRefsSelect.vue'
import TimeInputWithUnitSelect from './TimeInputWithUnitSelect.vue'
import CertFileInput from './TLSConfig/CertFileInput.vue'
import CustomInputPassword from './CustomInputPassword.vue'
import BatchSettings from './BatchSettings.vue'
import { usePerms } from '@/plugins/permissionsPlugin'
import { BatchSettingDatabaseType } from '@/types/enum'

interface FormItemMeta {
  levelName?: string
}

const typesDoNotShowSkeleton = INTEGRATION_SCHEMA_TYPES

const typesDoNotNeedGroups = [...INTEGRATION_SCHEMA_TYPES, 'file-trans']
const typesNeedConciseSSL = INTEGRATION_SCHEMA_TYPES
const SSL_PATH_REG = /^(.+\.)?ssl$/i
const SSL_KEY = 'ssl'
const CERT_FIELDS_REG = /cacertfile|certfile|keyfile/

const SchemaForm = defineComponent({
  name: 'SchemaForm',
  components: {
    TimeInputWithUnitSelect,
    InputWithUnit,
    ArrayEditor,
    ArrayEditorInput,
    ArrayEditorTable,
    Oneof,
    OneofRefsSelect,
    Setting,
    CommonTLSConfig,
    InfoTooltip,
    Monaco,
    TextareaWithUploader,
    MarkdownContent,
    CustomInputNumber,
    AdvancedSettingContainer,
    CertFileInput,
    InputWithPlaceholderSelect,
    BatchSettings,
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
    disabled: {
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
      type: Array as PropType<Array<string | RegExp>>,
    },
    defaultTab: {
      type: String,
    },
    /**
     * Support batch settings configs
     * Such as data template import for databases like influxdb, iotdb, tdengine, etc.
     */
    batchSettingConfigs: {
      type: Object as PropType<{ dbType: BatchSettingDatabaseType }>,
      default: () => ({
        dbType: '',
      }),
    },
  },
  setup(props, ctx) {
    const { hasPermission } = usePerms()
    const configForm = ref<{ [key: string]: any }>({})
    const schemaLoadPath = props.schemaFilePath || getAPIPath('/schemas/hotconf')
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
      currentGroup.value = props.defaultTab || groups.value[0] || tl('basic')
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

    const getSSLComponent = (property: Property) => {
      if (property?.properties?.enable) {
        return CommonTLSConfig
      }
      // for confluent...
      return TLSEnableConfig
    }

    const handleObjectArrayEditorOperation = (property: Property) => {
      formCom?.value?.validateField?.(property.path)
    }

    const isComplexOneof = (prop: Property) =>
      prop.type === 'oneof' && prop.oneOf?.length && prop.oneOf?.some(({ $ref }) => $ref)

    const handleSelectOneof = (parentProperty: Property, property: Property) => {
      const isInit = _.isUndefined(parentProperty.selectedOneof)
      parentProperty.selectedOneof = property.properties
      parentProperty.default = property.default
      const fieldValue = parentProperty.path && _.get(configForm.value, parentProperty.path)
      if (fieldValue) {
        // Remove unneeded fields
        Object.keys(fieldValue).forEach((key) => {
          if (!property.properties?.[key]) {
            // remove field
            Reflect.deleteProperty(fieldValue, key)
            // remove rule
            const totalPath = `${parentProperty.path}.${key}`
            Reflect.deleteProperty(rules.value, totalPath)
          }
        })
      }
      // If it is initial and, props.needRecord is false, do not set
      if ((!isInit || props.needRecord) && property.properties && parentProperty.path) {
        // Add new fields
        const newRecord = initRecordByComponents(property.properties)
        _.set(configForm.value, parentProperty.path, _.get(newRecord, parentProperty.path))
      }

      rules.value = { ...rules.value, ...property.rules }
    }

    const sortOneofProperties = (oneOfArr: Property['oneOf']): Property['oneOf'] => {
      if (!Array.isArray(oneOfArr)) {
        return oneOfArr
      }

      return oneOfArr.map((item) => {
        if (!item.properties || typeof item.properties !== 'object') {
          return item
        }
        const sortedKeys = sortPropKeys(Object.keys(item.properties))
        item.properties = sortedKeys.reduce((obj: Properties, key) => {
          if (!item.properties) {
            return obj
          }
          obj[key] = item.properties[key]
          return obj
        }, {})
        return item
      })
    }

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
      const clearableValue = typeof clearable === 'boolean' ? clearable : true
      const customProps = property.componentProps || {}
      const isTemplate = !!property.is_template

      const stringInput = (
        <el-input
          disabled={isPropertyDisabled}
          placeholder={property.default?.toString()}
          modelValue={modelValue}
          type={inputType}
          {...handleUpdateModelValue}
          clearable
          {...customProps}
        />
      )
      // TODO: use SchemaFormItem
      switch (property.type) {
        case 'string':
          if (property.key && CERT_FIELDS_REG.test(property.key)) {
            return (
              <CertFileInput
                modelValue={modelValue}
                isEdit={true}
                {...handleUpdateModelValue}
                {...customProps}
              />
            )
          } else if (isTemplate) {
            return (
              <InputWithPlaceholderSelect
                disabled={isPropertyDisabled}
                placeholder={property.default?.toString()}
                modelValue={modelValue}
                type={inputType}
                oneOf={property.oneOf}
                {...handleUpdateModelValue}
                clearable
                {...customProps}
              />
            )
          } else if (format === 'password') {
            return (
              <CustomInputPassword
                disabled={isPropertyDisabled}
                placeholder={property.default?.toString()}
                modelValue={modelValue}
                {...handleUpdateModelValue}
                clearable
                {...customProps}
              />
            )
          }
          return stringInput
        case 'connector':
          return (
            <ConnectorSelect
              modelValue={modelValue}
              type={configForm.value.type}
              {...handleUpdateModelValue}
              {...customProps}
            />
          )
        case 'number': {
          const { minimum: min = 0, maximum: max = Number.POSITIVE_INFINITY } = property
          const rangeLimit = { min, max }
          return (
            <CustomInputNumber
              disabled={isPropertyDisabled}
              modelValue={modelValue}
              {...handleUpdateModelValue}
              placeholder={property.default?.toString()}
              {...rangeLimit}
              {...customProps}
            />
          )
        }
        case 'enum':
          if (isTemplate) {
            return (
              <InputWithPlaceholderSelect
                disabled={isPropertyDisabled}
                placeholder={property.default?.toString()}
                modelValue={modelValue}
                oneOf={property.oneOf}
                {...handleUpdateModelValue}
                clearable={clearableValue}
                options={property.symbols}
                {...customProps}
              />
            )
          }
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
                <el-option value={opt} label={getOptLabel(opt.toString())} />
              ))}
            </el-select>
          )
        case 'boolean':
          return (
            <el-switch
              disabled={isPropertyDisabled}
              modelValue={modelValue}
              {...handleUpdateModelValue}
              {...customProps}
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
              <ArrayEditor
                modelValue={modelValue}
                {...handleUpdateModelValue}
                disabled={isPropertyDisabled || props.disabled}
                type={property.items.type}
                default={property.default}
                {...customProps}
              />
            )
          } else if (property.items.type === 'enum') {
            return (
              <el-select
                disabled={isPropertyDisabled}
                modelValue={modelValue}
                clearable={clearableValue}
                {...handleUpdateModelValue}
                {...customProps}
                multiple
              >
                {property.symbols?.map((opt) => (
                  <el-option value={opt} label={getOptLabel(opt.toString())} />
                ))}
              </el-select>
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
                disabled={props.disabled}
                rules={rules.value}
                onAddItem={() => handleObjectArrayEditorOperation(property)}
                onDeleteItem={() => handleObjectArrayEditorOperation(property)}
                dbType={props.batchSettingConfigs.dbType}
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
              units={['MB', 'GB', 'KB', 'B']}
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
          const bindProps = {
            modelValue,
            ...handleUpdateModelValue,
            items: property.oneOf,
            disabled: isPropertyDisabled,
            ...customProps,
          }
          if (isComplexOneof(property)) {
            const propToBind = _.cloneDeep(property)
            if (isComplexOneof(property)) {
              propToBind.oneOf = sortOneofProperties(propToBind.oneOf)
              bindProps.items = propToBind.oneOf
            }
            if (property.useNewCom) {
              return (
                <OneofRefsSelect
                  {...bindProps}
                  key={property.path}
                  fieldValue={modelValue}
                  property={propToBind}
                  colSpan={getColSpan(property)}
                  getText={getText}
                  customColClass={props.customColClass}
                  onChange={(selectedProperty: any) =>
                    handleSelectOneof(property, selectedProperty)
                  }
                />
              )
            }
            return (
              <OneofRefs
                {...bindProps}
                property={propToBind}
                colSpan={getColSpan(property)}
                getText={getText}
                customColClass={props.customColClass}
              />
            )
          }
          return <oneof {...bindProps} />
        }
        case 'ssl': {
          const ConfComponent = getSSLComponent(property)
          // do not show component is record is loading
          // otherwise will influent the component to judge which component should be displaed
          if (props.recordLoading) {
            return stringInput
          }
          return (
            <ConfComponent
              modelValue={modelValue}
              isEdit={!!props.form}
              {...handleUpdateModelValue}
              {...customProps}
            />
          )
        }

        case 'sql': {
          const isDisabled = isPropertyDisabled || props.disabled
          const showBatchSettings =
            props.batchSettingConfigs.dbType === BatchSettingDatabaseType.TDengine && !isDisabled
          return (
            <div class="monaco-container">
              <Monaco
                id={createRandomString()}
                modelValue={modelValue}
                {...handleUpdateModelValue}
                lang="sql"
                disabled={isPropertyDisabled || props.disabled}
                {...customProps}
              />
              {showBatchSettings && (
                <BatchSettings
                  type={props.batchSettingConfigs.dbType}
                  onUploadedData={handleModelValueUpdate(path)}
                />
              )}
            </div>
          )
        }
        case 'file':
          return (
            <TextareaWithUploader
              modelValue={modelValue}
              {...handleUpdateModelValue}
              {...customProps}
            />
          )
        case 'object':
          return (
            <KeyAndValueEditorVue
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
        case 'oneof': {
          if (isComplexOneof(property)) {
            const props = {
              modelValue,
              property,
              getText,
              items: property.oneOf,
              readonly: true,
              colSpan: getColSpan(property),
            }
            if (property.useNewCom) {
              return (
                <OneofRefsSelect
                  {...props}
                  key={property.path}
                  fieldValue={modelValue}
                  onChange={(selectedProperty: any) =>
                    handleSelectOneof(property, selectedProperty)
                  }
                />
              )
            }
            return <OneofRefs {...(props as any)} />
          }
          return <p class="value">{modelValue}</p>
        }
        case 'ssl': {
          const ele = switchComponent({ ...property, readOnly: true })
          if (ele?.props) {
            ele.props.readonly = true
          }
          return ele
        }
        case 'object':
          return <KeyAndValueEditorVue modelValue={modelValue} readonly />

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
      const popperClass = `${property.format === 'sql' ? 'is-wider' : ''} height-fixed`
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
        content: () => (
          <el-scrollbar max-height="158px">
            <MarkdownContent content={desc} gutter={0} inTooltip={true} />
          </el-scrollbar>
        ),
      }
      return labelSlot
    }

    /**
     * if property with special col span, return it, else return undefined
     */
    const getColSpan = ({ path, format, type, items }: Property): number | undefined => {
      if (
        (path && SSL_PATH_REG.test(path)) ||
        format === 'sql' ||
        (type === 'array' && items.type !== 'string') ||
        type === 'object'
      ) {
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

      const title = property.title ? (
        <el-col span={24}>
          {' '}
          <p class="part-header">{property.title}</p>{' '}
        </el-col>
      ) : null
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
      const colItemWithTitle = (
        <>
          {title}
          {colItem}
        </>
      )
      // Cluster form add Invite Node component
      if (props.type === 'cluster' && property.path === 'discovery_strategy') {
        const isManualCluster = configForm.value[property.path] === 'manual'
        if (isManualCluster) {
          return (
            <>
              {colItemWithTitle}
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
            {colItemWithTitle}
          </>
        )
      }
      return colItemWithTitle
    }

    const save = () => {
      ctx.emit('save', configForm.value)
    }

    const defaultFormProps = { class: 'configuration-form', labelPosition: 'right' }
    const getFormProps = () => ({
      ...defaultFormProps,
      disabled: props.disabled,
      ...(props.formProps || {}),
    })
    const rowGutter = computed(() => (props.formItemSpan <= 12 ? 24 : 0))

    const renderLayout = (contents: JSX.Element[]) => {
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
                <el-col span={24} class="btn-col">
                  <el-button
                    type="primary"
                    disabled={!hasPermission('put')}
                    loading={props.btnLoading}
                    onClick={save}
                  >
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
        const preOrder = propsOrderMap[pre] ?? 999
        const nextOrder = propsOrderMap[next] ?? 999
        return preOrder - nextOrder
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
          const propPath = property.path as string
          // for concise SSL
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

          const isComplexOneofProp = isComplexOneof(property)
          if (property.properties && !isSSLAndNeedConcise && !isComplexOneofProp) {
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
            const isAdvancedField = props.advancedFields?.some(
              (field) =>
                (typeof field === 'string' && field === propPath) ||
                (_.isRegExp(field) && field.test(propPath)),
            )
            if (isAdvancedField) {
              advancedFieldElement.push(elFormItem)
            } else {
              elements.push(elFormItem)
            }
            if (isComplexOneofProp && property.selectedOneof) {
              setComponents(property.selectedOneof)
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
    const { addObserverToFooter } = useConfFooterStyle()
    const renderSchemaForm = (properties: Properties) => {
      if (Object.keys(properties).length === 0) {
        // Initialize with an empty object, do not modify the loading variable at this point.
        formEle = null
      } else {
        formEle = renderLayout(getComponents(properties))
        ctx.emit('schema-loaded')
        isSchemaLoading.value = false
        if (props.needFooter) {
          window.setTimeout(addObserverToFooter, 400)
        }
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
      return initRecordByComponents(components.value)
    }

    const init = async () => {
      await handleComponentsData()
      initCurrentGroup()
      if (props.needRecord) {
        configForm.value = { ...getInitRecord(), ...(_.isObject(props.form) ? props.form : {}) }
        ctx.emit('init', configForm.value)
      }
    }

    watch(
      () => props.form,
      (value) => {
        if (value && !_.isEqual(value, configForm.value)) {
          configForm.value = _.cloneDeep(value)
        }
      },
    )

    // WARNING: If the parent component modifies the object pointed to by `components`, it will cause a dead loop
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
          const newRecord = initRecordByComponents(components.value)

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

    const isSchemaLoading = ref(true)
    const showSkeleton = computed(
      () =>
        (isSchemaLoading.value || props.recordLoading) &&
        !typesDoNotShowSkeleton.includes(props.type),
    )
    const showLoading = computed(
      () =>
        (isSchemaLoading.value || props.recordLoading) &&
        typesDoNotShowSkeleton.includes(props.type),
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
