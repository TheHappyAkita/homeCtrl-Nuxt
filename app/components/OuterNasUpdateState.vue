<template>
  <div class="nasUpdateState">
    <div :class="loading ? 'loading' : 'loaded'">
      <h3 class="header">NAS Update State</h3>
      <div v-if="text && !error" class="content">
        <div class="contentUpdateState">
          <div class="contentUpdateStateImg" :class="`contentUpdateStateImg_${updateState}`"></div>
          <div class="contentUpdateStateRightWrapper">
            <div class="contentUpdateStateUpdRun" :class="`contentUpdateStateTxt_${updateState}`">
              {{ updateStatusText }}
            </div>
            <div class="contentUpdateStateUpdLast">
              Last checked: {{ lastChecked }}
            </div>
          </div>
        </div>
        <ul v-if="updatesList.length > 0" class="updatesList updatesListHover">
          <li v-for="update in updatesList" :key="update" class="updateListElement">
            {{ update }}
          </li>
        </ul>
      </div>
      <div v-if="error" class="content">
        <div class="contentUpdateState">
          <div class="contentUpdateStateImg contentUpdateStateImg_Error"></div>
          <div class="contentUpdateStateRightWrapper">
            <div class="contentUpdateStateUpdRun contentUpdateStateTxt_Error">
              {{ error }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'

const loading = ref(false)
const shuttingDown = ref(false)
const canceling = ref(false)
const infoLoading = ref(false)
const error = ref('')
const text = ref('')

const updateState = computed(() => {
  if (!text.value) return 'Unknown'
  
  const content = text.value.toLowerCase()
  if (content.includes('error') || content.includes('failed')) return 'Error'
  if (content.includes('running') || content.includes('updating')) return 'Running'
  if (content.includes('planned') || content.includes('scheduled')) return 'Planned'
  if (content.includes('up to date') || content.includes('no updates')) return 'Ok'
  
  return 'Unknown'
})

const updateStatusText = computed(() => {
  if (!text.value) return 'Checking for updates...'
  
  // Extract first line as status
  const lines = text.value.split('\n')
  return lines[0] || 'Status unknown'
})

const lastChecked = computed(() => {
  return new Date().toLocaleString()
})

const updatesList = computed(() => {
  if (!text.value) return []
  
  // Extract update items from text (skip first line which is status)
  const lines = text.value.split('\n').slice(1)
  return lines.filter(line => line.trim()).map(line => line.trim())
})

async function load() {
  loading.value = true
  error.value = ''
  try {
    const res = await $fetch<string>('/api/nas/update')
    text.value = res || ''
  } catch (e: any) {
    error.value = e?.message || 'Failed to load'
  } finally {
    loading.value = false
  }
}

onMounted(load)
</script>

<style scoped>
@import "~/assets/NasUpdateState.css";
</style>
