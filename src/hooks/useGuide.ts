import { ref } from 'vue'

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default function useGuide(before: () => void) {
  const activeGuidesIndex = ref([0])
  const step = ref(0)
  const handleNext = function () {
    if (before) {
      before()
    }
    step.value += 1
    activeGuidesIndex.value.push(step.value)
  }
  const handleBack = function () {
    step.value -= 1
    activeGuidesIndex.value.pop()
  }
  return {
    activeGuidesIndex,
    step,
    handleNext,
    handleBack,
  }
}
