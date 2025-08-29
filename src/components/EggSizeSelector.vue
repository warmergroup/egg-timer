<template>
  <div class="flex flex-col items-center space-y-8 animate-fade-up">
    <div class="text-center mb-6">
      <h1 class="text-2xl md:text-3xl font-semibold text-gray-700 mb-2 drop-shadow-sm">
        Choose Your Egg Size
      </h1>
      <p class="text-gray-500">Select the size that matches your egg</p>
    </div>

    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
      <div v-for="size in eggSizes" :key="size.label" @click="selectSize(size)"
        class="group cursor-pointer transition-all duration-500 ease-out">

        <!-- Egg Size Card - Same size as LevelSelector -->
        <div
          class="relative w-40 h-40 md:w-44 md:h-44 rounded-card bg-neumorphic-light shadow-neumorphic-card hover:shadow-neumorphic-card-hover hover:scale-105 active:shadow-neumorphic-button-active transition-all duration-500 ease-out overflow-hidden">

          <!-- Egg Icon and Size Info -->
          <div class="absolute inset-0 flex flex-col items-center justify-center p-4">
            <div class="text-center">
              <!-- Different egg sizes - Same proportions as LevelSelector -->
              <div v-if="size.label === 'Small'" class="text-3xl md:text-4xl mb-2">🥚</div>
              <div v-else-if="size.label === 'Medium'" class="text-4xl md:text-5xl mb-2">🥚</div>
              <div v-else-if="size.label === 'Large'" class="text-5xl md:text-6xl mb-2">🥚</div>
              <div v-else-if="size.label === 'Extra Large'" class="text-6xl md:text-7xl mb-2">🥚
              </div>

              <!-- Size Label -->
              <div class="text-sm md:text-base font-medium text-gray-700 text-center mb-1">{{ size.label }}</div>

              <!-- Weight Info -->
              <div class="text-xs text-gray-500 font-medium">{{ size.weight }}</div>
            </div>
          </div>

          <!-- Selection Check - Same size as LevelSelector -->
          <div v-if="selectedSize?.label === size.label"
            class="absolute top-2 right-2 w-6 h-6 bg-amber-300 rounded-full flex items-center justify-center shadow-neumorphic-soft">
            <svg class="w-4 h-4 text-amber-800" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clip-rule="evenodd" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface EggSize {
  label: string
  weight: string
  timeInSeconds: number
}

const emit = defineEmits<{
  selectSize: [size: EggSize]
}>()

const selectedSize = ref<EggSize | null>(null)

const eggSizes: EggSize[] = [
  {
    label: 'Small',
    weight: '40g',
    timeInSeconds: 0 // Will be calculated based on level
  },
  {
    label: 'Medium',
    weight: '55g',
    timeInSeconds: 0 // Will be calculated based on level
  },
  {
    label: 'Large',
    weight: '65g',
    timeInSeconds: 0 // Will be calculated based on level
  },
  {
    label: 'Extra Large',
    weight: '70-90g',
    timeInSeconds: 0 // Will be calculated based on level
  }
]

const selectSize = (size: EggSize) => {
  selectedSize.value = size
  emit('selectSize', size)
}
</script>

<style scoped>
/* Press effect instead of hover */
.group:active .shadow-neumorphic-card-hover {
  box-shadow: var(--tw-shadow);
}

/* Smooth transitions */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* Enhanced button animations */
.group {
  transition: all 0.5s ease-out;
}

.group:active {
  transition: all 0.1s ease-out;
}

/* Selection animation */
.animate-scale-bounce {
  animation: scale-bounce 0.6s ease-out;
}

@keyframes scale-bounce {
  0% {
    transform: scale(0);
  }

  50% {
    transform: scale(1.2);
  }

  100% {
    transform: scale(1);
  }
}
</style>