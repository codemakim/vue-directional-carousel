<script setup lang="ts">
import { ref } from 'vue'
import DirectionalCarousel from './components/DirectionalCarousel.vue'

// Distinct pages so we can visually tell which slide is active.
// `src` is required by the item type but unused because we render via #item slot.
const pages = ref([
  { src: '', title: 'Summary',  color: '#e74c3c' },
  { src: '', title: 'Revenue',  color: '#3498db' },
  { src: '', title: 'Costs',    color: '#2ecc71' },
  { src: '', title: 'Outlook',  color: '#f1c40f' },
  { src: '', title: 'Appendix', color: '#9b59b6' }
])

const currentPage = ref(0)
</script>

<template>
  <div class="test-harness">
    <h2>DirectionalCarousel — visual regression test (0.3.0+ fix)</h2>

    <p class="hint">
      <strong>Test:</strong> Reload the page, then click <em>only</em> one of the
      external tabs / dots / prev button <strong>first</strong> (before touching the
      next arrow). The carousel should animate smoothly. Before the fix it would
      snap without animation until you clicked the next arrow once.
    </p>

    <div class="status">
      <span>currentIndex (v-model):</span>
      <strong>{{ currentPage }}</strong>
      <span>→ {{ pages[currentPage].title }}</span>
    </div>

    <!-- External tab buttons — this is the exact use case the user asked for -->
    <nav class="page-tabs" aria-label="Report pages">
      <button
        v-for="(page, i) in pages"
        :key="i"
        type="button"
        class="tab"
        :class="{ active: currentPage === i }"
        :style="{ borderColor: currentPage === i ? page.color : undefined }"
        @click="currentPage = i"
      >
        {{ page.title }}
      </button>
    </nav>

    <DirectionalCarousel
      v-model:currentIndex="currentPage"
      :items="pages"
      direction="right"
      width="600px"
      height="300px"
      :show-prev="true"
      :show-next="true"
      :show-dots="true"
      :interval="0"
      :duration="600"
    >
      <template #item="item">
        <div
          class="slide"
          :style="{ backgroundColor: (item as typeof pages.value[0]).color }"
        >
          {{ (item as typeof pages.value[0]).title }}
        </div>
      </template>
    </DirectionalCarousel>

    <div class="checklist">
      <h3>Checklist</h3>
      <ul>
        <li>After fresh reload → click <strong>tab</strong> only → should animate</li>
        <li>After fresh reload → click <strong>dot</strong> only → should animate</li>
        <li>After fresh reload → click <strong>prev arrow</strong> only → should animate</li>
        <li>After fresh reload → click <strong>next arrow</strong> only → should animate (regression check)</li>
        <li>On initial paint → no visible "flash" slide-in from left</li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.test-harness {
  max-width: 700px;
  margin: 2rem auto;
  font-family: -apple-system, system-ui, sans-serif;
  color: #222;
}

.hint {
  background: #fff8dc;
  border-left: 4px solid #f1c40f;
  padding: 0.75rem 1rem;
  font-size: 0.9rem;
  line-height: 1.5;
}

.status {
  display: flex;
  gap: 0.5rem;
  align-items: baseline;
  margin: 1rem 0;
  font-size: 0.95rem;
}
.status strong {
  font-family: ui-monospace, monospace;
  background: #f1f1f1;
  padding: 0.1rem 0.4rem;
  border-radius: 4px;
}

.page-tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.tab {
  padding: 0.5rem 1rem;
  background: #fff;
  border: 2px solid #ddd;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.15s;
}
.tab:hover {
  background: #f8f8f8;
}
.tab.active {
  background: #f0f8ff;
  border-width: 2px;
  font-weight: 600;
}

.slide {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  color: white;
  font-size: 2rem;
  font-weight: bold;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.checklist {
  margin-top: 2rem;
  padding: 1rem 1.5rem;
  background: #f9f9f9;
  border-radius: 6px;
  font-size: 0.9rem;
}
.checklist h3 {
  margin-top: 0;
}
.checklist ul {
  line-height: 1.7;
}
</style>
