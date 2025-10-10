<template>
  <div class="dnsEntries">
    <div :class="loading ? 'loading' : 'loaded'">
      <h3 class="header">Applications</h3>
      <div v-if="error" class="detailListElement detailListElementNegative">{{ error }}</div>
      <ul v-else class="dnsList">
        <li v-for="entry in dnsEntries" :key="entry.name" class="dnsListElement">
          <div class="dnsListElementHeader">
            <span :class="`img${entry.type}`" class="imgDefault"></span>
            <div class="dnsListElementContent">{{ entry.name }}</div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'

const loading = ref(false)
const error = ref('')
const text = ref('')

interface DnsEntry {
  name: string
  type: string
  isHidden: boolean
  order: number
}

// Filter configuration based on original project
const hiddenEntries = new Set([
  'akitaCtrl',
  'audiobooks2',
  'buecher',
  'buecher2', 
  'books2',
  'hoerbuecher',
  'hoerbuecher2',
  'jdownloader2',
  'music2',
  'musik',
  'musik2',
  'nas',
  'nas2',
  'nextcloud1',
  'nextcloud2',
  'nextcloud3',
  'nextcloud4',
  'akitasDen',
  'akitasDen2'
])

const entryOrder = ['nextcloud', 'music', 'books', 'audiobooks', 'jdownloader', 'akitaCtrl', 'akitapi4']

const dnsEntries = computed<DnsEntry[]>(() => {
  if (!text.value) {
    return []
  }
  
  // Parse DNS entries from text response (server returns <br> separated entries)
  const entries = text.value.split('<br>')
    .filter(line => line.trim())
    .map(line => {
      const name = line.trim()
      
      // Determine type based on name patterns (matching original logic)
      let type = 'Default'
      if (name.includes('akitapi4')) type = 'Akita'
      else if (name.includes('akita')) type = 'Home'
      else if (name.includes('audiobooks') || name.includes('hoerbuecher')) type = 'Audio'
      else if (name.includes('music') || name.includes('musik')) type = 'Music'
      else if (name.includes('buecher') || name.includes('books')) type = 'Books'
      else if (name.includes('nas')) type = 'Nas'
      else if (name.includes('nextcloud')) type = 'Nextcloud'
      else if (name.includes('fritz')) type = 'Fritz'
      else if (name.includes('jdownloader')) type = 'JDownloader'
      else if (name.includes('router')) type = 'Router'
      
      // Check if entry should be hidden
      const isHidden = hiddenEntries.has(name)
      
      // Determine order priority
      const orderIndex = entryOrder.findIndex(orderName => name.includes(orderName))
      const order = orderIndex >= 0 ? orderIndex : entryOrder.length
      
      return { name, type, isHidden, order }
    })
    // Filter out hidden entries
    .filter(entry => !entry.isHidden)
    // Sort by order priority
    .sort((a, b) => a.order - b.order)
  
  return entries
})

async function load() {
  loading.value = true
  error.value = ''
  try {
    const res = await $fetch<string>('/api/local/dns')
    text.value = res || ''
  } catch (e: any) {
    error.value = e?.message || 'Failed to load DNS entries'
  } finally {
    loading.value = false
  }
}

onMounted(load)
</script>

<style scoped>
@import "~/assets/DnsEntries.css";
</style>
