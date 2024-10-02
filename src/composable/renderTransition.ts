import { computed, ref, type Ref, type ComputedRef } from 'vue'
import { type VerticalCarouselProps, type CarouselComputedItemsType } from '@/types/props';

const DEFAULT_DIRECTION = 'right';
const DEFAULT_DURATION = 1000;
const TRANSLATE = 'translate'


export default function useRenderTransition(
  props: VerticalCarouselProps,
  renderItems: CarouselComputedItemsType,
  currentIndex: Ref<number>,
  numberWidth: ComputedRef<number>,
  numberHeight: ComputedRef<number>,
) {
  // Value determining the axis
  const axis = computed(() =>
    ['left', 'right'].includes(props.direction ?? DEFAULT_DIRECTION) ? numberWidth.value : numberHeight.value
  )

  // Value determining the distance
  const distinct = computed(() =>
    ['up', 'left'].includes(props.direction ?? DEFAULT_DIRECTION)
      ? currentIndex.value % renderItems.value.length
      : renderItems.value.length - (currentIndex.value + (1 % renderItems.value.length))
  )

  /**
   * When the direction is right or up, the distance values are output from the largest to the smallest according to the index.
   * When the direction is left or right, the distance is calculated based on the width.
   */
  const slideDistinct = computed(() => {
    return distinct.value * axis.value
  })

  // Axis value based on the direction
  const directionAxis = computed(() => (['left', 'right'].includes(props.direction ?? DEFAULT_DIRECTION) ? 'X' : 'Y'))

  // Translate value created using the index of the items currently visible on the screen
  const itemsTranslate = computed(() => {
    return `${TRANSLATE}${directionAxis.value}(-${slideDistinct.value}px)`
  })

  // default transition value
  const defaultTransition = ref(`transform ${(props.duration ?? DEFAULT_DURATION) / 1000}s ease`)

  // To preserve the original ( defaultTransition ) during initialization.
  const transition = ref(defaultTransition.value)

  return {
    itemsTranslate,
    defaultTransition,
    transition,
  }
}