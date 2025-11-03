<template>
  <div class="list-editor">
    <ul class="list-none px-0">
      <li class="list-item" v-for="(item, $index) in list" :key="$index" :class="itemClass">
        <el-form-item>
          <div class="flex items-start flex-1 gap-4">
            <slot :item="item" :index="$index"></slot>
            <div class="btn-container vertical-align-center">
              <el-button
                class="btn-del"
                :disabled="!$hasPermission('delete')"
                @click="deleteItem($index)"
              >
                <Icon icon="lucide:trash-2" class="w-4 h-4" />
              </el-button>
            </div>
          </div>
        </el-form-item>
      </li>
    </ul>
    <el-button class="btn-add mb-4" :disabled="!$hasPermission('post')" @click="addItem">
      <Icon icon="lucide:plus" class="w-4 h-4" />
    </el-button>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  list: any[]
  itemClass?: string
}>()
const emit = defineEmits<{
  (e: 'add'): void
  (e: 'delete', index: number): void
}>()

const addItem = () => emit('add')
const deleteItem = (index: number) => emit('delete', index)
</script>

<style lang="scss" scoped>
.btn-del {
  padding-left: 8px;
  padding-right: 8px;
}
</style>
