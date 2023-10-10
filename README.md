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
import { DirectionalCarousel } from 'vue-directional-carousel'
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
| items                | string[] \| { src: string}[]        | Required   |         | List of images to be used in the carousel.                                                                                                        |
| width                | string                              | Optional   | '100%'  | Width of the carousel.                                                                                                                            |
| height               | string                              | Optional   | '300px' | Height of the carousel.                                                                                                                           |
| direction            | 'left' \| 'right' \| 'up' \| 'down' | Optional   | 'right' | Direction in which the images flow.                                                                                                               |
| duration             | number                              | Optional   | 1000    | Duration of each slide (shorter values make it faster).                                                                                           |
| interval             | number                              | Optional   | 0       | Auto slide interval for images (in ms). Set to 0 to disable auto sliding.                                                                         |
| pauseAutoplayOnHover | boolean                             | Optional   | false   | When auto slide is enabled, pause the slide when the mouse is over an image. Resume auto slide when the mouse is moved outside the carousel area. |
| showPrev             | boolean                             | Optional   | true    | Show previous button.                                                                                                                             |
| showNext             | boolean                             | Optional   | true    | Show next button.                                                                                                                                 |
| showDots             | boolean                             | Optional   | true    | Show buttons indicating the current image sequence. Click to slide to the corresponding image.                                                    |

## Events

추후 기능 추가 예정

## Contributing

## License

MIT
