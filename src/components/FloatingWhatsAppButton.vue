<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { ChatBubbleLeftRightIcon } from '@heroicons/vue/24/outline'

const STORAGE_KEY = 'clipper_whatsapp_position'
const position = ref(null)
const dragging = ref(false)
let pointerOffset = { x: 0, y: 0 }
let pointerStart = { x: 0, y: 0 }
let moved = false

const positionStyle = computed(() => position.value
  ? { left: `${position.value.x}px`, top: `${position.value.y}px` }
  : {})

const clampPosition = (x, y, width = 48, height = 48) => ({
  x: Math.min(Math.max(12, x), Math.max(12, window.innerWidth - width - 12)),
  y: Math.min(Math.max(12, y), Math.max(12, window.innerHeight - height - 12)),
})

const startDrag = (event) => {
  const wrapper = event.currentTarget.closest('[data-whatsapp-wrapper]')
  if (!wrapper) return

  const rect = wrapper.getBoundingClientRect()
  pointerOffset = { x: event.clientX - rect.left, y: event.clientY - rect.top }
  pointerStart = { x: event.clientX, y: event.clientY }
  position.value = { x: rect.left, y: rect.top }
  dragging.value = true
  moved = false
  event.currentTarget.setPointerCapture(event.pointerId)
}

const moveDrag = (event) => {
  if (!dragging.value) return

  if (Math.hypot(event.clientX - pointerStart.x, event.clientY - pointerStart.y) > 4) {
    moved = true
  }

  const wrapper = event.currentTarget.closest('[data-whatsapp-wrapper]')
  const rect = wrapper?.getBoundingClientRect()
  position.value = clampPosition(
    event.clientX - pointerOffset.x,
    event.clientY - pointerOffset.y,
    rect?.width || 48,
    rect?.height || 48,
  )
}

const stopDrag = () => {
  if (!dragging.value) return
  dragging.value = false

  if (position.value) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(position.value))
  }
}

const openWhatsApp = (event) => {
  if (moved) {
    event.preventDefault()
    moved = false
  }
}

const keepInsideViewport = () => {
  if (!position.value) return
  position.value = clampPosition(position.value.x, position.value.y)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(position.value))
}

onMounted(() => {
  try {
    const savedPosition = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null')
    if (Number.isFinite(savedPosition?.x) && Number.isFinite(savedPosition?.y)) {
      position.value = clampPosition(savedPosition.x, savedPosition.y)
    }
  } catch {
    localStorage.removeItem(STORAGE_KEY)
  }

  window.addEventListener('resize', keepInsideViewport)
})

onBeforeUnmount(() => window.removeEventListener('resize', keepInsideViewport))
</script>

<template>
  <div
    data-whatsapp-wrapper
    class="fixed z-50 h-12 w-12"
    :class="position ? '' : 'bottom-5 right-5'"
    :style="positionStyle"
  >
    <div
      class="whatsapp-help-popup pointer-events-none absolute bottom-[60px] right-0 whitespace-nowrap rounded-lg border border-white/10 bg-[#15131f] px-4 py-2.5 shadow-card"
      aria-hidden="true"
    >
      <p class="text-sm font-medium text-white/85">Apakah ada yang bisa saya bantu?</p>
    </div>

    <div
      class="whatsapp-drag-popup pointer-events-none absolute bottom-[60px] right-0 whitespace-nowrap rounded-lg border border-white/10 bg-[#15131f] px-4 py-2.5 text-sm font-medium text-purple-100 shadow-card"
      aria-hidden="true"
    >
      Tombol ini bisa digeser, tekan dan geser
    </div>

    <a
      href="https://wa.me/6281111831580"
      target="_blank"
      rel="noopener noreferrer"
      :draggable="false"
      class="whatsapp-float group absolute bottom-0 right-0 inline-flex h-12 w-12 touch-none select-none items-center justify-end overflow-hidden rounded-lg border border-purple-300/25 bg-gradient-to-b from-[#a088ff] to-bluebrand text-sm font-semibold text-white shadow-blue transition-[width,filter] duration-200 hover:w-[132px] hover:brightness-110 focus-visible:w-[132px]"
      :class="dragging ? 'cursor-grabbing' : 'cursor-grab'"
      aria-label="Hubungi admin via WhatsApp"
      title="Geser untuk memindahkan atau klik untuk membuka WhatsApp"
      @click="openWhatsApp"
      @pointerdown="startDrag"
      @pointermove="moveDrag"
      @pointerup="stopDrag"
      @pointercancel="stopDrag"
      @dragstart.prevent
    >
      <span class="relative z-10 whitespace-nowrap pl-3 opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100">WhatsApp</span>
      <span class="relative z-10 grid h-12 w-12 shrink-0 place-items-center">
        <ChatBubbleLeftRightIcon class="h-5 w-5 stroke-[2]" />
      </span>
    </a>
  </div>
</template>

<style scoped>
@keyframes whatsapp-shine {
  0%, 65% {
    transform: translateX(-180%) skewX(-20deg);
  }
  100% {
    transform: translateX(320%) skewX(-20deg);
  }
}

@keyframes whatsapp-popup-once {
  0%, 100% {
    opacity: 0;
    transform: translateY(6px) scale(0.96);
  }
  15%, 80% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes whatsapp-popup-repeat {
  0%, 100% {
    opacity: 0;
    transform: translateY(6px) scale(0.96);
  }
  18%, 72% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.whatsapp-help-popup,
.whatsapp-drag-popup {
  transform-origin: bottom right;
  opacity: 0;
}

.whatsapp-help-popup {
  animation: whatsapp-popup-once 3.5s ease-in-out 1 forwards;
}

.whatsapp-drag-popup {
  animation: whatsapp-popup-repeat 2.4s ease-in-out 4s 3 forwards;
}

.whatsapp-float::after {
  position: absolute;
  inset: 0 auto 0 0;
  width: 34%;
  content: '';
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  animation: whatsapp-shine 4s ease-in-out infinite;
}

@media (prefers-reduced-motion: reduce) {
  .whatsapp-help-popup,
  .whatsapp-drag-popup,
  .whatsapp-float::after {
    animation: none;
  }

  .whatsapp-help-popup,
  .whatsapp-drag-popup {
    opacity: 0;
  }
}
</style>
