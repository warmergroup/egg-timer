<script setup lang="ts">
defineEmits<{
  increment: []
  decrement: []
}>()
</script>

<template>
  <div class="flex flex-col items-center space-y-6">
    <h3 class="text-xl font-semibold text-gray-700 mb-4">Adjust Timer</h3>

    <div class="flex items-center gap-6">
      <!-- Decrement Button - Always enabled -->
      <button @click="$emit('decrement')"
        class="group relative w-20 h-20 md:w-24 md:h-24 rounded-neumorphic bg-neumorphic-light shadow-neumorphic active:shadow-neumorphic-button-pressed transition-all duration-500 ease-out overflow-hidden">

        <!-- Button content -->
        <div class="relative z-10 w-full h-full flex items-center justify-center">
          <svg class="w-10 h-10 md:w-12 md:h-12 text-gray-700 transition-transform duration-300" fill="none"
            stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
          </svg>
        </div>
      </button>

      <!-- Time Display -->
      <div class="text-center">
        <div class="text-2xl font-bold text-gray-700">±10s</div>
        <div class="text-sm text-gray-500">per click</div>
      </div>

      <!-- Increment Button - Always enabled -->
      <button @click="$emit('increment')"
        class="group relative w-20 h-20 md:w-24 md:h-24 rounded-neumorphic bg-neumorphic-light shadow-neumorphic active:shadow-neumorphic-button-pressed transition-all duration-500 ease-out overflow-hidden">

        <!-- Button content -->
        <div class="relative z-10 w-full h-full flex items-center justify-center">
          <svg class="w-10 h-10 md:w-12 md:h-12 text-gray-700 transition-transform duration-300" fill="none"
            stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
        </div>
      </button>
    </div>
  </div>
</template>



<style scoped>
/* Press effect instead of hover */
button:active {
  transform: scale(0.95);
}

/* Smooth transitions */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* Enhanced button animations */
button {
  transition: all 0.5s ease-out;
}

button:active {
  transition: all 0.1s ease-out;
}
</style>