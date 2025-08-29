<template>
  <button :class="[
    'relative overflow-hidden rounded-neumorphic border-0 cursor-pointer transition-all duration-300 ease-out',
    'bg-neumorphic-light',
    'shadow-neumorphic hover:shadow-neumorphic-hover active:shadow-neumorphic-pressed',
    'transform hover:scale-105 active:scale-95',
    'focus:outline-none focus:ring-4 focus:ring-pastel-yellow/30',
    sizeClasses,
    { 'animate-bounce-soft': isSelected }
  ]" @click="handleClick" :disabled="disabled">

    <!-- Neumorphic depth effect -->
    <div class="absolute inset-0 rounded-neumorphic bg-neumorphic-gradient pointer-events-none"></div>

    <div class="flex flex-col items-center justify-center gap-2 relative z-10">
      <slot name="icon"></slot>
      <span :class="textClasses">{{ label }}</span>
    </div>

    <!-- Ripple effect -->
    <div v-if="ripple" class="absolute rounded-full bg-white/40 pointer-events-none animate-ping" :style="rippleStyle">
    </div>
  </button>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Props {
  label: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'primary' | 'secondary' | 'accent' | 'neutral'
  disabled?: boolean
  isSelected?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  variant: 'primary',
  disabled: false,
  isSelected: false
})

const emit = defineEmits<{
  click: []
}>()

const ripple = ref(false)
const rippleStyle = ref({})

const sizeClasses = computed(() => {
  const sizes = {
    sm: 'w-20 h-20 text-sm',
    md: 'w-24 h-24 text-base',
    lg: 'w-32 h-32 text-lg',
    xl: 'w-40 h-40 text-xl'
  }
  return sizes[props.size]
})

const textClasses = computed(() => {
  return 'font-medium text-gray-700 drop-shadow-sm'
})

const handleClick = (event: MouseEvent) => {
  if (props.disabled) return

  // Create ripple effect
  const rect = (event.target as HTMLElement).getBoundingClientRect()
  const size = Math.max(rect.width, rect.height)
  const x = event.clientX - rect.left - size / 2
  const y = event.clientY - rect.top - size / 2

  rippleStyle.value = {
    width: `${size}px`,
    height: `${size}px`,
    left: `${x}px`,
    top: `${y}px`
  }

  ripple.value = true
  setTimeout(() => {
    ripple.value = false
  }, 600)

  emit('click')
}
</script>

<style scoped>
/* Custom button hover effects */
button:hover {
  transform: translateY(-2px);
}

button:active {
  transform: scale(0.98);
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

/* Smooth transitions */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}
</style>