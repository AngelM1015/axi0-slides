import { storeToRefs } from 'pinia'
import { useKeyboardStore } from '@/store'
import { pasteCustomClipboardString } from '@/utils/clipboard'
import { parseText2Paragraphs } from '@/utils/textParser'
import { getImageDataURL, isSVGString, svg2File } from '@/utils/image'
import { isValidURL } from '@/utils/common'
import useCreateElement from '@/hooks/useCreateElement'
import useAddSlidesOrElements from '@/hooks/useAddSlidesOrElements'

interface PasteTextClipboardDataOptions {
  onlySlide?: boolean
  onlyElements?: boolean
}

/**
 * 判断ImageURL字符串
 * 
 * !!!注意, 你需要判断允许哪些来源的Image地址被匹配, 然后自行编写正则表达式
 * !!!必须确保Image来源都是合法, 可靠, 可控, None访问限制的
 */
const isValidImgURL = (url: string) => {
  const pexels = /^https?:\/\/(?:[a-zA-Z0-9-]+\.)*pexels\.com\/[^\s]+\.(?:jpg|jpeg|png|svg|webp)(?:\?.*)?$/i.test(url)
  const pptist = /^https?:\/\/(?:[a-zA-Z0-9-]+\.)*pptist\.cn\/[^\s]+\.(?:jpg|jpeg|png|svg|webp)(?:\?.*)?$/i.test(url)
  return pexels || pptist
}

export default () => {
  const { shiftKeyState } = storeToRefs(useKeyboardStore())

  const { createTextElement, createImageElement } = useCreateElement()
  const { addElementsFromData, addSlidesFromData } = useAddSlidesOrElements()

  /**
   * Paste普通Text: 创建为新的Text元素
   * @param text Text
   */
  const createTextElementFromClipboard = (text: string) => {
    createTextElement({
      left: 0,
      top: 0,
      width: 600,
      height: 50,
    }, { content: text })
  }

  /**
   * 解析剪贴板Content, 根据解析结果Select合适的Paste方式
   * @param text 剪贴板Content
   * @param options 配置项: onlySlide -- 仅处理页面Paste; onlyElements -- 仅处理元素Paste; 
   */
  const pasteTextClipboardData = (text: string, options?: PasteTextClipboardDataOptions) => {
    const onlySlide = options?.onlySlide || false
    const onlyElements = options?.onlyElements || false

    const clipboardData = pasteCustomClipboardString(text)

    // 元素或页面
    if (typeof clipboardData === 'object') {
      const { type, data } = clipboardData

      if (type === 'elements' && !onlySlide) addElementsFromData(data)
      else if (type === 'slides' && !onlyElements) addSlidesFromData(data)
    }

    // 普通Text
    else if (!onlyElements && !onlySlide) {
      // 普通Text
      if (shiftKeyState.value) {
        const string = parseText2Paragraphs(clipboardData)
        createTextElementFromClipboard(string)
      }
      else {
        // 尝试检查是否为Image地址链接
        if (isValidImgURL(clipboardData)) {
          createImageElement(clipboardData)
        }
        // 尝试检查是否为Hyperlink
        else if (isValidURL(clipboardData)) {
          createTextElementFromClipboard(`<a href="${clipboardData}" title="${clipboardData}" target="_blank">${clipboardData}</a>`)
        }
        // 尝试检查是否为SVG代码
        else if (isSVGString(clipboardData)) {
          const file = svg2File(clipboardData)
          getImageDataURL(file).then(dataURL => createImageElement(dataURL))
        }
        // 普通Text
        else {
          const string = parseText2Paragraphs(clipboardData)
          createTextElementFromClipboard(string)
        }
      }
    }
  }

  return {
    pasteTextClipboardData,
  }
}