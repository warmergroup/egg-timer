import { ref, computed, onUnmounted } from 'vue'

export function useTimer() {
  const time = ref(0)
  const isRunning = ref(false)
  const originalTime = ref(0)
  let intervalId: NodeJS.Timeout | null = null

  const progress = computed(() => {
    if (originalTime.value === 0) return 0
    return ((originalTime.value - time.value) / originalTime.value) * 100
  })

  const formattedTime = computed(() => {
    const minutes = Math.floor(time.value / 60)
    const seconds = time.value % 60
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  })

  const startTimer = (initialTime: number) => {
    if (intervalId) {
      clearInterval(intervalId)
    }
    
    time.value = initialTime
    originalTime.value = initialTime
    isRunning.value = true
    
    intervalId = setInterval(() => {
      if (time.value > 0) {
        time.value--
      } else {
        stopTimer()
      }
    }, 1000)
  }

  const pauseTimer = () => {
    if (intervalId) {
      clearInterval(intervalId)
      intervalId = null
    }
    isRunning.value = false
  }

  const resumeTimer = () => {
    if (!isRunning.value && time.value > 0) {
      isRunning.value = true
      intervalId = setInterval(() => {
        if (time.value > 0) {
          time.value--
        } else {
          stopTimer()
        }
      }, 1000)
    }
  }

  const stopTimer = () => {
    if (intervalId) {
      clearInterval(intervalId)
      intervalId = null
    }
    isRunning.value = false
  }

  const resetTimer = () => {
    stopTimer()
    time.value = originalTime.value
  }

  const adjustTime = (adjustment: number) => {
    const newTime = time.value + adjustment
    if (newTime >= 0) {
      time.value = newTime
      if (originalTime.value < time.value) {
        originalTime.value = time.value
      }
    }
  }

  onUnmounted(() => {
    if (intervalId) {
      clearInterval(intervalId)
    }
  })

  return {
    time,
    isRunning,
    originalTime,
    progress,
    formattedTime,
    startTimer,
    pauseTimer,
    resumeTimer,
    stopTimer,
    resetTimer,
    adjustTime
  }
}