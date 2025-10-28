<template>
  <div class="units">
    <h1>Units Management</h1>
    <p>Units component coming soon...</p>
    <p>This will display all your vacation rental units.</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Storage from '../services/storage.js'

const units = ref([])

onMounted(() => {
  units.value = Storage.getJSON('units', [])
})
</script>

<style scoped>
.units {
  padding: 20px;
}
</style>
