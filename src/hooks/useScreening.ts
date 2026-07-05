import { useScreenStore, useSlidesStore } from '@/store'
import { enterFullscreen, exitFullscreen, isFullscreen } from '@/utils/fullscreen'

export default () => {
  const screenStore = useScreenStore()
  const slidesStore = useSlidesStore()

  // 进入放映状态 (From current slide)
  const enterScreening = () => {
    enterFullscreen()
    screenStore.setScreening(true)
  }

  // 进入放映状态 (从First slideStart)
  const enterScreeningFromStart = () => {
    slidesStore.updateSlideIndex(0)
    enterScreening()
  }

  // Exit slide show状态
  const exitScreening = () => {
    screenStore.setScreening(false)
    if (isFullscreen()) exitFullscreen()
  }

  return {
    enterScreening,
    enterScreeningFromStart,
    exitScreening,
  }
}