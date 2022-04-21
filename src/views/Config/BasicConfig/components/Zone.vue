<template>
  <div class="zone">
    <div style="margin-bottom: 20px">
      <el-button class="new-zone-btn" type="primary" @click="handleBeforeAddTab(currTab)">{{
        tl('newZone')
      }}</el-button>
    </div>
    <el-tabs v-model="currTab" type="card" closable @tab-remove="removeTab">
      <el-tab-pane
        v-for="item in editableTabs"
        :key="item.name"
        :label="item.title"
        :name="item.name"
      >
        <p class="zone-tip">{{ tl('zoneTip') }}</p>
        <schema-form
          path="/configs/zones"
          :form="configs[item.name]"
          :btn-loading="saveLoading"
          :can-remove-config="item.name !== 'global'"
          @save="handleSave"
        ></schema-form>
      </el-tab-pane>
    </el-tabs>
    <el-dialog :title="tl('newZone')" width="420px" v-model="addTabDialog">
      <el-form ref="recordForm" :model="addTabConfig" label-position="top">
        <el-form-item prop="name" :label="tl('zoneName')">
          <el-input v-model="addTabConfig.name"></el-input>
        </el-form-item>
        <el-form-item prop="copyFrom" :label="tl('duplicateZone')">
          <el-select v-model="addTabConfig.copyFrom">
            <el-option
              v-for="item in editableTabs"
              :key="item.name"
              :label="item.title"
              :value="item.name"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-align-footer">
          <el-button @click="addTabDialog = false">{{ $t('Base.cancel') }}</el-button>
          <el-button type="primary" @click="addTab">{{ $t('Base.confirm') }}</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, nextTick, reactive, ref } from 'vue'
import SchemaForm from '@/components/SchemaForm'
import {
  getZoneConfigs,
  updateZoneConfigs,
  getGlobalZoneConfigs,
  updateGlobalZoneConfigs,
} from '@/api/config'
import { Zones, Zone } from '@/types/config'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useI18n } from 'vue-i18n'
import useI18nTl from '@/hooks/useI18nTl'

interface EditTableTabs {
  name: string
  title: string
  config: Zone | Record<string, any>
}

export default defineComponent({
  name: 'Zone',
  components: {
    SchemaForm,
  },
  setup() {
    const configs = reactive<Record<string, any>>({
      global: {},
    })
    const addTabDialog = ref(false)
    const { tl } = useI18nTl('BasicConfig')
    const addTabConfig = reactive({
      name: '',
      copyFrom: 'global',
    })
    const currTab = ref('global')
    const editableTabs = ref<EditTableTabs[]>([
      {
        name: 'global',
        title: tl('global'),
        config: {},
      },
    ])
    const handleBeforeAddTab = () => {
      addTabDialog.value = true
      addTabConfig.name = ''
      addTabConfig.copyFrom = 'global'
    }
    const saveLoading = ref(false)
    const { t } = useI18n()
    const loadData = async (resetTab?: boolean) => {
      const globalZone = await getGlobalZoneConfigs()
      configs.global = globalZone
      editableTabs.value[0].config = globalZone
      const zones = await getZoneConfigs()
      if (zones) {
        const _zones: { [key: string]: any } = {}
        Object.keys(zones).forEach((key) => {
          if (resetTab) {
            editableTabs.value.push({
              name: key,
              title: key,
              config: zones[key],
            })
          }
          _zones[key] = zones[key]
        })
        await nextTick()
        Object.keys(_zones).forEach((key) => {
          configs[key] = _zones[key]
        })
      }
    }
    const reloading = () => {
      loadData(false)
    }
    const updateGlobalZone = async (val: Zone) => {
      const data: Zone = {
        ...val,
      }
      try {
        await updateGlobalZoneConfigs(data)
        ElMessage.success(t('Base.updateSuccess'))
        reloading()
      } catch (error) {
        // ignore error
      } finally {
        saveLoading.value = false
      }
    }
    const updateZone = async (val: Zone | null, name?: string) => {
      const key = name || currTab.value
      configs[key] = val
      delete configs.global
      const data: Zones = {
        ...configs,
      }
      try {
        await updateZoneConfigs(data)
        ElMessage.success(t('Base.updateSuccess'))
        reloading()
      } catch (error) {
        // ignore error
      } finally {
        saveLoading.value = false
      }
    }
    const handleSave = async (val: Zone) => {
      saveLoading.value = true
      if (currTab.value === 'global') {
        updateGlobalZone(val)
      } else {
        updateZone(val)
      }
    }
    loadData(true)
    const addTab = async () => {
      const { name } = addTabConfig
      if (!name) {
        ElMessage.warning(tl('zoneNameRequired'))
        return
      }
      const findName = editableTabs.value.find((tab) => tab.name === name)
      if (findName) {
        ElMessage.error(tl('zoneNameExist'))
        return
      }
      const findTab: EditTableTabs = editableTabs.value.find(
        (tab) => tab.name === addTabConfig.copyFrom,
      ) as EditTableTabs
      const newTabName = name.trim()
      editableTabs.value.push({
        name: newTabName,
        title: newTabName,
        config: findTab.config,
      })
      currTab.value = newTabName
      addTabDialog.value = false
      await nextTick()
      configs[newTabName] = findTab.config
      updateZone(findTab.config as Zone, newTabName)
    }
    const removeTab = async (targetName: string) => {
      const tabs = editableTabs.value
      let activeName = currTab.value
      if (tabs.length === 1 || targetName === 'global') {
        return
      }
      await ElMessageBox.confirm(tl('confirmRemove', { name: targetName }), {
        confirmButtonText: t('Base.confirm'),
        cancelButtonText: t('Base.cancel'),
        type: 'warning',
      })
      if (activeName === targetName) {
        tabs.forEach((tab, index) => {
          if (tab.name === targetName) {
            const nextTab = tabs[index + 1] || tabs[index - 1]
            if (nextTab) {
              activeName = nextTab.name
            }
          }
        })
      }
      currTab.value = activeName
      editableTabs.value = tabs.filter((tab) => tab.name !== targetName)
      await nextTick()
      configs[targetName] = {}
      updateZone(null, targetName)
    }
    return {
      tl,
      handleSave,
      configs,
      addTabConfig,
      addTabDialog,
      reloading,
      saveLoading,
      editableTabs,
      currTab,
      handleBeforeAddTab,
      removeTab,
      addTab,
    }
  },
})
</script>

<style lang="scss">
.zone {
  .new-zone-btn {
    position: absolute;
    right: 0px;
    z-index: 1;
  }
  &.item-page .el-tab-pane {
    margin: 24px 0;
  }
  .el-tabs--card > .el-tabs__header {
    .el-tabs__item {
      border-bottom: 1px solid transparent;
    }
  }
  .zone-tip {
    margin-left: 32px;
    margin-bottom: 0px;
    color: var(--el-text-color-regular);
  }
  .el-tabs.el-tabs--card.el-tabs--top {
    .el-tabs__header.is-top {
      margin-left: 32px;
    }
    .el-tabs__content {
      padding-left: 0px;
    }
  }
}
</style>
