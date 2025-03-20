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

export type CSSUnit = `${number}${'px' | '%' | 'rem' | 'em' | 'vh' | 'vw'}`

export interface VerticalCarouselProps {
  width?: CSSUnit
  height?: CSSUnit
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

export interface ValidationError {
  prop: string
  message: string
}

export const validateCarouselProps = (props: VerticalCarouselProps): ValidationError[] => {
  const errors: ValidationError[] = []

  // items 검증
  if (!props.items?.length) {
    errors.push({
      prop: 'items',
      message: 'At least one item is required'
    })
  }

  // interval 검증
  if (props.interval != null && props.interval < 0) {
    errors.push({
      prop: 'interval',
      message: 'Interval must be a non-negative number'
    })
  }

  // duration 검증
  if (props.duration != null && props.duration <= 0) {
    errors.push({
      prop: 'duration',
      message: 'Duration must be greater than 0'
    })
  }

  // width, height 형식 검증
  const dimensionRegex = /^(\d+(\.\d+)?)(px|%|rem|em|vh|vw)$/
  if (props.width && !dimensionRegex.test(props.width)) {
    errors.push({
      prop: 'width',
      message: 'Width must be a valid CSS dimension (e.g., 100%, 200px)'
    })
  }

  if (props.height && !dimensionRegex.test(props.height)) {
    errors.push({
      prop: 'height',
      message: 'Height must be a valid CSS dimension (e.g., 300px, 50vh)'
    })
  }

  return errors
}
