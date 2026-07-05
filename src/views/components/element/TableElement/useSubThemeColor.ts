import { ref, watch, type Ref } from 'vue'
import type { TableTheme } from '@/types/slides'
import { getTableSubThemeColor } from '@/utils/element'

// 通过Table的Theme色计算AssistColor

export default (theme: Ref<TableTheme | undefined>) => {
  const subThemeColor = ref(['', ''])
  watch(() => theme.value, () => {
    if (theme.value) {
      subThemeColor.value = getTableSubThemeColor(theme.value.color)
    }
  }, { immediate: true })

  return {
    subThemeColor,
  }
}