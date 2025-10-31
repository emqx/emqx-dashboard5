<template>
  <div class="list-editor">
    <ul class="list-none px-0">
      <li class="topic-item" v-for="(item, $index) in list" :key="$index" :class="itemClass">
        <el-form-item>
          <div class="flex align-start flex-1">
            <slot :item="item" :index="$index"></slot>
            <div class="btn-container vertical-align-center">
              <el-button
                class="btn-del"
                :disabled="!$hasPermission('delete')"
                @click="deleteItem($index)"
              >
                <Icon icon="lucide:trash-2" class="w-4 h-4" />
              </el-button>
              <el-button
                v-if="$index === list.length - 1"
                class="btn-add"
                :disabled="!$hasPermission('post')"
                @click="addItem"
              >
                <Icon icon="lucide:plus" class="w-4 h-4" />
              </el-button>
            </div>
          </div>
        </el-form-item>
      </li>
    </ul>
    <el-button
      v-if="!list.length"
      class="btn-add"
      :disabled="!$hasPermission('post')"
      @click="addItem"
    >
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
