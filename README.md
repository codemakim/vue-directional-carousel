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

## Events

## Contributing

## License
