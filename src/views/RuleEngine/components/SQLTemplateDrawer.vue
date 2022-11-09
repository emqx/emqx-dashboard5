<template>
  <el-drawer
    v-model="showDrawer"
    :title="tl('commonSQLTemplates')"
    custom-class="SQL-template-drawer"
    :size="660"
  >
    <el-collapse class="collapse-border">
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
              <!-- <el-button size="small" @click="testSQL(item)">
                {{ tl('testsql') }}
              </el-button> -->
              <el-button size="small" @click="useSQL(item.sql)">
                {{ tl('useSQL') }}
              </el-button>
            </div>
          </div>
          <div class="input-container">
            <CodeView :code="item.sql" lang="sql" />
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
            <CodeView :code="item.input" lang="json" />
          </div>
        </section>

        <section>
          <div class="sub-block-hd">
            <p class="hd-title">{{ tl('processedResults') }}</p>
          </div>
          <div class="input-container">
            <CodeView :code="item.outputs" lang="json" />
          </div>
        </section>
      </el-collapse-item>
    </el-collapse>
  </el-drawer>
</template>

<script setup lang="ts">
import SQLTemplates from '@/common/SQLTemplates'
import { stringifyObjSafely } from '@/common/tools'
import { computed, defineEmits, defineProps, ref, Ref, WritableComputedRef } from 'vue'
import { useI18n } from 'vue-i18n'
import CodeView from '@/components/CodeView.vue'

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

// const testSQL = ({ sql, input }: TemplateItem) => {
//   emit('test-sql', { sql, input })
//   showDrawer.value = false
// }

const useSQL = (SQLContent: string) => {
  emit('use-sql', SQLContent)
  showDrawer.value = false
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
  .el-collapse-item__header {
    line-height: 1.6;
  }
  .el-collapse-item__content {
    background-color: var(--color-bg-split);
  }
}
</style>
