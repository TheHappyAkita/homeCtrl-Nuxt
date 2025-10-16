<template>
  <div class="spinner-container">
    <div
      :class="spinnerClasses"
    />
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

interface Props {
  size?: SpinnerSize
}

const props = withDefaults(defineProps<Props>(), {
  size: SpinnerSize.normal
})

const spinnerClasses = computed(() => {
  const baseClass = 'app-spinner'
  const sizeClass = props.size === SpinnerSize.small ? 'app-spinner-small' : 'app-spinner-normal'
  return `${baseClass} ${sizeClass}`
})
</script>

<style scoped>
@import '@/assets/Spinner.css';

.spinner-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.5rem;
}
</style>