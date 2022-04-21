import { Ref, ref } from 'vue'

export default function usePassword(): {
  HashOptions: Ref<string[]>
} {
  const HashOptions = ref(['plain', 'md5', 'sha', 'sha256', 'sha512', 'bcrypt', 'pbkdf2'])
  return {
    HashOptions,
  }
}
