import { BuiltInDBRule } from '@/types/auth'

const useAuthzDataHandler = () => {
  const handleRulesBeforeSubmit = (rules: Array<BuiltInDBRule>) =>
    rules.map((rule) => checkNOmitFromObj(rule))

  return {
    handleRulesBeforeSubmit,
  }
}

export default useAuthzDataHandler
