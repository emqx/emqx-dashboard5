import { LOCAL_STORAGE_KEY_MAP } from '@/common/constants'
import { RuleItem } from '@/types/rule'
import { useRouter } from 'vue-router'

export default (): {
  copyRule: (rule: RuleItem) => void
} => {
  const router = useRouter()

  const copyRule = (rule: RuleItem) => {
    const { name, sql, actions, description } = rule
    localStorage.setItem(
      LOCAL_STORAGE_KEY_MAP.RULE_FOR_COPY,
      JSON.stringify({ name, sql, actions, description }),
    )
    router.push({
      name: 'iot-create',
      query: {
        action: 'copy',
      },
    })
  }

  return {
    copyRule,
  }
}
