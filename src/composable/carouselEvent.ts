import { computed, ref, type Ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { type VerticalCarouselProps, type CarouselComputedItemsType } from '@/types/props';

export default function useCarouselEvent(
  props: VerticalCarouselProps,
  computedItems: CarouselComputedItemsType,
  renderItems: CarouselComputedItemsType,
  currentIndex: Ref<number>,
  defaultTransition: Ref<string>,
  transition: Ref<string>,
) {

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
    if (currentIndex.value >= renderItems.value.length - 1) {
      transition.value = ''
      currentIndex.value = 0
      setTimeout(() => {
        setTransition()
      }, 100)
    } else {
      setTransition()
    }
  }

  /**
   * The translation for the phrase.
   * Reset the interval when next or prev buttons are clicked or when the slide action is resumed.
   */
  const initInterval = () => {
    window.clearInterval(autoSlideInterval)
    autoSlideInterval = window.setInterval(next, props.interval)
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
    if (currentIndex.value === 0) {
      transition.value = ''
      currentIndex.value = prevIndex.value
      setTimeout(() => {
        currentIndex.value = prevIndex.value
        transition.value = defaultTransition.value
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
    currentIndex.value = index
    if (props.interval) {
      initInterval()
    }
  }

  // variables of setInterval
  let autoSlideInterval: number

  const watchItems = computed(() => computedItems.value)
  const watchInterval = computed(() => props.interval)

  watch([watchItems, watchInterval], () => {
    if (watchInterval.value) {
      window.clearInterval(autoSlideInterval)
      if (watchItems.value.length > 1) {
        autoSlideInterval = window.setInterval(next, watchInterval.value)
      }
    }
  })

  const isPaused = ref(false)

  /**
   * Pause slide action
   * @return void
   */
  const pauseSlide = () => {
    if (props.pauseAutoplayOnHover) {
      window.clearInterval(autoSlideInterval)
      isPaused.value = true
    }
  }

  /**
   * Resume slide action
   * @return void
   */
  const resumeSlide = () => {
    if (props.pauseAutoplayOnHover && isPaused.value && props.items.length > 1) {
      initInterval()
      isPaused.value = false
    }
  }

  onMounted(() => {
    transition.value = ''
    if (computedItems.value.length > 1 && props.interval) {
      autoSlideInterval = window.setInterval(next, props.interval)
    }
  })

  onBeforeUnmount(() => {
    window.clearInterval(autoSlideInterval)
  })

  return {
    clickNext,
    clickPrev,
    clickDot,
    pauseSlide,
    resumeSlide,
  }
}