<template>
  <el-drawer
    v-model="showDrawer"
    :title="tl('commonSQLTemplates')"
    custom-class="SQL-template-drawer"
  >
    <el-collapse>
      <el-collapse-item
        v-for="item in templateList"
        :key="item.title"
        :title="item.title"
        :name="item.title"
      >
        <section>
          <div class="sub-block-hd">
            <p class="hd-title">{{ tl('SQL') }}</p>
            <div>
              <el-button type="text">{{ tl('testsql') }}</el-button>
              <el-button type="text">{{ tl('useSQL') }}</el-button>
            </div>
          </div>
          <div class="input-container">
            <el-input type="textarea" v-model="item.sql" :rows="10" />
            <el-icon class="icon-copy"><copy-document /></el-icon>
          </div>
        </section>

        <section>
          <div class="sub-block-hd">
            <p class="hd-title">{{ tl('usageScenarios') }}</p>
          </div>
          <p class="usage-desc">{{ item.scene }}</p>
        </section>

        <section>
          <div class="sub-block-hd">
            <p class="hd-title">{{ tl('exampleOfInput') }}</p>
          </div>
          <div class="input-container">
            <el-input type="textarea" v-model="item.input" :rows="10" />
            <el-icon class="icon-copy"><copy-document /></el-icon>
          </div>
        </section>

        <section>
          <div class="sub-block-hd">
            <p class="hd-title">{{ tl('processedResults') }}</p>
          </div>
          <div class="input-container">
            <el-input type="textarea" v-model="item.outputs" :rows="10" />
            <el-icon class="icon-copy"><copy-document /></el-icon>
          </div>
        </section>
      </el-collapse-item>
    </el-collapse>
  </el-drawer>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'SQLTemplateDrawer',
})
</script>

<script setup lang="ts">
import { ref, defineProps, computed, defineEmits, WritableComputedRef } from 'vue'
import { useI18n } from 'vue-i18n'
import { CopyDocument } from '@element-plus/icons-vue'

const { t } = useI18n()
const tl = (key: string, moduleName = 'RuleEngine') => t(`${moduleName}.${key}`)

const templateList = ref([
  {
    title: 'Process messages reported by devices',
    scene: 'scene scene scene scene',
    sql: 'SELECT',
    input: '{"msg":100}',
    outputs: '{"msg":100}',
  },
])

const props = defineProps({
  modelValue: {
    type: Boolean,
  },
})

const emit = defineEmits(['update:modelValue'])

const showDrawer: WritableComputedRef<boolean> = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  },
})
</script>

<style lang="scss">
.SQL-template-drawer {
  .el-drawer__header {
    padding: 16px 20px;
    margin-bottom: 0;
    border-bottom: 1px solid var(--el-border-color-base);
  }
  .el-drawer__body {
    overflow: auto;
  }
  $collapse-border: 1px solid var(--el-border-color-base);
  .el-collapse {
    border-top: $collapse-border;
  }
  .el-collapse-item__header {
    padding-left: 16px;
    border-bottom: $collapse-border;
    &.is-active {
      border-bottom: $collapse-border;
    }
  }
  .el-collapse-item {
    border-right: $collapse-border;
    border-left: $collapse-border;
  }
  .el-collapse-item__content {
    padding: 16px 16px;
    section {
      margin-bottom: 16px;
    }
  }
  p {
    margin-top: 0;
    margin-bottom: 0;
  }
  .usage-desc {
    color: var(--el-text-color-secondary);
  }
  .sub-block-hd {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
  }
  .input-container {
    position: relative;
  }
  .icon-copy {
    position: absolute;
    top: 12px;
    right: 12px;
    cursor: pointer;
  }
}
</style>
