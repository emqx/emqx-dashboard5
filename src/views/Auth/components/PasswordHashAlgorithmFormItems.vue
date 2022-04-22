<template>
  <el-col :span="12">
    <el-form-item :label="$t('Auth.passwordHash')">
      <el-select v-model="formData.password_hash_algorithm.name" @change="handleSaltChanged">
        <el-option v-for="item in HashOptions" :key="item" :value="item" />
      </el-select>
    </el-form-item>
  </el-col>
  <el-col v-if="formData.password_hash_algorithm.name === 'bcrypt'" :span="12">
    <el-form-item label="Salt Rounds">
      <el-input v-model="formData.password_hash_algorithm.salt_rounds" />
    </el-form-item>
  </el-col>
  <template v-if="formData.password_hash_algorithm.name === 'pbkdf2'">
    <el-col :span="12">
      <el-form-item :label="titleCase($t('Auth.pseudorandomFunction'))">
        <el-select v-model="formData.password_hash_algorithm.mac_fun">
          <el-option v-for="item in macFunOpt" :key="item" :value="item" :label="item" />
        </el-select>
      </el-form-item>
    </el-col>
    <el-col :span="12">
      <el-form-item :label="$t('Auth.iterationCount')">
        <el-input v-model.number="formData.password_hash_algorithm.iterations" />
      </el-form-item>
    </el-col>
    <el-col :span="12">
      <el-form-item :label="titleCase($t('Auth.dkLength'))">
        <el-input v-model.number="formData.password_hash_algorithm.dk_length" />
      </el-form-item>
    </el-col>
  </template>
  <el-col :span="12" v-if="needSelectSaltPosition">
    <el-form-item :label="$t('Auth.saltPosition')">
      <el-select
        v-model="formData.password_hash_algorithm.salt_position"
        @change="handleSaltChanged"
      >
        <el-option v-for="item in saltPositionOpt" :key="item" :value="item" :label="item" />
      </el-select>
    </el-form-item>
  </el-col>
</template>

<script setup lang="ts">
import { PASSWORD_HASH_TYPES_WHICH_NEED_SALT_POSITION } from '@/common/constants'
import { titleCase } from '@/common/tools'
import usePassword from '@/hooks/usePassword'
import { SaltPosition } from '@/types/enum'
import { defineProps, computed, defineEmits, PropType } from 'vue'

interface PasswordHashAlgorithmFormItems {
  password_hash_algorithm: {
    name: string
    salt_rounds?: number
    mac_fun?: number
    iterations?: number
    dk_length?: number
    salt_position?: SaltPosition
  }
}

const props = defineProps({
  modelValue: {
    type: Object as PropType<PasswordHashAlgorithmFormItems>,
    required: true,
  },
})

const emit = defineEmits(['update:modelValue', 'change'])

const formData = computed<PasswordHashAlgorithmFormItems>({
  get() {
    if (
      'password_hash_algorithm' in props.modelValue &&
      typeof props.modelValue.password_hash_algorithm === 'object'
    ) {
      return props.modelValue
    }
    return {
      password_hash_algorithm: {
        name: '',
      },
    }
  },
  set(val) {
    emit('update:modelValue', val)
  },
})
const { HashOptions } = usePassword()

const saltPositionOpt = [SaltPosition.Disable, SaltPosition.Prefix, SaltPosition.Suffix]
const macFunOpt = ['md4', 'md5', 'ripemd160', 'sha', 'sha224', 'sha256', 'sha384', 'sha512']

const needSelectSaltPosition = computed(() => {
  const { name } = formData.value.password_hash_algorithm
  return name && PASSWORD_HASH_TYPES_WHICH_NEED_SALT_POSITION.includes(name)
})

const handleSaltChanged = () => {
  emit('change')
}
</script>
