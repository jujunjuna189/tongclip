<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import FloatingWhatsAppButton from './components/FloatingWhatsAppButton.vue'
import { useClipperStore } from './stores/clipper'

const route = useRoute()
const router = useRouter()
const store = useClipperStore()
const navigationReady = ref(false)

router.isReady().then(() => {
  navigationReady.value = true
})

const showWhatsAppButton = computed(() => (
  navigationReady.value
  && !route.path.startsWith('/admin')
  && store.user?.role !== 'brand'
))
</script>

<template>
  <RouterView />
  <FloatingWhatsAppButton v-if="showWhatsAppButton" />
</template>
