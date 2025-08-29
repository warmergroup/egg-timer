<template>
  <div id="app">
    <MainPage />
  </div>
</template>

<script setup lang="ts">
import MainPage from './views/MainPage.vue'

// Add structured data to document head for SEO
const addStructuredData = () => {
  const script = document.createElement('script')
  script.type = 'application/ld+json'
  script.textContent = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "EggTimer - Perfect Eggs Every Time",
    "description": "Cook perfect eggs with our beautiful neumorphic timer app. Choose egg size, cooking level, and get perfectly timed results every time.",
    "url": "https://eggtimer-six.vercel.app/",
    "applicationCategory": "LifestyleApplication",
    "operatingSystem": "Web Browser",
    "browserRequirements": "Requires JavaScript. Requires HTML5.",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "author": {
      "@type": "Organization",
      "name": "EggTimer App"
    },
    "featureList": [
      "Egg size selection (Small, Medium, Large, Extra Large)",
      "Cooking level selection (Soft, Medium, Hard, Extra Hard)",
      "Precise timer with visual progress",
      "Neumorphic design interface",
      "Mobile responsive design",
      "Free to use"
    ],
    "screenshot": "/eggtimer-logo.png",
    "softwareVersion": "1.0.0"
  })

  document.head.appendChild(script)
}

// Add structured data when component mounts
addStructuredData()
</script>

<style>
/* Global styles are in style.css */
</style>