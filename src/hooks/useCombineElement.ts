import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { nanoid } from 'nanoid'
import { useMainStore, useSlidesStore } from '@/store'
import type { PPTElement } from '@/types/slides'
import useHistorySnapshot from '@/hooks/useHistorySnapshot'

export default () => {
  const mainStore = useMainStore()
  const slidesStore = useSlidesStore()
  const { activeElementIdList, activeElementList, handleElementId } = storeToRefs(mainStore)
  const { currentSlide } = storeToRefs(slidesStore)

  const { addHistorySnapshot } = useHistorySnapshot()

  /**
   * 判断当前选Medium的元素是否可以Group
   */
  const canCombine = computed(() => {
    if (activeElementList.value.length < 2) return false

    const firstGroupId = activeElementList.value[0].groupId
    if (!firstGroupId) return true

    const inSameGroup = activeElementList.value.every(el => (el.groupId && el.groupId) === firstGroupId)
    return !inSameGroup
  })

  /**
   * Group当前选Medium的元素: 给当前选Medium的元素赋予一个相同的分组ID
   */
  const combineElements = () => {
    if (!activeElementList.value.length) return

    // Generate一个新元素列表进行后续操作
    let newElementList: PPTElement[] = JSON.parse(JSON.stringify(currentSlide.value.elements))

    // Generate分组ID
    const groupId = nanoid(10)

    // 收集需要Group的元素列表, 并赋上唯一分组ID
    const combineElementList: PPTElement[] = []
    for (const element of newElementList) {
      if (activeElementIdList.value.includes(element.id)) {
        element.groupId = groupId
        combineElementList.push(element)
      }
    }

    // 确保该Group内所有元素成员的层级是连续的, 具体操作方法为: 
    // 先获取到该Group内最上层元素的层级, 将本次需要Group的元素从新元素列表MediumRemove, 
    // 再根据最上层元素的层级Position, 将上面收集到的需要Group的元素列表一起Insert到新元素列表Medium合适的Position
    const combineElementMaxLevel = newElementList.findIndex(_element => _element.id === combineElementList[combineElementList.length - 1].id)
    const combineElementIdList = combineElementList.map(_element => _element.id)
    newElementList = newElementList.filter(_element => !combineElementIdList.includes(_element.id))

    const insertLevel = combineElementMaxLevel - combineElementList.length + 1
    newElementList.splice(insertLevel, 0, ...combineElementList)

    slidesStore.updateSlide({ elements: newElementList })
    addHistorySnapshot()
  }

  /**
   * Ungroup元素: Removeselected element的分组ID
   */
  const uncombineElements = () => {
    if (!activeElementList.value.length) return
    const hasElementInGroup = activeElementList.value.some(item => item.groupId)
    if (!hasElementInGroup) return
    
    const newElementList: PPTElement[] = JSON.parse(JSON.stringify(currentSlide.value.elements))
    for (const element of newElementList) {
      if (activeElementIdList.value.includes(element.id) && element.groupId) delete element.groupId
    }
    slidesStore.updateSlide({ elements: newElementList })

    // Ungroup后, 需要Reset激活元素状态
    // 默认Reset为当前正在操作的元素,如果不存在则Reset为空
    const handleElementIdList = handleElementId.value ? [handleElementId.value] : []
    mainStore.setActiveElementIdList(handleElementIdList)

    addHistorySnapshot()
  }

  return {
    canCombine,
    combineElements,
    uncombineElements,
  }
}