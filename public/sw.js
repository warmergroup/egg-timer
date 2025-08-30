// Service Worker for background notifications
const CACHE_NAME = 'eggtimer-v1'
const NOTIFICATION_TITLE = '🥚 Egg Timer Complete!'
const NOTIFICATION_BODY = 'Your egg is ready! Time to enjoy your perfectly cooked egg.'

// Install event - cache resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        '/',
        '/index.html',
        '/timer-done.mp3'
      ])
    })
  )
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
})

// Background sync event for timer completion
self.addEventListener('sync', (event) => {
  if (event.tag === 'timer-complete') {
    console.log('Background sync triggered for timer completion')
    event.waitUntil(showBackgroundNotification())
  }
})

// Show notification when timer completes in background
async function showBackgroundNotification() {
  try {
    console.log('Attempting to show background notification')
    
    // Check if we have permission
    if (Notification.permission === 'granted') {
      console.log('Notification permission granted, showing notification')
      
      // Show notification
      await self.registration.showNotification(NOTIFICATION_TITLE, {
        body: NOTIFICATION_BODY,
        icon: '/eggtimer-logo.png',
        badge: '/eggtimer-logo.png',
        requireInteraction: true,
        actions: [
          {
            action: 'open',
            title: 'Open App'
          },
          {
            action: 'dismiss',
            title: 'Dismiss'
          }
        ]
      })
      
      // Play audio notification
      await playBackgroundAudio()
      
      console.log('Background notification and audio completed successfully')
    } else {
      console.log('Notification permission not granted:', Notification.permission)
    }
  } catch (error) {
    console.error('Background notification failed:', error)
  }
}

// Play audio in background
async function playBackgroundAudio() {
  try {
    console.log('Playing background audio')
    
    // Create audio context for background audio
    const audioContext = new (self.AudioContext || self.webkitAudioContext)()
    
    // Fetch and decode audio
    const response = await fetch('/timer-done.mp3')
    const arrayBuffer = await response.arrayBuffer()
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)
    
    // Create and play audio
    const source = audioContext.createBufferSource()
    source.buffer = audioBuffer
    source.connect(audioContext.destination)
    source.start(0)
    
    console.log('Background audio started successfully')
  } catch (error) {
    console.error('Background audio failed:', error)
  }
}

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event.action)
  
  event.notification.close()
  
  if (event.action === 'open') {
    // Open the app
    event.waitUntil(
      clients.openWindow('/')
    )
  }
})

// Handle push notifications (for future use)
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json()
    event.waitUntil(
      self.registration.showNotification(data.title, {
        body: data.body,
        icon: '/eggtimer-logo.png',
        badge: '/eggtimer-logo.png'
      })
    )
  }
})

// Message event for communication with main thread
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'TIMER_COMPLETE') {
    console.log('Received timer complete message from main thread')
    event.waitUntil(showBackgroundNotification())
  }
})
