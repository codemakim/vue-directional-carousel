import { computed, ref, type Ref, watch, onMounted, onBeforeUnmount, onScopeDispose } from 'vue'
import { type VerticalCarouselProps, type CarouselComputedItemsType } from '@/types/props';

export default function useCarouselEvent(
  props: VerticalCarouselProps,
  computedItems: CarouselComputedItemsType,
  renderItems: CarouselComputedItemsType,
  currentIndex: Ref<number>,
  defaultTransition: Ref<string>,
  transition: Ref<string>,
  isTransitioning: Ref<boolean>,
) {
  // interval ID를 저장할 ref
  const autoSlideInterval = ref<number | null>(null)
  const isPaused = ref(false)

  /**
   * Applies the translate property to the item based on the current index.
   * @return void
   */
  const setTransition = () => {
    currentIndex.value = ++currentIndex.value % renderItems.value.length
    transition.value = defaultTransition.value
  }

  /**
   * Event handler to make items slide to the next order.
   * @return void
   */
  const next = () => {
    if (isTransitioning.value) return

    if (currentIndex.value >= renderItems.value.length - 1) {
      isTransitioning.value = true
      transition.value = ''
      currentIndex.value = 0

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          transition.value = defaultTransition.value
          currentIndex.value = 1

          setTimeout(() => {
            isTransitioning.value = false
          }, props.duration || 1000)
        })
      })
    } else {
      setTransition()
    }
  }

  /**
   * Clears the existing interval if it exists
   */
  const clearExistingInterval = () => {
    if (autoSlideInterval.value !== null) {
      window.clearInterval(autoSlideInterval.value)
      autoSlideInterval.value = null
    }
  }

  /**
   * Initializes the auto slide interval
   */
  const initInterval = () => {
    clearExistingInterval()
    if (props.interval && props.items.length > 1 && !isPaused.value) {
      autoSlideInterval.value = window.setInterval(next, props.interval)
    }
  }

  /**
   * click next button event handler
   */
  const clickNext = () => {
    next()
    if (props.interval && props.items.length > 1) {
      initInterval()
    }
  }

  // index of previous item
  const prevIndex = computed(
    () => (currentIndex.value - 1 + renderItems.value.length) % renderItems.value.length
  )

  /**
   * click prev button event handler
   * @return void
   */
  const clickPrev = () => {
    if (isTransitioning.value) return

    if (currentIndex.value === 0) {
      isTransitioning.value = true
      transition.value = ''
      currentIndex.value = prevIndex.value
      setTimeout(() => {
        currentIndex.value = prevIndex.value
        transition.value = defaultTransition.value
        setTimeout(() => {
          isTransitioning.value = false
        }, props.duration || 1000)
      }, 100)
    } else {
      currentIndex.value = prevIndex.value
    }

    if (props.interval && props.items.length > 1) {
      initInterval()
    }
  }

  /**
   * clicked dot button event handler
   */
  const clickDot = (index: number) => {
    if (isTransitioning.value) return

    currentIndex.value = index
    if (props.interval) {
      initInterval()
    }
  }

  // Watch for changes in relevant props
  watch(
    () => [
      props.interval,
      props.direction,
      props.items.length,
      props.pauseAutoplayOnHover
    ],
    () => {
      initInterval()
    },
    { deep: true }
  )

  /**
   * Pause slide action
   * @return void
   */
  const pauseSlide = () => {
    if (props.pauseAutoplayOnHover) {
      isPaused.value = true
      clearExistingInterval()
    }
  }

  /**
   * Resume slide action
   * @return void
   */
  const resumeSlide = () => {
    if (props.pauseAutoplayOnHover && props.items.length > 1) {
      isPaused.value = false
      initInterval()
    }
  }

  // Component lifecycle hooks
  onMounted(() => {
    transition.value = ''
    if (props.interval && props.items.length > 1) {
      initInterval()
    }
  })

  onBeforeUnmount(() => {
    clearExistingInterval()
  })

  onScopeDispose(() => {
    clearExistingInterval()
  })

  return {
    clickNext,
    clickPrev,
    clickDot,
    pauseSlide,
    resumeSlide,
  }
}