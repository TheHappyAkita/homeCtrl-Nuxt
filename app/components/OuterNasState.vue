<template>
  <div class="nasState">
    <div :class="onlineState">
      <div class="table">
        <span class="header headerInTable">NAS State</span>
        <div class="tableCol1" :class="{ 'tableCol1BG': ConnectionState.online === onlineState }">
          {{ ConnectionState.online === onlineState ? 'Online' : 'Offline' }}
        </div>
        <button
            v-if="ConnectionState.online === onlineState"
            class="tableCol2"
            @click="execShutdownNas"
        >
          <span class="imgShutDown"></span>
          <span class="btShutDown">Shut Down</span>
        </button>
        <button
            v-else
            class="tableCol2"
            @click="execWolNas"
        >
          <span class="imgWakeUp"></span>
          <span class="btWakeUp">Wake Up</span>
        </button>
      </div>
      <ul v-if="textLines.length > 0 && !error" class="detailList detailListHover">
          <li v-for="(line, index) in textLines" :key="index" class="detailListElement">{{ line }}</li>
      </ul>
      <div v-if="error" class="detailList">
        <div class="detailListElement detailListElementNegative">{{ error }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import {isOffline} from "~/utils/detectors";

const loading = ref(false)
const error = ref('')
const text = ref('')

enum ConnectionState {
  unknown = "unknown",
  online = "online",
  offline = "offline",
}
const onlineState = ref (ConnectionState.unknown);

const textLines = computed(() => {
  if (!text.value) return []
  return text.value.split('<br>').filter(line => line.trim())
})

async function load() {
  loading.value = true
  error.value = ''
  try {
    const res = await $fetch<string>('/api/nas')
    text.value = res || ''
    if (isOffline(res)) {
      onlineState.value = ConnectionState.offline;
    }
    else {
      onlineState.value = ConnectionState.online;
    }
  } catch (e: any) {
    error.value = e?.message || 'Failed to load';
    onlineState.value = ConnectionState.unknown;
  } finally {
    loading.value = false;
  }
}

onMounted(load);

async function execShutdownNas() {
  try {
    await $fetch('/api/nas/shutdown', {
      method: 'POST',
      body: { action: 'shutdown' }
    });
    await load(); // Refresh state after shutdown
  } catch (e: any) {
    error.value = e?.message || 'Failed to shutdown NAS';
  }
}

async function execWolNas() {
  try {
    await $fetch('/api/nas/wol', {
      method: 'POST',
      body: { action: 'wol' }
    });
    await load(); // Refresh state after WOL
  } catch (e: any) {
    error.value = e?.message || 'Failed to wake up NAS';
  }
}
</script>

<style scoped>
@import "~/assets/NasState.css";
</style>
