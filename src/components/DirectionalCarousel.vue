<!-- eslint-disable vue/no-setup-props-destructure -->

<script setup lang="ts">
import {
  ref,
  computed,
  onMounted,
  onBeforeUnmount,
  watch,
  type Ref,
  type ComputedRef,
  type CSSProperties
} from 'vue'
import { type VerticalCarouselProps } from '../types/props'

const TRANSLATE = 'translate'

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

// 캐러샐 영역의 너비
const carouselContainer: Ref<HTMLElement | null> = ref(null)
// 이미지 인덱스 표시 점 부분 엘리먼트
const dotWrapper: Ref<HTMLElement | null> = ref(null)
// items가 string[]인 경우 { src: string }[] 형식으로 변경합니다.
const computedItems = computed(() =>
  props.items.map((el) => (typeof el === 'string' ? { src: el } : el))
)
// 이미지 수
const itemCount = computed(() => props.items.length)
// 렌더링에 사용할 아이템 목록
const renderItems = computed(() => [...computedItems.value, computedItems.value[0]])
// 현재 보여지는 아이템 인덱스
const currentIndex = ref(0)
const dotWrapperHeight = computed(() => dotWrapper.value?.offsetHeight ?? 0)
// 이동 거리 계산을 위한 너비 값
const numberWidth = computed(() => carouselContainer.value?.offsetWidth ?? 0)
// 이동 거리 계산을 위한 높이 값
const numberHeight = computed(() => carouselContainer.value?.offsetHeight ?? 0)
// 축을 결정하는 값
const axis = computed(() =>
  ['left', 'right'].includes(props.direction) ? numberWidth.value : numberHeight.value
)
// 거리를 결정하는 값
const distinct = computed(() =>
  ['up', 'left'].includes(props.direction)
    ? currentIndex.value % renderItems.value.length
    : renderItems.value.length - (currentIndex.value + (1 % renderItems.value.length))
)

/**
 * direction 값이 right, up인 경우 인덱스에 따른 거리 값이 큰 수 부터 작은 수 순으로 출력됩니다.
 * direction 값이 left, right인 경우 width를 기준으로 거리 값을 계산하며,
 */
const slideDistinct = computed(() => {
  return distinct.value * axis.value
})

// direction 값에 따른 축 값
const directionAxis = computed(() => (['left', 'right'].includes(props.direction) ? 'X' : 'Y'))

// 현재 화면에 표시되어야 하는 아이템의 인덱스를 이용해 만든 translate 값
const itemsTranslate = computed(() => {
  return `${TRANSLATE}${directionAxis.value}(-${slideDistinct.value}px)`
})

// translate 동작 Duration 값 원본
const defaultTransition = ref(`transform ${props.duration / 1000}s ease`)

// 초기화 과정에서 원본 ( defaultTransition )을 보존하기 위한 값
const transition = ref(defaultTransition.value)

// 전달 받은 방향 값을 이용해 flex-direction 속성 값을 반환합니다.
const direction = computed(() => props.direction)
const flexDirection = computed(() => {
  switch (direction.value) {
    case 'left':
      return 'row'
    case 'up':
      return 'column'
    case 'down':
      return 'column-reverse'
    default:
      return 'row-reverse'
  }
})

/**
 * item에 현재 index에 맞는 translate 속성을 부여
 * @return void
 */
const setTransition = () => {
  currentIndex.value = ++currentIndex.value % renderItems.value.length
  transition.value = defaultTransition.value
}

/**
 * 아이템이 다음 순서로 슬라이드 동작하도록 하기 위한 이벤트 핸들러
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
 * 인터벌을 초기화합니다. next, prev 버튼을 클릭하거나, 슬라이드 동작 재게될 때 호출됩니다.
 */
const initInterval = () => {
  clearInterval(autoSlideInterval)
  autoSlideInterval = setInterval(next, props.interval)
}

const clickNext = () => {
  next()
  if (props.interval) {
    initInterval()
  }
}

const prevIndex = computed(
  () => (currentIndex.value - 1 + renderItems.value.length) % renderItems.value.length
)

/**
 * 아이템이 이전 순서로 슬라이드 동작하도록 하기 위한 이벤트 핸들러
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
  if (props.interval) {
    initInterval()
  }
}

const dotStyles = computed(() =>
  new Array(itemCount.value)
    .fill({
      border: 'none',
      borderRadius: '50%',
      backgroundColor: 'gray',
      cursor: 'pointer'
    })
    .map((el, index) => {
      const isCurrent = index === (itemCount.value > currentIndex.value ? currentIndex.value : 0)
      return {
        ...el,
        opacity: isCurrent ? '1' : '0.5',
        height: isCurrent ? '8px' : '6px',
        paddingInline: isCurrent ? '4px' : '3px'
      }
    })
)

/**
 * dot button 클릭 핸들러
 */
const clickDot = (index: number) => {
  currentIndex.value = index
  if (props.interval) {
    initInterval()
  }
}

// setIntervaldl 담길 변수
let autoSlideInterval: number

const watchItems = computed(() => computedItems.value)
const watchInterval = computed(() => props.interval)

watch([watchItems, watchInterval], () => {
  if (watchInterval.value) {
    clearInterval(autoSlideInterval)
    if (watchItems.value.length > 1) {
      autoSlideInterval = setInterval(next, watchInterval.value)
    }
  }
})

const isPaused = ref(false)

/**
 * 슬라이드 동작 일시 정지
 * @return void
 */
const pauseSlide = () => {
  if (props.pauseAutoplayOnHover) {
    clearInterval(autoSlideInterval)
    isPaused.value = true
  }
}

/**
 * 슬라이드 동작 재게
 * @return void
 */
const resumeSlide = () => {
  if (props.pauseAutoplayOnHover && isPaused.value) {
    initInterval()
    isPaused.value = false
  }
}

onMounted(() => {
  transition.value = ''
  if (computedItems.value.length > 1 && props.interval) {
    autoSlideInterval = setInterval(next, props.interval)
  }
})

onBeforeUnmount(() => {
  clearInterval(autoSlideInterval)
})

// button Wrapper CSS 스타일
const buttonWrapperStyle: CSSProperties = {
  zIndex: 1,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '5px'
}

// button CSS 스타일
const buttonStyle: Ref<CSSProperties> = ref({
  height: '20px',
  border: 'none',
  color: 'silver',
  borderRadius: '10px'
})

/**
 * button handler - mouse down
 */
const onMouseDownButton = () => {
  buttonStyle.value.color = 'gray'
}
/**
 * button handler - mouse up
 */
const onMouseUpButton = () => {
  buttonStyle.value.color = 'silver'
}

// 아이템 엘리먼트의 스타일
const itemStyle: ComputedRef<CSSProperties> = computed(() => ({
  overflow: 'hidden',
  width: numberWidth.value + 'px',
  height: numberHeight.value + 'px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
}))
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
      <div v-if="showPrev" :style="buttonWrapperStyle">
        <button
          class="prev-button"
          :style="buttonStyle"
          @click="clickPrev"
          @mousedown="onMouseDownButton"
        >
          <img
            alt="left arrow"
            :src="'src/assets/arrow-point-to-right.png'"
            :style="{
              width: '10px',
              borderRadius: '5px',
              transform: 'scaleX(-1)'
            }"
          />
        </button>
      </div>
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
            flexDirection: flexDirection,
            transform: itemsTranslate,
            transition: transition
          }"
        >
          <div
            v-for="(item, index) in renderItems"
            :key="index"
            :style="itemStyle"
            class="carousel-item"
          >
            <slot name="item" v-bind="item" :style="{ width, height }">
              <img
                :src="item.src"
                :alt="`directiional-carousel-image-${index}`"
                :style="{
                  width: '100%'
                }"
              />
            </slot>
          </div>
        </div>
      </div>
      <div v-if="showNext" :style="buttonWrapperStyle">
        <button
          class="next-button"
          :style="buttonStyle"
          @click="clickNext"
          @mouseup="onMouseUpButton"
        >
          <img
            alt="left arrow"
            :src="'src/assets/arrow-point-to-right.png'"
            :style="{
              width: '10px',
              borderRadius: '3px'
            }"
          />
        </button>
      </div>
    </div>
    <div
      v-if="showDots"
      ref="dotWrapper"
      :style="{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexWrap: 'wrap'
      }"
    >
      <div
        v-for="seq in itemCount"
        :style="{
          padding: '0px 4px 0px 4px'
        }"
      >
        <button :style="dotStyles[seq - 1]" @click="clickDot(seq - 1)" />
      </div>
    </div>
  </div>
</template>
