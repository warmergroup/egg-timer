<template>
  <div class="min-h-screen bg-neumorphic-light flex items-center justify-center p-4">
    <div class="w-full max-w-4xl mx-auto text-center">

      <!-- Step 1: Egg Size Selection -->
      <Transition name="slide-fade" mode="out-in">
        <EggSizeSelector v-if="currentStep === 1" @selectSize="handleSizeSelection" />

        <!-- Step 2: Cooking Level Selection -->
        <EggLevelSelector v-else-if="currentStep === 2" :selectedEggSize="selectedEggSize"
          @selectLevel="handleLevelSelection" />

        <!-- Step 3: Timer Display -->
        <div v-else-if="currentStep === 3" class="space-y-8">
          <CircularTimer :time="timer.time.value" :originalTime="timer.originalTime.value"
            :isRunning="timer.isRunning.value" :progress="timer.progress.value"
            :formattedTime="timer.formattedTime.value" :eggSize="selectedEggSize" :cookingLevel="selectedCookingLevel"
            @start="startTimer" @pause="timer.pauseTimer" @resume="timer.resumeTimer" @reset="timer.resetTimer"
            @increment="() => timer.adjustTime(10)" @decrement="() => timer.adjustTime(-10)" @startOver="goBack" />
        </div>
      </Transition>

      <!-- Completion Modal -->
      <Transition name="modal">
        <div v-if="showCompletionModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          @click="closeModal">
          <div
            class="bg-neumorphic-light rounded-neumorphic p-8 shadow-neumorphic max-w-md w-full text-center space-y-6"
            @click.stop>
            <div class="text-6xl mb-4 animate-bounce-soft">🎉</div>
            <h2 class="text-2xl font-bold text-gray-800">Egg Ready!</h2>
            <p class="text-gray-600">Your {{ selectedCookingLevel }} {{ selectedEggSize }} egg is perfectly cooked!</p>

            <div class="flex gap-4 justify-center">
              <button @click="startNewTimer"
                class="group relative px-8 py-4 rounded-neumorphic bg-neumorphic-light shadow-neumorphic active:shadow-neumorphic-button-pressed transition-all duration-500 ease-out overflow-hidden">

                <span class="relative z-10 font-medium text-gray-700 text-lg">Cook Another</span>
              </button>

              <button @click="closeModalAndReset"
                class="group relative px-8 py-4 rounded-neumorphic bg-neumorphic-light shadow-neumorphic active:shadow-neumorphic-button-pressed transition-all duration-500 ease-out overflow-hidden">

                <span class="relative z-10 font-medium text-gray-700 text-lg">Done</span>
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useTimer } from '../composables/useTimer'
import EggSizeSelector from '../components/EggSizeSelector.vue'
import EggLevelSelector from '../components/EggLevelSelector.vue'
import CircularTimer from '../components/CircularTimer.vue'

const currentStep = ref(1)
const selectedEggSize = ref('')
const selectedCookingLevel = ref('')
const selectedTimeInSeconds = ref(0)
const showCompletionModal = ref(false)

const timer = useTimer()

const handleSizeSelection = (size: any) => {
  selectedEggSize.value = size.label

  // Animate transition to next step - Faster transition
  setTimeout(() => {
    currentStep.value = 2
    // Scroll to top smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, 300)
}

const handleLevelSelection = (level: any) => {
  selectedCookingLevel.value = level.label
  selectedTimeInSeconds.value = level.timeInSeconds

  // Animate transition to timer - Faster transition
  setTimeout(() => {
    currentStep.value = 3
    // Scroll to top smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, 300)
}

const startTimer = () => {
  timer.startTimer(selectedTimeInSeconds.value)
}

const goBack = () => {
  timer.stopTimer()
  currentStep.value = 1
  selectedEggSize.value = ''
  selectedCookingLevel.value = ''
}

const closeModal = () => {
  showCompletionModal.value = false
}

const closeModalAndReset = () => {
  showCompletionModal.value = false
  timer.resetTimer()
}

const startNewTimer = () => {
  showCompletionModal.value = false
  currentStep.value = 1
  selectedEggSize.value = ''
  selectedCookingLevel.value = ''
  timer.stopTimer()
}

// Watch for timer completion
watch(() => timer.time.value, (newTime) => {
  if (newTime === 0 && timer.isRunning.value) {
    timer.stopTimer()
    showCompletionModal.value = true
  }
})
</script>

<style scoped>
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-fade-enter-from {
  opacity: 0;
  transform: translateY(30px);
}

.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-30px);
}

.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease-out;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

/* Press effect instead of hover */
button:active {
  transform: scale(0.98);
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