<template>
  <div :class="{ 'loading': loading === true, 'nasUpdateState': true }">
    <h3 class="header">NAS Update State</h3>
    <template v-if="loading">
      <AppSpinner :size="SpinnerSize.small"/>
    </template>
    <template v-else>
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
    </template>
  </div>
</template>

<script setup lang="ts">
import {ref, onMounted, computed} from 'vue'
import AppSpinner from './AppSpinner.vue'
import {SpinnerSize} from "~/utils/SpinnerSize";

const loading = ref(false)
const shuttingDown = ref(false)
const canceling = ref(false)
const infoLoading = ref(false)
const error = ref('')
const text = ref('')

const updateState = computed(() => {
  if (!text.value) return 'Unknown'

  const statusText = updateStatusText.value.toLowerCase()

  if (statusText.includes('running since:')) return 'Running'
  if (statusText.includes('update planned:')) return 'Planned'
  if (statusText.includes('everything is up to date')) return 'Ok'
  if (statusText.includes('error') || statusText.includes('failed')) return 'Error'

  return 'Unknown'
})

const updateStatusText = computed(() => {
  if (!text.value) return 'Checking for updates...'

  const lines = text.value.split('<br>').filter(line => line.trim())
  if (lines.length === 0) return 'Status unknown'

  const DATE_TIME_REGEX = /^.*[0-9]{4}\/[0-9]{2}\/[0-9]{2}.*[0-9]{2}:[0-9]{2}.*$/

  let updateRunning_TimeStamp = ''
  let updateLast_TimeStamp = ''
  const listOfUpdates: string[] = []

  // Parse the response similar to original logic
  let counter = 0
  for (let nasUpdateStateInfo of lines) {
    if (!nasUpdateStateInfo || nasUpdateStateInfo.trim().length <= 0) {
      continue
    }
    if (nasUpdateStateInfo.indexOf('No such file') > -1) {
      continue
    }
    if (nasUpdateStateInfo.indexOf('no route to') > -1) {
      continue
    }

    // find running update timestamp - only set if this looks like a genuine running timestamp
    if (counter === 0) {
      if (DATE_TIME_REGEX.test(nasUpdateStateInfo)) {
        // Only consider it "running" if it's actually a recent timestamp indicating active process
        // The original logic checks for actual running processes, not just any timestamp
        updateRunning_TimeStamp = 'Running since: ' + nasUpdateStateInfo
      }
    }
    else if (counter === 2) {
      if (DATE_TIME_REGEX.test(nasUpdateStateInfo)) {
        updateLast_TimeStamp = 'Last Update: ' + nasUpdateStateInfo
      }
    }
    else if (counter > 0 && (
        !updateLast_TimeStamp || updateLast_TimeStamp.trim().length <= 0
    )) {
      if (DATE_TIME_REGEX.test(nasUpdateStateInfo)) {
        updateLast_TimeStamp = 'Last Update: ' + nasUpdateStateInfo
      }
      else {
        listOfUpdates.push(nasUpdateStateInfo)
      }
    }
    else {
      listOfUpdates.push(nasUpdateStateInfo)
    }

    counter++
  }

  // Determine status text like original - fix the logic to match original behavior
  let updateStateImg = 'unknown'
  if (updateRunning_TimeStamp && updateRunning_TimeStamp.trim().length > 0) {
    updateStateImg = 'running'
  }
  else if (updateLast_TimeStamp && updateLast_TimeStamp.trim().length > 0) {
    updateStateImg = 'ok'
  }

  // Apply the same final logic as original
  if (updateStateImg === 'unknown') {
    return 'Status unknown'
  }
  else if (updateStateImg === 'ok' && listOfUpdates.length <= 0) {
    return 'Everything is up to date'
  }
  else if (updateStateImg === 'ok' && listOfUpdates.length > 0) {
    // Get next full hour for planned update
    const d = new Date()
    d.setHours(d.getHours() + 1)
    d.setMinutes(0)
    d.setSeconds(0)
    d.setMilliseconds(0)
    const dSplit = d.toISOString().replaceAll('-', '/').replaceAll('T', ' ').split(':')
    return 'Update planned: ' + dSplit[0] + ':' + dSplit[1]
  }
  else if (updateRunning_TimeStamp && updateRunning_TimeStamp.trim().length > 0) {
    return updateRunning_TimeStamp
  }

  return 'Status unknown'
})

const lastChecked = computed(() => {
  return new Date().toLocaleString()
})

const updatesList = computed(() => {
  if (!text.value) return []

  const lines = text.value.split('<br>').filter(line => line.trim())
  if (lines.length === 0) return []

  const DATE_TIME_REGEX = /^.*[0-9]{4}\/[0-9]{2}\/[0-9]{2}.*[0-9]{2}:[0-9]{2}.*$/

  let updateRunning_TimeStamp = ''
  let updateLast_TimeStamp = ''
  const listOfUpdates: string[] = []

  // Parse the response using the same logic as updateStatusText
  let counter = 0
  for (let nasUpdateStateInfo of lines) {
    if (!nasUpdateStateInfo || nasUpdateStateInfo.trim().length <= 0) {
      continue
    }
    if (nasUpdateStateInfo.indexOf('No such file') > -1) {
      continue
    }
    if (nasUpdateStateInfo.indexOf('no route to') > -1) {
      continue
    }

    // find running update timestamp
    if (counter === 0) {
      if (DATE_TIME_REGEX.test(nasUpdateStateInfo)) {
        updateRunning_TimeStamp = 'Running since: ' + nasUpdateStateInfo
      }
    }
    else if (counter === 2) {
      if (DATE_TIME_REGEX.test(nasUpdateStateInfo)) {
        updateLast_TimeStamp = 'Last Update: ' + nasUpdateStateInfo
      }
    }
    else if (counter > 0 && (
        !updateLast_TimeStamp || updateLast_TimeStamp.trim().length <= 0
    )) {
      if (DATE_TIME_REGEX.test(nasUpdateStateInfo)) {
        updateLast_TimeStamp = 'Last Update: ' + nasUpdateStateInfo
      }
      else {
        listOfUpdates.push(nasUpdateStateInfo)
      }
    }
    else {
      listOfUpdates.push(nasUpdateStateInfo)
    }

    counter++
  }

  return listOfUpdates
})

async function load() {
  loading.value = true
  error.value = ''
  try {
    const res = await $fetch<string>('/api/nas/update')
    text.value = res || ''
  }
  catch (e: any) {
    error.value = e?.message || 'Failed to load'
  }
  finally {
    loading.value = false
  }
}

onMounted(load)
</script>

<style scoped>
@import "~/assets/NasUpdateState.css";

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100px;
  padding: 2rem;
}
</style>
