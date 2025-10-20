<template>
  <div class="devState">
    <div class="table">
      <span class="header headerInTable">Akita's Den</span>
      <div class="tableCol1" :class="{ 'tableCol1OnlineBG': isOnline }">
        {{ isOnline ? 'Online' : 'Offline' }}
      </div>
      <template v-if="loading">
        <AppSpinner :size="SpinnerSize.small"/>
      </template>
      <template v-else class="tableCol1" >
        <button
            v-if="isOnline"
            class="tableCol2"
            :disabled="loading || shuttingDown"
            @click="shutdown"
        >
          <span class="imgShutDown"></span>
          <span class="btShutDown">Shut Down</span>
        </button>
        <button
            v-else
            class="tableCol2"
            :disabled="loading || wolLoading"
            @click="wol"
        >
          <span class="imgWakeUp"></span>
          <span class="btWakeUp">Wake Up</span>
        </button>
      </template>
    </div>
    <!--div v-if="servicesList.length > 0"-->
    <!--div class="detailListElement">Services:</div-->
    <ul class="serviceList" v-if="servicesList.length > 0 && isOnline === true">
      <li v-for="(service, index) in servicesList" :key="index">
        <a v-if="service.isLink" :href="service.url" target="_blank" rel="noopener noreferrer">
          {{ service.name }}
        </a>
        <span v-else>{{ service.name }}</span>
      </li>
    </ul>
    <ul v-if="(stateTextLines.length > 0 || servicesList.length > 0) && !error" class="detailList detailListHover">
      <li v-for="(line, index) in stateTextLines" :key="index" :class="line.cssClass">{{ line.text }}</li>
    </ul>
    <div v-if="error" class="detailList">
      <div class="detailListElement detailListElementNegative">{{ error }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, onMounted, computed} from 'vue'
import {isOffline} from '~/utils/detectors'
import AppSpinner from './AppSpinner.vue'
import {SpinnerSize} from "~/utils/SpinnerSize";

const loading = ref(false)
const wolLoading = ref(false)
const shuttingDown = ref(false)
const canceling = ref(false)
const infoLoading = ref(false)
const servicesLoading = ref(false)

const error = ref('')
const stateText = ref('')
const servicesText = ref('')

enum ConnectionState {
  unknown = "unknown",
  online = "online",
  offline = "offline"
}

const onlineState = ref(ConnectionState.unknown)

const isOnline = computed(() => onlineState.value === ConnectionState.online)

const servicesList = computed(() => {
  if (!servicesText.value) return []
  const lines = servicesText.value.split('<br>').filter(line => line.trim())

  if (lines.length <= 2) return []

  const dns = lines[0]
  const ip = lines[1]
  const serviceEndpoint = (
                              ip && ip.trim().length > 0
                          ) ? ip : dns

  // Process service lines (skip DNS and IP)
  const services = lines.slice(2).map(line => {
    if (!line || line.length === 0) return null

    const serviceParts = line.split('|')
    if (serviceParts.length > 3) {
      const protocol = serviceParts[1]
      const port = serviceParts[2]
      const name = serviceParts[3]
      const url = `${protocol}://${serviceEndpoint}:${port}`

      return {
        name,
        url,
        isLink: true
      }
    }
    return {
      name: line,
      url: '',
      isLink: false
    }
  }).filter(service => service !== null)

  return services
})

const stateTextLines = computed(() => {
  if (!stateText.value) return []
  return stateText.value.split('<br>').filter(line => line.trim()).map(line => {
    let cssClass = 'detailListElement'

    // Apply highlighting based on ping result content (matching original logic)
    if (line.indexOf('transmitted') > -1) {
      cssClass += ' detailListElementPositive'
    }
    else if (line.indexOf('received') > -1) {
      cssClass += ' detailListElementInactive'
    }
    else if (line.indexOf('errors') > -1 || line.indexOf('packet loss') > -1) {
      cssClass += ' detailListElementNegative'
    }

    return {
      text: line,
      cssClass
    }
  })
})

async function load() {
  loading.value = true
  error.value = ''
  try {
    const res = await $fetch<string>('/api/dev')
    stateText.value = res || ''
    if (isOffline(res)) {
      onlineState.value = ConnectionState.offline
    }
    else {
      onlineState.value = ConnectionState.online
    }
  }
  catch (e: any) {
    error.value = e?.message || 'Failed to load'
    onlineState.value = ConnectionState.unknown
  }
  finally {
    loading.value = false
  }
}

async function wol() {
  wolLoading.value = true
  error.value = ''
  try {
    await $fetch<string>('/api/dev', {method: 'POST', body: {action: 'wol'}})
  }
  catch (e: any) {
    error.value = e?.message || 'WOL failed'
  }
  finally {
    wolLoading.value = false
  }
}

async function shutdown() {
  shuttingDown.value = true
  error.value = ''
  try {
    const res = await $fetch<string>('/api/dev/shutdown', {method: 'POST', body: {action: 'shutdown'}})
    stateText.value = res || ''
  }
  catch (e: any) {
    error.value = e?.message || 'Failed to schedule shutdown'
  }
  finally {
    shuttingDown.value = false
  }
}

async function cancelShutdown() {
  canceling.value = true
  error.value = ''
  try {
    const res = await $fetch<string>('/api/dev/shutdown', {method: 'DELETE', body: {action: 'cancel'}})
    stateText.value = res || ''
  }
  catch (e: any) {
    error.value = e?.message || 'Failed to cancel shutdown'
  }
  finally {
    canceling.value = false
  }
}

async function shutdownInfo() {
  infoLoading.value = true
  error.value = ''
  try {
    const res = await $fetch<string>('/api/dev/shutdown', {method: 'GET', body: {action: 'info'}})
    stateText.value = res || ''
  }
  catch (e: any) {
    error.value = e?.message || 'Failed to get shutdown info'
  }
  finally {
    infoLoading.value = false
  }
}

async function loadServices() {
  servicesLoading.value = true
  error.value = ''
  try {
    const res = await $fetch<string>('/api/dev/services')
    servicesText.value = res || ''
  }
  catch (e: any) {
    error.value = e?.message || 'Failed to get services'
  }
  finally {
    servicesLoading.value = false
  }
}

onMounted(() => {
  load()
  loadServices()
})
</script>

<style scoped>
@import "~/assets/DevState.css";

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100px;
  padding: 2rem;
}
</style>
