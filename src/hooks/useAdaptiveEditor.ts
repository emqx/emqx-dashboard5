import type { Ref } from 'vue'
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'

interface UseAdaptiveEditorOptions {
  initialContent: Ref<string>
  maxHeightRatio?: number
  minHeight?: number
  lineHeight?: number
  padding?: number
}

interface UseAdaptiveEditorReturn {
  editorHeight: Ref<number>
  containerRef: Ref<HTMLElement | null>
  updateEditorHeight: () => void
}

export function useAdaptiveEditor({
  initialContent,
  maxHeightRatio = 0.9,
  minHeight = 100,
  lineHeight = 20,
  padding = 20,
}: UseAdaptiveEditorOptions): UseAdaptiveEditorReturn {
  const editorHeight = ref(minHeight)
  const containerRef = ref<HTMLElement | null>(null)

  const contentLines = computed(() => {
    return (initialContent.value || '').split('\n').length
  })

  const maxHeight = computed(() => {
    return window.innerHeight * maxHeightRatio
  })

  const updateEditorHeight = () => {
    nextTick(() => {
      if (containerRef.value) {
        const calculatedHeight = Math.max(minHeight, contentLines.value * lineHeight + padding)
        editorHeight.value = Math.min(calculatedHeight, maxHeight.value)
      }
    })
  }

  watch(initialContent, updateEditorHeight)

  onMounted(() => {
    updateEditorHeight()
    window.addEventListener('resize', updateEditorHeight)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', updateEditorHeight)
  })

  return {
    editorHeight,
    containerRef,
    updateEditorHeight,
  }
}

export default {}
