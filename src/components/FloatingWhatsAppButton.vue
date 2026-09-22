<script setup>
import { ChatBubbleLeftRightIcon } from '@heroicons/vue/24/outline'
</script>

<template>
  <div class="fixed bottom-5 right-5 z-50 flex flex-col items-end">
    <div
      class="whatsapp-greeting pointer-events-none mb-3 whitespace-nowrap rounded-lg border border-white/10 bg-[#15131f] px-4 py-2.5 text-sm font-medium text-white/85 shadow-card"
      aria-hidden="true"
    >
      Halo, ada yang bisa dibantu?
    </div>

    <a
      href="https://wa.me/6281111831580"
      target="_blank"
      rel="noopener noreferrer"
      class="whatsapp-float relative inline-flex h-12 items-center gap-2 overflow-hidden rounded-lg border border-purple-300/25 bg-gradient-to-b from-[#a088ff] to-bluebrand px-4 text-sm font-semibold text-white shadow-blue transition duration-200 hover:brightness-110 sm:px-5"
      aria-label="Hubungi admin via WhatsApp"
    >
      <ChatBubbleLeftRightIcon class="relative z-10 h-5 w-5 stroke-[2]" />
      <span class="relative z-10 hidden sm:inline">WhatsApp</span>
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

@keyframes whatsapp-greeting {
  0%, 12%, 72%, 100% {
    opacity: 0;
    transform: translateY(6px) scale(0.96);
  }
  20%, 62% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.whatsapp-greeting {
  transform-origin: bottom right;
  animation: whatsapp-greeting 8s ease-in-out 1 forwards;
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
  .whatsapp-greeting,
  .whatsapp-float::after {
    animation: none;
  }

  .whatsapp-greeting {
    opacity: 0;
  }
}
</style>
