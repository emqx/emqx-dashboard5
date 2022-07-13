import { ref } from 'vue'

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default function useGuide(before: () => void) {
  const activeGuidesIndex = ref([0])
  const step = ref(0)
  const guideDescList = ref<string[]>([])
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
    guideDescList.value.pop()
  }
  return {
    activeGuidesIndex,
    step,
    guideDescList,
    handleNext,
    handleBack,
  }
}
