# vue-directional-carousel

This is a Vue 3 component that allows you to set the direction of image movement not only vertically and horizontally but also in different directions (left, right, up, down).

## Installation

You can install the `vue-directional-carousel` package via npm or yarn:

```bash
npm install vue-directional-carousel
```

or

```bash
yarn install vue-directional-carousel
```

## Usage

- Import the VueDirectionalCarousel component in your Vue.js project:

```javascript
import DirectionalCarousel from 'vue-directional-carousel'
```

- Register the VueDirectionalCarousel component locally in your component:

```javascript
// if use options api
export default {
  components: {
    DirectionalCarousel
  }
}
```

- Use the vue-directional-carousel component in your template:

```html
<template>
  <div>
    <directional-carousel
      :items="imageList"
      :show-prev="true"
      :show-next="true"
      :interval="2000"
      direction="down"
      width="100%"
      height="200px"
    />
  </div>
</template>
<script setup>
  import DirectionalCarousel from 'vue-directional-carousel'

  // Define your carousel image here
  const imageList = [
     'src/assets/sample1.png',
     'src/assets/sample2.png',
     'src/assets/sample3.png',
     'src/assets/sample4.png',
     'src/assets/sample5.png',
     ...
  ]
</script>
```

## Props

| props                | type                                | isRequired | default | description                                                                                                                                       |
| -------------------- | ----------------------------------- | ---------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| items                | string[] \| { src: string}[]        | `Required` |         | List of images to be used in the carousel.                                                                                                        |
| width                | string                              | Optional   | '100%'  | Width of the carousel.                                                                                                                            |
| height               | string                              | Optional   | '300px' | Height of the carousel.                                                                                                                           |
| direction            | 'left' \| 'right' \| 'up' \| 'down' | Optional   | 'right' | Direction in which the images flow.                                                                                                               |
| duration             | number                              | Optional   | 1000    | Duration of each slide (shorter values make it faster).                                                                                           |
| interval             | number                              | Optional   | 0       | Auto slide interval for images (in ms). Set to 0 to disable auto sliding.                                                                         |
| pauseAutoplayOnHover | boolean                             | Optional   | false   | When auto slide is enabled, pause the slide when the mouse is over an image. Resume auto slide when the mouse is moved outside the carousel area. |
| showPrev             | boolean                             | Optional   | true    | Show previous button.                                                                                                                             |
| showNext             | boolean                             | Optional   | true    | Show next button.                                                                                                                                 |
| showDots             | boolean                             | Optional   | true    | Show buttons indicating the current image sequence. Click to slide to the corresponding image.                                                    |
| currentIndex         | number                              | Optional   | 0       | Current visible slide index (0-based). Supports `v-model:currentIndex` for two-way binding so the carousel can be controlled from outside.        |

## Props Validation Guidelines

For optimal usage, please ensure:

- `items` array contains at least one item
- `interval` is a non-negative number (0 or greater)
- `duration` is a positive number (greater than 0)
- `width` and `height` use valid CSS units (e.g., px, %, rem, em, vh, vw)

Example:

```vue
<DirectionalCarousel
  :items="['image1.jpg', 'image2.jpg']"
  width="100%"
  height="300px"
  :interval="2000"
  :duration="1000"
/>
```

## Events

| event                  | payload  | description                                                                                                                                  |
| ---------------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `update:currentIndex`  | `number` | Fired whenever the visible slide changes (next/prev/dot click, autoplay, or programmatic update). Payload is the normalized index `0..items.length - 1`. Pairs with `v-model:currentIndex`. |

## Controlling the carousel from outside

You can drive the carousel from your own UI (e.g. a tab list above the slides) by binding `v-model:currentIndex`. The carousel exposes a normalized index, so the value is always within `[0, items.length - 1]` regardless of the internal infinite-loop transition.

```vue
<script setup>
import { ref } from 'vue'
import DirectionalCarousel from 'vue-directional-carousel'

const pages = [
  { title: 'Summary', src: '/reports/summary.png' },
  { title: 'Revenue', src: '/reports/revenue.png' },
  { title: 'Costs',   src: '/reports/costs.png' },
  { title: 'Outlook', src: '/reports/outlook.png' }
]

const currentPage = ref(0)
</script>

<template>
  <nav class="page-tabs">
    <button
      v-for="(page, i) in pages"
      :key="i"
      type="button"
      :class="{ active: currentPage === i }"
      @click="currentPage = i"
    >
      {{ page.title }}
    </button>
  </nav>

  <DirectionalCarousel
    v-model:currentIndex="currentPage"
    :items="pages"
    width="800px"
    height="500px"
  />
</template>
```

Notes:

- If the parent does not bind `v-model:currentIndex`, the carousel manages its own state — existing usage keeps working with no changes.
- Setting an out-of-range or non-integer value is ignored and a warning is logged. The carousel stays on its current slide.
- While a transition is in flight, programmatic index changes are ignored to prevent jumpy state. The next change after the transition completes is honored.

## Slots

### item

Use Slot 'item' in your component:

```javascript
const items = ref([
  {
    title: "제목1",
    url: "google.com",
  }, {
    title: "제목2",
    url: "ahnlab.com",
  },
]);

<DirectionalCarousel
    :items="items"
    direction="down"
    height="50px"
    width="400px"
    :show-next="true"
    :show-prev="true"
    :interval="2000"
    :pause-autoplay-on-hover="true"
  >
    <template #item="item">
      <div :style="{ backgroundColor: 'white', color: 'black', height: '100%', width: '100%' }">
        {{ item.title }} / {{ item.url }}
      </div>
    </template>
  </DirectionalCarousel>
```

## Contributing

## License

MIT
