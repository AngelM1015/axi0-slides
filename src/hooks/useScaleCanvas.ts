import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useMainStore } from '@/store'

export default () => {
  const mainStore = useMainStore()
  const { canvasPercentage, canvasScale, canvasDragged } = storeToRefs(mainStore)

  const canvasScalePercentage = computed(() => Math.round(canvasScale.value * 100) + '%')

  /**
   * Zoom canvas百分比
   * @param command Zoom命令: Zoom in, Zoom out
   */
  const scaleCanvas = (command: '+' | '-') => {
    let percentage = canvasPercentage.value
    const step = 5
    const max = 200
    const min = 30
    if (command === '+' && percentage <= max) percentage += step
    if (command === '-' && percentage >= min) percentage -= step

    mainStore.setCanvasPercentage(percentage)
  }

  /**
   * Set画布Zoom比例
   * 但不是直接Set该Value, 而是通过Set画布可视区域百分比来动态计算
   * @param value 目标画布Zoom比例
   */
  const setCanvasScalePercentage = (value: number) => {
    const percentage = Math.round(value / canvasScale.value * canvasPercentage.value) / 100
    mainStore.setCanvasPercentage(percentage)
  }

  /**
   * Reset画布尺寸和Position
   */
  const resetCanvas = () => {
    mainStore.setCanvasPercentage(90)
    if (canvasDragged) mainStore.setCanvasDragged(false)
  }

  return {
    canvasScalePercentage,
    setCanvasScalePercentage,
    scaleCanvas,
    resetCanvas,
  }
}