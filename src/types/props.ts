// export interface VerticalCarouselItem {
//   title: string
//   url: string
// }

export type VerticalCarouselItem = string | { src: string }

export interface VerticalCarouselProps {
  width?: string
  height?: string
  items: VerticalCarouselItem[]
  direction: 'left' | 'right' | 'up' | 'down'
  duration?: number
  showPrev?: boolean
  showNext?: boolean
  interval?: number
  pauseAutoplayOnHover?: boolean
}
