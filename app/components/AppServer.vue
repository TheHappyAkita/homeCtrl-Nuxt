<template>
  <div class="appServerContainer">
    <OuterNasState />
    <br />
    <br />
    <OuterNasUpdateState />
    <br />
    <br />
    <OuterDnsEntries />
    <OuterDevState />
  </div>
</template>

<script setup lang="ts">
// Components are auto-imported by Nuxt if placed under app/components
</script>

<style scoped>
@import "~/assets/AppServer.css";
</style>
