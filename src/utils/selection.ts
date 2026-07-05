// 清除Text选区
export const removeAllRanges = () => {
  const selection = window.getSelection()
  selection && selection.removeAllRanges()
}