import tinycolor from 'tinycolor2'
import { nanoid } from 'nanoid'
import type { LinePoint, PPTElement, PPTLineElement, Slide } from '@/types/slides'

interface RotatedElementData {
  left: number
  top: number
  width: number
  height: number
  rotate: number
}

interface Point {
  x: number
  y: number
}

interface AbsoluteLinePoints {
  start: Point
  end: Point
  broken?: Point
  broken2?: Point
  curve?: Point
  cubic?: [Point, Point]
}

interface IdMap {
  [id: string]: string
}

/**
 * 计算元素在画布Medium的Rectangle范围Rotate后的新Position范围
 * @param element 元素的PositionLargeSmall和Rotate角度信息
 */
export const getRectRotatedRange = (element: RotatedElementData) => {
  const { left, top, width, height, rotate = 0 } = element

  const radius = Math.sqrt( Math.pow(width, 2) + Math.pow(height, 2) ) / 2
  const auxiliaryAngle = Math.atan(height / width) * 180 / Math.PI

  const tlbraRadian = (180 - rotate - auxiliaryAngle) * Math.PI / 180
  const trblaRadian = (auxiliaryAngle - rotate) * Math.PI / 180

  const middleLeft = left + width / 2
  const middleTop = top + height / 2

  const xAxis = [
    middleLeft + radius * Math.cos(tlbraRadian),
    middleLeft + radius * Math.cos(trblaRadian),
    middleLeft - radius * Math.cos(tlbraRadian),
    middleLeft - radius * Math.cos(trblaRadian),
  ]
  const yAxis = [
    middleTop - radius * Math.sin(tlbraRadian),
    middleTop - radius * Math.sin(trblaRadian),
    middleTop + radius * Math.sin(tlbraRadian),
    middleTop + radius * Math.sin(trblaRadian),
  ]

  return {
    xRange: [Math.min(...xAxis), Math.max(...xAxis)],
    yRange: [Math.min(...yAxis), Math.max(...yAxis)],
  }
}

/**
 * 计算元素在画布Medium的Rectangle范围Rotate后的新Position与Rotate之前Position的偏离距离
 * @param element 元素的PositionLargeSmall和Rotate角度信息
 */
export const getRectRotatedOffset = (element: RotatedElementData) => {
  const { xRange: originXRange, yRange: originYRange } = getRectRotatedRange({
    left: element.left,
    top: element.top,
    width: element.width,
    height: element.height,
    rotate: 0,
  })
  const { xRange: rotatedXRange, yRange: rotatedYRange } = getRectRotatedRange({
    left: element.left,
    top: element.top,
    width: element.width,
    height: element.height,
    rotate: element.rotate,
  })
  return {
    offsetX: rotatedXRange[0] - originXRange[0],
    offsetY: rotatedYRange[0] - originYRange[0],
  }
}

/**
 * 计算元素在画布Medium的Position范围
 * @param element 元素信息
 */
export const getElementRange = (element: PPTElement) => {
  let minX, maxX, minY, maxY

  if (element.type === 'line') {
    minX = element.left
    maxX = element.left + Math.max(element.start[0], element.end[0])
    minY = element.top
    maxY = element.top + Math.max(element.start[1], element.end[1])
  }
  else if ('rotate' in element && element.rotate) {
    const { left, top, width, height, rotate } = element
    const { xRange, yRange } = getRectRotatedRange({ left, top, width, height, rotate })
    minX = xRange[0]
    maxX = xRange[1]
    minY = yRange[0]
    maxY = yRange[1]
  }
  else {
    minX = element.left
    maxX = element.left + element.width
    minY = element.top
    maxY = element.top + element.height
  }
  return { minX, maxX, minY, maxY }
}

/**
 * 计算一组元素在画布Medium的Position范围
 * @param elementList 一组元素信息
 */
export const getElementListRange = (elementList: PPTElement[]) => {
  const leftValues: number[] = []
  const topValues: number[] = []
  const rightValues: number[] = []
  const bottomValues: number[] = []

  elementList.forEach(element => {
    const { minX, maxX, minY, maxY } = getElementRange(element)
    leftValues.push(minX)
    topValues.push(minY)
    rightValues.push(maxX)
    bottomValues.push(maxY)
  })

  const minX = Math.min(...leftValues)
  const maxX = Math.max(...rightValues)
  const minY = Math.min(...topValues)
  const maxY = Math.max(...bottomValues)

  return { minX, maxX, minY, maxY }
}

const ROTATABLE_GROUP_ELEMENT_TYPES = ['text', 'image', 'shape', 'line']

/**
 * 判断当前选Medium的元素是否为同一个Group的完整成员
 * @param elements 选Medium的元素列表
 */
export const isSingleGroupSelection = (elements: PPTElement[]) => {
  if (elements.length < 2) return false

  const groupId = elements[0].groupId
  if (!groupId) return false

  return elements.every(element => element.groupId === groupId)
}

/**
 * 判断当前Group是否允许执行统一Rotate
 * @param elements Group成员列表
 */
export const canRotateGroupElements = (elements: PPTElement[]) => {
  if (!isSingleGroupSelection(elements)) return false

  return elements.every(element => {
    if (!ROTATABLE_GROUP_ELEMENT_TYPES.includes(element.type)) return false
    if (element.type === 'line' && (element.broken || element.broken2 || element.curve || element.cubic)) return false
    return true
  })
}

/**
 * 计算一组元素整体范围的Medium心Point
 * @param elements 元素列表
 * @param rotate Group整体的Rotate参照角度, 会先By该角度对齐后再计算Medium心Point
 */
export const getGroupElementCenter = (elements: PPTElement[], rotate = 0) => {
  const { minX, maxX, minY, maxY } = getElementListRangeByRotate(elements, rotate)
  const alignedCenter = {
    x: (minX + maxX) / 2,
    y: (minY + maxY) / 2,
  }

  if (!rotate) return alignedCenter

  return rotatePoint(alignedCenter, { x: 0, y: 0 }, rotate)
}

/**
 * 计算Rectangle类元素四个顶Point在画布Medium的绝对Position
 * @param element Rectangle类元素
 */
const getRectElementPoints = (element: Exclude<PPTElement, PPTLineElement>) => {
  const center = {
    x: element.left + element.width / 2,
    y: element.top + element.height / 2,
  }
  const points = [
    { x: center.x - element.width / 2, y: center.y - element.height / 2 },
    { x: center.x + element.width / 2, y: center.y - element.height / 2 },
    { x: center.x + element.width / 2, y: center.y + element.height / 2 },
    { x: center.x - element.width / 2, y: center.y + element.height / 2 },
  ]

  if (!element.rotate) return points

  return points.map(point => rotatePoint(point, center, element.rotate))
}

/**
 * 计算Line元素用于范围计算的绝对Position列表
 * @param element Line元素
 */
const getAbsoluteLinePointList = (element: PPTLineElement) => {
  const points = getAbsoluteLinePoints(element)
  return [points.start, points.end]
}

/**
 * By指定整体Rotate参照角度对齐后, 计算元素列表的范围
 * @param elements 元素列表
 * @param rotate Group整体的Rotate参照角度
 */
const getElementListRangeByRotate = (elements: PPTElement[], rotate: number) => {
  const xValues: number[] = []
  const yValues: number[] = []

  elements.forEach(element => {
    const points = element.type === 'line' ? getAbsoluteLinePointList(element) : getRectElementPoints(element)
    const rotatedPoints = rotate ? points.map(point => rotatePoint(point, { x: 0, y: 0 }, -rotate)) : points
    xValues.push(...rotatedPoints.map(point => point.x))
    yValues.push(...rotatedPoints.map(point => point.y))
  })

  return {
    minX: Math.min(...xValues),
    maxX: Math.max(...xValues),
    minY: Math.min(...yValues),
    maxY: Math.max(...yValues),
  }
}

/**
 * 将角度规范到 [-180, 180] 区间内
 * @param angle 原始角度
 */
export const normalizeAngle = (angle: number) => {
  let result = angle
  while (result > 180) result -= 360
  while (result < -180) result += 360
  return result
}

/**
 * 计算一个Point绕指定Medium心PointRotate后的Position
 * @param point 目标Point
 * @param center RotateMedium心Point
 * @param angle Rotate角度
 */
export const rotatePoint = (point: Point, center: Point, angle: number): Point => {
  const radian = angle * Math.PI / 180
  const deltaX = point.x - center.x
  const deltaY = point.y - center.y

  return {
    x: center.x + deltaX * Math.cos(radian) - deltaY * Math.sin(radian),
    y: center.y + deltaX * Math.sin(radian) + deltaY * Math.cos(radian),
  }
}

/**
 * RotateRectangle类元素: 通过Rotate元素Medium心Point并叠加自身Rotate角度实现
 * @param element 元素
 * @param center GroupRotateMedium心Point
 * @param angle Rotate角度
 */
export const rotateRectLikeElement = (element: Exclude<PPTElement, PPTLineElement>, center: Point, angle: number) => {
  const elementCenter = {
    x: element.left + element.width / 2,
    y: element.top + element.height / 2,
  }
  const nextCenter = rotatePoint(elementCenter, center, angle)

  return {
    ...element,
    left: nextCenter.x - element.width / 2,
    top: nextCenter.y - element.height / 2,
    rotate: normalizeAngle(element.rotate + angle),
  }
}

/**
 * 将Line元素的Point位转换为画布Medium的绝对Position
 * @param element Line元素
 */
const getAbsoluteLinePoints = (element: PPTLineElement): AbsoluteLinePoints => {
  const toAbsolutePoint = (point: [number, number]) => ({
    x: element.left + point[0],
    y: element.top + point[1],
  })

  const points: AbsoluteLinePoints = {
    start: toAbsolutePoint(element.start),
    end: toAbsolutePoint(element.end),
  }

  if (element.broken) points.broken = toAbsolutePoint(element.broken)
  if (element.broken2) points.broken2 = toAbsolutePoint(element.broken2)
  if (element.curve) points.curve = toAbsolutePoint(element.curve)
  if (element.cubic) {
    points.cubic = [
      toAbsolutePoint(element.cubic[0]),
      toAbsolutePoint(element.cubic[1]),
    ]
  }

  return points
}

/**
 * 将Line元素的All绝对Point位绕指定Medium心PointRotate
 * @param points Line绝对Point位
 * @param center GroupRotateMedium心Point
 * @param angle Rotate角度
 */
const rotateAbsoluteLinePoints = (points: AbsoluteLinePoints, center: Point, angle: number): AbsoluteLinePoints => {
  const rotated: AbsoluteLinePoints = {
    start: rotatePoint(points.start, center, angle),
    end: rotatePoint(points.end, center, angle),
  }

  if (points.broken) rotated.broken = rotatePoint(points.broken, center, angle)
  if (points.broken2) rotated.broken2 = rotatePoint(points.broken2, center, angle)
  if (points.curve) rotated.curve = rotatePoint(points.curve, center, angle)
  if (points.cubic) {
    rotated.cubic = [
      rotatePoint(points.cubic[0], center, angle),
      rotatePoint(points.cubic[1], center, angle),
    ]
  }

  return rotated
}

/**
 * 根据Rotate后的绝对Point位重建Line元素
 * @param element 原Line元素
 * @param points Rotate后的绝对Point位
 */
const rebuildLineElement = (element: PPTLineElement, points: AbsoluteLinePoints): PPTLineElement => {
  const allPoints = [points.start, points.end]
  if (points.broken) allPoints.push(points.broken)
  if (points.broken2) allPoints.push(points.broken2)
  if (points.curve) allPoints.push(points.curve)
  if (points.cubic) allPoints.push(...points.cubic)

  const left = Math.min(...allPoints.map(point => point.x))
  const top = Math.min(...allPoints.map(point => point.y))
  const toRelativePoint = (point: Point): [number, number] => [point.x - left, point.y - top]

  const nextElement: PPTLineElement = {
    ...element,
    left,
    top,
    start: toRelativePoint(points.start),
    end: toRelativePoint(points.end),
  }

  if (points.broken) nextElement.broken = toRelativePoint(points.broken)
  else delete nextElement.broken

  if (points.broken2) nextElement.broken2 = toRelativePoint(points.broken2)
  else delete nextElement.broken2

  if (points.curve) nextElement.curve = toRelativePoint(points.curve)
  else delete nextElement.curve

  if (points.cubic) {
    nextElement.cubic = [
      toRelativePoint(points.cubic[0]),
      toRelativePoint(points.cubic[1]),
    ]
  }
  else delete nextElement.cubic

  return nextElement
}

/**
 * RotateLine元素: 将All控制PointRotate后重建Line数据
 * @param element Line元素
 * @param center GroupRotateMedium心Point
 * @param angle Rotate角度
 */
export const rotateLineElement = (element: PPTLineElement, center: Point, angle: number) => {
  const absolutePoints = getAbsoluteLinePoints(element)
  const rotatedPoints = rotateAbsoluteLinePoints(absolutePoints, center, angle)
  return rebuildLineElement(element, rotatedPoints)
}

export const getLineElementLength = (element: PPTLineElement) => {
  const deltaX = element.end[0] - element.start[0]
  const deltaY = element.end[1] - element.start[1]
  const len = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
  return len
}

export const getBroken2LineDirection = (element: PPTLineElement) => {
  if (element.broken2Direction) return element.broken2Direction

  const { minX, maxX, minY, maxY } = getElementRange(element)
  return maxX - minX >= maxY - minY ? 'horizontal' : 'vertical'
}

export interface AlignLine {
  value: number
  range: [number, number]
}

/**
 * 将一组对齐吸附线进行去重: 同Position的的多条对齐吸附线仅留下一条, 取该Position所有对齐吸附线的最LargeValue和最SmallValue为新的范围
 * @param lines 一组对齐吸附线信息
 */
export const uniqAlignLines = (lines: AlignLine[]) => {
  const uniqLines: AlignLine[] = []
  lines.forEach(line => {
    const index = uniqLines.findIndex(_line => _line.value === line.value)
    if (index === -1) uniqLines.push(line)
    else {
      const uniqLine = uniqLines[index]
      const rangeMin = Math.min(uniqLine.range[0], line.range[0])
      const rangeMax = Math.max(uniqLine.range[1], line.range[1])
      const range: [number, number] = [rangeMin, rangeMax]
      const _line = { value: line.value, range }
      uniqLines[index] = _line
    }
  })
  return uniqLines
}

/**
 * 以页面列表为基础, 为每一个页面Generate新的ID, 并Off联到旧ID形成一个字典
 * 主要用于页面元素时, 维持数据Medium各处页面ID原有的Off系
 * @param slides 页面列表
 */
export const createSlideIdMap = (slides: Slide[]) => {
  const slideIdMap: IdMap = {}
  for (const slide of slides) {
    slideIdMap[slide.id] = nanoid(10)
  }
  return slideIdMap
}

/**
   * 以元素列表为基础, 为每一个元素Generate新的ID, 并Off联到旧ID形成一个字典
   * 主要用于Copy元素时, 维持数据Medium各处元素ID原有的Off系
   * 例如: 原本两个Group的元素拥有相同的groupId, Copy后依然会拥有另一个相同的groupId
   * @param elements 元素列表数据
   */
export const createElementIdMap = (elements: PPTElement[]) => {
  const groupIdMap: IdMap = {}
  const elIdMap: IdMap = {}
  for (const element of elements) {
    const groupId = element.groupId
    if (groupId && !groupIdMap[groupId]) {
      groupIdMap[groupId] = nanoid(10)
    }
    elIdMap[element.id] = nanoid(10)
  }
  return {
    groupIdMap,
    elIdMap,
  }
}

/**
 * 根据Table的Theme色, 获取对应用于配色的子Color
 * @param themeColor Theme色
 */
export const getTableSubThemeColor = (themeColor: string) => {
  const rgba = tinycolor(themeColor)
  return [
    rgba.setAlpha(0.3).toRgbString(),
    rgba.setAlpha(0.1).toRgbString(),
  ]
}

/**
 * 获取Line元素路径字符串
 * @param element Line元素
 */
export const getLineElementPath = (element: PPTLineElement) => {
  const start = element.start.join(',')
  const end = element.end.join(',')
  if (element.broken) {
    const mid = element.broken.join(',')
    return `M${start} L${mid} L${end}`
  }
  else if (element.broken2) {
    const direction = getBroken2LineDirection(element)
    if (direction === 'horizontal') return `M${start} L${element.broken2[0]},${element.start[1]} L${element.broken2[0]},${element.end[1]} ${end}`
    return `M${start} L${element.start[0]},${element.broken2[1]} L${element.end[0]},${element.broken2[1]} ${end}`
  }
  else if (element.curve) {
    const mid = element.curve.join(',')
    return `M${start} Q${mid} ${end}`
  }
  else if (element.cubic) {
    const [c1, c2] = element.cubic
    const p1 = c1.join(',')
    const p2 = c2.join(',')
    return `M${start} C${p1} ${p2} ${end}`
  }
  return `M${start} L${end}`
}

/**
 * 根据Line端PointType和线宽, 计算渲染时线身需要向内收缩的距离
 * @param point Line端PointType
 * @param width Line宽度
 */
const getLinePointRetractionOffset = (point: LinePoint, width: number) => {
  const size = width < 2 ? 2 : width
  if (point === 'arrow') return size
  if (point === 'dot') return size / 2
  return 0
}

/**
 * 计算两个LinePoint位between的距离
 * @param p1 第一个Point
 * @param p2 第二个Point
 */
const getLinePointDistance = (p1: [number, number], p2: [number, number]) => {
  const deltaX = p2[0] - p1[0]
  const deltaY = p2[1] - p1[1]
  return Math.sqrt(deltaX * deltaX + deltaY * deltaY)
}

/**
 * By指定偏移距离, 将LinePoint位沿目标Point方向平移
 * @param point 当前Point
 * @param target 目标Point
 * @param offset 偏移距离
 */
const getLinePointByOffset = (
  point: [number, number],
  target: [number, number],
  offset: number,
) => {
  const distance = getLinePointDistance(point, target)
  if (!distance) return point

  const ratio = offset / distance
  return [
    point[0] + (target[0] - point[0]) * ratio,
    point[1] + (target[1] - point[1]) * ratio,
  ] as [number, number]
}

/**
 * 获取Line在路径起Point和终Point处对应的相邻控制Point, 用于计算端Point内缩方向
 * @param element Line元素
 */
const getLinePathTurningPoints = (element: PPTLineElement) => {
  if (element.broken) return [element.broken]

  if (element.broken2) {
    const direction = getBroken2LineDirection(element)
    if (direction === 'horizontal') {
      return [
        [element.broken2[0], element.start[1]],
        [element.broken2[0], element.end[1]],
      ] as [number, number][]
    }
    return [
      [element.start[0], element.broken2[1]],
      [element.end[0], element.broken2[1]],
    ] as [number, number][]
  }

  if (element.curve) return [element.curve]
  if (element.cubic) return [element.cubic[0], element.cubic[1]]
  return []
}

/**
 * 获取Line元素用于实际渲染的路径字符串: 
 * 保持端Point marker 仍对齐原始 start/end, 仅将可见线身在两端By需向内收缩
 * @param element Line元素
 */
export const getLineElementRenderPath = (element: PPTLineElement) => {
  const turningPoints = getLinePathTurningPoints(element)

  let start = element.start
  let end = element.end

  const startOffset = getLinePointRetractionOffset(element.points[0], element.width)
  const endOffset = getLinePointRetractionOffset(element.points[1], element.width)

  if (startOffset) {
    const nextPoint = turningPoints[0] || element.end
    const offset = Math.min(startOffset, getLinePointDistance(element.start, nextPoint) / 2)
    start = getLinePointByOffset(element.start, nextPoint, offset)
  }

  if (endOffset) {
    const prevPoint = turningPoints[turningPoints.length - 1] || element.start
    const offset = Math.min(endOffset, getLinePointDistance(prevPoint, element.end) / 2)
    end = getLinePointByOffset(element.end, prevPoint, offset)
  }

  const startPoint = start.join(',')
  const endPoint = end.join(',')
  if (element.broken) {
    const mid = element.broken.join(',')
    return `M${startPoint} L${mid} L${endPoint}`
  }
  else if (element.broken2) {
    const direction = getBroken2LineDirection(element)
    if (direction === 'horizontal') return `M${startPoint} L${element.broken2[0]},${element.start[1]} L${element.broken2[0]},${element.end[1]} ${endPoint}`
    return `M${startPoint} L${element.start[0]},${element.broken2[1]} L${element.end[0]},${element.broken2[1]} ${endPoint}`
  }
  else if (element.curve) {
    const mid = element.curve.join(',')
    return `M${startPoint} Q${mid} ${endPoint}`
  }
  else if (element.cubic) {
    const [c1, c2] = element.cubic
    const p1 = c1.join(',')
    const p2 = c2.join(',')
    return `M${startPoint} C${p1} ${p2} ${endPoint}`
  }
  return `M${startPoint} L${endPoint}`
}

/**
 * 判断一个元素是否在可视范围内
 * @param element 元素
 * @param parent 父元素
 */
export const isElementInViewport = (element: HTMLElement, parent: HTMLElement): boolean => {
  const elementRect = element.getBoundingClientRect()
  const parentRect = parent.getBoundingClientRect()

  return (
    elementRect.top >= parentRect.top &&
    elementRect.bottom <= parentRect.bottom
  )
}
