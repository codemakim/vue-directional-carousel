import { type ComputedRef } from "vue"

export type VerticalCarouselItem = string | { src: string }

export type CarouselComputedItemsType = ComputedRef<{ src: string }[]>

export type ArrowOptions = {
  show?: boolean
  image?: string
}

export interface VerticalCarouselProps {
  width?: string
  height?: string
  items: VerticalCarouselItem[]
  direction?: 'left' | 'right' | 'up' | 'down'
  duration?: number
  showPrev?: boolean
  showNext?: boolean
  showDots?: boolean
  interval?: number
  arrowOptions?: {
    prev: ArrowOptions,
    next: ArrowOptions
  }
  pauseAutoplayOnHover?: boolean
}

export type DotButtonsProps = {
  currentIndex: number
  itemCount: number
  showDots: boolean
}
