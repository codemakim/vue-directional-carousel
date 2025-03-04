import { type ComputedRef } from "vue"

export type VerticalCarouselItem = string | { src: string }

export type CarouselComputedItemsType = ComputedRef<{ src: string }[]>

export type ArrowOptions = {
  show?: boolean
  image?: string
}

export type Direction = 'left' | 'right' | 'up' | 'down'

export type DirectionProps = {
  isHorizontal: boolean
  isReverse: boolean
  flexDirection: 'row' | 'row-reverse' | 'column' | 'column-reverse'
}

export interface VerticalCarouselProps {
  width?: string
  height?: string
  items: VerticalCarouselItem[]
  direction?: Direction
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

export const validateCarouselProps = (props: VerticalCarouselProps): string | true => {
  if (!props.items?.length) {
    return 'At least one item is required'
  }

  if (props.interval != null && props.interval < 0) {
    return 'Interval must be a non-negative number'
  }

  if (props.duration != null && props.duration <= 0) {
    return 'Duration must be greater than 0'
  }

  return true
}
