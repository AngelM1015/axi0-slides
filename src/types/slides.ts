export const enum ShapePathFormulasKeys {
  ROUND_RECT = 'roundRect',
  ROUND_RECT_DIAGONAL = 'roundRectDiagonal',
  ROUND_RECT_SINGLE = 'roundRectSingle',
  ROUND_RECT_SAMESIDE = 'roundRectSameSide',
  CUT_RECT_DIAGONAL = 'cutRectDiagonal',
  CUT_RECT_SINGLE = 'cutRectSingle',
  CUT_RECT_SAMESIDE = 'cutRectSameSide',
  CUT_ROUND_RECT = 'cutRoundRect',
  MESSAGE = 'message',
  ROUND_MESSAGE = 'roundMessage',
  L = 'L',
  RING_RECT = 'ringRect',
  PLUS = 'plus',
  TRIANGLE = 'triangle',
  PARALLELOGRAM_LEFT = 'parallelogramLeft',
  PARALLELOGRAM_RIGHT = 'parallelogramRight',
  TRAPEZOID = 'trapezoid',
  BULLET = 'bullet',
  INDICATOR = 'indicator',
  DONUT = 'donut',
  DIAGSTRIPE = 'diagStripe',
}

export const enum ElementTypes {
  TEXT = 'text',
  IMAGE = 'image',
  SHAPE = 'shape',
  LINE = 'line',
  CHART = 'chart',
  TABLE = 'table',
  LATEX = 'latex',
  VIDEO = 'video',
  AUDIO = 'audio',
}

/**
 * 渐变
 * 
 * type: 渐变Type (径向, Linear)
 * 
 * colors: 渐变Color列表 (pos: 百分比Position; color: Color)
 * 
 * rotate: 渐变角度 (Linear gradient)
 */
export type GradientType = 'linear' | 'radial'
export type GradientColor = {
  pos: number
  color: string
}
export interface Gradient {
  type: GradientType
  colors: GradientColor[]
  rotate: number
}

export type LineStyleType = 'solid' | 'dashed' | 'dotted'

/**
 * 元素阴影
 * 
 * h: Horizontal偏移量
 * 
 * v: Vertical偏移量
 * 
 * blur: Blur程度
 * 
 * color: 阴影Color
 */
export interface PPTElementShadow {
  h: number
  v: number
  blur: number
  color: string
}

/**
 * 元素Border
 * 
 * style?: BorderStyle (实线或虚线)
 * 
 * width?: Border宽度
 * 
 * color?: BorderColor
 */
export interface PPTElementOutline {
  style?: LineStyleType
  width?: number
  color?: string
}

export type ElementLinkType = 'web' | 'slide'

/**
 * 元素Hyperlink
 * 
 * type: 链接Type (网页, Slide pages)
 * 
 * target: 目标地址 (Web link, Slide pagesID)
 */
export interface PPTElementLink {
  type: ElementLinkType
  target: string
}

export type TextAlign = 'left' | 'center' | 'right' | 'justify'

export type TextAlignVertical = 'top' | 'middle' | 'bottom' 


/**
 * 元素General属性
 * 
 * id: 元素ID
 * 
 * left: 元素Horizontal方向Position (距离画布左侧)
 * 
 * top: 元素Vertical方向Position (距离画布顶部)
 * 
 * lock?: Lock元素
 * 
 * groupId?: GroupID (拥有相同GroupID的元素即为同一Group元素成员)
 * 
 * width: 元素宽度
 * 
 * height: 元素高度
 * 
 * rotate: Rotate角度
 * 
 * link?: Hyperlink
 * 
 * name?: 元素名
 */
interface PPTBaseElement {
  id: string
  left: number
  top: number
  lock?: boolean
  groupId?: string
  width: number
  height: number
  rotate: number
  link?: PPTElementLink
  name?: string
}


export type TextType = 'title' | 'subtitle' | 'content' | 'item' | 'itemTitle' | 'notes' | 'header' | 'footer' | 'partNumber' | 'itemNumber'
export type TextInset = [number, number, number, number]

/**
 * Text元素
 * 
 * type: 元素Type (text)
 * 
 * content: TextContent (HTML字符串)
 * 
 * defaultFontName: 默认字体 (会被TextContentMedium的HTML内联Style覆盖)
 * 
 * defaultColor: 默认Color (会被TextContentMedium的HTML内联Style覆盖)
 * 
 * outline?: Border
 * 
 * fill?: Fill色
 * 
 * lineHeight?: 行高 (x), 默认1.5
 * 
 * wordSpace?: 字间距, 默认0
 * 
 * opacity?: Opacity, 默认1
 * 
 * shadow?: 阴影
 * 
 * paragraphSpace?: 段间距, 默认5px
 * 
 * vertical?: PortraitText
 * 
 * textType?: TextType
 * 
 * inset?: 内边距 (上, 右, 下, 左), 默认[10, 10, 10, 10]
 *
 * fixedHeight?: 固定Text box自适应轴尺寸, 横排Text固定高度, 竖排Text固定宽度
 *
 * vAlign?: Text box内Vertical对齐方向, 仅fixedHeight为真时有效, 默认top
 */
export interface PPTTextElement extends PPTBaseElement {
  type: 'text'
  content: string
  defaultFontName: string
  defaultColor: string
  outline?: PPTElementOutline
  fill?: string
  lineHeight?: number
  wordSpace?: number
  opacity?: number
  shadow?: PPTElementShadow
  paragraphSpace?: number
  vertical?: boolean
  textType?: TextType
  inset?: TextInset
  fixedHeight?: boolean
  vAlign?: TextAlignVertical
}


/**
 * ImageFlip, ShapeFlip
 * 
 * flipH?: Flip horizontal
 * 
 * flipV?: Flip vertical
 */
export interface ImageOrShapeFlip {
  flipH?: boolean
  flipV?: boolean
}

/**
 * Image滤镜
 * 
 * https://developer.mozilla.org/zh-CN/docs/Web/CSS/filter
 * 
 * 'blur'?: Blur, 默认0 (px)
 * 
 * 'brightness'?: Brightness, 默认100 (%)
 * 
 * 'contrast'?: Contrast, 默认100 (%)
 * 
 * 'grayscale'?: Grayscale, 默认0 (%)
 * 
 * 'saturate'?: Saturation, 默认100 (%)
 * 
 * 'hue-rotate'?: HueRotate, 默认0 (deg)
 * 
 * 'opacity'?: Opacity, 默认100 (%)
 */
export type ImageElementFilterKeys = 'blur' | 'brightness' | 'contrast' | 'grayscale' | 'saturate' | 'hue-rotate' | 'opacity' | 'sepia' | 'invert'
export interface ImageElementFilters {
  'blur'?: string
  'brightness'?: string
  'contrast'?: string
  'grayscale'?: string
  'saturate'?: string
  'hue-rotate'?: string
  'sepia'?: string
  'invert'?: string
  'opacity'?: string
}

export type ImageClipDataRange = [[number, number], [number, number]]

/**
 * ImageCrop
 * 
 * range: Crop范围, 例如: [[10, 10], [90, 90]] 表示裁取原图从左上角 10%, 10% 到 90%, 90% 的范围
 * 
 * shape: CropShape, 见 configs/imageClip.ts CLIPPATHS 
 */
export interface ImageElementClip {
  range: ImageClipDataRange
  shape: string
}

export type ImageType = 'pageFigure' | 'itemFigure' | 'background'

/**
 * Image元素
 * 
 * type: 元素Type (image)
 * 
 * fixedRatio: 固定Image宽高比例
 * 
 * src: Image地址
 * 
 * outline?: Border
 * 
 * filters?: Image滤镜
 * 
 * clip?: Crop信息
 * 
 * flipH?: Flip horizontal
 * 
 * flipV?: Flip vertical
 * 
 * shadow?: 阴影
 * 
 * radius?: 圆角半径
 * 
 * colorMask?: Color蒙版
 * 
 * imageType?: ImageType
 */
export interface PPTImageElement extends PPTBaseElement {
  type: 'image'
  fixedRatio: boolean
  src: string
  outline?: PPTElementOutline
  filters?: ImageElementFilters
  clip?: ImageElementClip
  flipH?: boolean
  flipV?: boolean
  shadow?: PPTElementShadow
  radius?: number
  colorMask?: string
  imageType?: ImageType
}

/**
 * Shape内Text
 * 
 * content: TextContent (HTML字符串)
 * 
 * defaultFontName: 默认字体 (会被TextContentMedium的HTML内联Style覆盖)
 * 
 * defaultColor: 默认Color (会被TextContentMedium的HTML内联Style覆盖)
 * 
 * align: Text对齐方向 (Vertical方向)
 * 
 * lineHeight?: 行高 (x), 默认1.5
 * 
 * wordSpace?: 字间距, 默认0
 * 
 * paragraphSpace?: 段间距, 默认5px
 * 
 * type: TextType
 * 
 * inset?: Text内边距 (上, 右, 下, 左), 默认[10, 10, 10, 10]
 */
export interface ShapeText {
  content: string
  defaultFontName: string
  defaultColor: string
  align: TextAlignVertical
  lineHeight?: number
  wordSpace?: number
  paragraphSpace?: number
  inset?: TextInset
  type?: TextType
}

/**
 * Shape元素
 * 
 * type: 元素Type (shape)
 * 
 * viewBox: SVG的viewBox属性, 例如 [1000, 1000] 表示 '0 0 1000 1000'
 * 
 * path: Shape路径, SVG path 的 d 属性
 * 
 * fixedRatio: 固定Shape宽高比例
 * 
 * fill: Fill, 不存在渐变时生效
 * 
 * gradient?: 渐变, 该属性存在时将优先作为Fill
 * 
 * pattern?: 图案, 该属性存在时将优先作为Fill
 * 
 * outline?: Border
 * 
 * opacity?: Opacity
 * 
 * flipH?: Flip horizontal
 * 
 * flipV?: Flip vertical
 * 
 * shadow?: 阴影
 * 
 * special?: 特殊Shape (标记一些难以解析的Shape, 例如路径使用了 L Q C A 以外的Type, 该类Shape在Export后将变为Image的形式)
 * 
 * text?: Shape内Text
 * 
 * pathFormula?: Shape路径计算Formula
 * 一般情况下, Shape的LargeSmall变化时仅由宽高基于 viewBox 的Zoom比例来调整Shape, 而 viewBox 本身和 path 不会变化, 
 * 但也有一些Shape希望能更精确的控制一些Off键Point的Position, 此时就需要提供路径计算Formula, 通过在Zoom时更新 viewBox 并重新计算 path 来重新绘制Shape
 * 
 * keypoints?: Off键PointPosition百分比
 */
export interface PPTShapeElement extends PPTBaseElement {
  type: 'shape'
  viewBox: [number, number]
  path: string
  fixedRatio: boolean
  fill: string
  gradient?: Gradient
  pattern?: string
  outline?: PPTElementOutline
  opacity?: number
  flipH?: boolean
  flipV?: boolean
  shadow?: PPTElementShadow
  special?: boolean
  text?: ShapeText
  pathFormula?: ShapePathFormulasKeys
  keypoints?: number[]
}


export type LinePoint = '' | 'arrow' | 'dot' 
export type Broken2LineDirection = 'horizontal' | 'vertical'

/**
 * Line元素
 * 
 * type: 元素Type (line)
 * 
 * start: 起PointPosition ([x, y])
 * 
 * end: 终PointPosition ([x, y])
 * 
 * style: LineStyle (实线, 虚线, Point线)
 * 
 * color: LineColor
 * 
 * points: 端PointStyle ([起PointStyle, 终PointStyle], 可选: None, Arrow, 圆Point)
 * 
 * shadow?: 阴影
 * 
 * broken?: 折线控制PointPosition ([x, y])
 * 
 * broken2?: 双折线控制PointPosition ([x, y])
 * 
 * broken2Direction?: 双折线方向
 * 
 * curve?: 二次Curve控制PointPosition ([x, y])
 * 
 * cubic?: 三次Curve控制PointPosition ([[x1, y1], [x2, y2]])
 */
export interface PPTLineElement extends Omit<PPTBaseElement, 'height' | 'rotate'> {
  type: 'line'
  start: [number, number]
  end: [number, number]
  style: LineStyleType
  color: string
  points: [LinePoint, LinePoint]
  shadow?: PPTElementShadow
  broken?: [number, number]
  broken2?: [number, number]
  broken2Direction?: Broken2LineDirection
  curve?: [number, number]
  cubic?: [[number, number], [number, number]]
}


export type ChartType = 'bar' | 'column' | 'line' | 'pie' | 'ring' | 'area' | 'radar' | 'scatter'

export interface ChartOptions {
  lineSmooth?: boolean
  stack?: boolean
}

export interface ChartData {
  labels: string[]
  legends: string[]
  series: number[][]
}

/**
 * Chart元素
 * 
 * type: 元素Type (chart)
 * 
 * fill?: Fill色
 * 
 * chartType: Chart基础Type (bar/line/pie), 所有ChartType都是由这三种基本Type衍生而来
 * 
 * data: Chart数据
 * 
 * options: 扩展选项
 * 
 * outline?: Border
 * 
 * themeColors: Theme色
 * 
 * textColor?: Position和Text color
 * 
 * lineColor?: 网格Color
 */
export interface PPTChartElement extends PPTBaseElement {
  type: 'chart'
  fill?: string
  chartType: ChartType
  data: ChartData
  options?: ChartOptions
  outline?: PPTElementOutline
  themeColors: string[]
  textColor?: string
  lineColor?: string
}


/**
 * Table单元格Style
 * 
 * bold?: Bold
 * 
 * em?: Italic
 * 
 * underline?: Underline
 * 
 * strikethrough?: Strikethrough
 * 
 * color?: 字体Color
 * 
 * backcolor?: Fill色
 * 
 * fontsize?: 字体LargeSmall
 * 
 * fontname?: 字体
 * 
 * align?: 对齐方式
 */
export interface TableCellStyle {
  bold?: boolean
  em?: boolean
  underline?: boolean
  strikethrough?: boolean
  color?: string
  backcolor?: string
  fontsize?: string
  fontname?: string
  align?: TextAlign
  vAlign?: TextAlignVertical
}


/**
 * Table单元格
 * 
 * id: 单元格ID
 * 
 * colspan: 合并列数
 * 
 * rowspan: 合并行数
 * 
 * text: TextContent
 * 
 * style?: 单元格Style
 */
export interface TableCell {
  id: string
  colspan: number
  rowspan: number
  text: string
  style?: TableCellStyle
}

/**
 * TableTheme
 * 
 * color: Theme色
 * 
 * rowHeader: Header row
 * 
 * rowFooter: Total row
 * 
 * colHeader: First column
 * 
 * colFooter: Last column
 */
export interface TableTheme {
  color: string
  rowHeader: boolean
  rowFooter: boolean
  colHeader: boolean
  colFooter: boolean
}

/**
 * Table元素
 * 
 * type: 元素Type (table)
 * 
 * outline: Border
 * 
 * theme?: Theme
 * 
 * colWidths: 列宽数组, 如[0.3, 0.5, 0.2]表示三列宽度分别占总宽度的30%, 50%, 20%
 * 
 * cellMinHeight: 单元格最小高度
 *
 * rowHeights?: 各行最小高度
 * 
 * data: Table数据
 */
export interface PPTTableElement extends PPTBaseElement {
  type: 'table'
  outline: PPTElementOutline
  theme?: TableTheme
  colWidths: number[]
  cellMinHeight: number
  rowHeights?: number[]
  data: TableCell[][]
}


/**
 * LaTeX元素 (Formula)
 * 
 * type: 元素Type (latex)
 * 
 * latex: latex代码
 * 
 * path: svg path
 * 
 * color: Color
 * 
 * strokeWidth: 路径宽度
 * 
 * viewBox: SVG的viewBox属性
 * 
 * fixedRatio: 固定Shape宽高比例
 */
export interface PPTLatexElement extends PPTBaseElement {
  type: 'latex'
  latex: string
  path: string
  color: string
  strokeWidth: number
  viewBox: [number, number]
  fixedRatio: boolean
}

/**
 * Video元素
 * 
 * type: 元素Type (video)
 * 
 * src: Video地址
 * 
 * autoplay: AutoPlay
 * 
 * poster: PreviewCover
 * 
 * ext: Video后缀, 当资源链接缺少后缀时用该字段Confirm资源Type
 */
export interface PPTVideoElement extends PPTBaseElement {
  type: 'video'
  src: string
  autoplay: boolean
  poster?: string
  ext?: string
}

/**
 * Audio元素
 * 
 * type: 元素Type (audio)
 * 
 * fixedRatio: 固定图标宽高比例
 * 
 * color: 图标Color
 * 
 * loop: LoopPlay
 * 
 * autoplay: AutoPlay
 * 
 * src: Audio地址
 * 
 * ext: Audio后缀, 当资源链接缺少后缀时用该字段Confirm资源Type
 */
export interface PPTAudioElement extends PPTBaseElement {
  type: 'audio'
  fixedRatio: boolean
  color: string
  loop: boolean
  autoplay: boolean
  src: string
  ext?: string
}


export type PPTElement = PPTTextElement | PPTImageElement | PPTShapeElement | PPTLineElement | PPTChartElement | PPTTableElement | PPTLatexElement | PPTVideoElement | PPTAudioElement

export type AnimationType = 'in' | 'out' | 'attention'
export type AnimationTrigger = 'click' | 'meantime' | 'auto'

/**
 * 元素Animation
 * 
 * id: Animationid
 * 
 * elId: 元素ID
 * 
 * effect: Animation效果
 * 
 * type: AnimationType (Entrance, Exit, Emphasis)
 * 
 * duration: Animation持续时间
 * 
 * trigger: Animation触发方式(click - 单击时, meantime - With previous, auto - After previous)
 */
export interface PPTAnimation {
  id: string
  elId: string
  effect: string
  type: AnimationType
  duration: number
  trigger: AnimationTrigger
}

export type SlideBackgroundType = 'solid' | 'image' | 'gradient'
export type SlideBackgroundImageSize = 'cover' | 'contain' | 'repeat'
export interface SlideBackgroundImage {
  src: string
  size: SlideBackgroundImageSize,
}

/**
 * Slides背景
 * 
 * type: 背景Type (纯色, Image, 渐变)
 * 
 * color?: 背景Color (纯色)
 * 
 * image?: Image背景
 * 
 * gradientType?: 渐变背景
 */
export interface SlideBackground {
  type: SlideBackgroundType
  color?: string
  image?: SlideBackgroundImage
  gradient?: Gradient
}


export type TurningMode = 'no' | 'fade' | 'slideX' | 'slideY' | 'random' | 'slideX3D' | 'slideY3D' | 'rotate' | 'scaleY' | 'scaleX' | 'scale' | 'scaleReverse'

export interface NoteReply {
  id: string
  content: string
  time: number
  user: string
}

export interface Note {
  id: string
  content: string
  time: number
  user: string
  elId?: string
  replies?: NoteReply[]
}

export interface SectionTag {
  id: string
  title?: string
}

export type SlideType = 'cover' | 'contents' | 'transition' | 'content' | 'end'

/**
 * Slide pages
 * 
 * id: 页面ID
 * 
 * elements: 元素集合
 * 
 * notes?: 批注
 * 
 * remark?: 备注
 * 
 * background?: 页面背景
 * 
 * animations?: 元素Animation集合
 * 
 * turningMode?: 翻页方式
 * 
 * slideType?: 页面Type
 */
export interface Slide {
  id: string
  elements: PPTElement[]
  notes?: Note[]
  remark?: string
  background?: SlideBackground
  animations?: PPTAnimation[]
  turningMode?: TurningMode
  sectionTag?: SectionTag
  type?: SlideType
}

/**
 * SlidesTheme
 * 
 * backgroundColor: 页面背景Color
 * 
 * themeColor: Theme色, 用于默认创建的ShapeColor等
 * 
 * fontColor: 字体Color
 * 
 * fontName: 字体
 */
export interface SlideTheme {
  backgroundColor: string
  themeColors: string[]
  fontColor: string
  fontName: string
  outline: PPTElementOutline
  shadow: PPTElementShadow
}

export interface SlideTemplate {
  name: string
  id: string
  cover: string
  origin?: string
}
