<template>
  <el-drawer
    v-model="showDrawer"
    :title="tl('commonSQLTemplates')"
    custom-class="SQL-template-drawer"
    :size="500"
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
              <el-button type="text" size="small" @click="testSQL(item)">
                {{ tl('testsql') }}
              </el-button>
              <el-button type="text" size="small" @click="useSQL(item.sql)">
                {{ tl('useSQL') }}
              </el-button>
            </div>
          </div>
          <div class="input-container">
            <div class="monaco-container">
              <Monaco :id="createRandomString()" v-model="item.sql" lang="sql" />
            </div>
            <el-icon class="icon-copy" @click="copyText(item.sql)"><copy-document /></el-icon>
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
            <div class="monaco-container">
              <Monaco :id="createRandomString()" v-model="item.input" lang="json" />
            </div>
            <el-icon class="icon-copy" @click="copyText(item.input)"><copy-document /></el-icon>
          </div>
        </section>

        <section>
          <div class="sub-block-hd">
            <p class="hd-title">{{ tl('processedResults') }}</p>
          </div>
          <div class="input-container">
            <div class="monaco-container">
              <Monaco :id="createRandomString()" v-model="item.outputs" lang="json" />
            </div>
            <el-icon class="icon-copy" @click="copyText(item.outputs)"><copy-document /></el-icon>
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
import { ref, Ref, defineProps, computed, defineEmits, WritableComputedRef } from 'vue'
import { useI18n } from 'vue-i18n'
import { CopyDocument } from '@element-plus/icons-vue'
import { copyToClipboard, createRandomString, stringifyObjSafely } from '@/common/tools'
import { ElMessage } from 'element-plus'
import Monaco from '@/components/Monaco.vue'
import SQLTemplates from '@/common/SQLTemplates'

interface TemplateItem {
  title: string
  scene: string
  sql: string
  input: string
  outputs: string
}

const { t, locale } = useI18n()
const tl = (key: string, moduleName = 'RuleEngine') => t(`${moduleName}.${key}`)

const templateList: Ref<Array<TemplateItem>> = ref([])

const props = defineProps({
  modelValue: {
    type: Boolean,
  },
})

const emit = defineEmits(['update:modelValue', 'use-sql', 'test-sql'])

const showDrawer: WritableComputedRef<boolean> = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  },
})

const initTemplateList = () => {
  templateList.value = SQLTemplates.map((item) => {
    const { title, scene, input, outputs, sql } = item
    const lang = locale.value === 'zh' ? 'zh' : 'en'
    return {
      sql,
      title: title[lang],
      scene: scene[lang],
      input: stringifyObjSafely(input, 2),
      outputs: stringifyObjSafely(outputs, 2),
    }
  })
}

const testSQL = ({ sql, input }: TemplateItem) => {
  emit('test-sql', { sql, input })
  showDrawer.value = false
}

const useSQL = (SQLContent: string) => {
  emit('use-sql', SQLContent)
  showDrawer.value = false
}

const copyText = async (text: string) => {
  try {
    await copyToClipboard(text)
    ElMessage.success(t('Base.copied'))
  } catch (error) {
    ElMessage.error(t('Base.opErr'))
  }
}

initTemplateList()
</script>

<style lang="scss">
.SQL-template-drawer {
  .el-drawer__header {
    padding: 16px 20px;
    margin-bottom: 0;
    border-bottom: 1px solid var(--color-border-primary);
  }
  .el-drawer__body {
    overflow: auto;
  }
  $collapse-border: 1px solid var(--color-border-primary);
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
