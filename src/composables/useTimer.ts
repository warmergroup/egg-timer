import { ref, computed, onUnmounted, onMounted } from 'vue'

export function useTimer() {
  const time = ref(0)
  const originalTime = ref(0)
  const isRunning = ref(false)
  const isPaused = ref(false)
  let intervalId: NodeJS.Timeout | null = null

  // Selections state
  const selections = ref({ size: '', level: '' })

  // Notification and audio state
  const notificationPermission = ref<NotificationPermission>('default')
  let audioContext: AudioContext | null = null
  let audioBuffer: AudioBuffer | null = null

  // Request notification permission
  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      try {
        // Check if we're in a mobile browser
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
        
        // For mobile, try to request permission more aggressively
        if (isMobile) {
          // Some mobile browsers need user interaction
          const permission = await Notification.requestPermission()
          notificationPermission.value = permission
          
          // If permission denied, show a helpful message
          if (permission === 'denied') {
            console.log('Notification permission denied on mobile. User may need to enable in browser settings.')
          }
          
          return permission
        } else {
          const permission = await Notification.requestPermission()
          notificationPermission.value = permission
          return permission
        }
      } catch (error) {
        console.warn('Notification permission request failed:', error)
        return 'denied'
      }
    }
    return 'denied'
  }

  // Check notification permission
  const checkNotificationPermission = () => {
    if ('Notification' in window) {
      const permission = Notification.permission
      notificationPermission.value = permission
      
      // Log permission status for debugging
      console.log('Notification permission status:', permission)
      
      return permission
    }
    return 'denied'
  }

  // Show notification with mobile fallback
  const showNotification = (title: string, options?: NotificationOptions) => {
    if (notificationPermission.value === 'granted') {
      // Check if page is visible
      if (document.hidden) {
        try {
          // Page is hidden, show notification
          const notification = new Notification(title, {
            icon: '/eggtimer-logo.png',
            badge: '/eggtimer-logo.png',
            tag: 'eggtimer',
            requireInteraction: true,
            ...options
          })
          
          // Add click handler for mobile
          notification.onclick = () => {
            window.focus()
            notification.close()
          }
          
          console.log('Desktop notification shown:', title)
        } catch (error) {
          console.warn('Desktop notification failed, falling back to in-app:', error)
          showInAppNotification(title)
        }
      } else {
        // Page is visible, show in-app notification
        showInAppNotification(title)
      }
    } else {
      // Permission not granted, always show in-app notification
      console.log('Notification permission not granted, showing in-app notification')
      showInAppNotification(title)
    }
  }

  // Show in-app notification when page is visible
  const showInAppNotification = (title: string) => {
    // Create a simple in-app notification
    const notification = document.createElement('div')
    notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transform translate-x-full transition-transform duration-300'
    notification.innerHTML = `
      <div class="flex items-center gap-3">
        <div class="w-2 h-2 bg-white rounded-full animate-pulse"></div>
        <span class="font-medium">${title}</span>
      </div>
    `
    
    document.body.appendChild(notification)
    
    // Animate in
    setTimeout(() => {
      notification.classList.remove('translate-x-full')
    }, 100)
    
    // Remove after 5 seconds
    setTimeout(() => {
      notification.classList.add('translate-x-full')
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification)
        }
      }, 300)
    }, 5000)
  }

  // Load audio file
  const loadAudio = async () => {
    try {
      audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const response = await fetch('/timer-done.mp3')
      const arrayBuffer = await response.arrayBuffer()
      audioBuffer = await audioContext.decodeAudioData(arrayBuffer)
    } catch (error) {
      console.warn('Audio loading failed:', error)
    }
  }

  // Play audio notification
  const playAudio = () => {
    if (audioContext && audioBuffer && audioContext.state === 'running') {
      const source = audioContext.createBufferSource()
      source.buffer = audioBuffer
      source.connect(audioContext.destination)
      source.start(0)
    }
  }

  // Resume audio context if suspended
  const resumeAudioContext = async () => {
    if (audioContext && audioContext.state === 'suspended') {
      await audioContext.resume()
    }
  }

  const progress = computed(() => {
    if (originalTime.value === 0) return 0
    return ((originalTime.value - time.value) / originalTime.value) * 100
  })

  const formattedTime = computed(() => {
    const minutes = Math.floor(time.value / 60)
    const seconds = time.value % 60
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  })

  // Save progress to localStorage
  const saveProgress = () => {
    if (time.value > 0) {
      const progress = {
        time: time.value,
        originalTime: originalTime.value,
        isRunning: isRunning.value,
        isPaused: isPaused.value,
        progress: ((originalTime.value - time.value) / originalTime.value) * 100,
        timestamp: Date.now()
      }
      localStorage.setItem('timerProgress', JSON.stringify(progress))
    }
  }

  // Load progress from localStorage
  const loadProgress = () => {
    const saved = localStorage.getItem('timerProgress')
    if (saved) {
      try {
        const progress = JSON.parse(saved)
        const now = Date.now()
        const elapsed = (now - progress.timestamp) / 1000 // seconds
        
        // If timer was running and not paused, calculate remaining time
        if (progress.isRunning && !progress.isPaused && elapsed > 0) {
          const remainingTime = Math.max(0, progress.time - elapsed)
          if (remainingTime > 0) {
            // Round to nearest second to avoid floating point errors
            time.value = Math.round(remainingTime)
            originalTime.value = Math.round(progress.originalTime)
            isRunning.value = true
            isPaused.value = false
            return true
          }
        } else if (progress.isPaused) {
          // If timer was paused, restore paused state
          time.value = Math.round(progress.time)
          originalTime.value = Math.round(progress.originalTime)
          isRunning.value = false
          isPaused.value = true
          return true
        }
      } catch (error) {
        console.error('Error loading timer progress:', error)
      }
    }
    return false
  }

  // Save egg selections
  const saveSelections = (selections: { size: string; level: string }) => {
    localStorage.setItem('eggtimer-selections', JSON.stringify(selections))
  }

  // Load egg selections
  const loadSelections = () => {
    try {
      const saved = localStorage.getItem('eggtimer-selections')
      if (saved) {
        return JSON.parse(saved)
      }
    } catch (error) {
      console.warn('Failed to load selections from localStorage:', error)
    }
    return null
  }

  // Start over - completely reset timer state
  const startOver = () => {
    stopTimer()
    time.value = 0
    originalTime.value = 0
    // Clear localStorage
    localStorage.removeItem('timerProgress')
    localStorage.removeItem('eggtimer-selections')
  }

  // Set initial time from external source (egg size/level selection)
  const setInitialTime = (initialTime: number) => {
    time.value = initialTime
    originalTime.value = initialTime
    // Save to localStorage
    saveProgress()
  }



  const startTimer = (initialTime: number) => {
    if (intervalId) {
      clearInterval(intervalId)
    }
    
    // Check if time was adjusted before starting
    if (time.value > 0 && time.value !== initialTime) {
      // Time was adjusted, use the adjusted time as originalTime
      originalTime.value = time.value
    } else {
      // Use the initial time from selection
      time.value = initialTime
      originalTime.value = initialTime
    }
    
    isRunning.value = true
    isPaused.value = false
    
    // Resume audio context when starting timer
    resumeAudioContext()
    
    // Save progress
    saveProgress()
    
    intervalId = setInterval(() => {
      if (time.value > 0) {
        time.value--
        
        // Save progress every second
        saveProgress()
        
        // Play audio when 7 seconds remaining
        if (time.value === 7) {
          playAudio()
        }
        
        // Show notification when timer ends
        if (time.value === 0) {
          showNotification('🥚 Egg Timer Complete!', {
            body: 'Your egg is ready! Time to enjoy your perfectly cooked egg.',
            requireInteraction: true
          })
        }
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
    isPaused.value = true
    // Save progress when paused
    saveProgress()
  }

  const resumeTimer = () => {
    if (!isRunning.value && isPaused.value && time.value > 0) {
      isRunning.value = true
      isPaused.value = false
      // Save progress when resumed
      saveProgress()
      
      intervalId = setInterval(() => {
        if (time.value > 0) {
          time.value--
          
          // Save progress every second
          saveProgress()
          
          // Play audio when 7 seconds remaining
          if (time.value === 7) {
            playAudio()
          }
          
          // Show notification when timer ends
          if (time.value === 0) {
            showNotification('🥚 Egg Timer Complete!', {
              body: 'Your egg is ready! Time to enjoy your perfectly cooked egg.',
              requireInteraction: true
            })
          }
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
    isPaused.value = false
    time.value = 0
    originalTime.value = 0
    // Save progress when stopped
    saveProgress()
  }

  const resetTimer = () => {
    stopTimer()
    time.value = originalTime.value
    // Save progress when reset
    saveProgress()
  }

  const adjustTime = (adjustment: number) => {
    const newTime = time.value + adjustment
    if (newTime >= 0) {
      time.value = newTime
      // Update originalTime if time was increased (both when running and not running)
      if (newTime > originalTime.value) {
        originalTime.value = newTime
      }
      // Save progress when time is adjusted
      saveProgress()
    }
  }

  onMounted(() => {
    // Check notification permission on mount
    checkNotificationPermission()
    
    // Load audio file
    loadAudio()
    
    // Load progress from localStorage on mount
    loadProgress()
    
    // Add visibility change listener for background notifications
    document.addEventListener('visibilitychange', () => {
      if (document.hidden && isRunning.value && time.value > 0) {
        // Page became hidden while timer is running
        showNotification('🥚 Egg Timer Running', {
          body: `Your egg is cooking! ${formattedTime.value} remaining.`,
          tag: 'eggtimer-running',
          requireInteraction: false
        })
      }
    })
  })

  onUnmounted(() => {
    if (intervalId) {
      clearInterval(intervalId)
    }
    // Clean up audio context
    if (audioContext) {
      audioContext.close()
    }
  })

  return {
    time,
    isRunning,
    isPaused,
    originalTime,
    progress,
    formattedTime,
    notificationPermission,
    requestNotificationPermission,
    checkNotificationPermission,
    showNotification,
    startTimer,
    pauseTimer,
    resumeTimer,
    stopTimer,
    resetTimer,
    adjustTime,
    startOver,
    setInitialTime,
    saveProgress,
    loadProgress,
    saveSelections,
    loadSelections,
    selections
  }
}