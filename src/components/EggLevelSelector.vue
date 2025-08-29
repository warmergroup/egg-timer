<template>
  <div class="flex flex-col items-center space-y-8 animate-fade-up">
    <div class="text-center mb-8">
      <h1 class="text-3xl md:text-4xl font-semibold text-gray-700 mb-2 drop-shadow-sm">
        Choose Cooking Level
      </h1>
      <p class="text-gray-500 text-lg">How would you like your {{ selectedEggSize }} egg cooked?</p>
    </div>

    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
      <div v-for="level in cookingLevels" :key="level.id"
        class="group cursor-pointer transition-all duration-500 ease-out" @click="selectLevel(level as CookingLevel)">

        <!-- True Neumorphic Cooking Level Card - Matching EggSizeSelector design with enhanced shadows -->
        <div
          class="relative w-40 h-40 md:w-44 md:h-44 rounded-card bg-neumorphic-light shadow-neumorphic-card active:shadow-neumorphic-button-pressed transition-all duration-500 ease-out overflow-hidden">

          <!-- Egg image -->
          <div class="relative z-10 w-full h-full flex flex-col items-center justify-center p-4">
            <img :src="level.image" :alt="level.label"
              class="w-20 h-20 md:w-24 md:h-24 object-cover rounded-full mb-2 shadow-neumorphic-soft">
            <span class="text-sm md:text-base font-medium text-gray-700 text-center">{{ level.label }}</span>
            <span class="text-xs text-gray-500 font-medium">{{ level.timeRange }}</span>
          </div>

          <!-- Selection indicator - Soft egg yolk color -->
          <div v-if="selectedLevel === level.id"
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
import { ref, computed, onMounted } from 'vue'

interface CookingLevel {
  id: string
  label: string
  image: string
  timeRange: string
  timeInSeconds: number
  variant: 'primary' | 'secondary' | 'accent'
}

interface Props {
  selectedEggSize: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  selectLevel: [level: CookingLevel]
}>()

const selectedLevel = ref('')
const windowWidth = ref(window.innerWidth)

const isMobile = computed(() => windowWidth.value < 768)

// Calculate cooking times based on egg size
const getCookingTimes = (eggSize: string) => {
  const times = {
    'Small': {
      'soft': { range: '4:30 – 5:00 min', seconds: 270 }, // 4:30 minutes
      'medium': { range: '6:00 – 6:30 min', seconds: 390 }, // 6:15 minutes
      'hard': { range: '9:00 – 9:30 min', seconds: 570 }, // 9:15 minutes
      'extra-hard': { range: '11:00 – 11:30 min', seconds: 690 } // 11:15 minutes
    },
    'Medium': {
      'soft': { range: '5:30 – 6:00 min', seconds: 345 }, // 5:45 minutes
      'medium': { range: '7:00 – 7:30 min', seconds: 450 }, // 7:15 minutes
      'hard': { range: '10:00 – 10:30 min', seconds: 630 }, // 10:15 minutes
      'extra-hard': { range: '12:00 – 12:30 min', seconds: 750 } // 12:15 minutes
    },
    'Large': {
      'soft': { range: '6:00 – 6:30 min', seconds: 390 }, // 6:15 minutes
      'medium': { range: '8:00 – 8:30 min', seconds: 510 }, // 8:15 minutes
      'hard': { range: '11:00 – 11:30 min', seconds: 690 }, // 11:15 minutes
      'extra-hard': { range: '13:00 – 13:30 min', seconds: 810 } // 13:15 minutes
    },
    'Extra Large': {
      'soft': { range: '7:00 – 7:30 min', seconds: 450 }, // 7:15 minutes
      'medium': { range: '9:00 – 9:30 min', seconds: 570 }, // 9:15 minutes
      'hard': { range: '12:00 – 13:00 min', seconds: 750 }, // 12:30 minutes
      'extra-hard': { range: '14:00 – 15:00 min', seconds: 870 } // 14:30 minutes
    }
  }

  return times[eggSize as keyof typeof times] || times['Medium']
}

const cookingLevels = computed(() => {
  const times = getCookingTimes(props.selectedEggSize)

  return [
    {
      id: 'soft',
      label: 'Soft-Boiled',
      image: '/soft.png',
      timeRange: times.soft.range,
      timeInSeconds: times.soft.seconds,
      variant: 'primary'
    },
    {
      id: 'medium',
      label: 'Medium/Jammy',
      image: '/medium.png',
      timeRange: times.medium.range,
      timeInSeconds: times.medium.seconds,
      variant: 'secondary'
    },
    {
      id: 'hard',
      label: 'Hard-Boiled',
      image: '/hard.png',
      timeRange: times.hard.range,
      timeInSeconds: times.hard.seconds,
      variant: 'accent'
    },
    {
      id: 'extra-hard',
      label: 'Extra-Hard',
      image: '/extra-hard.png',
      timeRange: times['extra-hard'].range,
      timeInSeconds: times['extra-hard'].seconds,
      variant: 'primary'
    }
  ]
})

const selectLevel = (level: CookingLevel) => {
  selectedLevel.value = level.id

  // Animate selection with delay
  setTimeout(() => {
    emit('selectLevel', level)
  }, 400)
}

onMounted(() => {
  const handleResize = () => {
    windowWidth.value = window.innerWidth
  }
  window.addEventListener('resize', handleResize)

  return () => {
    window.removeEventListener('resize', handleResize)
  }
})
</script>

<style scoped>
/* Press effect instead of hover */
.group:active .shadow-neumorphic-card {
  transform: scale(0.98);
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
</style>