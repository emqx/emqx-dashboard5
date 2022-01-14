<template>
  <!-- without salt_position field -->
  <el-col :span="12">
    <el-form-item :label="$t('Auth.passwordHash')">
      <el-select v-model="formData.password_hash_algorithm.name">
        <el-option v-for="item in HashOptions" :key="item" :value="item"></el-option>
      </el-select>
    </el-form-item>
  </el-col>
  <el-col v-if="formData.password_hash_algorithm.name === 'bcrypt'" :span="12">
    <el-form-item label="Salt Rounds">
      <el-input v-model="formData.password_hash_algorithm.salt_rounds"></el-input>
    </el-form-item>
  </el-col>
  <template v-if="formData.password_hash_algorithm.name === 'pbkdf2'">
    <el-col :span="12">
      <el-form-item label="macfun">
        <el-input v-model.number="formData.password_hash_algorithm.mac_fun" />
      </el-form-item>
    </el-col>
    <el-col :span="12">
      <el-form-item :label="$t('Auth.iterationCount')">
        <el-input v-model.number="formData.password_hash_algorithm.iterations" />
      </el-form-item>
    </el-col>
    <el-col :span="12">
      <el-form-item :label="$t('Auth.dkLength')">
        <el-input v-model.number="formData.password_hash_algorithm.dk_length" />
      </el-form-item>
    </el-col>
  </template>
</template>

<script setup lang="ts">
import usePassword from '@/hooks/usePassword'
import { defineProps, computed, defineEmits } from 'vue'

const props = defineProps({
  modelValue: Object,
})

const emit = defineEmits(['update:modelValue'])

const formData = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  },
})

const { HashOptions } = usePassword()

console.log(123)
</script>
