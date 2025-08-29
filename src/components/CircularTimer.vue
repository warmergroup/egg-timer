<script setup lang="ts">
import { computed, ref } from 'vue'

interface Props {
  time: number
  originalTime: number
  isRunning: boolean
  progress: number
  formattedTime: string
  eggSize: string
  cookingLevel: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  start: []
  pause: []
  resume: []
  reset: []
  increment: []
  decrement: []
  startOver: []
}>()

const isPaused = ref(false)

const circumference = computed(() => 2 * Math.PI * 90)

const strokeDashoffset = computed(() => {
  return circumference.value - (props.progress / 100) * circumference.value
})

const start = () => {
  emit('start')
  isPaused.value = false
}

const pause = () => {
  emit('pause')
  isPaused.value = true
}

const resume = () => {
  emit('resume')
  isPaused.value = false
}

const reset = () => {
  emit('reset')
  isPaused.value = false
}
</script>


<template>
  <div class="flex flex-col items-center space-y-8 animate-fade-up">
    <div class="text-center mb-6">
      <h1 class="text-2xl md:text-3xl font-semibold text-gray-700 mb-2 drop-shadow-sm">
        {{ cookingLevel }} {{ eggSize }} Egg
      </h1>
      <p class="text-gray-500">Your perfect egg is cooking!</p>
    </div>

    <div class="w-full max-w-6xl">
      <!-- Desktop Layout: All buttons on left, timer on right -->
      <div class="hidden md:flex items-start justify-between">
        <!-- Left Side: ALL Control Buttons -->
        <div class="flex flex-col gap-4 w-48">
          <!-- Start/Reset Button with smooth width transition -->
          <Transition name="slide-left" mode="out-in">
            <button v-if="!isRunning && !isPaused" @click="start" key="start"
              class="group relative px-8 py-4 rounded-neumorphic bg-neumorphic-light shadow-neumorphic hover:shadow-neumorphic-hover hover:scale-105 active:shadow-neumorphic-button-active transition-all duration-500 ease-out overflow-hidden min-w-[140px]">

              <span class="relative z-10 font-medium text-gray-700 text-lg whitespace-nowrap">Start Cooking</span>
            </button>

            <button v-else @click="reset" key="reset"
              class="group relative px-8 py-4 rounded-neumorphic bg-neumorphic-light shadow-neumorphic hover:shadow-neumorphic-hover hover:scale-105 active:shadow-neumorphic-button-active transition-all duration-500 ease-out overflow-hidden min-w-[140px]">

              <span class="relative z-10 font-medium text-gray-700 text-lg whitespace-nowrap">Reset</span>
            </button>
          </Transition>

          <!-- Pause/Resume Button - Appears with smooth animation -->
          <Transition name="slide-right" mode="out-in">
            <button v-if="isRunning" @click="pause" key="pause"
              class="group relative px-8 py-4 rounded-neumorphic bg-neumorphic-light shadow-neumorphic hover:shadow-neumorphic-hover hover:scale-105 active:shadow-neumorphic-button-active transition-all duration-500 ease-out overflow-hidden min-w-[140px]">

              <span class="relative z-10 font-medium text-gray-700 text-lg whitespace-nowrap">Pause</span>
            </button>

            <button v-else-if="isPaused" @click="resume" key="resume"
              class="group relative px-8 py-4 rounded-neumorphic bg-neumorphic-light shadow-neumorphic hover:shadow-neumorphic-hover hover:scale-105 active:shadow-neumorphic-button-active transition-all duration-500 ease-out overflow-hidden min-w-[140px]">

              <span class="relative z-10 font-medium text-gray-700 text-lg whitespace-nowrap">Resume</span>
            </button>
          </Transition>

          <!-- Timer Controls - Adjust Time Buttons -->
          <div class="mt-6">
            <h3 class="text-lg font-semibold text-gray-700 mb-4 text-center">Adjust Timer</h3>
            <div class="flex items-center gap-4 justify-center">
              <!-- Decrement Button -->
              <button @click="$emit('decrement')"
                class="group relative w-16 h-16 rounded-neumorphic bg-neumorphic-light shadow-neumorphic hover:shadow-neumorphic-hover hover:scale-105 active:shadow-neumorphic-button-active transition-all duration-500 ease-out overflow-hidden">

                <div class="relative z-10 w-full h-full flex items-center justify-center">
                  <svg class="w-8 h-8 text-gray-700 transition-transform duration-300" fill="none" stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
                  </svg>
                </div>
              </button>

              <!-- Time Display -->
              <div class="text-center">
                <div class="text-lg font-bold text-gray-700">±10s</div>
                <div class="text-xs text-gray-500">per click</div>
              </div>

              <!-- Increment Button -->
              <button @click="$emit('increment')"
                class="group relative w-16 h-16 rounded-neumorphic bg-neumorphic-light shadow-neumorphic hover:shadow-neumorphic-hover hover:scale-105 active:shadow-neumorphic-button-active transition-all duration-500 ease-out overflow-hidden">

                <div class="relative z-10 w-full h-full flex items-center justify-center">
                  <svg class="w-8 h-8 text-gray-700 transition-transform duration-300" fill="none" stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                  </svg>
                </div>
              </button>
            </div>
          </div>

          <!-- Start Over Button -->
          <button @click="$emit('startOver')"
            class="group relative px-8 py-4 rounded-neumorphic bg-neumorphic-light shadow-neumorphic active:shadow-neumorphic-button-active transition-all duration-500 ease-out overflow-hidden min-w-[140px] mt-6">

            <div class="relative z-10 flex items-center gap-3 font-medium text-gray-700 text-lg justify-center">
              <svg class="w-5 h-5 transition-transform duration-300" fill="none" stroke="currentColor"
                viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Start Over</span>
            </div>
          </button>
        </div>

        <!-- Right Side: Timer -->
        <div class="relative">
          <!-- Main Timer Container - Circular Neumorphic Design -->
          <div
            class="relative w-80 h-80 md:w-96 md:h-96 rounded-full bg-neumorphic-light shadow-neumorphic-timer overflow-hidden">

            <!-- Inner Timer Display with Inset Effect -->
            <div
              class="absolute inset-4 rounded-full bg-neumorphic-light shadow-neumorphic-timer-inset flex items-center justify-center">

              <!-- Circular Progress Background -->
              <svg class="w-64 h-64 md:w-72 md:h-72 transform -rotate-90" viewBox="0 0 200 200">
                <!-- Background circle -->
                <circle cx="100" cy="100" r="90" stroke="#E5E7EB" stroke-width="8" fill="none" class="opacity-30" />

                <!-- Progress circle - Egg yolk color -->
                <circle cx="100" cy="100" r="90" stroke="#F59E0B" stroke-width="8" fill="none" stroke-linecap="round"
                  :stroke-dasharray="circumference" :stroke-dashoffset="strokeDashoffset"
                  class="transition-all duration-1000 ease-out drop-shadow-lg" />
              </svg>

              <!-- Timer Display -->
              <div class="absolute inset-0 flex flex-col items-center justify-center">
                <div class="text-5xl md:text-6xl font-bold text-gray-700 mb-3 drop-shadow-sm">
                  {{ formattedTime }}
                </div>
                <div class="text-base text-gray-500 mb-6 font-medium">
                  {{ isRunning ? 'Cooking...' : isPaused ? 'Paused' : 'Ready to Start' }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Mobile Layout: Stacked with proper centering -->
      <div class="md:hidden flex flex-col items-center">
        <div class="relative">
          <!-- Main Timer Container - Circular Neumorphic Design -->
          <div class="relative w-80 h-80 rounded-full bg-neumorphic-light shadow-neumorphic-timer overflow-hidden">

            <!-- Inner Timer Display with Inset Effect -->
            <div
              class="absolute inset-4 rounded-full bg-neumorphic-light shadow-neumorphic-timer-inset flex items-center justify-center">

              <!-- Circular Progress Background -->
              <svg class="w-64 h-64 transform -rotate-90" viewBox="0 0 200 200">
                <!-- Background circle -->
                <circle cx="100" cy="100" r="90" stroke="#E5E7EB" stroke-width="8" fill="none" class="opacity-30" />

                <!-- Progress circle - Egg yolk color -->
                <circle cx="100" cy="100" r="90" stroke="#F59E0B" stroke-width="8" fill="none" stroke-linecap="round"
                  :stroke-dasharray="circumference" :stroke-dashoffset="strokeDashoffset"
                  class="transition-all duration-1000 ease-out drop-shadow-lg" />
              </svg>

              <!-- Timer Display -->
              <div class="absolute inset-0 flex flex-col items-center justify-center">
                <div class="text-5xl font-bold text-gray-700 mb-3 drop-shadow-sm">
                  {{ formattedTime }}
                </div>
                <div class="text-base text-gray-500 mb-6 font-medium">
                  {{ isRunning ? 'Cooking...' : isPaused ? 'Paused' : 'Ready to Start' }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Start/Reset and Pause/Resume Buttons - Side by side for mobile -->
        <div class="flex justify-center mt-8 gap-4">
          <!-- Start/Reset Button with smooth width transition -->
          <Transition name="slide-left" mode="out-in">
            <button v-if="!isRunning && !isPaused" @click="start" key="start"
              class="group relative px-8 py-4 rounded-neumorphic bg-neumorphic-light shadow-neumorphic hover:shadow-neumorphic-hover hover:scale-105 active:shadow-neumorphic-button-active transition-all duration-500 ease-out overflow-hidden min-w-[140px]">

              <span class="relative z-10 font-medium text-gray-700 text-lg whitespace-nowrap">Start</span>
            </button>

            <button v-else @click="reset" key="reset"
              class="group relative px-8 py-4 rounded-neumorphic bg-neumorphic-light shadow-neumorphic hover:shadow-neumorphic-hover hover:scale-105 active:shadow-neumorphic-button-active transition-all duration-500 ease-out overflow-hidden min-w-[140px]">

              <span class="relative z-10 font-medium text-gray-700 text-lg whitespace-nowrap">Reset</span>
            </button>
          </Transition>

          <!-- Pause/Resume Button - Appears with smooth animation -->
          <Transition name="slide-right" mode="out-in">
            <button v-if="isRunning" @click="pause" key="pause"
              class="group relative px-8 py-4 rounded-neumorphic bg-neumorphic-light shadow-neumorphic hover:shadow-neumorphic-hover hover:scale-105 active:shadow-neumorphic-button-active transition-all duration-500 ease-out overflow-hidden min-w-[140px]">

              <span class="relative z-10 font-medium text-gray-700 text-lg whitespace-nowrap">Pause</span>
            </button>

            <button v-else-if="isPaused" @click="resume" key="resume"
              class="group relative px-8 py-4 rounded-neumorphic bg-neumorphic-light shadow-neumorphic hover:shadow-neumorphic-hover hover:scale-105 active:shadow-neumorphic-button-active transition-all duration-500 ease-out overflow-hidden min-w-[140px]">

              <span class="relative z-10 font-medium text-gray-700 text-lg whitespace-nowrap">Resume</span>
            </button>
          </Transition>
        </div>

        <!-- Timer Controls - Adjust Time Buttons for Mobile -->
        <div class="mt-6">
          <h3 class="text-lg font-semibold text-gray-700 mb-4 text-center">Adjust Timer</h3>
          <div class="flex items-center gap-4 justify-center">
            <!-- Decrement Button -->
            <button @click="$emit('decrement')"
              class="group relative w-16 h-16 rounded-neumorphic bg-neumorphic-light shadow-neumorphic hover:shadow-neumorphic-hover hover:scale-105 active:shadow-neumorphic-button-active transition-all duration-500 ease-out overflow-hidden">

              <div class="relative z-10 w-full h-full flex items-center justify-center">
                <svg class="w-8 h-8 text-gray-700 transition-transform duration-300" fill="none" stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
                </svg>
              </div>
            </button>

            <!-- Time Display -->
            <div class="text-center">
              <div class="text-lg font-bold text-gray-700">±10s</div>
              <div class="text-xs text-gray-500">per click</div>
            </div>

            <!-- Increment Button -->
            <button @click="$emit('increment')"
              class="group relative w-16 h-16 rounded-neumorphic bg-neumorphic-light shadow-neumorphic hover:shadow-neumorphic-hover hover:scale-105 active:shadow-neumorphic-button-active transition-all duration-500 ease-out overflow-hidden">

              <div class="relative z-10 w-full h-full flex items-center justify-center">
                <svg class="w-8 h-8 text-gray-700 transition-transform duration-300" fill="none" stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
              </div>
            </button>
          </div>
        </div>

        <!-- Start Over Button for Mobile -->
        <button @click="$emit('startOver')"
          class="group relative px-8 py-4 rounded-neumorphic bg-neumorphic-light shadow-neumorphic active:shadow-neumorphic-button-active transition-all duration-500 ease-out overflow-hidden min-w-[140px] mt-6">

          <div class="relative z-10 flex items-center gap-3 font-medium text-gray-700 text-lg justify-center">
            <svg class="w-5 h-5 transition-transform duration-300" fill="none" stroke="currentColor"
              viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Start Over</span>
          </div>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Press effect instead of hover */
button:active {
  /* Remove scale transform, keep only shadow change */
}

/* Smooth transitions */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* Timer container animations */
.animate-fade-up {
  animation: fade-up 0.8s ease-out;
}

/* Button slide animations */
.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-left-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.slide-left-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.slide-right-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.slide-right-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

/* Smooth width transitions */
button {
  transition: width 0.5s ease-out, padding 0.5s ease-out;
}
</style>