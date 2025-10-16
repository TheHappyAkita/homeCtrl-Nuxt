<template>
  <div :class="{ 'loading': loading === true, 'dnsEntries': true }">
    <h3 class="header">Applications</h3>
    <template v-if="loading">
      <AppSpinner :size="SpinnerSize.small"/>
    </template>
    <template v-else>
      <div v-if="error" class="detailListElement detailListElementNegative">{{ error }}</div>
      <ul v-else class="dnsList">
        <li v-for="entry in dnsEntries" :key="entry.name" class="dnsListElement">
          <img class="imgInfo" @click="showModal(entry)" alt="info icon"/>
          <a :href="entry.finalHref" target="_blank" rel="noopener noreferrer" class="dnsListElementHeader">
            <img :class="`icon dns_entries img${entry.type}`" alt="dns entry icon"/>
            <div class="dnsListElementContent">{{ entry.name }}</div>
          </a>
        </li>
      </ul>
      <!-- Modal for DNS entry details -->
      <div v-if="selectedEntry" class="modal-overlay" @click="hideModal">
        <div class="modal-content" @click.stop>
          <h1>{{ selectedEntry.name }}</h1>
          <h2>DNS</h2>
          <p>{{ selectedEntry.dns }}</p>
          <h2>IP</h2>
          <p>{{ selectedEntry.ip }}</p>
          <button @click="hideModal">OK</button>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import {ref, onMounted, computed} from 'vue'
import AppSpinner from './AppSpinner.vue'
import {SpinnerSize} from "~/utils/SpinnerSize";

const loading = ref(false)
const error = ref('')
const text = ref('')
const selectedEntry = ref<DnsEntry | null>(null)

interface DnsEntry {
  name: string
  type: string
  isHidden: boolean
  order: number
  dns: string
  ip: string
  finalHref: string
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
        const dnsSplit = line.trim().split(/\s+/)
        if (dnsSplit.length <= 0) {
          return null
        }

        // Extract IP (first token)
        const ip = dnsSplit.shift() || ''
        if (!ip || ip.length <= 0 || !ip.startsWith('192.168')) {
          return null
        }

        // Extract DNS name (second token)
        const dns = dnsSplit.shift() || ''

        // Handle the rest as description string
        const rest = dnsSplit.join(' ')
        let name = rest
        if (!name || name.length <= 0) {
          name = dns
        }
        if (!name || name.length <= 0) {
          name = ip
        }

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

        // Construct href (using DNS by default, can be extended with specific rules)
        const dnsHref = `http://${dns}`
        const ipHref = `http://${ip}`
        let finalHref = dnsHref

        // Apply href extensions based on original logic
        const hrefExtensions: { [key: string]: string } = {
          'akitapi4': '/admin',
          'akitaCtrl': ':5555',
          'nextcloud': ':8055',
          'nextcloud2': ':8055',
          'jdownloader': ':5800'
        }

        if (hrefExtensions[name]) {
          finalHref += hrefExtensions[name]
        }

        return {name, type, isHidden, order, dns, ip, finalHref}
      })
      // Filter out null entries and hidden entries
      .filter((entry): entry is DnsEntry => entry !== null && !entry.isHidden)
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
  }
  catch (e: any) {
    error.value = e?.message || 'Failed to load DNS entries'
  }
  finally {
    loading.value = false
  }
}

onMounted(load)

function showModal(entry: DnsEntry) {
  selectedEntry.value = entry
}

function hideModal() {
  selectedEntry.value = null
}
</script>

<style scoped>
@import "~/assets/DnsEntries.css";

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100px;
  padding: 2rem;
}

/* Modal styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.modal-content h1 {
  margin-top: 0;
  color: var(--color_tile_head);
}

.modal-content h2 {
  color: var(--color_grey5_label);
  font-size: var(--font_medium_font-size-14);
  margin-bottom: 0.5rem;
}

.modal-content p {
  color: var(--color_midnight_black);
  margin-bottom: 1rem;
}

.modal-content button {
  background-color: var(--color_highlight);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}

.modal-content button:hover {
  opacity: 0.8;
}
</style>
