// Enter fullscreen
export const enterFullscreen = () => {
  const docElm = document.documentElement
  // axi0-slides: without a user gesture inside the frame the browser refuses; the slide show then fills the frame
  if (docElm.requestFullscreen) docElm.requestFullscreen().catch(() => undefined)
  else if (docElm.mozRequestFullScreen) docElm.mozRequestFullScreen() 
  else if (docElm.webkitRequestFullScreen) docElm.webkitRequestFullScreen()
  else if (docElm.msRequestFullscreen) docElm.msRequestFullscreen()
}

// Exit fullscreen
export const exitFullscreen = () => {
  if (document.exitFullscreen) document.exitFullscreen()
  else if (document.mozCancelFullScreen) document.mozCancelFullScreen()
  else if (document.webkitExitFullscreen) document.webkitExitFullscreen()
  else if (document.msExitFullscreen) document.msExitFullscreen()
}

// 判断是否Fullscreen
export const isFullscreen = () => {
  const fullscreenElement = 
    document.fullscreenElement ||
    document.mozFullScreenElement ||
    document.webkitFullscreenElement ||
    document.msFullscreenElement ||
    document.webkitCurrentFullScreenElement
  return !!fullscreenElement
}