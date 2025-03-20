<!-- eslint-disable vue/no-setup-props-destructure -->

<script setup lang="ts">
import { type VerticalCarouselProps, type DirectionProps, validateCarouselProps } from '../types/props'
import {
  type Ref,
  type ComputedRef,
  type CSSProperties,
  ref,
  computed,
  watch
} from 'vue'
import DotButtons from '@/components/DotButtons.vue'
import PrevButton from './PrevButton.vue'
import NextButton from './NextButton.vue'
import useRenderTransition from '@/composable/renderTransition'
import useCarouselEvent from '@/composable/carouselEvent'
import useImageLoading from '@/composable/imageLoading'

const props = withDefaults(defineProps<VerticalCarouselProps>(), {
  width: '100%',
  height: '300px',
  direction: 'right',
  duration: 1000,
  showPrev: true,
  showNext: true,
  showDots: true,
  interval: 0,
  pauseAutoplayOnHover: false
})

const validateProps = () => {
  const errors = validateCarouselProps(props)
  
  if (errors.length > 0) {
    errors.forEach(error => {
      console.error(`DirectionalCarousel: ${error.prop} - ${error.message}`)
    })
    
    if (errors.some(e => e.prop === 'items')) {
      // items는 필수이므로 심각한 에러로 처리
      throw new Error('DirectionalCarousel: Invalid props - check console for details')
    }
  }
}

// 초기 검증 및 변경사항 감지
watch(
  () => ({
    items: props.items,
    interval: props.interval,
    duration: props.duration,
    width: props.width,
    height: props.height
  }),
  validateProps,
  { immediate: true }
)

// width of carousel area
const carouselContainer: Ref<HTMLElement | null> = ref(null)

// In the case where items is of type string[],
// it is transformed into the format { src: string }[]
const computedItems = computed(() =>
  props.items.map((el) => (typeof el === 'string' ? { src: el } : el))
)
// count of images
const itemCount = computed(() => props.items.length)

// image list for rendering
const renderItems = computed(() => [...computedItems.value, computedItems.value[0]])

// current visible item index.
const currentIndex = ref(0)

// Width value for calculating the movement distance
const numberWidth = computed(() => carouselContainer.value?.offsetWidth ?? 0)

// Height value for calculating the movement distance
const numberHeight = computed(() => carouselContainer.value?.offsetHeight ?? 0)

// 컴포저블로 대체한 렌더링 관련 친구들 추가
const {
  itemsTranslate,
  defaultTransition,
  transition,
  isTransitioning,
  directionProps
} = useRenderTransition(props, renderItems, currentIndex, numberWidth, numberHeight)

const {
  clickNext,
  clickPrev,
  clickDot,
  pauseSlide,
  resumeSlide,
} = useCarouselEvent(
  props, 
  computedItems, 
  renderItems, 
  currentIndex, 
  defaultTransition, 
  transition,
  isTransitioning
)

// 아이템 엘리먼트의 스타일
const itemStyle: ComputedRef<CSSProperties> = computed(() => ({
  overflow: 'hidden',
  width: numberWidth.value + 'px',
  height: numberHeight.value + 'px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
}))

const {
  loadingStates,
  errorStates,
  loadedImages,
  preloadImage
} = useImageLoading(currentIndex, computedItems)

defineExpose({
  currentIndex,
})
</script>
<template>
  <div
    :style="{
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      width: props.width,
      height: props.height
    }"
  >
    <div
      class="slider"
      :style="{
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
        width: '100%',
        height: '100%'
      }"
      @mouseenter="pauseSlide"
      @focusin="pauseSlide"
      @mouseleave="resumeSlide"
      @focusout="resumeSlide"
    >
      <prev-button v-if="arrowOptions?.prev.show || showPrev" @click-prev-button="clickPrev" />
      <div
        ref="carouselContainer"
        :style="{
          overflow: 'hidden',
          position: 'relative',
          flex: 1
        }"
      >
        <div
          class="wrapper-carousel-items"
          :style="{
            display: 'inline-flex',
            position: 'relative',
            flexDirection: directionProps.flexDirection,
            transform: itemsTranslate,
            transition: transition,
            pointerEvents: isTransitioning ? 'none' : 'auto'
          }"
        >
          <div
            v-for="(item, index) in renderItems"
            :key="index"
            :style="itemStyle"
            class="carousel-item"
          >
            <slot name="item" v-bind="item" :style="{ width, height }">
              <div class="carousel-image-container" :style="{ width: '100%', height: '100%' }">
                <!-- State of loading -->
                <div v-if="loadingStates.get(item.src)" class="carousel-image-loading">
                  <slot name="loading">
                    <div class="loading-spinner"></div>
                  </slot>
                </div>
                
                <!-- State of error -->
                <div v-else-if="errorStates.get(item.src)" class="carousel-image-error">
                  <slot name="error">
                    <div class="error-fallback">
                      <span>Failed to load image</span>
                    </div>
                  </slot>
                </div>
                
                <!-- State of success -->
                <img
                  v-else
                  :src="item.src"
                  :alt="`directional-carousel-item-${index}`"
                  :style="{
                    width: '100%',
                    opacity: loadedImages.has(item.src) ? 1 : 0,
                    transition: 'opacity 0.2s'
                  }"
                  @load="loadedImages.add(item.src)"
                />
              </div>
            </slot>
          </div>
        </div>
      </div>
      <next-button v-if="arrowOptions?.next.show || showNext" @click-next-button="clickNext" />
    </div>
    <dot-buttons
      v-if="showDots"
      :current-index="currentIndex"
      :item-count="itemCount"
      :show-dots="showDots"
      @click-dot-button="clickDot"
    />
  </div>
</template>

<style scoped>
.carousel-image-container {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.carousel-image-loading,
.carousel-image-error {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.loading-spinner {
  /* 로딩 스피너 스타일 */
  width: 40px;
  height: 40px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.error-fallback {
  padding: 1rem;
  text-align: center;
  background-color: #f8f9fa;
  color: #dc3545;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
