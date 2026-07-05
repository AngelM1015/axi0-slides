import { onMounted, onUnmounted, ref, watch, type ShallowRef } from 'vue'
import { storeToRefs } from 'pinia'
import { useSlidesStore } from '@/store'

export default (wrapRef?: ShallowRef<HTMLElement | null>) => {
  const slidesStore = useSlidesStore()
  const { viewportRatio } = storeToRefs(slidesStore)

  const slideWidth = ref(0)
  const slideHeight = ref(0)

  // 计算和更New slideContent的尺寸 (By比例自Fit to screen)
  const setSlideContentSize = () => {
    const slideWrapRef = wrapRef?.value || document.body
    const winWidth = slideWrapRef.clientWidth
    const winHeight = slideWrapRef.clientHeight
    let width, height

    if (winHeight / winWidth === viewportRatio.value) {
      width = winWidth
      height = winHeight
    }
    else if (winHeight / winWidth > viewportRatio.value) {
      width = winWidth
      height = winWidth * viewportRatio.value
    }
    else {
      width = winHeight / viewportRatio.value
      height = winHeight
    }
    slideWidth.value = width
    slideHeight.value = height
  }

  onMounted(() => {
    setSlideContentSize()
    window.addEventListener('resize', setSlideContentSize)
  })
  onUnmounted(() => {
    window.removeEventListener('resize', setSlideContentSize)
  })

  watch(viewportRatio, setSlideContentSize)

  return {
    slideWidth,
    slideHeight,
  }
}