<template>
  <div class="help-block">
    <div>
      <template v-for="(item, $index) in helpText" :key="$index">
        <p v-if="typeof item === 'string'">{{ item }}</p>
        <code-view
          v-else-if="typeof item === 'object' && item.type === 'code'"
          :lang="codeLang"
          :code="item.content"
          :show-copy-btn="false"
        />
      </template>
    </div>
    <template v-if="helpCode">
      <code-view :lang="codeLang" :code="helpCode" :show-copy-btn="false" />
      <el-button ref="btnCopyHelp" @click="copyText(helpCode)" size="small">
        {{ $t('Base.copy') }}
      </el-button>
    </template>
  </div>
</template>

<script lang="ts">
export default defineComponent({
  name: 'HelpBlock',
})
</script>

<script setup lang="ts">
const props = defineProps({
  authType: {
    type: String as PropType<'authn' | 'authz'>,
    required: true,
  },
  databaseType: {
    type: String as PropType<'mysql' | 'postgresql' | 'mongodb' | 'redis' | 'http'>,
  },
  copiedCallback: {
    type: Function as PropType<() => void>,
    default: () => () => {
      //
    },
  },
})

const codeLang = computed(() => {
  const { databaseType: type } = props
  if (type === 'mongodb') {
    return 'javascript'
  }
  if (type === 'redis') {
    return 'bash'
  }
  return 'sql'
})

const { copyText } = useCopy(props.copiedCallback)

const { helpText, helpCode } = useAuthHelp({
  authType: props.authType,
  databaseType: props.databaseType,
})
</script>

<style lang="scss"></style>
