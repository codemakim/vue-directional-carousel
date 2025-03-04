import { computed, ref, type Ref, type ComputedRef } from 'vue'
import { type VerticalCarouselProps, type CarouselComputedItemsType, type Direction, DirectionProps } from '@/types/props'

const DEFAULT_DURATION = 1000
const TRANSLATE = 'translate'

export default function useRenderTransition(
  props: VerticalCarouselProps,
  renderItems: CarouselComputedItemsType,
  currentIndex: Ref<number>,
  numberWidth: ComputedRef<number>,
  numberHeight: ComputedRef<number>,
) {
  const isTransitioning = ref(false)

  const directionProps = computed<DirectionProps>(() => {
    const direction = props.direction as Direction
    return {
      isHorizontal: ['left', 'right'].includes(direction),
      isReverse: ['up', 'left'].includes(direction),
      flexDirection: {
        'left': 'row',
        'right': 'row-reverse',
        'up': 'column',
        'down': 'column-reverse'
      }[direction] as DirectionProps['flexDirection']
    }
  })

  const axis = computed(() =>
    directionProps.value.isHorizontal ? numberWidth.value : numberHeight.value
  )

  const distinct = computed(() => {
    const length = renderItems.value.length
    const current = currentIndex.value % length

    return directionProps.value.isReverse
      ? current
      : length - (current + (1 % length))
  })

  const slideDistinct = computed(() => {
    return distinct.value * axis.value
  })

  const itemsTranslate = computed(() => {
    const axisName = directionProps.value.isHorizontal ? 'X' : 'Y'
    return `${TRANSLATE}${axisName}(-${slideDistinct.value}px)`
  })

  const defaultTransition = ref(`transform ${(props.duration ?? DEFAULT_DURATION) / 1000}s ease`)
  const transition = ref(defaultTransition.value)

  return {
    itemsTranslate,
    defaultTransition,
    transition,
    isTransitioning,
    directionProps,
  }
}