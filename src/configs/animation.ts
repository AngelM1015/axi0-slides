import type { TurningMode } from '@/types/slides'

export const ANIMATION_DEFAULT_DURATION = 1000
export const ANIMATION_DEFAULT_TRIGGER = 'click'
export const ANIMATION_CLASS_PREFIX = 'animate__'

export const ENTER_ANIMATIONS = [
  {
    type: 'bounce',
    name: 'Bounce',
    children: [
      { name: 'Pop in', value: 'bounceIn' },
      { name: 'Pop in right', value: 'bounceInLeft' },
      { name: 'Pop in left', value: 'bounceInRight' },
      { name: 'Pop in up', value: 'bounceInUp' },
      { name: 'Pop in down', value: 'bounceInDown' },
    ],
  },
  {
    type: 'fade',
    name: 'Float in',
    children: [
      { name: 'Float in', value: 'fadeIn' },
      { name: 'Float in down', value: 'fadeInDown' },
      { name: 'Float in down (far)', value: 'fadeInDownBig' },
      { name: 'Float in right', value: 'fadeInLeft' },
      { name: 'Float in right (far)', value: 'fadeInLeftBig' },
      { name: 'Float in left', value: 'fadeInRight' },
      { name: 'Float in left (far)', value: 'fadeInRightBig' },
      { name: 'Float in up', value: 'fadeInUp' },
      { name: 'Float in up (far)', value: 'fadeInUpBig' },
      { name: 'Float in from top-left', value: 'fadeInTopLeft' },
      { name: 'Float in from top-right', value: 'fadeInTopRight' },
      { name: 'Float in from bottom-left', value: 'fadeInBottomLeft' },
      { name: 'Float in from bottom-right', value: 'fadeInBottomRight' },
    ],
  },
  {
    type: 'rotate',
    name: 'Rotate',
    children: [
      { name: 'Rotate in', value: 'rotateIn' },
      { name: 'Rotate in around bottom-left', value: 'rotateInDownLeft' },
      { name: 'Rotate in around bottom-right', value: 'rotateInDownRight' },
      { name: 'Rotate in around top-left', value: 'rotateInUpLeft' },
      { name: 'Rotate in around top-right', value: 'rotateInUpRight' },
    ],
  },
  {
    type: 'zoom',
    name: 'Zoom',
    children: [
      { name: 'Zoom in', value: 'zoomIn' },
      { name: 'Zoom in downward', value: 'zoomInDown' },
      { name: 'Zoom in from left', value: 'zoomInLeft' },
      { name: 'Zoom in from right', value: 'zoomInRight' },
      { name: 'Zoom in upward', value: 'zoomInUp' },
    ],
  },
  {
    type: 'slide',
    name: 'Slide in',
    children: [
      { name: 'Slide in down', value: 'slideInDown' },
      { name: 'Slide in from right', value: 'slideInLeft' },
      { name: 'Slide in from left', value: 'slideInRight' },
      { name: 'Slide in up', value: 'slideInUp' },
    ],
  },
  {
    type: 'flip',
    name: 'Flip',
    children: [
      { name: 'XFlip in', value: 'flipInX' },
      { name: 'YFlip in', value: 'flipInY' },
    ],
  },
  {
    type: 'back',
    name: 'Slide in zooming',
    children: [
      { name: 'Slide in zooming down', value: 'backInDown' },
      { name: 'Slide in zooming from left', value: 'backInLeft' },
      { name: 'Slide in zooming from right', value: 'backInRight' },
      { name: 'Slide in zooming up', value: 'backInUp' },
    ],
  },
  {
    type: 'lightSpeed',
    name: 'Fly in',
    children: [
      { name: 'Fly in from right', value: 'lightSpeedInRight' },
      { name: 'Fly in from left', value: 'lightSpeedInLeft' },
    ],
  },
]

export const EXIT_ANIMATIONS = [
  {
    type: 'bounce',
    name: 'Bounce',
    children: [
      { name: 'Pop out', value: 'bounceOut' },
      { name: 'Pop out left', value: 'bounceOutLeft' },
      { name: 'Pop out right', value: 'bounceOutRight' },
      { name: 'Pop out up', value: 'bounceOutUp' },
      { name: 'Pop out down', value: 'bounceOutDown' },
    ],
  },
  {
    type: 'fade',
    name: 'Float in',
    children: [
      { name: 'Float out', value: 'fadeOut' },
      { name: 'Float out down', value: 'fadeOutDown' },
      { name: 'Float out down (far)', value: 'fadeOutDownBig' },
      { name: 'Float out left', value: 'fadeOutLeft' },
      { name: 'Float out left (far)', value: 'fadeOutLeftBig' },
      { name: 'Float out right', value: 'fadeOutRight' },
      { name: 'Float out right (far)', value: 'fadeOutRightBig' },
      { name: 'Float out up', value: 'fadeOutUp' },
      { name: 'Float out up (far)', value: 'fadeOutUpBig' },
      { name: 'Float out to top-left', value: 'fadeOutTopLeft' },
      { name: 'Float out to top-right', value: 'fadeOutTopRight' },
      { name: 'Float out to bottom-left', value: 'fadeOutBottomLeft' },
      { name: 'Float out to bottom-right', value: 'fadeOutBottomRight' },
    ],
  },
  {
    type: 'rotate',
    name: 'Rotate',
    children: [
      { name: 'Rotate out', value: 'rotateOut' },
      { name: 'Rotate out around bottom-left', value: 'rotateOutDownLeft' },
      { name: 'Rotate out around bottom-right', value: 'rotateOutDownRight' },
      { name: 'Rotate out around top-left', value: 'rotateOutUpLeft' },
      { name: 'Rotate out around top-right', value: 'rotateOutUpRight' },
    ],
  },
  {
    type: 'zoom',
    name: 'Zoom',
    children: [
      { name: 'Zoom out', value: 'zoomOut' },
      { name: 'Zoom out downward', value: 'zoomOutDown' },
      { name: 'Zoom out to left', value: 'zoomOutLeft' },
      { name: 'Zoom out to right', value: 'zoomOutRight' },
      { name: 'Zoom out upward', value: 'zoomOutUp' },
    ],
  },
  {
    type: 'slide',
    name: 'Slide out',
    children: [
      { name: 'Slide out down', value: 'slideOutDown' },
      { name: 'Slide out to left', value: 'slideOutLeft' },
      { name: 'Slide out to right', value: 'slideOutRight' },
      { name: 'Slide out up', value: 'slideOutUp' },
    ],
  },
  {
    type: 'flip',
    name: 'Flip',
    children: [
      { name: 'XFlip out', value: 'flipOutX' },
      { name: 'YFlip out', value: 'flipOutY' },
    ],
  },
  {
    type: 'back',
    name: 'Slide out shrinking',
    children: [
      { name: 'Slide out shrinking down', value: 'backOutDown' },
      { name: 'Slide out shrinking to left', value: 'backOutLeft' },
      { name: 'Slide out shrinking to right', value: 'backOutRight' },
      { name: 'Slide out shrinking up', value: 'backOutUp' },
    ],
  },
  {
    type: 'lightSpeed',
    name: 'Fly out',
    children: [
      { name: 'Fly out to right', value: 'lightSpeedOutRight' },
      { name: 'Fly out to left', value: 'lightSpeedOutLeft' },
    ],
  },
]

export const ATTENTION_ANIMATIONS = [
  {
    type: 'shake',
    name: 'Shake',
    children: [
      { name: 'Shake horizontally', value: 'shakeX' },
      { name: 'Shake vertically', value: 'shakeY' },
      { name: 'Head shake', value: 'headShake' },
      { name: 'Swing', value: 'swing' },
      { name: 'Shake', value: 'wobble' },
      { name: 'Tada', value: 'tada' },
      { name: 'Jelly', value: 'jello' },
    ],
  },
  {
    type: 'other',
    name: 'Other',
    children: [
      { name: 'Bounce', value: 'bounce' },
      { name: 'Flash', value: 'flash' },
      { name: 'Pulse', value: 'pulse' },
      { name: 'Rubber band', value: 'rubberBand' },
      { name: 'Heartbeat (fast)', value: 'heartBeat' },
    ],
  },
]

interface SlideAnimation {
  label: string
  value: TurningMode
}

export const SLIDE_ANIMATIONS: SlideAnimation[] = [
  { label: 'None', value: 'no' },
  { label: 'Random', value: 'random' },
  { label: 'Push horizontally', value: 'slideX' },
  { label: 'Push vertically', value: 'slideY' },
  { label: 'Push horizontally (3D)', value: 'slideX3D' },
  { label: 'Push vertically (3D)', value: 'slideY3D' },
  { label: 'Fade', value: 'fade' },
  { label: 'Rotate', value: 'rotate' },
  { label: 'Wipe vertically', value: 'scaleY' },
  { label: 'Wipe horizontally', value: 'scaleX' },
  { label: 'Zoom in', value: 'scale' },
  { label: 'Zoom out', value: 'scaleReverse' },
]