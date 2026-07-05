import type { Ref } from 'vue'
import { uniq } from 'lodash'
import { storeToRefs } from 'pinia'
import { useMainStore, useKeyboardStore } from '@/store'
import type { PPTElement } from '@/types/slides'

export default (
  elementList: Ref<PPTElement[]>,
  moveElement: (e: MouseEvent | TouchEvent, element: PPTElement) => void,
) => {
  const mainStore = useMainStore()
  const { activeElementIdList, activeGroupElementId, handleElementId, editorAreaFocus } = storeToRefs(mainStore)
  const { ctrlKeyState, ctrlOrShiftKeyActive } = storeToRefs(useKeyboardStore())

  // selected element
  // startMove 表示是否需要再选Medium操作后进入到StartMove的状态
  const selectElement = (e: MouseEvent | TouchEvent, element: PPTElement, startMove = true) => {
    if (!editorAreaFocus.value) mainStore.setEditorareaFocus(true)

    // 如果目标元素当前未被选Medium, 则将他设为选Medium状态
    // 此时如果By下Ctrl键或Shift键, 则进入Multi-select状态, 将当前已选Medium的元素和目标元素一起Set为选Medium状态, 否则仅将目标元素Set为选Medium状态
    // 如果目标元素是分组成员, 需要将该Group的Other元素一起Set为选Medium状态
    if (!activeElementIdList.value.includes(element.id)) {
      let newActiveIdList: string[] = []

      if (ctrlOrShiftKeyActive.value) {
        newActiveIdList = [...activeElementIdList.value, element.id]
      }
      else newActiveIdList = [element.id]
      
      if (element.groupId) {
        const groupMembersId: string[] = []
        elementList.value.forEach((el: PPTElement) => {
          if (el.groupId === element.groupId) groupMembersId.push(el.id)
        })
        newActiveIdList = [...newActiveIdList, ...groupMembersId]
      }

      mainStore.setActiveElementIdList(uniq(newActiveIdList))
      mainStore.setHandleElementId(element.id)
    }

    // 已selected element上By下 Ctrl 且允许拖拽时, 先不立刻Cancel选Medium
    // 因为 Ctrl+Point击 和 Ctrl+拖拽Copy 共用同一 mousedown
    // 所以需要先记录By下Position, 等 mouseup 时再判断这次操作到底是"Point击"还是"拖拽"
    // Point击时在 mouseup 再Cancel选Medium, 拖拽时交给拖拽逻辑处理
    else if (ctrlKeyState.value && startMove) {
      const startPageX = e instanceof MouseEvent ? e.pageX : e.changedTouches[0].pageX
      const startPageY = e instanceof MouseEvent ? e.pageY : e.changedTouches[0].pageY
      const target = e.target as HTMLElement

      target.onmouseup = (e: MouseEvent) => {
        const currentPageX = e.pageX
        const currentPageY = e.pageY

        if (startPageX === currentPageX && startPageY === currentPageY) {
          let newActiveIdList: string[] = []

          if (element.groupId) {
            const groupMembersId: string[] = []
            elementList.value.forEach((el: PPTElement) => {
              if (el.groupId === element.groupId) groupMembersId.push(el.id)
            })
            newActiveIdList = activeElementIdList.value.filter(id => !groupMembersId.includes(id))
          }
          else {
            newActiveIdList = activeElementIdList.value.filter(id => id !== element.id)
          }

          if (newActiveIdList.length > 0) {
            mainStore.setActiveElementIdList(newActiveIdList)
          }
        }
        target.onmouseup = null
      }
    }

    // 如果目标元素已被选Medium, 且By下了Ctrl键或Shift键, 则Cancel其被选Medium状态
    // 除非目标元素是最后的一个被selected element, 或者目标元素所在的Group是最后一组选MediumGroup
    // 如果目标元素是分组成员, 需要将该Group的Other元素一起Cancel选Medium状态
    else if (ctrlOrShiftKeyActive.value) {
      let newActiveIdList: string[] = []

      if (element.groupId) {
        const groupMembersId: string[] = []
        elementList.value.forEach((el: PPTElement) => {
          if (el.groupId === element.groupId) groupMembersId.push(el.id)
        })
        newActiveIdList = activeElementIdList.value.filter(id => !groupMembersId.includes(id))
      }
      else {
        newActiveIdList = activeElementIdList.value.filter(id => id !== element.id)
      }

      if (newActiveIdList.length > 0) {
        mainStore.setActiveElementIdList(newActiveIdList)
      }
    }

    // 如果目标元素已被选Medium, 同时目标元素不是当前操作元素, 则将其Set为当前操作元素
    else if (handleElementId.value !== element.id) {
      mainStore.setHandleElementId(element.id)
    }

    // 如果目标元素已被选Medium, 同时也是当前操作元素, 那么当目标元素在该状态下再次被Point击时, 将被Set为Multi-select元素Medium的激活成员
    else if (activeGroupElementId.value !== element.id) {
      const startPageX = e instanceof MouseEvent ? e.pageX : e.changedTouches[0].pageX
      const startPageY = e instanceof MouseEvent ? e.pageY : e.changedTouches[0].pageY

      ;(e.target as HTMLElement).onmouseup = (e: MouseEvent) => {
        const currentPageX = e.pageX
        const currentPageY = e.pageY

        if (startPageX === currentPageX && startPageY === currentPageY) {
          mainStore.setActiveGroupElementId(element.id)
          ;(e.target as HTMLElement).onmouseup = null
        }
      }
    }

    if (startMove) moveElement(e, element)
  }

  return {
    selectElement,
  }
}
